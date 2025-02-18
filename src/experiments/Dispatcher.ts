import Constants = require('../helper/Constants');
import Util = require('../helper/Util');
import yargs from "yargs";
const fs = require('fs')
const WebSocketServer = require('websocket').server;
const https = require('https');

const logger = require('../helper/Logger').getLogger("Dispatcher",Constants.LOGLEVEL);
const info = x => logger.info(x)
const debug = x => logger.debug(x)
const error = x => logger.error(x);

// Read parameters from JSON file, path passed command line
const jsonFile = fs.readFileSync(process.argv[2]);
const json = JSON.parse(jsonFile);
const numberClients = json.number_of_clients;
const experimentDuration = json.experiment_duration_ms;
const eventTicks = json.event_ticks_ms;
const numberRegularMessages = json.regular_message_per_tick;
const regularProbability = json.regular_behavior_probability;
if(regularProbability<=0 || numberRegularMessages<0) {
    error(`Illegal parameter value: regular behavior is turned off or regular messages per tick is 0`)
    process.exit(6);
}
const numberDeniableMessages = json.deniable_message_per_tick;
const numberRegularEphemerals = json.number_regular_ephemerals;
const numberDeniableEphemerals = json.number_deniable_ephemerals;
const deniableProbability = json.deniable_behavior_probability;
const response = json.clients_respond_on_message_received;
const messageLength = json.message_length;
const denimServerAddress = json.denim_server_address;
const scenario = json.scenario;
const runs = json.runs;
const clientCode = fs.readFileSync("./src/experiments/ClientBehaviors.ts.txt", "utf8");

const connectionToAddress = new Map<any, number>();
const addressToConnection = new Map<number, any>();

let counter = 0; // For non-colliding client names
let readyClients = new Map<any, boolean>();
let doneClients = new Map<any, boolean>();
let runsCompleted = 0;

const WebSocketClient = require('websocket').client;
type t = (x:string) => void;
type GroupType = {"leader":number, "members":Array<number>};
let denimServerConnection;
let sendToDenimServer;


let server = https.createServer(
    { key:fs.readFileSync('ssl-cert/key.pem') 
    , cert:fs.readFileSync('ssl-cert/cert.pem')
    }
  , function(request, response) {
      info((new Date()) + ' Received request for ' + request.url);
      response.writeHead(404);
      response.end();
  });

server.listen(Constants.DISPATCHER_PORT, function() {
    info((new Date()) + ' Server is listening on port '+ Constants.DISPATCHER_PORT.toString());
});

let wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function sendInstructions() {
    
    let instructions = {
        "client_name":undefined,
        "denim_server_address":denimServerAddress,
        "duration":experimentDuration,
        "event_ticks":eventTicks,
        "regular_messages":numberRegularMessages,
        "deniable_messages":numberDeniableMessages,
        "regular_ephemerals":numberRegularEphemerals,
        "deniable_ephemerals":numberDeniableEphemerals,
        "deniable_probability":deniableProbability,
        "regular_probability":regularProbability,
        "message_length":messageLength,
        "client_code":clientCode,
        // Set BAZAAR as default behavior
        "regular_response_behavior":Constants.BEHAVIOR_BAZAAR,
        "regular_send_behavior":Constants.BEHAVIOR_BAZAAR,
        "deniable_response_behavior":Constants.BEHAVIOR_BAZAAR,
        "deniable_send_behavior":Constants.BEHAVIOR_BAZAAR,
        "client_addresses_regular":[],
        "client_addresses_deniable":[],
        "client_addresses_groups_regular":[],
        "client_addresses_groups_deniable":[],
    };

    const allAddresses = Array.from(connectionToAddress.values());

    if(scenario === Constants.EXPERIMENT_SCENARIO_SATURATION) {
        instructions.client_addresses_regular = allAddresses;
        instructions.client_addresses_deniable = allAddresses;

        // Turn off response behavior
        if(!response) {
            instructions.regular_response_behavior = Constants.BEHAVIOR_SILENT;
            instructions.deniable_response_behavior = Constants.BEHAVIOR_SILENT;
        }

        let connections = addressToConnection.values();
        for(const connection of connections) {
            instructions.client_name = connectionToAddress.get(connection);
            connection.send(Constants.SERVER_INSTRUCTIONS+"\n"+JSON.stringify(instructions));
        }

    } else if(scenario === Constants.EXPERIMENT_SCENARIO_DENIABLE_LATENCY) {
        // One client will be appointed leader (doesn't count as a member)
        const groupSize = Math.ceil(numberClients/json.number_regular_groups)-1; // Defensive
        info(`Group size is: ${groupSize}`);
        if(groupSize*json.number_regular_groups+json.number_regular_groups != numberClients) {
            error(`Couldn't divide into equal sized groups, group size is ${groupSize}, number of clients is ${numberClients}`);
            process.exit(4);
        }

        
        let addresses = Array.from(allAddresses);
        let leaders:Array<number> = [];
        let groups:Array<GroupType> = [];
        let idToGroups = new Map<number, Array<GroupType>>();

        let currentGroup:Array<number> = [];

        while(addresses.length>0){
            if(currentGroup.length<groupSize){
                let member = addresses.shift();
                currentGroup.push(member);
            } else {
                let leader = addresses.shift();
                const group = {"leader": leader, "members":Array.from(currentGroup)};

                const all = Array.from(currentGroup);
                all.push(leader);
                
                for(let member of all) {
                    let allGroups = idToGroups.get(member);
                    if(allGroups){
                        allGroups.push(group);
                        idToGroups.set(member, allGroups);
                    }else {
                        idToGroups.set(member, [group]);
                    } 
                }

                groups.push(group);
                leaders.push(leader);
                currentGroup = [];
                info(`Created group with leader: ${leader} and members: ${group.members}`)
            }
        }

        info(`Created ${groups.length} groups`);

        let connections = addressToConnection.values();

        for(const connection of connections) {
            let clientName = connectionToAddress.get(connection);
            instructions.client_name = clientName;

            // Different instructions for leaders vs members
            if(leaders.includes(clientName)) { // Is leader
                const myGroups = idToGroups.get(clientName);
                instructions.client_addresses_groups_regular = myGroups;
                instructions.client_addresses_deniable = [];
                instructions.regular_response_behavior = Constants.BEHAVIOR_GROUP_CHAT;
                // Leaders only react to getting regular responses, everything else is silent
                instructions.deniable_response_behavior = Constants.BEHAVIOR_SILENT;
                instructions.regular_send_behavior = Constants.BEHAVIOR_SILENT;
                instructions.deniable_send_behavior = Constants.BEHAVIOR_SILENT;
            } else {
                // Find group
                const myGroups = idToGroups.get(clientName);
                instructions.client_addresses_groups_regular = myGroups;
                instructions.regular_send_behavior = Constants.BEHAVIOR_GROUP_CHAT;
                instructions.regular_response_behavior = Constants.BEHAVIOR_SILENT;
                instructions.deniable_response_behavior = Constants.BEHAVIOR_BAZAAR;
                instructions.deniable_send_behavior = Constants.BEHAVIOR_BAZAAR;
                // Deniable contacts are everyone from different groups (no leaders)
                const differentGroups = groups.filter((group) => !group.members.includes(clientName));
                const differentGroupMembers = differentGroups.map((group) => group.members);
                instructions.client_addresses_deniable = differentGroupMembers.flat();
                info(`${clientName}'s deniable contacts are: ${instructions.client_addresses_deniable}`);
            
                // Turn off response behavior (but leave group leaders alone)
                if(!response) {
                    instructions.regular_response_behavior = Constants.BEHAVIOR_SILENT;
                    instructions.deniable_response_behavior = Constants.BEHAVIOR_SILENT;
                }
            
            }

            connection.send(Constants.SERVER_INSTRUCTIONS+"\n"+JSON.stringify(instructions));
        }
        

    } else if(scenario === Constants.EXPERIMENT_SCENARIO_DENIABLE_GROUP_LATENCY) {
        instructions.regular_response_behavior = Constants.BEHAVIOR_SILENT; 
        instructions.deniable_response_behavior = Constants.BEHAVIOR_SILENT;
        instructions.regular_send_behavior = Constants.BEHAVIOR_GROUP_CHAT;
        instructions.deniable_send_behavior = Constants.BEHAVIOR_GROUP_CHAT;

        // Turn off response behavior completely
        if(!response) {
            instructions.regular_response_behavior = Constants.BEHAVIOR_SILENT;
            instructions.deniable_response_behavior = Constants.BEHAVIOR_SILENT;
        }

        // Send instructions

    } else {
        error(`No scenario set; behaviors uninitialized`);
        process.exit(5);
    }


}


