import {DenimClient, newDenimClient} from "../src/core/DenimClient";
import SignalLib = require('@signalapp/libsignal-client');;

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



test('Two parties initializing session at same time', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);

    const bobPreKeyId = bob._regularPreKeyCounter-1;
    const bobPrePKey = await bob.regularPreKeyStore.getPreKey(bobPreKeyId);
    const bobSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const bobSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(bobSignedPrePKeyId);
    const bobIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const bobRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
    const bobBundle = SignalLib.PreKeyBundle.new(
        bobRegId,
        bob.address.deviceId(),
        bobPreKeyId,
        bobPrePKey.publicKey(),
        bobSignedPrePKeyId,
        bobSignedPrePKey.publicKey(),
        bobSignedPrePKey.signature(),
        bobIdKey
    );

    const receiverPreKeyId = alice._regularPreKeyCounter-1;
    const receiverPrePKey = await alice.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = alice._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await alice.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await alice.identityKeyStore.getIdentity(alice.address);
    const receiverRegId = await alice.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
    const aliceBundle = SignalLib.PreKeyBundle.new(
        receiverRegId,
        alice.address.deviceId(),
        receiverPreKeyId,
        receiverPrePKey.publicKey(),
        receiverSignedPrePKeyId,
        receiverSignedPrePKey.publicKey(),
        receiverSignedPrePKey.signature(),
        receiverIdKey
    );
    

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(bobBundle, bob.address);
    // Bob->Alice
    await bob.startNewOutgoingSessionThreadUnsafe(aliceBundle, alice.address);

    //send messages
    const bobMessage = Buffer.from("Greetings from Bob", "utf8");
    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");
    const bobCiphertexts = Array<SignalLib.CiphertextMessage>();
    const aliceCiphertexts = Array<SignalLib.CiphertextMessage>();
    for(let i=0; i<10; i++) {
        bobCiphertexts.push(await bob.encryptRegularThreadUnsafe(bobMessage, alice.address));
        aliceCiphertexts.push(await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address));
    }

    for(let i=0; i<10; i++) {
        const bobCiphertext= bobCiphertexts.shift();
        const aliceReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(bobCiphertext.serialize());
        const aliceDecrypted = await alice.decryptRegularPreKeyThreadUnsafe(aliceReceivedCiphertext, bob.address);
        console.log(aliceDecrypted.toString());

        const aliceCiphertext = aliceCiphertexts.shift();
        const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
        const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
        console.log(bobDecrypted.toString());
    }    

    const aliceSessions = await alice.regularSessionStore.getSession(bob.address);
    console.log(aliceSessions);
    
    const aliceMessage2 = Buffer.from("Hello from Alice", "utf8");
    const aliceCiphertext2 = await alice.encryptRegularThreadUnsafe(aliceMessage2, bob.address);
    const bobReceivedCiphertext2 = SignalLib.SignalMessage.deserialize(aliceCiphertext2.serialize());
    const bobDecrypted2 = await bob.decryptRegularThreadUnsafe(bobReceivedCiphertext2, alice.address);
    console.log(bobDecrypted2.toString());

});



