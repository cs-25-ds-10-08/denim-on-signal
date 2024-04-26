import {DenimClient, newDenimClient } from "../src/core/DenimClient";

import { DenimServer } from '../src/core/DenimServer';
import Constants = require('../src/helper/Constants');

import { Message } from "../src/core/Message";

import Util = require('../src/helper/Util');
import SignalLib = require('@signalapp/libsignal-client');
import { denim_proto } from "../src/proto-generated/compiled";
import { ProtoFactory } from '../src/helper/ProtoFactory';
import fc from "fast-check";


function driver() { // Hint: pay attention to the following values BYTE_SIZE_GAPS = [133, 16386, 2097155, 268435460];
    fc.assert(fc.property(
        fc.integer({"min":128**1+1+Constants.EMPTY_DENIMCHUNK_SIZE, "max":128*2+2+Constants.EMPTY_DENIMCHUNK_SIZE}),
        fc.integer({"min":0, "max":15}),
        fc.integer({"min":0, "max":10}),
        
        (regularlen, deniablelen, deniablequeuelen) => byteSizeVsDenimSize(regularlen, deniablelen, deniablequeuelen)), 
        {verbose: fc.VerbosityLevel.VeryVerbose});
}

function byteSizeVsDenimSize(length:number, ongoingLength:number, deniableQueueLength:number) {
    console.log (`>> byteSize start ${length}, ${ongoingLength}, ${deniableQueueLength}`)
    const bytes = Uint8Array.from(Buffer.alloc(length, 'r'));
    const q = 1;
    const deniableBytes = Uint8Array.from(Buffer.alloc(ongoingLength, 'd'));
    const outgoingCurrentChunk = deniableBytes;
    const outgoingDeniable = new Array<denim_proto.DeniablePayload>();
    for(let i=0; i<deniableQueueLength; i++) {
        const deniablePayload = ProtoFactory.deniableDummyPadding(Buffer.alloc(10, 'd'));
        outgoingDeniable.push(deniablePayload);
    }
    const address = SignalLib.ProtocolAddress.new('Alice', 1);
    
    const regularPayloadLength = bytes.byteLength;
    let expectedPaddingLength = Util.calculatePaddingLength(q, regularPayloadLength);
    if(expectedPaddingLength <= Constants.DENIMARRAY_WITH_EMPTY_DENIMCHUNK_SIZE) {
        expectedPaddingLength = Constants.MIN_PADDING;
    }

    // Defensive
    if(regularPayloadLength!=length) {
        console.log(`Encrypted byte representation mismatch`);
        return false;
    }

    console.log (`>> byteSize calling getDeniableChunks`)
    // Call util to get bytes
    const rets = Util.getDeniableChunks(q, regularPayloadLength, outgoingCurrentChunk, outgoingDeniable, Util.signalAddressToString(address));
    const chunks = rets.chunks;

    // Peek at the encoded size
    let totalChunkLength = 0;
    let serializedChunkLengths = [];
    let chunkFlags = [];
    for(const chunk of chunks) {
        const chunkOnWire = denim_proto.DenimChunk.encode(chunk).finish()
        totalChunkLength += chunkOnWire.byteLength;
        serializedChunkLengths.push(chunkOnWire.byteLength);
        chunkFlags.push(chunk.flags);
    }

    const denimMsg = ProtoFactory.clientDenimMessage(bytes, chunks, rets.ballast);
    const serializedMsg = denim_proto.DenimMessage.encode(denimMsg).finish();
   

    // Key, length, payload (with MSB used to signal continue)
    const regularMsgEncodedSize = 1+Util.varintSizeOfNumber(bytes.byteLength)+bytes.byteLength;
    const expectedDenimMsgSize = regularMsgEncodedSize+expectedPaddingLength
    

    if(serializedMsg.byteLength!=expectedDenimMsgSize){
        console.log(`Fail, case 1`);
        console.log(`Regular content length: ${bytes.byteLength}\nChunks: ${chunks.length}\nExpected DenimMsg size: ${expectedDenimMsgSize}\nActual DenimMsg size: ${serializedMsg.byteLength}, `);
        console.log(`Chunk lengths: ${serializedChunkLengths}`);
        console.log(`Chunk flags: ${chunkFlags}`);
        console.log(`Ballast is ${rets.ballast}, denimMsg.ballast: ${denimMsg.ballast}`);
        return false;
    } else {
        console.log("done")
        return true;
    }

}


driver();

function checkDummyCreation () {
    let c = Util.makeRepeatableDummyChunk(100);
    let e = denim_proto.DenimChunk.encode(c.chunk).finish()
    console.log(`created chunk of length ${e.byteLength}`);
}
