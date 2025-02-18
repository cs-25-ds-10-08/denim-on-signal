import Constants = require('../helper/Constants');
import { DenimClient, newDenimClient } from "../core/DenimClient";
import { ProtoFactory } from "../helper/ProtoFactory";
import Util = require('../helper/Util');
import SignalLib = require('@signalapp/libsignal-client');
import { denim_proto } from "../proto-generated/compiled";
import { Message } from '../core/Message';
import yargs from "yargs";

// SignalLib.initLogger(
//     SignalLib.LogLevel.Trace,
//     (level, target, fileOrNull, lineOrNull, message) => {
//       const targetPrefix = target ? '[' + target + '] ' : '';
//       const file = fileOrNull ?? '<unknown>';
//       const line = lineOrNull ?? 0;
//       // eslint-disable-next-line no-console
//       console.log(targetPrefix + file + ':' + line + ': ' + message);
//     }
// );    

const dispatcherAddress = yargs.argv.dispatcherip ? yargs.argv.dispatcherip : Constants.DISPATCHER_NETWORK_ADDRESS;

const EventEmitter = require('events');
class MessageEmitter extends EventEmitter { }
let messageEmitter = new MessageEmitter();

const fs = require('fs');

const logger = require('../helper/Logger').getLogger("ExperimentClient", Constants.LOGLEVEL);
const info = x => logger.info(x)
const debug = x => logger.debug(x)
const error = x => logger.error(x);

const WebSocketClient = require('websocket').client;

const printMessageReceived = "messageReceived";

type t = (x: string | Uint8Array) => void;

let send: t; // Connection to Dispatcher
let denimSend: t; // Connection to DenimServer
let denimClient: DenimClient; // DenimClient object to delegate to

let deniableKeys = new Map<string, string>(); // Stringified ProtocolAddress, KEY_STATE from Constants
let regularKeys = new Map<string, string>();
let queuedRegularMessages = new Array<Message>();
let queuedDeniableMessages = new Array<Message>();

let serverConnections = new Map<string, any>();

let json; // Contains all experiment parameters and code
// Parameters to read from json passed from Dispatcher
let codeBase;
let code;
let classArgs = {}
let numberRegularEphemerals: number;
let numberDeniableEphemerals: number;
let regularResponseBehavior: string;
let regularSendBehavior: string;
let deniableResponseBehavior: string;
let deniableSendBehavior: string;
let denimServerAddress: string;
let currentRun = 0;
let clientSignalAddress: SignalLib.ProtocolAddress;

let stateExperimentOngoing: boolean;

type GroupType = { "leader": number | SignalLib.ProtocolAddress, "members": Array<number | SignalLib.ProtocolAddress> };

function getPrintName() {
  return `CLIENT_ID_${clientSignalAddress?.name()}`;
}

process.on('uncaughtException', function(e) {
  error(`Uncaught Exception in ${getPrintName()}: ${e}`);
  error(`Stack trace: ${e.stack ? e.stack : new Error("Uncaught error").stack}`);
  process.exit(99);
});

process.on('exit', function(exitcode) {
  info(`${getPrintName()} exiting with code ${exitcode}; ongoing connections: ${serverConnections.values?.length}`);
});




function initExperimentClient(onMessage, initialMessage, serverAddress, protocol): Promise<t> {
  return new Promise((resolve, reject) => {
    let client = new WebSocketClient({ tlsOptions: { rejectUnauthorized: false } })

    client.on('connectFailed', (errorMessage) => {
      error(`Failed to connect to ${serverAddress}, protocol: ${protocol}. Connect error: ${errorMessage.toString()}`)
    });

    client.on('connect', (connection) => {
      info('Connected to ' + serverAddress);
      serverConnections.set(serverAddress, connection);
      connection.send(initialMessage);
      connection.on('error', (errorMessage) => {
        error(`${getPrintName()}; Connection Error: ${errorMessage.toString()}`);
      });
      connection.on('close', (reasonCode, description) => {
        info(`Connection to ${connection.remoteAddress} closed`);

        if (connection.protocol === Constants.PROTOCOL) {
          // Report back to dispatcher
          info(`${getPrintName()} Socket closed`);
          currentRun++;
          send(Constants.CLIENT_DONE);
          info(`${getPrintName()} Sent CLIENT_DONE to Dispatcher`)
        } else if (connection.protocol === Constants.EXPERIMENT_PROTOCOL) {
          error(`${getPrintName()} Connection with Dispatcher (${connection.remoteAddress}) closed, reason: ${reasonCode}, description: ${description}`);
          process.exit(255);
        }
      });
      connection.on('message', onMessage);

      function sendMessage(x: string | Uint8Array) { // Strings to Dispatcher, bytes to DenimServer
        if (connection.connected) {
          connection.send(x);
        } else {
          // some error reporting
          throw `Attempting to send on a closed connection, protocol is ${connection.protocol}`;
        }
      }
      resolve(sendMessage)
    });

    client.connect(serverAddress, protocol);
  });
}

