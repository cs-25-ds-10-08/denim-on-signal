import {DenimClient, newDenimClient } from "../src/core/DenimClient";
import Util = require('../src/helper/Util');
import { DenimServer } from '../src/core/DenimServer';
import Constants = require('../src/helper/Constants');
import { denim_proto } from "../src/proto-generated/compiled";
import { Message } from "../src/core/Message";
import SignalLib = require('@signalapp/libsignal-client');
import fc from "fast-check";

function genMessage (len, sym)  {
	return Buffer.alloc(len, sym).toString('utf-8');
}

async function bulkProcess(from:string, message:Uint8Array, server:DenimServer, stringToClient:Map<string, DenimClient>) {
	let p = server.process(from, message);
	let client = stringToClient.get(p.receiver);
	let forwardedMessage = denim_proto.DenimMessage.decode(p.msg);
	let clientReceived:Array<Message> = await client.process(forwardedMessage);
	await server._processChunks (from, p.chunks);
	
	return clientReceived;
}

async function drainSenderDeniableBuffer(sender:DenimClient, receiver:DenimClient,
	 server:DenimServer, stringToClient:Map<string, DenimClient>, regularMessage:string) {
	const senderString = Util.signalAddressToString(sender.address);
	const receiverString = Util.signalAddressToString(receiver.address);

	while((sender.outgoingDeniable.length>0 || sender.outgoingCurrentChunk.length>0) 
		&& (sender.deniableMessagesAwaitingEncryption.get(receiverString)?.length>0 
		|| sender.deniableMessagesAwaitingEncryption.get(receiverString)==null)) {
		const senderMessage = await sender.createRegularMessage(regularMessage, receiver.address);
		await bulkProcess(senderString, senderMessage, server, stringToClient);
	}

}

async function drainServerDeniableBuffer(sender:DenimClient, receiver:DenimClient,
	server:DenimServer, stringToClient:Map<string, DenimClient>, regularMessage:string) {
	const senderString = Util.signalAddressToString(sender.address);
	const receiverString = Util.signalAddressToString(receiver.address);
	const receiverMessages = new Array<Message>();

	while(server.deniableBuffers.get(receiverString)?.length>0 
	|| server.usersCurrentOutgoingChunk.get(receiverString)?.byteLength>0) {
        const senderMessage = await sender.createRegularMessage(regularMessage, receiver.address);
        const messages= await bulkProcess(senderString, senderMessage, server, stringToClient);
		messages.map(message => receiverMessages.push(message));
    }
	return receiverMessages;
}

async function chunkingScenario(q:number, regularMessageLength:number, deniableMessageLength:number, 
	alicePreKeyRecords:[SignalLib.PreKeyRecord], bobPreKeyRecords:[SignalLib.PreKeyRecord], 
	aliceDeniablePreKeyRecords:[SignalLib.PreKeyRecord], bobDeniablePreKeyRecords:[SignalLib.PreKeyRecord]) {
	console.log(`q: ${q}, regularmessagelength: ${regularMessageLength}, deniablemessagelength: ${deniableMessageLength}`);
	// Initialize clients, server, and messages (strings) to send
	const stringToClient = new Map<string, DenimClient>();

	const alice = await newDenimClient("alice", 1, alicePreKeyRecords, aliceDeniablePreKeyRecords);
	const aliceString = Util.signalAddressToString(alice.address);
	stringToClient.set(aliceString, alice);

	const bob = await newDenimClient("bob", 1, bobPreKeyRecords, bobDeniablePreKeyRecords);
	const bobString = Util.signalAddressToString(bob.address);
	stringToClient.set(bobString, bob);

	const server = new DenimServer(q);
	const regularMessage = genMessage(regularMessageLength, 'r');
	const deniableMessage = genMessage(deniableMessageLength, 'd');

	// Create register message and register them with the server 
	server.process(aliceString, await alice.createRegisterThreadUnsafe());
	server.process(bobString, await bob.createRegisterThreadUnsafe());
	
	// Queue deniable key request and message from Alice->Bob
	alice.queueDeniableKeyRequest(bob.address);
	
	// Initialize regular comm Alice->Bob
	const aliceRequestBobKeyBundle = alice.createKeyRequest(bob.address);
	await bulkProcess(aliceString, aliceRequestBobKeyBundle, server, stringToClient);
	
	// Drain Alice's deniable buffers (of deniable key request)
	await drainSenderDeniableBuffer(alice, bob, server, stringToClient, regularMessage);
	// Alice's key request has been processed by server; there's a key response queued
	if(server.deniableBuffers.get(aliceString).length!=1) {
		return false;
	}

	// Let Bob respond to carry deniable key response to Alice
	await drainServerDeniableBuffer(bob, alice, server, stringToClient, regularMessage);
	if(!(await alice.deniableSessionStore.getSession(bob.address)).hasCurrentState()) {
		return false;
	}

	// Now that deniable buffers are empty and deniable session is initialized, queue the deniable message
	// This is where the test case starts!
	await alice.createDeniableMessage(deniableMessage, bob.address);

	// Drain Alice's deniable buffers
	await drainSenderDeniableBuffer(alice, bob, server, stringToClient, regularMessage);
	//Bob's message should be reassembled and waiting to go on the server
	if(server.deniableBuffers.get(bobString)?.length!=1){
		return false;
	}

	const bobReceived = await drainServerDeniableBuffer(alice, bob, server, stringToClient, regularMessage);
	const bobReceivedDeniable = bobReceived.filter(message => message.deniable).shift();
	const decryptionSuccessful = bobReceivedDeniable.message == deniableMessage;

	return decryptionSuccessful;
}

async function checkChunking () {

	// Initialize keys: only run this once and then re-use
	const alicePreKey = SignalLib.PrivateKey.generate();
    const alicePreKeyId = 2;
    const alicePreKeyRecord = SignalLib.PreKeyRecord.new(alicePreKeyId, alicePreKey.getPublicKey(), alicePreKey);

	const aliceDeniablePreKey = SignalLib.PrivateKey.generate();
    const aliceDeniablePreKeyId = 2;
    const aliceDeniablePreKeyRecord = SignalLib.PreKeyRecord.new(aliceDeniablePreKeyId, aliceDeniablePreKey.getPublicKey(), aliceDeniablePreKey);

	const bobPreKey = SignalLib.PrivateKey.generate();
    const bobPreKeyId = 2;
    const bobPreKeyRecord = SignalLib.PreKeyRecord.new(bobPreKeyId, bobPreKey.getPublicKey(), bobPreKey);

	const bobDeniablePreKey = SignalLib.PrivateKey.generate();
    const bobDeniablePreKeyId = 2;
    const bobDeniablePreKeyRecord = SignalLib.PreKeyRecord.new(bobDeniablePreKeyId, bobDeniablePreKey.getPublicKey(), bobDeniablePreKey);


	fc.assert(fc.asyncProperty(fc.float({"min":0.1, "max":10}), fc.integer({"min":1, "max":100000}), fc.integer({"min":1, "max":100000}),
		async (q, r, d) => chunkingScenario(q, r, q, [alicePreKeyRecord], [bobPreKeyRecord], [aliceDeniablePreKeyRecord], [bobDeniablePreKeyRecord]) ), 
		{verbose: fc.VerbosityLevel.VeryVerbose});
		
	
}

checkChunking();