wsServer.on('request',(request) => {
    let connection = request.accept(Constants.EXPERIMENT_PROTOCOL, request.origin);
    debug((new Date()) + ' Connection accepted.');
    connection.on('message', (message) => {

        if (message.type === 'utf8') {
            let content:string = message.utf8Data;
            info(`Message received: ${content}`);
            
            if(content.includes(Constants.CLIENT_CONNECT)) {
                info('New connection, assigning id: ' + counter);
                
                // Assign id
                connectionToAddress.set(connection, counter);
                addressToConnection.set(counter, connection);
                counter++;

                // Send instructions using json if *all* clients have connected
                if(counter >= numberClients) {
                    sendToDenimServer(Constants.SERVER_START);
                    sendInstructions();
                }

            } else if(content.includes(Constants.CLIENT_READY)) {
                // Barrier synchronize before starting experiments

                // Set current connection to ready
                readyClients.set(connection, true);

                // Was this the last client to be ready?
                if(readyClients.size >= numberClients) {
                    // Tell all connected clients to start their experiments
                    info(`Starting experiment...`);
                    let connections = addressToConnection.values();
                    for(const connection of connections) {
                        connection.send(Constants.SERVER_START);
                    }

                    readyClients = new Map<any, boolean>();
                }

            } else if (content.includes(Constants.CLIENT_DONE)) {
                // Finalize and print results

                 // Set current connection to done
                 doneClients.set(connection, true);

                 // Report who we're waiting for; they may have crashed
                 let notDone = [];
                 for(const c of addressToConnection.values()){
                    if(!doneClients.get(c)) {
                        notDone.push(connectionToAddress.get(c));
                    }
                 }

                 info(`DONE: ${connectionToAddress.get(connection)}\n${doneClients.size} clients reported done\nWaiting for ${notDone}\nThis was run ${runsCompleted}/${runs}`);

                 // Was this the last client to finish?
                 if(doneClients.size>=counter) {
                    runsCompleted++;
                    readyClients = new Map<any, boolean>();
                    doneClients = new Map<any, boolean>();

                    if(runsCompleted>=runs) { // We're done, finish up
                        info(`Experiment done, exiting...`);
                         // Tell all connected clients the experiment is done
                        let connections = addressToConnection.values();
                        for(const connection of connections) {
                            connection.send(Constants.SERVER_EXPERIMENT_DONE);
                        }
                        sendToDenimServer(Constants.SERVER_EXPERIMENT_DONE);
                        process.exit(0);
                    } else { // Start another loop
                        info(`Restarting DenIM server...`);
                        sendToDenimServer(Constants.SERVER_COMMAND_RESTART_STRING); // Restart DenimServer
                        info(`Waiting to start next experiment, ${runsCompleted}/${runs} runs completed`);   
                    }
                }   
            }
        }
    });
    connection.on('close',(reasonCode, description) => {
        info(`Connection with ${connectionToAddress.get(connection)} closed, reason: ${reasonCode}, description: ${description}`);
    });
});

  
function connectToDenimServer(initialMessage, serverAddress, protocol): Promise<t> {
    return new Promise ((resolve, reject) => {
        let client = new WebSocketClient({tlsOptions:{rejectUnauthorized: false}})

        client.on('connectFailed', (errorMessage) => {
            error('Connect Error: ' + errorMessage.toString());
        });
        
        client.on('connect',(connection) => {
            info('Connected to '+serverAddress);
            denimServerConnection = connection; // Save the connection
            connection.send(initialMessage);
            connection.on('error',(errorMessage) => {
                error("Connection Error: " + errorMessage.toString());
            });
            connection.on('close', () => {
                info(`Connection to ${serverAddress} closed`);
            });
            connection.on('message', async (message) => {
            
                if (message.type === 'utf8') {
                    let content = message.utf8Data;
                    info(`Message received: ${content}`);

                    if(content === Constants.DENIM_SERVER_RESTARTED) {
                        info(`Starting next experiment...`)
                        
                        // Defensive check
                        if(!denimServerConnection) {
                            info(`Connecting to DenIM server`);
                            sendToDenimServer = await connectToDenimServer("DISPATCHER", denimServerAddress, Constants.PROTOCOL);
                        }
                        sendToDenimServer(Constants.SERVER_START);
                        sendInstructions(); // This is inefficient but safe...
                    }
                }
            });
            
            function sendMessage (x:string) {
                if (connection.connected) {
                    connection.send(x);
                } else {
                    // some error reporting
                }
            }
            resolve(sendMessage)
        });
    
        client.connect(serverAddress, protocol);
   });
}


async function main () {
    info(`Connecting to DenIM server`);
    sendToDenimServer = await connectToDenimServer("DISPATCHER", denimServerAddress, Constants.PROTOCOL);
}

main();