async function processIncomingDenimMessage(data) {
  let received = Util.getRelativeTimeMicroseconds();

  // Defensive check to make sure experiment is running...
  if (stateExperimentOngoing) {
    // Deserialize message
    const denimMsg = denim_proto.DenimMessage.decode(data.binaryData);
    const processedMessages: Array<Message> = await denimClient.process(denimMsg);

    for (const processedMessage of processedMessages) {
      let msg = processedMessage.message;
      // User message received, pass to behavior code
      if (processedMessage.messageType == Constants.MESSAGE_TYPE_TEXT) {
        info(`Message received: ${processedMessage}`);
        // Call behavior code
        await code[printMessageReceived](processedMessage);
      } else if (processedMessage.messageType == Constants.MESSAGE_TYPE_KEY_RESPONSE) {
        // Check if deniable or regular and keep separate tables
        const receivedAddress = Util.signalAddressToString(processedMessage.sender);
        info(`Key response received for user: ${receivedAddress}`);
        if (processedMessage.deniable == false) { // Regular key response
          info(`${queuedRegularMessages.length} messages queued`);
          regularKeys.set(receivedAddress, Constants.KEY_STATE_RECEIVED);

          //Send queued messages
          const toSend = queuedRegularMessages.filter(msg =>
            Util.signalAddressToString(msg.receiver) === receivedAddress);

          for (const msg of toSend) {
            info(`Sending queued regular message: ${msg}`);
            const sessionOngoing = (await denimClient.regularSessionStore.getSession(msg.receiver)).hasCurrentState();
            info(`Regular session started: ${sessionOngoing}`);
            const denimMsg = await denimClient.createRegularMessage(msg.message, msg.receiver);
            // Defensive check to make sure experiment is running...
            if (stateExperimentOngoing) {
              denimSend(denimMsg);
            } else {
              error(`${getPrintName()} received KEY_RESPONSE after run ended`);
            }
          }

        } else { // Deniable key response
          deniableKeys.set(receivedAddress, Constants.KEY_STATE_RECEIVED);

          const toSend = queuedDeniableMessages.filter(msg =>
            Util.signalAddressToString(msg.receiver) === receivedAddress);

          for (const msg of toSend) {
            info(`Sending queued deniable message: ${msg}`);
            const sessionOngoing = (await denimClient.deniableSessionStore.getSession(msg.receiver)).hasCurrentState();
            info(`Deniable session started: ${sessionOngoing}`);
            await denimClient.createDeniableMessage(msg.message, msg.receiver);
          }
        }

      } else if (processedMessage.messageType == Constants.MESSAGE_TYPE_ERROR_KEY_REQUEST) {

        info(`Key request for ${processedMessage.sender.name()} failed, resending (deniable=${processedMessage.deniable})`);

        if (processedMessage.deniable == false) {
          const denimMsg = denimClient.createKeyRequest(processedMessage.sender);
          // Defensive check to make sure experiment is running...
          if (stateExperimentOngoing) {
            denimSend(denimMsg);
          } else {
            error(`${getPrintName()} received ERROR_KEY_REQUEST after run ended`);
          }
        } else {
          denimClient.queueDeniableKeyRequest(processedMessage.sender);
        }
      }
    }
  } else {
    debug(`Received message while waiting for next experiment, ignoring...`);
  }
}

