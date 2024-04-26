import {DenimClient, newDenimClient } from "../src/core/DenimClient";
import { DenimServer } from '../src/core/DenimServer';
import SignalLib = require('@signalapp/libsignal-client');;
import { KeyTuple, SignedKeyTuple } from "../src/wrappers/KeyWrappers";
import { denim_proto } from "../src/proto-generated/compiled";
import Constants = require('../src/helper/Constants');
import { ProtoFactory } from "../src/helper/ProtoFactory";
import Util = require('../src/helper/Util');

var test = require('tape');

test('Deniable', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);
    const charlie = await newDenimClient("Charlie", 1);
    const dorothy = await newDenimClient("Dorothy", 1);

    const aliceAddressString = Util.signalAddressToString(alice.address);
    const bobAddressString = Util.signalAddressToString(bob.address);
    const charlieAddressString = Util.signalAddressToString(charlie.address);
    const dorothyAddressString = Util.signalAddressToString(dorothy.address);

    const q = 2;
    const server = new DenimServer(q);

    const aliceRegister = await alice.createRegisterThreadUnsafe();
    server.process(aliceAddressString, aliceRegister); //Async this call?
    const bobRegister = await bob.createRegisterThreadUnsafe();
    server.process(bobAddressString, bobRegister);
    const charlieRegister = await charlie.createRegisterThreadUnsafe();
    server.process(charlieAddressString, charlieRegister);
    const dorothyRegister = await dorothy.createRegisterThreadUnsafe();
    server.process(dorothyAddressString, dorothyRegister);

    // Alice wants to communicate deniably with Bob
    await alice.queueDeniableKeyRequest(bob.address);
    await alice.queueDeniableMessage("Privet "+bob.address.name()+"...", bob.address);
    tape.equal(alice.deniableMessagesAwaitingEncryption.get(bobAddressString).length, 1);

    const aliceCharlieKeyRequest = alice.createKeyRequest(charlie.address);
    const aliceCharlieKeyResponse = server.process(aliceAddressString, aliceCharlieKeyRequest)["msg"];
    let decoded = denim_proto.DenimMessage.decode(aliceCharlieKeyResponse);
    await alice.process(decoded);

    // Server processes *after* responding
    const denimMsg1 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieKeyRequest));
    await server._processChunks(aliceAddressString, denimMsg1.chunks);


    const aliceCharlieMsg1 = await alice.createRegularMessage("Very long message for Charlie to flush out the deniable key request", charlie.address);
    const aliceCharlieMsg1Forward = server.process(aliceAddressString, aliceCharlieMsg1)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg1Forward);
    await charlie.process(decoded);

    // Server processes *after* responding
    const denimMsg2 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg1));
    await server._processChunks(aliceAddressString, denimMsg2.chunks);

    // Charlie should respond so Alice can get the deniable key response
    const aliceCharlieMsg2 = await charlie.createRegularMessage("Hello Alice! Let me send you something very long so you can get the key response with this message", alice.address);
    const aliceCharlieMsg2Forward = server.process(charlieAddressString, aliceCharlieMsg2)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg2Forward);
    await alice.process(decoded); // Should contain key response
    
    await new Promise(r => setTimeout(r, 3000)); // Sleep to make sure process finishes
    tape.true(alice.deniableSessionStore.getSession(charlie.address));
    console.log(alice.outgoingDeniable);
    tape.true(alice.outgoingDeniable.length, 1); // Message should be encrypted and queued

    // Server processes *after* responding
    const denimMsg3 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg2));
    await server._processChunks(charlieAddressString, denimMsg3.chunks);


    const aliceCharlieMsg3 = await alice.createRegularMessage("Very long message 2 for Charlie to flush out the deniable message", charlie.address);
    const aliceCharlieMsg3Forward = server.process(aliceAddressString, aliceCharlieMsg3)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg3Forward);
    await charlie.process(decoded);

    // Server processes *after* responding
    const denimMsg4 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg3));
    await server._processChunks(aliceAddressString, denimMsg4.chunks);

    // Push Bob's message out using Dorothy
    // Key Request
    const dorothyBobKeyRequest = dorothy.createKeyRequest(bob.address);
    const dorothyBobKeyResponse = server.process(dorothyAddressString, dorothyBobKeyRequest)["msg"];
    decoded = denim_proto.DenimMessage.decode(dorothyBobKeyResponse);
    await dorothy.process(decoded);

     // Server processes *after* responding
     const denimMsg5 = denim_proto.DenimMessage.decode(Buffer.from(dorothyBobKeyRequest));
     await server._processChunks(dorothyAddressString, denimMsg5.chunks);

    //Regular message Dorothy->Bob

    const dorothyBobMsg1 = await dorothy.createRegularMessage("Very long message for Bob to flush out Alice's deniable message", bob.address);
    const dorothyBobMsg1Forward = server.process(dorothyAddressString, dorothyBobMsg1)["msg"];
    decoded = denim_proto.DenimMessage.decode(dorothyBobMsg1Forward);
    await bob.process(decoded);


    // Server processes *after* responding
    const denimMsg6 = denim_proto.DenimMessage.decode(Buffer.from(dorothyBobMsg1));
    await server._processChunks(dorothyAddressString, denimMsg6.chunks);


});