import SignalLib = require('@signalapp/libsignal-client');
import { InMemoryIdentityKeyStore, InMemoryPreKeyStore, InMemorySenderKeyStore, InMemorySessionStore, InMemorySignedPreKeyStore } from './Stores'
import { denim_proto } from "../proto-generated/compiled"
import { ProtoFactory } from '../helper/ProtoFactory'
import { KeyTuple, SignedKeyTuple } from '../wrappers/KeyWrappers';
import Constants = require('../helper/Constants');
import Util = require('../helper/Util');

import * as fastq from "fastq";
import type { queueAsPromised } from "fastq";
import { Message } from './Message';

const crypto = require('crypto');
import yargs from "yargs";

const logLevel = yargs.argv.debugclient ? 'debug' : 'info';


const logger = require('../helper/Logger').getLogger("DenimClient",logLevel);
const info = x => logger.info(x)
const debug = x => logger.debug(x)
const error = x => logger.error(x);

type SignalWorkQueueTask = () => any


export async function newDenimClient (name: string, devideId: number, 
    regularEphemerals:number|Array<SignalLib.PreKeyRecord>=Constants.CLIENT_DEFAULT_REGULAR_EPHEMERAL_KEYS,
    deniabelEphemerals:number|Array<SignalLib.PreKeyRecord>=Constants.CLIENT_DEFAULT_DENIABLE_EPHEMERAL_KEYS) {
    let c = new DenimClient(name, devideId)
    await c.initSignalState(regularEphemerals, deniabelEphemerals)
    return c 
}
    

export class DenimClient {
    address:SignalLib.ProtocolAddress
    identityKeyStore:SignalLib.IdentityKeyStore //shared
    regularSessionStore:SignalLib.SessionStore
    deniableSessionStore:SignalLib.SessionStore //secret state
    regularPreKeyStore:SignalLib.PreKeyStore
    deniablePreKeyStore:SignalLib.PreKeyStore // secret state
    signedPreKeyStore:SignalLib.SignedPreKeyStore // shared
    senderKeyStore:SignalLib.SenderKeyStore //check if needed

    generatorCounter:number;
    keySeed:Uint8Array;
    keyGenerator:any;

    keyIdSeed:Uint8Array;
    keyIdGenerator:any;
    deniableKeyIds:Array<number>
    _regularPreKeyCounter:number
    _signedPreKeyCounter:number

    ephemeralsToRegister:Array<KeyTuple>
    deniableEphemeralsToRegister:Array<KeyTuple>

    deniableMessagesAwaitingEncryption:Map<string, Array<string>>


    prekeysSentToReceiver:Map<string, number>

    q:number

    outgoingDeniable:Array<denim_proto.DeniablePayload>
    outgoingCurrentChunk:Uint8Array
    incomingCurrentChunk:Uint8Array
    
    signalWorkQ: queueAsPromised <SignalWorkQueueTask> 
    incomingCounter:number
    processedCounter:number
    snapshotCounter: number
    processedRegularMessages:number
    processedDeniableMessages:number


