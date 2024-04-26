import math = require('mathjs');
import { DenimServer as DenimServer } from '../core/DenimServer';
import Constants = require('../helper/Constants');
import Util = require('../helper/Util');
const fs = require('fs')
const pidusage = require('pidusage')
const WebSocketServer = require('websocket').server;
const https = require('https');
const microseconds = require('microseconds')
import yargs from "yargs";
const gc = require ('gc-stats')()

let gcStats = new Array<{timestamp: any, type:any}>();
gc.on('stats', (stats)=> {
	if(stats.gctype > 1) {
        gcStats.push({timestamp:microseconds.now(), type:stats.gctype});
    }
})

const logLevel = yargs.argv.debugserver ? 'debug' : 'info';
const logger = require('../helper/Logger').getLogger("WSServer",logLevel);
const info = x => logger.info(x)
const debug = x => logger.debug(x)
const error = x => logger.error(x);

const q = yargs.argv.q != undefined ? yargs.argv.q : Constants.DEFAULT_Q;

// Aggregate statistics
let processedRegularMessages = 0;
let processedRegularKeyRequests = 0;
let processedRegularMessageBytes = 0;
let processedDeniableMessages = 0;
let processedDeniableKeyRequests = 0;
let processedDeniableMessageBytes = 0;

let run = 0;

let denimServer = new DenimServer(q);
let connectionToAddress = new Map<any, string>();
let addressToConnection = new Map<string, any>();

let throughputMeasurements = new Array<{start:any, end:any}>();
let processedMessagesSnapshots = new Array<{timestamp:any, regularMessages:any, regularKeyRequests:any, regularMessageBytes:any,
     deniableMessages:any, deniableKeyRequests:any, deniableMessageBytes:any}>();
let cpuStats = new Array<{timestamp: any, cpu:any, memory:any}>();
let deniableBufferStatus = new Array<{timestamp:any, numberDeniablePayloads:any}>();

const fileSuffix = "-q="+denimServer.q.toString()+".csv";
const outputDir = Constants.OUTPUT_DIR_SERVER;
const oneSecond = 1000;

let stateWaiting = true;

Util.createFolder(outputDir);

fs.writeFileSync(`${outputDir}/server-settings.json`, `{\n    "q":${q}\n}`); 

// Write statistics to file before exiting
process.once('SIGINT', () => {
    processAndPrintStatistics();
    process.exit(0);
});

let server = https.createServer(
    { key:fs.readFileSync('ssl-cert/key.pem') 
    , cert:fs.readFileSync('ssl-cert/cert.pem')
    }
  , function(request, response) {
      info((new Date()) + ' Received request for ' + request.url);
      response.writeHead(404);
      response.end();
  });

