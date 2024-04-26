import {DenimClient, newDenimClient } from "../src/core/DenimClient";
import { DenimServer } from '../src/core/DenimServer';
import SignalLib = require('@signalapp/libsignal-client');;
import { KeyTuple, SignedKeyTuple } from "../src/wrappers/KeyWrappers";
import { denim_proto } from "../src/proto-generated/compiled";
import Constants = require('../src/helper/Constants');
import { ProtoFactory } from "../src/helper/ProtoFactory";
import Util = require('../src/helper/Util');
import { re } from "mathjs";
import { Message } from "../src/core/Message";
import * as fc from 'fast-check'
import { fstat } from "fs";

var test = require('tape');


test('Chunk size dummy padding', async (tape)=> {
    let q = 2;
    let messageLength = 10;
    let currentChunk = undefined;
    let deniableBuffer = new Array();

    let ret = Util.getDeniableChunks(q, messageLength, currentChunk, deniableBuffer);
    let chunk = ret.chunks.shift();
    let serialized = denim_proto.DenimChunk.encode(chunk).finish();
    console.log(serialized);

    tape.equals(serialized.byteLength, Util.calculatePaddingLength(q, messageLength));
});

test('Chunk size deniable content', async (tape)=> {
    let q = 1;
    let contentLength = 10;
    let currentChunk = undefined;
    let deniableBuffer = new Array();
    let messageLength = 10;

    let deniablePayload = ProtoFactory.deniableDummyPadding(Buffer.alloc(contentLength));
    deniableBuffer = [deniablePayload];
    let ret = Util.getDeniableChunks(q, messageLength, currentChunk, deniableBuffer);
    let chunk = ret.chunks.shift();
    let serialized = denim_proto.DenimChunk.encode(chunk).finish();

    tape.true(serialized.byteLength == Util.calculatePaddingLength(q, messageLength) || serialized.byteLength == Constants.EMPTY_DENIMCHUNK_SIZE);
});

test('Chunk size deniable content and dummy', async (tape)=> {
    let q = 2;
    let contentLength = 10;
    let currentChunk = undefined;
    let deniableBuffer = new Array();
    let messageLength = 10;

    let deniablePayload = ProtoFactory.deniableDummyPadding(Buffer.alloc(contentLength));
    deniableBuffer = [deniablePayload];
    let ret = Util.getDeniableChunks(q, messageLength, currentChunk, deniableBuffer);

    let length = 0;
    for(const chunk of ret.chunks) {
        length += denim_proto.DenimChunk.encode(chunk).finish().byteLength;
    }

    tape.equals(length, Util.calculatePaddingLength(q, messageLength));
});

test('Chunk size multiple deniable content and dummy', async (tape)=> {
    let q = 2;
    let contentLength = 10;
    let currentChunk = undefined;
    let deniableBuffer = new Array();

    let deniablePayload1 = ProtoFactory.deniableDummyPadding(Buffer.alloc(contentLength));
    let deniablePayload2 = ProtoFactory.deniableDummyPadding(Buffer.alloc(contentLength));
    deniableBuffer = [deniablePayload1, deniablePayload2];
    let messageLength = 10;
    let ret = Util.getDeniableChunks(q, messageLength, currentChunk, deniableBuffer);

    let length = 0;
    for(const chunk of ret.chunks) {
        length += denim_proto.DenimChunk.encode(chunk).finish().byteLength;
    }

    tape.equals(length, Util.calculatePaddingLength(q, messageLength));
});

test('Chunk size deniable content exceeds padding space', async (tape)=> {
    let q = 2;
    let currentChunk = undefined;
    let deniableBuffer = new Array();
    let messageLength = 10;
    let contentLength = Util.calculatePaddingLength(q, messageLength)+1;

    let deniablePayload1 = ProtoFactory.deniableDummyPadding(Buffer.alloc(contentLength));
    deniableBuffer = [deniablePayload1];
    let ret = Util.getDeniableChunks(q, messageLength, currentChunk, deniableBuffer);

    let length = 0;
    for(const chunk of ret.chunks) {
        length += denim_proto.DenimChunk.encode(chunk).finish().byteLength;
    }

    tape.equals(length, Util.calculatePaddingLength(q, messageLength));
});