    constructor(name:string, deviceId:number){
        this.signalWorkQ = fastq.promise( (j) => { return j ()} , 1 )

        this.address = SignalLib.ProtocolAddress.new(name, deviceId);
        this.regularSessionStore = new InMemorySessionStore();
        this.deniableSessionStore = new InMemorySessionStore();
        this.identityKeyStore = new InMemoryIdentityKeyStore(Math.floor(Math.random()*(16383))); // integer in (0,16383) According to https://github.com/signalapp/Signal-Desktop/blob/b066d04817a0f2a8cbbac8714aa574a380451047/ts/Crypto.ts
        this.regularPreKeyStore = new InMemoryPreKeyStore();
        this.deniablePreKeyStore = new InMemoryPreKeyStore();
        this.signedPreKeyStore = new InMemorySignedPreKeyStore();

        this.ephemeralsToRegister = new Array<KeyTuple>();
        this.deniableEphemeralsToRegister = new Array<KeyTuple>();

        this.deniableMessagesAwaitingEncryption = new Map<string, Array<string>>();

        this.q = Constants.DEFAULT_Q;

        this.outgoingDeniable = new Array<denim_proto.DeniablePayload>();

        this.senderKeyStore = new InMemorySenderKeyStore();

        // Fallback when deniable keys run out
        this.generatorCounter = 0;
        this.keySeed = crypto.randomBytes(Constants.SIGNAL_KEY_LENGTH);
        this.keyGenerator = Util.getGenerator(this.keySeed);

        this.keyIdSeed = crypto.randomBytes(Constants.KEY_ID_SEED_LENGTH);
        this.keyIdGenerator = Util.getGenerator(this.keyIdSeed);
        this.deniableKeyIds = new Array<number>();
        // Internal logic to count keys sequentially; only use when id isn't sensitive
        this._regularPreKeyCounter = Constants.KEY_START_ID;
        this._signedPreKeyCounter = Constants.KEY_START_ID;
    
        this.prekeysSentToReceiver = new Map<string, number>();

        this.incomingCounter = 0;
        this.processedCounter = 0;
        this.snapshotCounter = 0;
        this.processedRegularMessages = 0;
        this.processedDeniableMessages = 0;

        this.outgoingCurrentChunk = Constants.EMPTY_UINT8ARRAY;
        this.incomingCurrentChunk = Constants.EMPTY_UINT8ARRAY;
    }
    

    takeIncomingCounterSnapshot () {
        this.snapshotCounter = this.incomingCounter
    }

    async initSignalState (regularEphemerals:number|Array<SignalLib.PreKeyRecord>, deniabelEphemerals:number|Array<SignalLib.PreKeyRecord>) {
        await this.signalWorkQ.push( async () => {
            // generate keys for prekeybundles
            await this._setIdentityThreadUnsafe();
            await this.generateMidTermThreadUnsafe();

            if(typeof regularEphemerals === 'number') {
                for(let i=0; i<regularEphemerals; i++) {
                    await this.generateEphemeralThreadUnsafe();
                } 
            } else {

                for(const regularPreKeyRecord of regularEphemerals) {
                    this.ephemeralsToRegister.push(new KeyTuple(regularPreKeyRecord.publicKey(), regularPreKeyRecord.id()));
                    await this.regularPreKeyStore.savePreKey(regularPreKeyRecord.id(), regularPreKeyRecord); //store
                }
                
            }

            if(typeof deniabelEphemerals === 'number') {
                for(let i=0; i<deniabelEphemerals; i++) {
                    await this.generateDeniableEphemeralThreadUnsafe();
                } 
            } else { // We don't check that ids are correct (i.e. won't collide with server's key gen ids)
                for(const deniablePreKeyRecord of deniabelEphemerals) {
                    this.deniableEphemeralsToRegister.push(new KeyTuple(deniablePreKeyRecord.publicKey(), deniablePreKeyRecord.id()));
                    await this.deniablePreKeyStore.savePreKey(deniablePreKeyRecord.id(), deniablePreKeyRecord); //store
                }

            }
            
        })
    }

    // Call exactly ONCE
    async _setIdentityThreadUnsafe(){
        const idk = await this.identityKeyStore.getIdentityKey();
        await this.identityKeyStore.saveIdentity(this.address, 
            idk.getPublicKey());
    }

    async generateEphemeralThreadUnsafe(){
        const preKey = SignalLib.PrivateKey.generate();
        const preKeyId = this._regularPreKeyCounter++;
        this.ephemeralsToRegister.push(new KeyTuple(preKey.getPublicKey(), preKeyId));
        await this.regularPreKeyStore.savePreKey(preKeyId, 
            SignalLib.PreKeyRecord.new(preKeyId, preKey.getPublicKey(), preKey)); //store
    }

    async generateDeniableEphemeralThreadUnsafe(){
        const preKey = SignalLib.PrivateKey.generate();

        //How many ids to generate? If we're on an index divisible by n, it's the server's key
        if(this.deniableKeyIds.length%Constants.KEY_ID_PARTITIONING_MULTIPLE==0) {
            // Key belongs to server, we need to generate a key and reserve it for the server first
            const serverKey = Util.generateIdWithoutCollision(this.keyIdGenerator, this.deniableKeyIds);
            this.deniableKeyIds.push(serverKey);
        }
        // Generate a client key id
        const preKeyId = Util.generateIdWithoutCollision(this.keyIdGenerator, this.deniableKeyIds);
        this.deniableKeyIds.push(preKeyId);
        
        this.deniableEphemeralsToRegister.push(new KeyTuple(preKey.getPublicKey(), preKeyId));
        await this.deniablePreKeyStore.savePreKey(preKeyId, 
            SignalLib.PreKeyRecord.new(preKeyId, preKey.getPublicKey(), preKey)); //store
    }