server.listen(8080, function() {
    info((new Date()) + ' Server is listening on port 8080');
    info("Statistics will be printed and saved upon ctrl-c before exiting");
    info(`q is ${q}`);
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

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

function calculateDeniableBufferSize() {
    let queuedDeniable = 0;

    for(const buffer of denimServer.deniableBuffers.values()) {
        queuedDeniable += buffer.length;
    }

    for(const chunk of denimServer.usersCurrentOutgoingChunk.values()) {
        if(chunk.length>0) {
            queuedDeniable++;
        }
    }

    for(const chunk of denimServer.usersCurrentIncomingChunk.values()) {
        if(chunk.length>0) {
            queuedDeniable++;
        }
    }
    
    return queuedDeniable;

}


function takeMeasurements () {
    const timestamp = microseconds.now();

    // Save statistics
    pidusage(process.pid, function (err, stats) {
        cpuStats.push({timestamp:timestamp, cpu:stats.cpu, memory:stats.memory});
    } );
    deniableBufferStatus.push({timestamp:timestamp, numberDeniablePayloads:calculateDeniableBufferSize()});
    processedMessagesSnapshots.push({timestamp:timestamp,
        regularMessages:processedRegularMessages,
        regularKeyRequests:processedRegularKeyRequests,
        regularMessageBytes:processedRegularMessageBytes,
        deniableMessages:processedDeniableMessages,
        deniableKeyRequests:processedDeniableKeyRequests,
        deniableMessageBytes:processedDeniableMessageBytes});

    setTimeout(takeMeasurements,oneSecond);
}
takeMeasurements();

wsServer.on('request',(request) => {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      debug((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    let connection = request.accept(Constants.PROTOCOL, request.origin);
    debug((new Date()) + ' Connection accepted.');
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            let content = message.utf8Data;

            //Dispatcher instructions
            if(content.includes(Constants.SERVER_COMMAND_RESTART_STRING)) {
                stateWaiting = true;
                // Print statistics for current run and clean up state
                processAndPrintStatistics();
                info(`##RESTARTING SERVER##`);
                cleanUp();
                denimServer = new DenimServer(q);
                run++;
                // Tell Dispatcher that the server is restarted
                connection.send(Constants.DENIM_SERVER_RESTARTED);
            } else if(content.includes(Constants.SERVER_START)) {
                stateWaiting = false;
            
            } else if(content.includes(Constants.SERVER_EXPERIMENT_DONE)){
                info(`Received SERVER_EXPERIMENT_DONE, wrapping up...`);
                processAndPrintStatistics();
                process.exit(0);
            } else { // New client connection
                info('New connection with: ' + message.utf8Data);
                connectionToAddress.set(connection, message.utf8Data);
                addressToConnection.set(message.utf8Data, connection);
            }
        }
        else if (message.type === 'binary') {
            if(stateWaiting) {
                info(`Incoming message while waiting for next experiment, ignoring...`);
                return;
            }

            const start = microseconds.now();
            debug('Received message of ' + message.binaryData.length + ' bytes');
            const sender = connectionToAddress.get(connection);
            const response = denimServer.process(sender, message.binaryData);
            // Reply/forward
            if(response.receiver!=null && response.msg.length > 0 ){                
                const respondTo = addressToConnection.get(response.receiver);
                respondTo.sendBytes(response.msg);

                // Measurements for statistics
                const end = microseconds.now();
                if(response.msg){ // Ignore register user (msg is null)
                    throughputMeasurements.push({start:start, end:end});
                }
                    
            } else {
                debug(`DenimServer's process() returned null`);
            }

            processedRegularMessages = denimServer.regularMessagesProcessed;
            processedRegularMessageBytes = denimServer.regularMessageBytes;
            processedRegularKeyRequests = denimServer.regularKeyRequestsProcessed;

            // Process potentially deniable part *after* handling regular part
            denimServer._processChunks(sender, response.chunks);
            processedDeniableMessages = denimServer.deniableMessagesProcessed;
            processedDeniableKeyRequests =  denimServer.deniableKeyRequestsProcessed;
            processedDeniableMessageBytes = denimServer.deniableMessageBytes;
        }
    });
    connection.on('close',(reasonCode, description) => {
        debug((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

  
function processAndPrintStatistics() {
    const outputPath = `${outputDir}/${run}/`;
    const experimentStart = Math.round(throughputMeasurements[0].start);
    const expiermentEnd = Math.round(throughputMeasurements[throughputMeasurements.length-1].end);
    const timeElapsed = (expiermentEnd-experimentStart)/(1000*oneSecond); //Microseconds
    const generatedKeys = Array.from(denimServer.counters.values()).reduce((partialSum, count) => partialSum + count, 0);
    const regularMessageBytesPerSecond = processedRegularMessageBytes/timeElapsed;
    const deniableMessageBytesPerSecond = processedDeniableMessageBytes/timeElapsed;
    const regularPayloadsPerSecond = (processedRegularMessages+processedRegularKeyRequests)/timeElapsed;
    const regularMessagesPerSecond = processedRegularMessages/timeElapsed;
    const deniablePayloadsPerSecond = (processedDeniableMessages+processedDeniableKeyRequests)/timeElapsed;
    const deniableMessagesPerSecond = processedDeniableMessages/timeElapsed;
    info(`Saving statistics to ${outputDir}...`);
    info(`Value of q used: ${q}`);
    info(`Time elapsed between first and last message: ${timeElapsed}`);
    info(`Total DenIM messages processed: ${processedRegularMessages} regular messages, ${processedRegularKeyRequests} regular key requests, ${processedDeniableMessages} deniable messages, ${processedDeniableKeyRequests} deniable key requests`);
    info(`Processed ${processedRegularMessageBytes} bytes of regular user messages, ${regularMessageBytesPerSecond} bytes/second`);
    info(`Processed ${processedDeniableMessageBytes} bytes of deniable user messages, ${deniableMessageBytesPerSecond} bytes/second`);
    info(`Throughput all regular traffic (traffic/second): ${regularPayloadsPerSecond}`);
    info(`Throughput regular (messages/second): ${regularMessagesPerSecond}`);
    info(`Throughput all deniable traffic (traffic/second): ${deniablePayloadsPerSecond}`);
    info(`Throughput deniable (messages/second): ${deniableMessagesPerSecond}`);
    info(`${generatedKeys} deniable ephemeral keys generated`);
    
    
    Util.createFolder(outputPath);

    // Trim to only include measurements while experiments were running
    const processedMessagesSnapshotsFiltered = processedMessagesSnapshots.filter((data) => data.timestamp>experimentStart && data.timestamp<expiermentEnd);
    // Add column header first
    processedMessagesSnapshotsFiltered.unshift({timestamp:"timestamp_us",
        regularMessages:"number_regular_messages_processed",
        regularKeyRequests:"number_regular_keyrequests_processed",
        regularMessageBytes:"regular_messages_byte",
        deniableMessages:"number_deniable_messages_processed",
        deniableKeyRequests:"number_deniable_keyrequests_processed",
        deniableMessageBytes:"deniable_messages_byte"});
    fs.writeFileSync(`${outputPath}throughput${fileSuffix}`, processedMessagesSnapshotsFiltered.map(
        (data) => `${data.timestamp},${data.regularMessages},${data.regularKeyRequests},${data.regularMessageBytes},${data.deniableMessages},${data.deniableKeyRequests},${data.deniableMessageBytes}`).join("\n"), function (err,data) {
        if (err) {
          return console.log(err);
        }
    }); 

    // Trim to only include measurements while experiments were running
    const cpuLoadFiltered = cpuStats.filter((data) => data.timestamp>experimentStart && data.timestamp<expiermentEnd);
    const cpuLoad:Array<number> = cpuLoadFiltered.map((data) => data.cpu);
    const cpuArithmeticMean = cpuLoad.length > 0 ? math.mean(cpuLoad):0;
    // Replace 0 with 1 for geometric mean
    const cpuLoadZeroesReplaced = cpuLoad.map((data) => data==0? 1: data);
    const cpuGeometricMean =  cpuLoadZeroesReplaced.length > 0 ? Util.geometricMean(cpuLoadZeroesReplaced):0;
    info(`Arithmetic mean CPU load: ${cpuArithmeticMean}`);
    info(`Geometric mean CPU load: ${cpuGeometricMean}`);

    
    fs.writeFileSync(`${outputPath}summary${fileSuffix}`,`parameter,value
time_elapsed,${timeElapsed}
arithmetic_mean,${cpuArithmeticMean}
geometric_mean,${cpuGeometricMean}
total_regular_message_processed,${processedRegularMessages}
total_regular_keyrequests_processed,${processedRegularKeyRequests}
total_regular_message_bytes_processed,${processedRegularMessageBytes}
regular_messages_processed_per_second,${regularMessagesPerSecond}
regular_payloads_processed_per_second,${regularPayloadsPerSecond}
regular_bytes_processed_per_second,${regularMessageBytesPerSecond}
deniable_keys_generated_by_server,${generatedKeys}
total_deniable_message_processed,${processedDeniableMessages}
total_deniable_keyrequests_processed,${processedDeniableKeyRequests}
total_deniable_message_bytes_processed,${processedDeniableMessageBytes}
deniable_messages_processed_per_second,${deniableMessagesPerSecond}
deniable_payloads_processed_per_second,${deniablePayloadsPerSecond}
deniable_bytes_processed_per_second,${deniableMessageBytesPerSecond}`);

    // Add column header first
    cpuLoadFiltered.unshift({timestamp:"timestamp_us", cpu:"cpu_usage_percentages", memory:"memory_usage_bytes"});
    fs.writeFileSync(`${outputPath}cpuload${fileSuffix}`, cpuLoadFiltered.map(
        (data) => `${data.timestamp},${data.cpu},${data.memory}`).join("\n"), function (err,data) {
        if (err) {
          return console.log(err);
        }
    }); 

    const gcFiltered = gcStats.filter((data) => data.timestamp>experimentStart && data.timestamp<expiermentEnd);
    // Add column header first
    gcFiltered.unshift({timestamp:"timestamp_us", type:"gc_type"});
    fs.writeFileSync(`${outputPath}gc-stats${fileSuffix}`, gcFiltered.map(
        (data) => `${data.timestamp},${data.type}`).join("\n"), function (err,data) {
        if (err) {
          return console.log(err);
        }
    }); 

    // Add column header first
    throughputMeasurements.unshift({start:"start_time_us", end:"end_time_us"});
    fs.writeFileSync(`${outputPath}latency${fileSuffix}`, throughputMeasurements.map(
        (data) => `${data.start},${data.end}`).join("\n"), function (err,data) {
        if (err) {
          return console.log(err);
        }
    }); 

    // Filter out timestamps before the experiment started
    const deniableBufferStatusFiltered = deniableBufferStatus.filter((data) => data.timestamp>experimentStart && data.timestamp<expiermentEnd);
    // Add column header first
    deniableBufferStatusFiltered.unshift({timestamp:"timestamp_us", numberDeniablePayloads:"total_number_of_deniable_payloads_on_server"});
    fs.writeFileSync(`${outputPath}deniablebuffers${fileSuffix}`, deniableBufferStatusFiltered.map(
        (data) => `${data.timestamp},${data.numberDeniablePayloads}`).join("\n"), function (err,data) {
        if (err) {
          return console.log(err);
        }
    }); 

    
}

function cleanUp() {
    connectionToAddress = new Map();
    addressToConnection = new Map();
    // Evict statistics data structures
    gcStats = gcStats = new Array<{timestamp: any, type:any}>();
    throughputMeasurements = new Array<{start:any, end:any}>();
    processedMessagesSnapshots = new Array<{timestamp:any, regularMessages:any, regularKeyRequests:any, regularMessageBytes:any, deniableMessages:any, deniableKeyRequests:any, deniableMessageBytes:any}>();
    cpuStats = new Array<{timestamp: any, cpu:any, memory:any}>();
    deniableBufferStatus = new Array<{timestamp:any, numberDeniablePayloads:any}>();

    // Aggregate statistics
    processedRegularMessages = 0;
    processedRegularKeyRequests = 0;
    processedRegularMessageBytes = 0;
    processedDeniableMessages = 0;
    processedDeniableKeyRequests = 0;
    processedDeniableMessageBytes = 0;
}