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

const logLevel = yargs.argv.debugserver ? 'debug' : 'info';
const logger = require('../helper/Logger').getLogger("WSServer", logLevel);
const info = x => logger.info(x)
const debug = x => logger.debug(x)
const error = x => logger.error(x);

const q = yargs.argv.q != undefined ? yargs.argv.q : Constants.DEFAULT_Q;

let run = 0;

let denimServer = new DenimServer(q);
let connectionToAddress = new Map<any, string>();
let addressToConnection = new Map<string, any>();

const fileSuffix = "-q=" + denimServer.q.toString() + ".csv";
const outputDir = Constants.OUTPUT_DIR_SERVER;
const oneSecond = 1000;

let stateWaiting = true;

Util.createFolder(outputDir);

fs.writeFileSync(`${outputDir}/server-settings.json`, `{\n    "q":${q}\n}`);

let server = https.createServer(
  {
    key: fs.readFileSync('ssl-cert/key.pem')
    , cert: fs.readFileSync('ssl-cert/cert.pem')
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

function calculateDeniableBufferSize() {
  let queuedDeniable = 0;

  for (const buffer of denimServer.deniableBuffers.values()) {
    queuedDeniable += buffer.length;
  }

  for (const chunk of denimServer.usersCurrentOutgoingChunk.values()) {
    if (chunk.length > 0) {
      queuedDeniable++;
    }
  }

  for (const chunk of denimServer.usersCurrentIncomingChunk.values()) {
    if (chunk.length > 0) {
      queuedDeniable++;
    }
  }

  return queuedDeniable;

}


wsServer.on('request', (request) => {
  let connection = request.accept(Constants.PROTOCOL, request.origin);
  debug((new Date()) + ' Connection accepted.');
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      let content = message.utf8Data;

      //Dispatcher instructions
      if (content.includes(Constants.SERVER_COMMAND_RESTART_STRING)) {
        stateWaiting = true;
        cleanUp();
        denimServer = new DenimServer(q);
        run++;
        // Tell Dispatcher that the server is restarted
        connection.send(Constants.DENIM_SERVER_RESTARTED);
      } else if (content.includes(Constants.SERVER_START)) {
        stateWaiting = false;

      } else if (content.includes(Constants.SERVER_EXPERIMENT_DONE)) {
        info(`Received SERVER_EXPERIMENT_DONE, wrapping up...`);
        process.exit(0);
      } else { // New client connection
        info('New connection with: ' + message.utf8Data + " on port " + connection.socket._peername.port);
        connectionToAddress.set(connection, message.utf8Data);
        addressToConnection.set(message.utf8Data, connection);
      }
    }
    else if (message.type === 'binary') {
      if (stateWaiting) {
        info(`Incoming message while waiting for next experiment, ignoring...`);
        return;
      }

      const start = microseconds.now();
      debug('Received message of ' + message.binaryData.length + ' bytes');
      const sender = connectionToAddress.get(connection);
      const response = denimServer.process(sender, message.binaryData);
      // Reply/forward
      if (response.receiver != null && response.msg.length > 0) {
        const respondTo = addressToConnection.get(response.receiver);
        respondTo.sendBytes(response.msg);
      } else {
        debug(`DenimServer's process() returned null`);
      }

      // Process potentially deniable part *after* handling regular part
      denimServer._processChunks(sender, response.chunks);
    }
  });
  connection.on('close', (reasonCode, description) => {
    debug((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

function cleanUp() {
  connectionToAddress = new Map();
  addressToConnection = new Map();
}