    async generateMidTermThreadUnsafe(){
        const signedPrePKey = SignalLib.PrivateKey.generate();
        const signedPrePKeyId = this._signedPreKeyCounter++;

        const idk = await this.identityKeyStore.getIdentityKey();
        // sign
        const signedPreKeySignature = idk.sign(signedPrePKey.getPublicKey().serialize());

        await this.signedPreKeyStore.saveSignedPreKey(signedPrePKeyId, 
            SignalLib.SignedPreKeyRecord.new(signedPrePKeyId,
            Date.now(),
            signedPrePKey.getPublicKey(),
            signedPrePKey,
            signedPreKeySignature)
        ); //store
    }

    async startNewOutgoingSessionThreadUnsafe(bundle:SignalLib.PreKeyBundle, receiver:SignalLib.ProtocolAddress) {
        return await SignalLib.processPreKeyBundle(bundle, receiver, this.regularSessionStore, this.identityKeyStore);
    }

    async startNewOutgoingDeniableSessionThreadUnsafe(bundle:SignalLib.PreKeyBundle, receiver:SignalLib.ProtocolAddress) {
        return await SignalLib.processPreKeyBundle(bundle, receiver, this.deniableSessionStore, this.identityKeyStore);
    }

    async decryptRegularPreKeyThreadUnsafe(firstMsg:SignalLib.PreKeySignalMessage, sender:SignalLib.ProtocolAddress) {
        try {
            const decrypted = await SignalLib.signalDecryptPreKey(
                firstMsg, 
                sender, 
                this.regularSessionStore, 
                this.identityKeyStore, 
                this.regularPreKeyStore, 
                this.signedPreKeyStore
            );

            return decrypted;
        } catch (err) {
            console.error(`Failed in  decryptRegularPreKeyThreadUnsafe`);
            console.error(err);
            console.error(firstMsg);
            console.error(`Session status is ${(await this.regularSessionStore.getSession(sender))?.hasCurrentState()}`);
            console.error(this.regularSessionStore, this.identityKeyStore, this.regularPreKeyStore, this.signedPreKeyStore);
            process.exit(2);
        }

    }

    async decryptDeniablePreKeyThreadUnsafe(firstMsg:SignalLib.PreKeySignalMessage, sender:SignalLib.ProtocolAddress) {
        try{
            const decrypted = await SignalLib.signalDecryptPreKey(
                firstMsg, 
                sender, 
                this.deniableSessionStore, 
                this.identityKeyStore, 
                this.deniablePreKeyStore, 
                this.signedPreKeyStore
            );

            return decrypted;
        } catch (err) {
            console.error(`Failed in  decryptDeniablePreKeyThreadUnsafe`);
            console.error(err);
            console.error(`Session status is ${(await this.deniableSessionStore.getSession(sender))?.hasCurrentState()}`);
            console.error(firstMsg);
            console.error(this.deniableSessionStore, this.identityKeyStore, this.deniablePreKeyStore, this.signedPreKeyStore);
            process.exit(2);
        }
    }