async function processOutgoingDenimMessage(data: Message) {
  // Defensive check to make sure experiment is running...
  if (stateExperimentOngoing) {
    const receiverAddress = Util.signalAddressToString(data.receiver);

    if (data.deniable == false) { // Regular messages
      let keyStatus = regularKeys.get(receiverAddress);
      let denimMsg: Uint8Array;
      if (keyStatus == null) { // If there's no entry, we haven't requested keys for this user
        regularKeys.set(receiverAddress, Constants.KEY_STATE_IN_FLIGHT);
        denimMsg = denimClient.createKeyRequest(data.receiver);
        queuedRegularMessages.push(data);
        // Defensive check to make sure experiment is running...
        if (stateExperimentOngoing) {
          info(`${denimClient.address.name()} requesting regular key for ${receiverAddress}`);
          denimSend(denimMsg);
        } else {
          error(`${getPrintName()} attempted to send KEY_REQUEST after run ended`);
        }
      } else if (keyStatus == Constants.KEY_STATE_RECEIVED) {
        denimMsg = await denimClient.createRegularMessage(data.message, data.receiver);
        // Defensive check to make sure experiment is running...
        if (stateExperimentOngoing) {
          denimSend(denimMsg);
        } else {
          error(`${getPrintName()} attempted to send message after run ended`);
        }
      } else if (keyStatus == Constants.KEY_STATE_IN_FLIGHT) {
        queuedRegularMessages.push(data);
      }

    } else { // Deniable messages
      let keyStatus = deniableKeys.get(receiverAddress);
      if (keyStatus == null) {
        deniableKeys.set(receiverAddress, Constants.KEY_STATE_IN_FLIGHT);
        info(`${denimClient.address.name()} queuing deniable key request for ${receiverAddress}`);
        denimClient.queueDeniableKeyRequest(data.receiver);
        queuedDeniableMessages.push(data);
      } else if (keyStatus == Constants.KEY_STATE_RECEIVED) {
        await denimClient.createDeniableMessage(data.message, data.receiver);
      } else if (keyStatus == Constants.KEY_STATE_IN_FLIGHT) {
        queuedDeniableMessages.push(data);
      }
    }
  } else {
    debug(`Outgoing message while waiting for next experiment, ignoring...`);
  }

}

function reportDone() {
  info(`${getPrintName()} report done, cleaning up`);
  cleanUp();
  // Close connection to Denimserver
  info(`${getPrintName()} closing connection with DenimServer`);
  serverConnections.get(denimServerAddress).close();
  // Report DONE to Dispatcher when the socket is actually closed (in connection.on('close'...))
}

