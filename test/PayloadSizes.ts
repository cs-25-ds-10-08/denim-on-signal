import SignalLib = require('@signalapp/libsignal-client');
import { newDenimClient } from '../src/core/DenimClient';
import { DenimServer } from '../src/core/DenimServer';
import Util = require('../src/helper/Util');
import Constants = require('../src/helper/Constants');
import { denim_proto } from "../src/proto-generated/compiled";
import { ProtoFactory } from '../src/helper/ProtoFactory';

async function keyResponseSize() {
    const alice = await newDenimClient("Alice", 1, 10, 0);
    const bob = await newDenimClient("Bob", 1, 10, 0);

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


    const serializedAddress = ProtoFactory._protocolAddress(alice.address)
    const keyResponse = ProtoFactory.deniableKeyResponse(serializedAddress, bobBundle);

    const payload = denim_proto.DeniablePayload.encode(keyResponse).finish()
    console.log(`Deniable KeyResponse byte length: ${payload.byteLength}`);
}

async function keyRequestSize() {
    const alice = await newDenimClient("A", 1, 10, 0);
    const request = ProtoFactory.deniableKeyRequest(alice.address);

    const payload = denim_proto.DeniablePayload.encode(request).finish();
    console.log(`Deniable KeyRequest byte length: ${payload.byteLength}`);
}

function emptyChunk() {
    const emptyChunk = ProtoFactory.denimChunk(Buffer.from(""), false);
    console.log(`DenimChunk with empty string is byte length: ${emptyChunk.chunk.byteLength}`);
}

keyResponseSize();
keyRequestSize();
emptyChunk();