    async process (denimMsg:denim_proto.DenimMessage) {
        this.incomingCounter++;
        let ret  = await this.signalWorkQ.push ( () =>  this.processThreadUnsafe (denimMsg) );
        return ret;
    }
    async processThreadUnsafe(denimMsg:denim_proto.DenimMessage) { 
        let ret = new Array<Message>();
        this.q = denimMsg.q;

        // PROCESS REGULAR PAYLOAD FIRST
        const regularPayload = denim_proto.RegularPayload.decode(denimMsg.regularPayload);
        // Branch on message kind
        if(regularPayload.keyResponse) {
            debug("****Client received key response****");
            debug(regularPayload.keyResponse.keyBundle);
            const packedBundle = regularPayload.keyResponse.keyBundle;
            const ephemeralNotNull = packedBundle.ephemeralKey;
            const signalBundle = SignalLib.PreKeyBundle.new(packedBundle.registrationId, 
                packedBundle.deviceId,
                ephemeralNotNull ? packedBundle.ephemeralKey.id:null, 
                ephemeralNotNull ? SignalLib.PublicKey.deserialize(Buffer.from(packedBundle.ephemeralKey.key)):null,
                packedBundle.midTermKey.tuple.id,
                SignalLib.PublicKey.deserialize(Buffer.from(packedBundle.midTermKey.tuple.key)),
                Buffer.from(packedBundle.midTermKey.signature),
                SignalLib.PublicKey.deserialize(Buffer.from(packedBundle.idKey))
                );

            const receiver = SignalLib.ProtocolAddress.new(regularPayload.keyResponse.address.name, 
                regularPayload.keyResponse.address.deviceId);
            
            await this.startNewOutgoingSessionThreadUnsafe(signalBundle, receiver);

            debug(this.address.name()+" set up master secret with "+receiver.name());

            ret.push(new Message("", receiver, this.address, false, Constants.MESSAGE_TYPE_KEY_RESPONSE));
            
        } else if (regularPayload.userMessage) {
            debug("****Client received user message****");
            this.processedRegularMessages++;
            const sender = SignalLib.ProtocolAddress.new(regularPayload.userMessage.address.name, 
                regularPayload.userMessage.address.deviceId);
            debug("Sender: "+sender.name());

        
            // Continue conversation: decrypt
            let signalMsg;
            let msg;
            if(regularPayload.userMessage.signalMessageType == SignalLib.CiphertextMessageType.Whisper) {
                signalMsg = SignalLib.SignalMessage.deserialize(
                    Buffer.from(regularPayload.userMessage.signalMessage));
                info(`${this.address.name()} decrypting regular from ${sender.name()}`); 
                msg = await this.decryptRegularThreadUnsafe(signalMsg, sender);
            } else if(regularPayload.userMessage.signalMessageType == SignalLib.CiphertextMessageType.PreKey) {
                signalMsg = SignalLib.PreKeySignalMessage.deserialize(
                    Buffer.from(regularPayload.userMessage.signalMessage));
                info(`${this.address.name()} decrypting prekey (new session) regular from ${sender.name()}`); 
                msg = await this.decryptRegularPreKeyThreadUnsafe(signalMsg, sender);
            }

            ret.push(new Message(msg.toString("utf-8"), sender, this.address, false, Constants.MESSAGE_TYPE_TEXT));
        } else if(regularPayload.error) {
            debug(`User ${regularPayload.error.receiver.name} not registered`);
            const failedLookupAddress = SignalLib.ProtocolAddress.new(regularPayload.error.receiver.name, regularPayload.error.receiver.deviceId); 
            ret.push(new Message("", failedLookupAddress, this.address, false, Constants.MESSAGE_TYPE_ERROR_KEY_REQUEST));
        } else {
            info(`Payload didn't get matched, content is: ${regularPayload}`);
        }

        // Has the server generated deniable ephemeral keys?
        if(denimMsg.counter > this.generatorCounter) {
            const loops = denimMsg.counter-this.generatorCounter;
            for(let i=0; i<loops; i++) {
                const key = Util.generateKey(this.keyGenerator);
                // What's the index of the key we need to generate?
                const keyIndex = (this.generatorCounter)*Constants.KEY_ID_PARTITIONING_MULTIPLE; //0, n, 2n, ...
                
                // Do we need to generate new ids?
                if(this.deniableKeyIds.length<keyIndex) {
                    while(this.deniableKeyIds.length<=keyIndex) {
                        const idToAdd = Util.generateIdWithoutCollision(this.keyIdGenerator, this.deniableKeyIds);
                        this.deniableKeyIds.push(idToAdd);
                    }
                }
                const idToUse = Util.generateIdWithoutCollision(this.keyIdGenerator, this.deniableKeyIds);
                this.deniableKeyIds.push(idToUse);
                const preKeyId = this.deniableKeyIds[keyIndex];
                info(`Server has generated a deniable ephemeral key, id is: ${preKeyId}`);
                
                await this.deniablePreKeyStore.savePreKey(preKeyId,
                     SignalLib.PreKeyRecord.new(preKeyId, key.getPublicKey(), key));
                this.generatorCounter++;
            }
        }
        
        // DENIABLE PAYLOAD LAST
        debug(this.address.name()+" processing deniable payload");
        const deniablePayloads = this._processChunks(denimMsg.chunks);

        // Potentially more than one message in the padding...
        for(const deniablePayload of deniablePayloads){
            
            // Branch on message kind
            if(deniablePayload.keyResponse) {
                info("****Client received deniable key response****");
                debug(deniablePayload.keyResponse.keyBundle);
                const packedBundle = deniablePayload.keyResponse.keyBundle;
                const ephemeralNotNull = packedBundle.ephemeralKey;
                const signalBundle = SignalLib.PreKeyBundle.new(packedBundle.registrationId, 
                    packedBundle.deviceId,
                    ephemeralNotNull ? packedBundle.ephemeralKey.id:null,  
                    ephemeralNotNull ? SignalLib.PublicKey.deserialize(Buffer.from(packedBundle.ephemeralKey.key)):null,
                    packedBundle.midTermKey.tuple.id,
                    SignalLib.PublicKey.deserialize(Buffer.from(packedBundle.midTermKey.tuple.key)),
                    Buffer.from(packedBundle.midTermKey.signature),
                    SignalLib.PublicKey.deserialize(Buffer.from(packedBundle.idKey))
                    );

                const receiver = SignalLib.ProtocolAddress.new(deniablePayload.keyResponse.address.name, 
                    deniablePayload.keyResponse.address.deviceId);
                
                await this.startNewOutgoingDeniableSessionThreadUnsafe(signalBundle, receiver);
                info(`Deniable session started with ${deniablePayload.keyResponse.address.name}`);

                const receiverString = Util.signalAddressToString(receiver);
                
                // Someone else might have started a chat with us, then our list will be undefined
                if(this.deniableMessagesAwaitingEncryption.get(receiverString)){
                    // Check if we can encrypt awaiting deniable messages and queue them
                    for(const toEncrypt of this.deniableMessagesAwaitingEncryption.get(receiverString)) {
                        debug("Encrypting deniable message: "+toEncrypt);
                        await this.createDeniableMessage(toEncrypt, receiver);
                    }

                    this.deniableMessagesAwaitingEncryption.set(receiverString, []);
                }

                ret.push(new Message("", receiver, this.address, true, Constants.MESSAGE_TYPE_KEY_RESPONSE));
            } else if (deniablePayload.userMessage) {
                debug("****Client received deniable user message****");
                this.processedDeniableMessages++;
                const sender = SignalLib.ProtocolAddress.new(deniablePayload.userMessage.address.name, 
                    deniablePayload.userMessage.address.deviceId);

                    // Continue conversation: decrypt
                    let signalMsg;
                    let msg;
                    if(deniablePayload.userMessage.signalMessageType == SignalLib.CiphertextMessageType.Whisper) {
                        signalMsg = SignalLib.SignalMessage.deserialize(
                            Buffer.from(deniablePayload.userMessage.signalMessage));
                        info(`${this.address.name()} decrypting deniable from ${sender.name()}`);
                        msg = await this.decryptDeniableThreadUnsafe(signalMsg, sender);
                    } else if(deniablePayload.userMessage.signalMessageType == SignalLib.CiphertextMessageType.PreKey){
                        signalMsg = SignalLib.PreKeySignalMessage.deserialize(Buffer.from(deniablePayload.userMessage.signalMessage));
                        info(`${this.address.name()} decrypting prekey (new session) deniable from ${sender.name()}`); 
                        msg = await this.decryptDeniablePreKeyThreadUnsafe(signalMsg, sender);
                    }

                    info("Decrypted deniable message: "+msg.toString("utf-8"));
                    ret.push(new Message(msg.toString("utf-8"), sender, this.address, true, Constants.MESSAGE_TYPE_TEXT));
            } else if(deniablePayload.error) {
                // Failed key request
                const sender = SignalLib.ProtocolAddress.new(deniablePayload.error.receiver.name, 
                    deniablePayload.error.receiver.deviceId);
                this.queueDeniableKeyRequest(sender);
                ret.push(new Message("", sender, this.address, true, Constants.MESSAGE_TYPE_ERROR_KEY_REQUEST));
            }
        }

        this.processedCounter++;
        return ret;
    }