const onMessage = async (data) => {
  if (data.utf8Data) { // Dispatcher messages
    info(data.utf8Data);
    //Process dispatcher commands
    let content = data.utf8Data;

    // Extract parameters and initialize DenIM client
    if (content.includes(Constants.SERVER_INSTRUCTIONS)) {
      // Parse JSON
      const startOfJson = content.indexOf(Constants.SERVER_INSTRUCTIONS) + Constants.SERVER_INSTRUCTIONS.length;
      const jsonString = content.slice(startOfJson);
      json = JSON.parse(jsonString);
      regularSendBehavior = json.regular_send_behavior;
      deniableSendBehavior = json.deniable_send_behavior;
      regularResponseBehavior = json.regular_response_behavior;
      numberRegularEphemerals = json.regular_ephemerals;
      numberDeniableEphemerals = json.deniable_ephemerals;
      deniableResponseBehavior = json.deniable_response_behavior;
      denimServerAddress = json.denim_server_address;

      // Build address lists
      const regularAddresses = Util.getSignalAddressesExcludingSelf(json.client_addresses_regular, json.client_name);
      const deniableAddresses = Util.getSignalAddressesExcludingSelf(json.client_addresses_deniable, json.client_name);

      const regularGroupAddresses = [];
      for (const group of json.client_addresses_groups_regular) {
        info(`Regular group consist of members: ${group.members}, leader: ${group.leader}`)
        const memberAddresses = Util.getSignalAddressesExcludingSelf(group.members, json.client_name);
        const leaderAddress = SignalLib.ProtocolAddress.new(group.leader.toString(), Constants.DEFAULT_DEVICE_ID);
        const groupRecord: GroupType = { "leader": leaderAddress, "members": memberAddresses };

        regularGroupAddresses.push(groupRecord);
      }

      const deniableGroupAddresses = [];
      for (const group of json.client_addresses_groups_deniable) {
        info(`Deniable group consist of members: ${group.members}, leader: ${group.leader}`)
        const memberAddresses = Util.getSignalAddressesExcludingSelf(group.members, json.client_name);
        const leaderAddress = SignalLib.ProtocolAddress.new(group.leader.toString(), Constants.DEFAULT_DEVICE_ID);
        const groupRecord: GroupType = { "leader": leaderAddress, "members": memberAddresses };

        deniableGroupAddresses.push(groupRecord);
      }

      // Initialize denim client
      denimClient = await newDenimClient(json.client_name.toString(), Constants.DEFAULT_DEVICE_ID, numberRegularEphemerals, numberDeniableEphemerals);
      info(`DenimClient has been initialized`);

      // Create function with the received code
      codeBase = new Function('classArgs', json.client_code); // Put params in *one* dict

      // Connect to denim server
      // Establish connection and register keys for bundles
      clientSignalAddress = SignalLib.ProtocolAddress.new(json.client_name.toString(), Constants.DEFAULT_DEVICE_ID);
      denimSend = await initExperimentClient(processIncomingDenimMessage, Util.signalAddressToString(clientSignalAddress), denimServerAddress, Constants.PROTOCOL);
      const registerBytes = await denimClient.createRegisterThreadUnsafe();
      if (serverConnections?.get(denimServerAddress).connected) { // Defensive
        denimSend(registerBytes);
      } else {
        error(`${getPrintName()} attempted to REGISTER after run ended`);
      }

      // Prepare dict to pass to code base
      classArgs["clientName"] = clientSignalAddress;
      classArgs["messageLength"] = json.message_length;
      classArgs["regularContacts"] = regularAddresses;
      classArgs["deniableContacts"] = deniableAddresses;
      classArgs["deniableGroups"] = deniableGroupAddresses; //List of GroupType
      classArgs["regularGroups"] = regularGroupAddresses; //List of GroupType
      classArgs["denimClient"] = denimClient;
      classArgs["send"] = processOutgoingDenimMessage;
      classArgs["Message"] = Message;
      classArgs["Constants"] = Constants;
      classArgs["Util"] = Util;
      classArgs["regularSendBehavior"] = regularSendBehavior;
      classArgs["deniableSendBehavior"] = deniableSendBehavior;
      classArgs["regularResponseBehavior"] = regularResponseBehavior;
      classArgs["deniableResponseBehavior"] = deniableResponseBehavior;
      code = new codeBase(classArgs);

      // Let dispatcher know setup is done
      send(Constants.CLIENT_READY);

    } else if (content.includes(Constants.SERVER_START)) {
      // Fresh data structures
      cleanUp();

      // Driver to start experiment
      messageEmitter.on('event', code[printMessageReceived]); // Prints messages and then branches on behavior
      const startTime = Date.now();
      stateExperimentOngoing = true;

      while (stateExperimentOngoing) {
        info(`${getPrintName()} Time elapsed ${Date.now() - startTime}`);

        // Execute the provided behavior code with given probabilities
        const regularProbability = json.regular_probability;
        for (let i = 0; i < json.regular_messages; i++) {
          if (Util.doWithProbability(regularProbability)) {
            await code[regularSendBehavior](false);
          }
        }

        const deniableProbability = json.deniable_probability;
        if (deniableProbability > 0) {
          for (let i = 0; i < json.deniable_messages; i++) {
            if (Util.doWithProbability(deniableProbability)) {
              await code[deniableSendBehavior](true);
            }
          }
        }

        // Wait for next tick
        await new Promise(r => setTimeout(r, json.event_ticks));

        // Should we continue looping?
        const _stateExperimentOngoing = Util.hasNotTimedOut(startTime, json.duration);
        if (!_stateExperimentOngoing) {
          denimClient.takeIncomingCounterSnapshot()
          await new Promise(r => setTimeout(r, 1000))
        }
        stateExperimentOngoing = _stateExperimentOngoing

        if (!stateExperimentOngoing) {
          info(`${getPrintName()} Current experiment run over`);
          reportDone();
        }
      }

    } else if (content.includes(Constants.SERVER_EXPERIMENT_DONE)) {
      info(`${getPrintName()} SERVER_EXPERIMENT_DONE received`);
      process.exit(0);

    }
  } else { // Denim server messages
    info(data.binaryData)
  }
}

async function main() {
  send = await initExperimentClient(onMessage, Constants.CLIENT_CONNECT, 'wss://' + dispatcherAddress + ':'
    + Constants.DISPATCHER_PORT, Constants.EXPERIMENT_PROTOCOL);
}

function cleanUp() {
  messageEmitter.removeAllListeners();

  // Signal state: keys cached, messages to send
  deniableKeys = new Map<string, string>(); // Stringified ProtocolAddress, KEY_STATE from Constants
  regularKeys = new Map<string, string>();
  queuedRegularMessages = new Array<Message>();
  queuedDeniableMessages = new Array<Message>();
}

main();
