import {DenimClient, newDenimClient} from "../src/core/DenimClient";
import {DenimServer} from "../src/core/DenimServer";
import SignalLib = require('@signalapp/libsignal-client');;
import { KeyTuple, SignedKeyTuple } from "../src/wrappers/KeyWrappers";
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


test('Setup regular session', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);
    
    const receiverPreKeyId = bob._regularPreKeyCounter-1;
    const receiverPrePKey = await bob.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const receiverRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
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

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(receiverBundle, bob.address);
    const aliceBobSession =await alice.regularSessionStore.getSession(bob.address);
    tape.true(aliceBobSession.hasCurrentState());
});


test('Session: encrypt/decrypt message', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);

    const receiverPreKeyId = bob._regularPreKeyCounter-1;
    const receiverPrePKey = await bob.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const receiverRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
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

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(receiverBundle, bob.address);
    //send message
    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");
    const aliceCiphertext = await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address);
    const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
    const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
    tape.equal(bobDecrypted.toString(), aliceMessage.toString());
});

test('Session: ping-pong messages', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);

    const receiverPreKeyId = bob._regularPreKeyCounter-1;
    const receiverPrePKey = await bob.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const receiverRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
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

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(receiverBundle, bob.address);
    //send message
    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");
    const aliceCiphertext = await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address);
    const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
    const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
    tape.equal(bobDecrypted.toString(), aliceMessage.toString());

    const plain2 = Buffer.from("Bob to Alice", "utf8");
    const msg2 = await bob.encryptRegularThreadUnsafe(plain2, alice.address);
    const decryptMsg2 = await alice.decryptRegularThreadUnsafe(SignalLib.SignalMessage.deserialize(msg2.serialize()), bob.address);
    tape.equal(decryptMsg2.toString(), plain2.toString());

    const plain3 = Buffer.from("Alice to Bob", "utf8");
    const msg3 = await alice.encryptRegularThreadUnsafe(plain3, bob.address);
    const decryptMsg3 = await bob.decryptRegularThreadUnsafe(SignalLib.SignalMessage.deserialize(msg3.serialize()), alice.address);
    tape.equal(decryptMsg3.toString(), plain3.toString());
});

test('Session: multiple messages', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);

    const receiverPreKeyId = bob._regularPreKeyCounter-1;
    const receiverPrePKey = await bob.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const receiverRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
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

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(receiverBundle, bob.address);
    //send message
    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");
    const aliceCiphertext = await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address);
    const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
    const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
    tape.equal(bobDecrypted.toString(), aliceMessage.toString());

    const plain1 = Buffer.from("Hi Alice", "utf8");
    const msg1 = await bob.encryptRegularThreadUnsafe(plain1, alice.address);
    const decryptMsg1 = await alice.decryptRegularThreadUnsafe(SignalLib.SignalMessage.deserialize(msg1.serialize()), bob.address);
    tape.equal(decryptMsg1.toString(), plain1.toString());

    const plain2 = Buffer.from("Alice second", "utf8");
    const msg2 = await alice.encryptRegularThreadUnsafe(plain2, bob.address);
    const decryptMsg2 = await bob.decryptRegularThreadUnsafe(SignalLib.SignalMessage.deserialize(msg2.serialize()), alice.address);
    tape.equal(decryptMsg2.toString(), plain2.toString());

    const plain3 = Buffer.from("Alice third", "utf8");
    const msg3 = await alice.encryptRegularThreadUnsafe(plain3, bob.address);
    const decryptMsg3 = await bob.decryptRegularThreadUnsafe(SignalLib.SignalMessage.deserialize(msg3.serialize()), alice.address);
    tape.equal(decryptMsg3.toString(), plain3.toString());
});

test('Session: multiple messages, same speaker', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);

    const receiverPreKeyId = bob._regularPreKeyCounter-1;
    const receiverPrePKey = await bob.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const receiverRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
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

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(receiverBundle, bob.address);
    //send message
    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");
    const aliceCiphertext = await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address);
    const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
    const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
    tape.equal(bobDecrypted.toString(), aliceMessage.toString());

    const plain2 = Buffer.from("Alice second", "utf8");
    const msg2 = await alice.encryptRegularThreadUnsafe(plain2, bob.address);
    const decryptMsg2 = await bob.decryptRegularPreKeyThreadUnsafe(SignalLib.PreKeySignalMessage.deserialize(msg2.serialize()), alice.address);
    tape.equal(decryptMsg2.toString(), plain2.toString());

    const plain3 = Buffer.from("Alice third", "utf8");
    const msg3 = await alice.encryptRegularThreadUnsafe(plain3, bob.address);
    const decryptMsg3 = await bob.decryptRegularPreKeyThreadUnsafe(SignalLib.PreKeySignalMessage.deserialize(msg3.serialize()), alice.address);
    tape.equal(decryptMsg3.toString(), plain3.toString());
});