    // Add chunks before calling, call with serialized <regular>+<deniable chunk>
    _prepareBytes(payload:denim_proto.RegularPayload):Uint8Array {
        const bytePayload = denim_proto.RegularPayload.encode(payload).finish();
        const regularPayloadLength = bytePayload.byteLength;

        const rets = Util.getDeniableChunks(this.q, regularPayloadLength, this.outgoingCurrentChunk, this.outgoingDeniable, Util.signalAddressToString(this.address));
        this.outgoingCurrentChunk = rets.state; // Update state
        
        const denimMsg = ProtoFactory.clientDenimMessage(bytePayload, rets.chunks, rets.ballast);
        const bytes = denim_proto.DenimMessage.encode(denimMsg).finish();
        return bytes;
    }

    _processChunks(chunks:Array<denim_proto.IDenimChunk>) {
        
        let ret = new Array<denim_proto.DeniablePayload>();
        let j = 0;
        for(const denimChunk of chunks){

            const isDummy = denimChunk.flags&Constants.BITPATTERN_IS_DUMMY;
            const isFinal = denimChunk.flags&Constants.BITPATTERN_IS_FINAL;
            
            if(!isDummy){ // Avoid putting dummy bytes into the dechunking buffer

                if(this.incomingCurrentChunk.length>0) {
                    this.incomingCurrentChunk = Util.concatUint8Array(this.incomingCurrentChunk, denimChunk.chunk);
                } else {
                    this.incomingCurrentChunk = denimChunk.chunk;
                }

                // Ready to decode?
                if(isFinal){
                    debug(`Finalizing... Length of deniable payload is ${this.incomingCurrentChunk.byteLength}`);
                    ret.push(denim_proto.DeniablePayload.decode(Buffer.from(this.incomingCurrentChunk)));
                    this.incomingCurrentChunk = Constants.EMPTY_UINT8ARRAY; // Reset state
                } else {
                    debug(`Loop ${j}: Length of deniable payload is currently ${this.incomingCurrentChunk.byteLength}`);
                }
            }
            j++
        }

        return ret;
    }