test('Two parties initializing session at same time', async (tape) => {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);

    const bobPreKeyId = bob._regularPreKeyCounter-1;
    const bobPrePKey = await bob.regularPreKeyStore.getPreKey(bobPreKeyId);
    const bobSignedPrePKeyId = bob._signedPreKeyCounter-1;
    const bobSignedPrePKey = await bob.signedPreKeyStore.getSignedPreKey(bobSignedPrePKeyId);
    const bobIdKey = await bob.identityKeyStore.getIdentity(bob.address);
    const bobRegId = await bob.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
    const bobBundle = SignalLib.PreKeyBundle.new(
        bobRegId,
        bob.address.deviceId(),
        bobPreKeyId,
        bobPrePKey.publicKey(),
        bobSignedPrePKeyId,
        bobSignedPrePKey.publicKey(),
        bobSignedPrePKey.signature(),
        bobIdKey
    );

    const receiverPreKeyId = alice._regularPreKeyCounter-1;
    const receiverPrePKey = await alice.regularPreKeyStore.getPreKey(receiverPreKeyId);
    const receiverSignedPrePKeyId = alice._signedPreKeyCounter-1;
    const receiverSignedPrePKey = await alice.signedPreKeyStore.getSignedPreKey(receiverSignedPrePKeyId);
    const receiverIdKey = await alice.identityKeyStore.getIdentity(alice.address);
    const receiverRegId = await alice.identityKeyStore.getLocalRegistrationId();

    // instead of fetching, create a bundle ourselves
    const aliceBundle = SignalLib.PreKeyBundle.new(
        receiverRegId,
        alice.address.deviceId(),
        receiverPreKeyId,
        receiverPrePKey.publicKey(),
        receiverSignedPrePKeyId,
        receiverSignedPrePKey.publicKey(),
        receiverSignedPrePKey.signature(),
        receiverIdKey
    );
    

    // Alice->Bob
    await alice.startNewOutgoingSessionThreadUnsafe(bobBundle, bob.address);
    // Bob->Alice
    await bob.startNewOutgoingSessionThreadUnsafe(aliceBundle, alice.address);

    //send message
    const bobMessage = Buffer.from("Greetings from Bob", "utf8");
    const bobCiphertext = await bob.encryptRegularThreadUnsafe(bobMessage, alice.address);

    const bobMessage2 = Buffer.from("Hi from Bob", "utf8");
    const bobCiphertext2 = await bob.encryptRegularThreadUnsafe(bobMessage2, alice.address);

    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");
    const aliceCiphertext = await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address);

    const aliceMessage2 = Buffer.from("Hello from Alice", "utf8");
    const aliceCiphertext2 = await alice.encryptRegularThreadUnsafe(aliceMessage2, bob.address);


    let aliceReceivedCiphertext;
    let aliceDecrypted;
    if(bobCiphertext.type() == SignalLib.CiphertextMessageType.PreKey){
        aliceReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(bobCiphertext.serialize());
        aliceDecrypted = await alice.decryptRegularPreKeyThreadUnsafe(aliceReceivedCiphertext, bob.address);
    } else {
        aliceReceivedCiphertext = SignalLib.SignalMessage.deserialize(bobCiphertext.serialize());
        aliceDecrypted = await alice.decryptRegularThreadUnsafe(aliceReceivedCiphertext, bob.address);
    }
    console.log(aliceDecrypted.toString());

    let aliceReceivedCiphertext2;
    let aliceDecrypted2;
    if(bobCiphertext2.type() == SignalLib.CiphertextMessageType.PreKey){
        aliceReceivedCiphertext2 = SignalLib.PreKeySignalMessage.deserialize(bobCiphertext2.serialize());
        aliceDecrypted2 = await alice.decryptRegularPreKeyThreadUnsafe(aliceReceivedCiphertext2, bob.address);
    } else {
        aliceReceivedCiphertext2 = SignalLib.SignalMessage.deserialize(bobCiphertext2.serialize());
        aliceDecrypted2 = await alice.decryptRegularThreadUnsafe(aliceReceivedCiphertext2, bob.address);
    }
    console.log(aliceDecrypted2.toString());

    let bobReceivedCiphertext;
    let bobDecrypted;
    if(aliceCiphertext.type() == SignalLib.CiphertextMessageType.PreKey) {
        bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
        bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
    } else {
        bobReceivedCiphertext = SignalLib.SignalMessage.deserialize(aliceCiphertext.serialize());
        bobDecrypted = await bob.decryptRegularThreadUnsafe(bobReceivedCiphertext, alice.address);
    }
    console.log(bobDecrypted.toString());

    let bobReceivedCiphertext2;
    let bobDecrypted2;
    if(aliceCiphertext2.type() == SignalLib.CiphertextMessageType.PreKey) {
        bobReceivedCiphertext2 = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext2.serialize());
        bobDecrypted2 = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext2, alice.address);
    } else {
        bobReceivedCiphertext2 = SignalLib.SignalMessage.deserialize(aliceCiphertext2.serialize());
        bobDecrypted2 = await bob.decryptRegularThreadUnsafe(bobReceivedCiphertext2, alice.address);
    }
    console.log(bobDecrypted2.toString());  

});