test('Test specific values that cause dummy padding inserted between chunks, end-to-end setting', async (tape)=> {
    const q = 1; // Tuned for this case, don't change
    const alice = await newDenimClient("alice", 1);
    const aliceString = Util.signalAddressToString(alice.address);
    const bob = await newDenimClient("bob", 1);
    const bobString = Util.signalAddressToString(bob.address);
    const server = new DenimServer(q);
    const regularMessageLength = 1000; //Tuned numbers, this will result in 1 byte saved in the ongoing chunk. Test different values with fast-check
    const regularMessage = Buffer.alloc(regularMessageLength, 'r').toString('utf-8');
    const deniableMessageLength = 900; // Tuned for this case, don't update
    const deniableMessage = Buffer.alloc(deniableMessageLength, 'd').toString('utf-8');

    // Create register messages
    const registerAlice = await alice.createRegisterThreadUnsafe();
    const registerBob = await bob.createRegisterThreadUnsafe();

    // Register keys
    let response = server.process(aliceString, registerAlice);
    response = server.process(bobString, registerBob);

    // Queue deniable key request and message from Alice->Bob
    alice.queueDeniableKeyRequest(bob.address);
    tape.equal(alice.outgoingDeniable.length, 1); // The key request should be queued

    // Initialize regular comm Alice->Bob
    const aliceRequestBobKeyBundle = alice.createKeyRequest(bob.address);
    response = server.process(aliceString, aliceRequestBobKeyBundle);
    let deniableProcessed = await server._processChunks(aliceString, response.chunks);
     // Server response 
    let denimMsg = denim_proto.DenimMessage.decode(response.msg);            
    await alice.process(denimMsg); // Key response

    const hasRegularSession = await alice.regularSessionStore.getSession(bob.address);
    tape.true(hasRegularSession); // Check that session got established

    // Drain Alice's deniable buffers (of deniable key request)
    while((alice.outgoingDeniable.length>0 || alice.outgoingCurrentChunk!=undefined) 
            && (alice.deniableMessagesAwaitingEncryption.get(bobString)?.length>0 || alice.deniableMessagesAwaitingEncryption.get(bobString)==null)) {
        let aliceMessage = await alice.createRegularMessage(regularMessage, bob.address);
        response = server.process(aliceString, aliceMessage); // Pass serialized message to server
        // Process chunks after processing
        deniableProcessed = await server._processChunks(aliceString, response.chunks);
        console.log(`Alice outgoingdeniable: ${alice.outgoingDeniable.length}, ongoing chunk is length ${alice.outgoingCurrentChunk?.byteLength}`);
        
        // Forward message to receiver
        denimMsg = denim_proto.DenimMessage.decode(response.msg);            
        await bob.process(denimMsg);
    }
    console.log(`First regular message sent, server has started processing:
    deniable key requests: ${server.deniableKeyRequestsProcessed}
    deniable user messages: ${server.deniableMessagesProcessed}`);

    tape.equal(server.deniableBuffers.get(aliceString).length, 1); // Alice's key request has been processed by server; there's a key response queued

    // Let Bob respond to carry deniable key response to Alice
    while(server.deniableBuffers.get(aliceString)?.length>0 || server.usersCurrentOutgoingChunk.get(aliceString)?.byteLength>0) {
        let bobMessage = await bob.createRegularMessage(regularMessage, alice.address);
        response = server.process(bobString, bobMessage); // Pass serialized message to server
        // Forward message to receiver 
        denimMsg = denim_proto.DenimMessage.decode(response.msg);            
        await alice.process(denimMsg);
        // Process chunks after forwarding
        deniableProcessed = await server._processChunks(bobString, response.chunks); 
    } 
    // Check that Alice received the deniable key response
    const hasDeniableSession = await alice.deniableSessionStore.getSession(bob.address);
    tape.true(hasDeniableSession.hasCurrentState());

    await alice.createDeniableMessage(deniableMessage, bob.address);
    tape.equal(alice.outgoingDeniable?.length, 1); // The deniable message
    let deniablePayload = denim_proto.DeniablePayload.encode(alice.outgoingDeniable[0]).finish();
    console.log(`Deniable payload queued is ${deniablePayload.byteLength} bytes`);
    tape.equal(server.deniableBuffers.get(bobString)?.length, 0); // Bob shouldn't have anything queued yet

    // Try out the case where a deniable message requires an intermediary dummy chunk
    // The deniable payload needs to be smaller than the padding for this to happen
    let aliceMessage = await alice.createRegularMessage(regularMessage, bob.address);
    response = server.process(aliceString, aliceMessage); // Pass serialized message to server
    // Process chunks after processing
    deniableProcessed = await server._processChunks(aliceString, response.chunks);
    console.log(`Alice outgoingdeniable: ${alice.outgoingDeniable.length}, ongoing chunk is length ${alice.outgoingCurrentChunk?.byteLength}`);
    tape.false(alice.outgoingCurrentChunk==undefined);
    // Forward message to receiver
    denimMsg = denim_proto.DenimMessage.decode(response.msg);            
    let bobReceived:Array<Message> = await bob.process(denimMsg);
    for(const processedMessage of bobReceived){
        tape.false(processedMessage.deniable); // There should still be some bytes (<4) at the server
    }

    // Push the last chunk to Bob
    aliceMessage = await alice.createRegularMessage(regularMessage, bob.address);
    response = server.process(aliceString, aliceMessage); // Pass serialized message to server
    // Process chunks after processing
    deniableProcessed = await server._processChunks(aliceString, response.chunks);
    console.log(`Alice outgoingdeniable: ${alice.outgoingDeniable.length}, ongoing chunk is length ${alice.outgoingCurrentChunk?.byteLength}`);

    denimMsg = denim_proto.DenimMessage.decode(response.msg);            
    bobReceived = await bob.process(denimMsg);
    console.log(bobReceived.length);
    for(const processedMessage of bobReceived){
        tape.false(processedMessage.deniable); // The message should be on the server
    }

    // Bob's message has been reassembled on the server
    tape.equal(server.deniableBuffers.get(bobString)?.length, 1); 


});



test('Uint8array reassembly', async (tape)=> {

    const padding = ProtoFactory.deniableDummyPadding(Buffer.alloc(20));
    const serializedPadding = denim_proto.DeniablePayload.encode(padding).finish();
    console.log("Serialized length: "+serializedPadding.byteLength);
    const slice = Math.floor(serializedPadding.byteLength/2);

    console.log(serializedPadding);
    const chunk1 = serializedPadding.slice(0, serializedPadding.byteLength-slice);
    const chunk2 = serializedPadding.slice(serializedPadding.byteLength-slice, serializedPadding.byteLength);
    console.log(chunk1);
    console.log(chunk2);

    const reassembled = Util.concatUint8Array(chunk1, chunk2);
    tape.equal(serializedPadding.byteLength, reassembled.byteLength);
 
    const deserializedPadding = denim_proto.DeniablePayload.decode(Buffer.from(reassembled));
    tape.true(deserializedPadding.dummy);

});