    async createRegisterThreadUnsafe(){
        const idKey = await this.identityKeyStore.getIdentityKey();
        const regId = await this.identityKeyStore.getLocalRegistrationId();
        const midTermKey = await this.signedPreKeyStore.getSignedPreKey(this._signedPreKeyCounter-1);
        const signedTuple = new SignedKeyTuple(midTermKey.publicKey(), midTermKey.id(), midTermKey.signature());
        
        
        const payload = ProtoFactory.regularRegister(this.address,
            idKey.getPublicKey().serialize(), 
            regId, 
            signedTuple, 
            this.ephemeralsToRegister, 
            this.deniableEphemeralsToRegister,
            this.keySeed,
            this.keyIdSeed);

        const ret = this._prepareBytes(payload);

        // Evict *after* sending
        this.ephemeralsToRegister = new Array<KeyTuple>();
        this.deniableEphemeralsToRegister = new Array<KeyTuple>();
        return ret;
    }

    createRefillKeys(toRefill:number) {
        
        for(let i=0; i<toRefill; i++){
            this.generateEphemeralThreadUnsafe();
        }
        
        const payload = ProtoFactory.regularKeyRefill(this.ephemeralsToRegister);
        this.ephemeralsToRegister = new Array<KeyTuple>(); //Evict queued keys

        return this._prepareBytes(payload);
    }

    queueDeniableKeyRefill(toRefill:number) {

    }

    createKeyRequest(receiver:SignalLib.ProtocolAddress) {
        const payload = ProtoFactory.regularKeyRequest(receiver);
        return this._prepareBytes(payload);
    }

    queueDeniableKeyRequest(receiver:SignalLib.ProtocolAddress) {
        const payload = ProtoFactory.deniableKeyRequest(receiver);
        debug(this.address.name()+" queueing deniable key request");
        this.outgoingDeniable.push(payload);
    }