test('Session: regular and deniable at once', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);

    const receiverPreKeyId = bob._regularPreKeyCounter-1;
    const receiverPrePKey = await bob.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const receiverRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
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

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(receiverBundle, bob.address);
    const aliceBobSession = await alice.regularSessionStore.getSession(bob.address);
    tape.true(aliceBobSession.hasCurrentState())

    //send message
    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");
    const aliceCiphertext = await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address);
    const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
    const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
    tape.equal(bobDecrypted.toString(), aliceMessage.toString());

    const plain2 = Buffer.from("Bob to Alice", "utf8");
    const msg2 = await bob.encryptRegularThreadUnsafe(plain2, alice.address);
    const decryptMsg2 = await alice.decryptRegularThreadUnsafe(SignalLib.SignalMessage.deserialize(msg2.serialize()), bob.address);
    tape.equal(decryptMsg2.toString(), plain2.toString());

    //Deniable session
    const bobPreKeyId = bob.deniableKeyIds[1];
    const bobPrePKey = await bob.deniablePreKeyStore.getPreKey(bobPreKeyId);
    const bobSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const bobSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(bobSignedPrePKeyId);
    const bobIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const bobRegId = await bob.identityKeyStore.getLocalRegistrationId();
    const deniableBundle = SignalLib.PreKeyBundle.new(
        bobRegId,
        bob.address.deviceId(),
        bobPreKeyId,
        bobPrePKey.publicKey(),
        bobSignedPrePKeyId,
        bobSignedPrePKey.publicKey(),
        bobSignedPrePKey.signature(),
        bobIdKey
    );

    // Deniable: Alice->Bob
    await alice.startNewOutgoingDeniableSessionThreadUnsafe(deniableBundle, bob.address);
    const aliceBobDeniableSession = await alice.deniableSessionStore.getSession(bob.address);
    tape.true(aliceBobDeniableSession.hasCurrentState());
    tape.true(aliceBobSession.hasCurrentState());
});


test('Fetch key bundle', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);
    
    const preKeyId = bob._regularPreKeyCounter-1;
    const prePKey:SignalLib.PreKeyRecord = await bob.regularPreKeyStore.getPreKey(preKeyId);
    const signedPrePKeyId = bob._signedPreKeyCounter-1;
    const signedPrePKey:SignalLib.SignedPreKeyRecord = await bob.signedPreKeyStore.getSignedPreKey(signedPrePKeyId);
    const signedKeyTuple = new SignedKeyTuple(signedPrePKey.publicKey(), signedPrePKey.id(), signedPrePKey.signature());
    const idKey = await bob.identityKeyStore.getIdentity(bob.address);
    const regId = await bob.identityKeyStore.getLocalRegistrationId();

    var ephemerals = new Array<KeyTuple>();
    ephemerals.push(new KeyTuple(prePKey.publicKey(), prePKey.id()));

    const kdc = new DenimServer(0.9);
    const bobAddress = ProtoFactory._protocolAddress(bob.address);

    const registerMsg = ProtoFactory._register(bob.address, idKey.serialize(), regId, signedKeyTuple, ephemerals, ephemerals, bob.keySeed, bob.keyIdSeed);

    tape.equal(kdc.users.size, 0);
    kdc._registerUser(registerMsg);
    tape.equal(kdc.users.size, 1);

    // Getting a bundle should delete a epemeral key
    kdc._createRegularPreKeyBundle(bobAddress);
    
    // there should only be one ephemeral key available, but signal should replace with midtermkey
    var empty = kdc._createRegularPreKeyBundle(bobAddress);
    tape.true(empty);
    const addressString = JSON.stringify(bobAddress);
    tape.false(kdc.regularPreKeys.get(addressString)?.length);
});

