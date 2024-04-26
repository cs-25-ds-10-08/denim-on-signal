import {DenimClient, newDenimClient } from "../src/core/DenimClient";
import { DenimServer } from '../src/core/DenimServer';
import SignalLib = require('@signalapp/libsignal-client');;
import { KeyTuple, SignedKeyTuple } from "../src/wrappers/KeyWrappers";
import { denim_proto } from "../src/proto-generated/compiled";
import Constants = require('../src/helper/Constants');
import { ProtoFactory } from "../src/helper/ProtoFactory";

var test = require('tape');

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

test('Key request sanity', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const aliceStringify = JSON.stringify(ProtoFactory._protocolAddress(alice.address));
    const bob = await newDenimClient("Bob", 1);
    const bobStringify = JSON.stringify(ProtoFactory._protocolAddress(bob.address));
    const server = new DenimServer(Constants.DEFAULT_Q);

    const aliceRegister = await alice.createRegisterThreadUnsafe();
    server.process(aliceStringify, aliceRegister);
    const bobRegister = await bob.createRegisterThreadUnsafe();
    server.process(bobStringify, bobRegister);

    const bytes = await bob.createKeyRequest(alice.address); //serialized by client
    const denimMsg = denim_proto.DenimMessage.decode(bytes); //deserialized by server

    tape.true(bytes);
    tape.true(denimMsg);
});

test('Register', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const aliceStringify = JSON.stringify(ProtoFactory._protocolAddress(alice.address));
    const server = new DenimServer(Constants.DEFAULT_Q);
    const address = ProtoFactory._protocolAddress(alice.address);

    const bytes = await alice.createRegisterThreadUnsafe();
    server.process(aliceStringify, bytes);
    tape.equal(server.users.size, 1);
});

test('Register and refill', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const aliceStringify = JSON.stringify(ProtoFactory._protocolAddress(alice.address));
    const server = new DenimServer(Constants.DEFAULT_Q);
    const address = ProtoFactory._protocolAddress(alice.address);

    const bytes = await alice.createRegisterThreadUnsafe();
    server.process(aliceStringify, bytes);
    tape.equal(server.users.size, 1);

    await alice.createRefillKeys(10);
});

test('Serialize signal key', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const receiverIdKey = await alice.identityKeyStore.getIdentityKey();

    const serializedKey = receiverIdKey.getPublicKey().serialize();
    const deserialized = SignalLib.PublicKey.deserialize(serializedKey);

    tape.equal(receiverIdKey.getPublicKey().getPublicKeyBytes, deserialized.getPublicKeyBytes);
});

test('Register and set up com', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const aliceStringify = JSON.stringify(ProtoFactory._protocolAddress(alice.address));
    const bob = await newDenimClient("Bob", 1);
    const bobStringify = JSON.stringify(ProtoFactory._protocolAddress(bob.address));
    const server = new DenimServer(Constants.DEFAULT_Q);

    const aliceRegister = await alice.createRegisterThreadUnsafe();
    server.process(aliceStringify, aliceRegister);
    tape.equal(server.users.size, 1);
    const bobRegister = await bob.createRegisterThreadUnsafe();
    server.process(bobStringify, bobRegister);
    tape.equal(server.users.size, 2);

    // instead of fetching, create a bundle ourselves
    const receiverPreKeyId = bob._regularPreKeyCounter-1;
    const receiverPrePKey = await bob.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const receiverRegId = await bob.identityKeyStore.getLocalRegistrationId();
    const receiverBundle = SignalLib.PreKeyBundle.new(
        receiverRegId,
        bob.address.deviceId(),
        receiverPreKeyId,
        receiverPrePKey.publicKey(),
        receiverSignedPrePKeyId,
        receiverSignedPrePKey.publicKey(),
        receiverSignedPrePKey.signature(),
        receiverIdKey
    );

    await alice.startNewOutgoingSessionThreadUnsafe(receiverBundle, bob.address);
    
    const encoded = await alice.createRegularMessage("Hello Bob", bob.address);
    const denimMsg = denim_proto.DenimMessage.decode(encoded);
    const regularPayload = denim_proto.RegularPayload.decode(denimMsg.regularPayload);
    const aliceCiphertext = regularPayload.userMessage.signalMessage;
    const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(Buffer.from(aliceCiphertext));
    const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
});