    async createRegularMessage(message:string, receiver:SignalLib.ProtocolAddress):Promise<any> {
        let __this = this
        return await this.signalWorkQ.push(async () =>  {
            // Assume there's an ongoing session
            const regularSignalMessage = await __this.encryptRegularThreadUnsafe(Buffer.from(message, 'utf8'), receiver);
            debug(`Message: ${message}`);
            debug("Message type: "+regularSignalMessage.type())
            const payload = ProtoFactory.regularUserMessage(receiver, regularSignalMessage.type(), regularSignalMessage.serialize());
            return __this._prepareBytes(payload);                    
        })
    }

    queueDeniableMessage(message:string, receiver:SignalLib.ProtocolAddress) {
        const queue = this.deniableMessagesAwaitingEncryption.get(Util.signalAddressToString(receiver));

        if(queue) {
            queue.push(message);
        } else {
            this.deniableMessagesAwaitingEncryption.set(Util.signalAddressToString(receiver), [message]);
        }

        info(`${this.deniableMessagesAwaitingEncryption.get(Util.signalAddressToString(receiver))?.length} deniable messages awaiting encryption for user ${Util.signalAddressToString(receiver)}`)
    }

    async createDeniableMessage(message:string, receiver:SignalLib.ProtocolAddress) {
        return await this.signalWorkQ.push(async () =>  {
            //Defensive check: session ongoing?
            const ongoing = (await this.deniableSessionStore.getSession(receiver))?.hasCurrentState()
            if(ongoing){
                // Continue conversation: create and queue message
                debug("Deniable message: "+message);
                const deniableSignalMessage = await this.encryptDeniableThreadUnsafe(Buffer.from(message, 'utf8'), receiver);
                const deniablePayload = ProtoFactory.deniableUserMessage(receiver, deniableSignalMessage.type(), deniableSignalMessage.serialize());
                debug("Queueing encrypted deniable message");
                this.outgoingDeniable.push(deniablePayload);
            } else {
                error(`Deniable message can't be encrypted because key for ${receiver.name()} is missing`);
            }
        });
    }


    createBlockRequest(toBlock:string){

    }

    queueDeniableBlockRequest(toBlock:string){

    }

    /**
     * Periodic Update; Public Schedule
     * Generates new key and sends to KDC
     */
    createMidTermKeyUpdate() {

    }

    async encryptRegularThreadUnsafe(message:Buffer, receiver:SignalLib.ProtocolAddress){
        return await SignalLib.signalEncrypt(
                message,
                receiver,
                this.regularSessionStore,
                this.identityKeyStore
                );
    }

    async encryptDeniableThreadUnsafe(message:Buffer, receiver:SignalLib.ProtocolAddress){
        return await SignalLib.signalEncrypt(
                message,
                receiver,
                this.deniableSessionStore,
                this.identityKeyStore
                );
    }

    async decryptRegularThreadUnsafe(message:SignalLib.SignalMessage, sender:SignalLib.ProtocolAddress){
        
        try{
            const decrypted = await SignalLib.signalDecrypt(message,
                sender,
                this.regularSessionStore,
                this.identityKeyStore);
            return decrypted;
        } catch (err) {
            console.error(`Failed in  decryptRegularThreadUnsafe`);
            console.error(err);
            console.error(`Sender: ${sender.name()}`);
            console.error(`Session status is ${(await this.regularSessionStore.getSession(sender))?.hasCurrentState()}`);
            process.exit(2);
        }
    }

    async decryptDeniableThreadUnsafe(message:SignalLib.SignalMessage, sender:SignalLib.ProtocolAddress){
        try{
            const decrypted = await SignalLib.signalDecrypt(message,
                sender,
                this.deniableSessionStore,
                this.identityKeyStore);
            return decrypted;
        } catch (err) {
            console.error(`Failed in  decryptDeniableThreadUnsafe`);
            console.error(err);
            console.error(`Sender: ${sender.name()}`);
            console.error(`Session status is ${(await this.deniableSessionStore.getSession(sender))?.hasCurrentState()}`);
            process.exit(2);
        }
    }
}
