import {DenimClient, newDenimClient } from "../src/core/DenimClient";
import Util = require('../src/helper/Util');
import { DenimServer } from '../src/core/DenimServer';
import Constants = require('../src/helper/Constants');
import { denim_proto } from "../src/proto-generated/compiled";
import { Message } from "../src/core/Message";
import SignalLib = require('@signalapp/libsignal-client');
import fc from "fast-check";
import { ProtoFactory } from "../src/helper/ProtoFactory";



async function keyRequestsScenario(q:number, attempts:number) {
    const alice = await newDenimClient("A", 1, 10, 2);
    const aliceString = Util.signalAddressToString(alice.address);
    const bob = await newDenimClient("B", 1, 10, 2);
    const bobString = Util.signalAddressToString(bob.address);
    const server = new DenimServer(q);

	// Create register message and register them with the server 
	server.process(aliceString, await alice.createRegisterThreadUnsafe());
	server.process(bobString, await bob.createRegisterThreadUnsafe());

    // Pass Bob's key to Alice
    const aliceKeyRequest = alice.createKeyRequest(bob.address);
    const ret1 = server.process(aliceString, aliceKeyRequest);
    server._processChunks(aliceString, ret1.chunks);
    const denimMsg = denim_proto.DenimMessage.decode(ret1.msg);
    await alice.processThreadUnsafe(denimMsg);
	
	// Queue deniable key requests *After* receving the response
	alice.queueDeniableKeyRequest(bob.address); // Length=9B
    alice.queueDeniableKeyRequest(bob.address); // Length=9B
    console.log(`2 deniable key requests queued by Alice`);
    console.log(`Alice's outgoingDeniable is of length: ${alice.outgoingDeniable.length}`);

    const deniableKeyRequestLength = denim_proto.DeniablePayload.encode(ProtoFactory.deniableKeyRequest(bob.address)).finish().byteLength;
    console.log(`Deniable key request is ${deniableKeyRequestLength} bytes`);
    const shortMessage = "A";

    console.log(`Start sending regular key requests`);
    for(let i=0; i<deniableKeyRequestLength*attempts; i++) { // deniableKeyRequestLength should be enough
        const aliceRepeatKeyRequest = alice.createKeyRequest(bob.address);
        console.log(`Payload length: ${aliceRepeatKeyRequest.byteLength}, q: ${alice.q}, expected padding: ${Math.ceil(alice.q*aliceRepeatKeyRequest.byteLength)}`);
        console.log(`Padding calulated client-side: ${Util.calculatePaddingLength(alice.q, aliceRepeatKeyRequest.byteLength)}`)
        console.log(`-------------- Server process() start --------------`);
        const retn = server.process(aliceString, aliceRepeatKeyRequest);
        console.log(`-------------- Server process() end --------------`);
        server._processChunks(aliceString, retn.chunks);
        console.log(`Alice's outgoingDeniable is of length: ${alice.outgoingDeniable.length}`);
    }

    server.q = 100;
    alice.q = server.q;
    console.log(`Increasing q to ${server.q}`);
    const msgBytes = await alice.createRegularMessage(shortMessage, bob.address);
    const ret2 = server.process(aliceString, msgBytes);
    server._processChunks(aliceString, ret2.chunks);
}

keyRequestsScenario(0.72, 1);