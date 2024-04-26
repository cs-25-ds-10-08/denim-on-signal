import {DenimClient, newDenimClient} from "../src/core/DenimClient";
import SignalLib = require('@signalapp/libsignal-client');;
import fc from "fast-check";



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

function driver() {
    fc.assert(fc.asyncProperty(
        fc.integer({"min":1, "max":50}),
        fc.integer({"min":1, "max":50}),
        async (alicePrekeyMessages, bobPrekeyMessages) => sessionTies(alicePrekeyMessages, bobPrekeyMessages)), 
        {verbose: fc.VerbosityLevel.VeryVerbose});
}




async function sessionTies(alicePrekeyMessages:number, bobPrekeyMessages:number) {
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
    

    const bobMessage = Buffer.from("Greetings from Bob", "utf8");
    const aliceMessage = Buffer.from("Greetings from Alice", "utf8");

    
    const bobCiphertexts = Array<SignalLib.CiphertextMessage>();
    const aliceCiphertexts = Array<SignalLib.CiphertextMessage>();

    await alice.startNewOutgoingSessionThreadUnsafe(bobBundle, bob.address);
    await bob.startNewOutgoingSessionThreadUnsafe(aliceBundle, alice.address);

    //Encrypt messages
    for(let i=0; i<alicePrekeyMessages; i++) {
        aliceCiphertexts.push(await alice.encryptRegularThreadUnsafe(aliceMessage, bob.address));
    }

    for(let i=0; i<bobPrekeyMessages; i++) {
        bobCiphertexts.push(await bob.encryptRegularThreadUnsafe(bobMessage, alice.address));
    }


    for(let bobCiphertext of bobCiphertexts) {
        const aliceReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(bobCiphertext.serialize());
        const aliceDecrypted = await alice.decryptRegularPreKeyThreadUnsafe(aliceReceivedCiphertext, bob.address);
    }  
    
    for(let aliceCiphertext of aliceCiphertexts) {
        const bobReceivedCiphertext = SignalLib.PreKeySignalMessage.deserialize(aliceCiphertext.serialize());
        const bobDecrypted = await bob.decryptRegularPreKeyThreadUnsafe(bobReceivedCiphertext, alice.address);
    }  


    return true;
}


async function arbitrarySession(instructions) {
    console.log ("-------- Starting a new run ---------")
    /* signal initialization */
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
    

    const plaintext = Buffer.from("Greetings", "utf8");
    

    
    const ciphertextsForAlice = Array<SignalLib.CiphertextMessage>();
    const ciphertextsForBob = Array<SignalLib.CiphertextMessage>();

    await alice.startNewOutgoingSessionThreadUnsafe(bobBundle, bob.address);
    await bob.startNewOutgoingSessionThreadUnsafe(aliceBundle, alice.address);


    const parties = [alice, bob]
    const queue = [ciphertextsForAlice, ciphertextsForBob]
    
    
    function name (x:boolean) {
        return x ? "Alice" : "Bob"
    }

    let _counter = 0;
    async function _encrypt (isAlice: boolean) {
        console.log (`${_counter} Encrypting ${name (isAlice)}`)
        const sender_index = isAlice?0:1
        const sender = parties [sender_index]
        const recipient_index = 1 - sender_index
        const recipient = parties [ recipient_index ]
        const ciphertext = await sender.encryptRegularThreadUnsafe(plaintext, recipient.address)
        queue[recipient_index].push (ciphertext)
    }
    
    async function _decrypt (isAlice: boolean) {
        console.log (`${_counter} Decrypting ${name (isAlice)}`)
        const sender_index = isAlice?0:1
        const sender = parties [sender_index]
        const recipient_index = 1 - sender_index
        const recipient = parties [ recipient_index ]

        const q = queue[recipient_index]
        
        const ciphertext = q.shift()
        if(ciphertext) {
            if(ciphertext.type() == SignalLib.CiphertextMessageType.PreKey) {
                const signalMsg = SignalLib.PreKeySignalMessage.deserialize(ciphertext.serialize());
                await recipient.decryptRegularPreKeyThreadUnsafe(signalMsg, sender.address);
            } else {
                const signalMsg = SignalLib.SignalMessage.deserialize(ciphertext.serialize());
                await recipient.decryptRegularThreadUnsafe(signalMsg, sender.address);
            }
        } else {
            console.log ("   queue empty; suppressing decryption")
        }
    }
    
    let actions = [_encrypt, _decrypt]


    for (let {isAlice, isEncrypt} of instructions) {
        actions[isEncrypt? 0:1] (isAlice)
        _counter ++;
    }
    return true;
}


function testSignalInterleavings() {
    fc.assert (fc.asyncProperty (
        fc.array (fc.record ( { isAlice : fc.boolean (), isEncrypt : fc.boolean () }), {minLength: 25} ) ,
        arbitrarySession
    ))
}

testSignalInterleavings ()