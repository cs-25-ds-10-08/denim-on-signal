import SignalLib = require('@signalapp/libsignal-client');;
import { denim_proto } from '../proto-generated/compiled';
import { KeyTuple, SignedKeyTuple } from '../wrappers/KeyWrappers';
import {DenimClient as DenimClient } from "./DenimClient";
import { ProtoFactory } from '../helper/ProtoFactory';
import Constants = require('../helper/Constants');
import Util = require('../helper/Util');
import yargs from "yargs";

const logLevel = yargs.argv.debugserver ? 'debug' : 'info';
const logger = require('../helper/Logger').getLogger("DenimServer",logLevel);
const info = x => logger.info(x)
const debug = x => logger.debug(x)
const error = x => logger.error(x);

export class DenimServer {
    q:number;
    users:Map<string, number>; // User, registrationid
    identitiyKeys:Map<string, SignalLib.PublicKey>;
    signedPreKeys:Map<string, SignedKeyTuple>;
    regularPreKeys:Map<string, Array<KeyTuple>>;
    deniablePreKeys:Map<string, Array<KeyTuple>>;

    deniableBuffers:Map<string, Array<denim_proto.DeniablePayload>>;
    usersCurrentOutgoingChunk:Map<string, Uint8Array>; // Sender's queue
    usersCurrentIncomingChunk:Map<string, Uint8Array>; // Receiver's queue

    // map user to PRNG (the fallback key generator)
    counters:Map<string, number>;
    keyGenerators:Map<string, any>;
    keyIdGenerators:Map<string, any>;
    generatedIds:Map<string, Array<number>>;

    //Blocklist?
    blockLists:Map<string, string[]>; //ProtocolAddress.name to block accross *all* devices

    // Statistics
    deniableKeyRequestsProcessed = 0;
    deniableMessagesProcessed = 0;
    deniableMessageBytes = 0;
    regularKeyRequestsProcessed = 0;
    regularMessagesProcessed = 0;
    regularMessageBytes = 0;

    constructor(q:number) {
        this.q = q;
        this.users = new Map<string, number>();
        this.identitiyKeys = new Map<string, SignalLib.PublicKey>();
        this.signedPreKeys = new Map<string, SignedKeyTuple>();
        this.regularPreKeys = new Map<string, Array<KeyTuple>>();
        this.deniablePreKeys = new Map<string, Array<KeyTuple>>();
        this.usersCurrentOutgoingChunk = new Map<string, Uint8Array>();
        this.usersCurrentIncomingChunk = new Map<string, Uint8Array>();

        this.counters = new Map<string, number>();
        this.keyGenerators = new Map<string, any>();
        this.generatedIds = new Map<string, Array<number>>();
        this.keyIdGenerators = new Map<string, any>();

        this.deniableBuffers = new Map<string, Array<denim_proto.DeniablePayload>>();
        this.blockLists = new Map<string, Array<string>>();
    }

    process(sender:string, incoming:Uint8Array){
        const denimMsg = denim_proto.DenimMessage.decode(incoming);
        const regularPayload = denim_proto.RegularPayload.decode(denimMsg.regularPayload);

        let receiver:string = null;
        let msg:Uint8Array = Constants.EMPTY_UINT8ARRAY;
        const chunks = denimMsg.chunks;

        if(regularPayload.registerUser) {
            debug("****Server: register received");
            this._registerUser(regularPayload.registerUser);
        } else if(regularPayload.keyRequest){
            debug("****Server: key request received");
            this.regularKeyRequestsProcessed++;
            msg = this._processRegularKeyRequest(sender, regularPayload.keyRequest);
            receiver = sender;

            if(msg==null) {
                const failedRequestAddress = Util.denimAddressToString(regularPayload.keyRequest.address);
                const payload = ProtoFactory.regularInvalidRequest(Constants.ERROR_USER_NOT_REGISTERED, failedRequestAddress);
                msg = this._prepareBytes(receiver, payload);
            }
            
        } else if(regularPayload.keyRefill) {
            debug("****Server: key refill received");
            this._processKeyRefill(sender, regularPayload.keyRefill);
        } else if(regularPayload.userMessage) {
            debug("****Server: user message received");
            this.regularMessagesProcessed++;
            this.regularMessageBytes += regularPayload.userMessage.signalMessage.byteLength;
            
            receiver = Util.denimAddressToString(regularPayload.userMessage.address);
            msg = this._processRegularMessage(sender, receiver, regularPayload.userMessage);
        } else {
            debug(`Unhandled message type: ${regularPayload}`);
        }

        return {"msg":msg, "receiver": receiver, "chunks":chunks};

        // Processing of deniable needs to be after forward, leave to network implementation
    }

    _prepareBytes(receiver:string, payload:denim_proto.RegularPayload):Uint8Array{
        const payloadBytes = denim_proto.RegularPayload.encode(payload).finish();
        const regularPayloadLength = payloadBytes.byteLength;
        let currentChunk = this.usersCurrentOutgoingChunk.get(receiver);
        if(!currentChunk) {
            currentChunk = Constants.EMPTY_UINT8ARRAY;
        }
        const deniableBuffer = this.deniableBuffers.get(receiver);
        const rets = Util.getDeniableChunks(this.q, regularPayloadLength, currentChunk, deniableBuffer, receiver);
        this.usersCurrentOutgoingChunk.set(receiver, rets.state); // Update state
        
        const denimMsg = ProtoFactory.serverDenimMessage(payloadBytes, rets.chunks, this.counters.get(receiver), this.q, rets.ballast);
        const bytes = denim_proto.DenimMessage.encode(denimMsg).finish();

        return bytes;
    }

    _processRegularMessage(sender:string, receiver:string, msg:denim_proto.IUserMessage) {
        const ciphertext = msg.signalMessage;
        const address = ProtoFactory._protocolAddress(Util.stringToSignalProtocolAddress(sender));
        const payload = ProtoFactory.regularUserMessageFromSerialized(address, msg.signalMessageType, ciphertext);

        return this._prepareBytes(receiver, payload);
    }

    _processDeniableMessage(sender:string, msg:denim_proto.IUserMessage) {
        const receiver = Util.denimAddressToString(msg.address);
        // Change address to tell receiver who's the sender
        const senderAddress = ProtoFactory._protocolAddressFromString(sender);
        const deniablePayload = ProtoFactory.deniableUserMessageFromSerialized(senderAddress, msg.signalMessageType, msg.signalMessage);
        debug("Queueing deniable message from "+sender+" to "+receiver);
        this.deniableBuffers.get(receiver).push(deniablePayload);
    }

    _processChunks(sender:string, chunks:Array<denim_proto.IDenimChunk>) {
        let currentChunk = this.usersCurrentIncomingChunk.get(sender);
        if(!currentChunk) {
            currentChunk = Constants.EMPTY_UINT8ARRAY;
        }

        for (const denimChunk of chunks) {
            const isDummy = denimChunk.flags&Constants.BITPATTERN_IS_DUMMY;
            const isFinal = denimChunk.flags&Constants.BITPATTERN_IS_FINAL;

            if(!isDummy) {
                if(currentChunk.length>0) {
                    currentChunk = Util.concatUint8Array(currentChunk, denimChunk.chunk); //FIXME: revisit concat
                    debug(`Concatenating chunk for user ${sender}, adding ${denimChunk.chunk.byteLength} bytes, new byte length is ${currentChunk.byteLength} `);
                } else {
                    currentChunk = denimChunk.chunk;
                    debug(`Starting new chunk for user ${sender}. Byte length is ${currentChunk.byteLength}`);
                }
            
                // Ready to decode?
                if(isFinal){
                    debug(`Decoding complete chunk for user ${sender} of byte length ${currentChunk.byteLength}`);
                    debug(currentChunk);
                    const deniablePayload = denim_proto.DeniablePayload.decode(Buffer.from(currentChunk));

                    if(deniablePayload.keyRequest){
                        debug("****Server: deniable key request reassembled");
                        this.deniableKeyRequestsProcessed++;
                        this._processDeniableKeyRequest(sender, deniablePayload.keyRequest);
                    } else if(deniablePayload.userMessage) {
                        debug("****Server: deniable user message reassembled");
                        this.deniableMessagesProcessed++;
                        this.deniableMessageBytes +=  deniablePayload.userMessage.signalMessage.byteLength;
                        this._processDeniableMessage(sender, deniablePayload.userMessage);
                    } else if(deniablePayload.keyRefill) {
                        debug("****Server: deniable key refill reassembled");
                    } else if(deniablePayload.dummy) {
                        debug("****Server: dummy reassembled");
                    }

                    currentChunk = Constants.EMPTY_UINT8ARRAY; // Reset state
                }
            }
        }
        this.usersCurrentIncomingChunk.set(sender,currentChunk); // Save state
    }

    _processRegularKeyRequest(sender:string, request:denim_proto.IKeyRequest) {

        if(!this.users.get(Util.denimAddressToString(request.address))){
            info("User not registered");
            return null;
        }

        const bundle = this._createRegularPreKeyBundle(request.address);
        debug(bundle);
        if(bundle) {
            const payload = ProtoFactory.regularKeyResponse(request.address, bundle);
            return this._prepareBytes(sender, payload);
        } else {
            Util.fatalExit("_no bundles in processRegularKeyRequest")
        }
    }

    _processDeniableKeyRequest(sender:string, request:denim_proto.IKeyRequest) {
        const bundle = this._createDeniablePreKeyBundle(request.address);

        let deniablePayload;
        if(bundle==null) {
            const failedRequestAddress = Util.denimAddressToString(request.address);
            deniablePayload = ProtoFactory.deniableInvalidRequest(Constants.ERROR_USER_NOT_REGISTERED, failedRequestAddress);
        } else {
            deniablePayload = ProtoFactory.deniableKeyResponse(request.address, bundle);
        }

        // Queue deniable payload
        debug("Queuing deniable key response/invalid request for "+sender);
        this.deniableBuffers.get(sender).push(deniablePayload);
    }

    _processKeyRefill(sender:string, request:denim_proto.IKeyRefill) {
        const ephemeralArray = this.regularPreKeys.get(sender);

        request.keys.forEach((key)=>{
            ephemeralArray.push(new KeyTuple(SignalLib.PublicKey.deserialize(Buffer.from(key.key)), key.id));
        });
    }

    createStatusMessage(receiver:DenimClient){

    }

    _registerUser(message:denim_proto.IRegister) {
        const user = message.address;
        const identityKey = SignalLib.PublicKey.deserialize(Buffer.from(message.idKey));
        const midTermKey = message.midTermKey;
        const regularEphemerals = message.ephemeralKeys;
        const deniableEphemerals = message.deniableEphemeralKeys;
        const localRegId = message.registrationId;
        const userString = Util.denimAddressToString(user);

        this.users.set(userString, localRegId);
        this.identitiyKeys.set(userString, identityKey);

        //Init user's data structures
        this.deniableBuffers.set(userString, new Array<denim_proto.DeniablePayload>());
        this.blockLists.set(user.name, new Array<string>()); //Block across all devices, not just one
        this.regularPreKeys.set(userString, new Array<KeyTuple>());
        this.deniablePreKeys.set(userString, new Array<KeyTuple>());

        this._updateMidTerm(user, midTermKey)
        this._refillEphemerals(user, regularEphemerals);
        this._refillDeniableEphemerals(user, deniableEphemerals);

        this.counters.set(userString, 0);
        this.keyGenerators.set(userString, Util.getGenerator(message.keyGeneratorSeed));
        this.keyIdGenerators.set(userString, Util.getGenerator(message.keyIdGeneratorSeed));
        this.generatedIds.set(userString, new Array<number>());
    }

    // PUPS; remember to add expiration dates to keys
    _updateMidTerm(user:denim_proto.IProtocolAddress, keyTuple:denim_proto.ISignedKeyTuple){
        const signedPreKey = new SignedKeyTuple(SignalLib.PublicKey.deserialize(
            Buffer.from(keyTuple.tuple.key)), 
            keyTuple.tuple.id, 
            Buffer.from(keyTuple.signature));
        const userString = Util.denimAddressToString(user);
        this.signedPreKeys.set(userString, signedPreKey);
    }

    /**
     * 
     * @param user stringified ProtocolAddress
     * @param toBlock string ProtocolAddress.name
     */
    _blockUser(user:string, toBlock:string) {
        this.blockLists.get(user)?.push(toBlock);
    }

    _refillEphemerals(user:denim_proto.IProtocolAddress, keys:Array<denim_proto.IKeyTuple>){
        const userString = Util.denimAddressToString(user);
        const currentKeys = this.regularPreKeys.get(userString);
        if(currentKeys){
            keys.forEach(function (key) {
                currentKeys.push(new KeyTuple(SignalLib.PublicKey.deserialize(Buffer.from(key.key)), key.id));
            });
        }
    }

    _refillDeniableEphemerals(user:denim_proto.IProtocolAddress, keys:Array<denim_proto.IKeyTuple>){
        const userString = Util.denimAddressToString(user);
        const currentKeys = this.deniablePreKeys.get(userString);
        if(currentKeys){
            keys.forEach(function (key) {
                currentKeys.push(new KeyTuple(SignalLib.PublicKey.deserialize(Buffer.from(key.key)), key.id));
            });
        }
    }

    _createRegularPreKeyBundle(user:denim_proto.IProtocolAddress){
        const userString = Util.denimAddressToString(user);
        const regId = this.users.get(userString);
        const idk = this.identitiyKeys.get(userString);
        const midtermKey = this.signedPreKeys.get(userString);
        // remove keys from maps to avoid giving to multiple users
        const ephemeral = this.regularPreKeys.get(userString)?.shift();

        if(ephemeral && user && midtermKey) { // defensive
            return SignalLib.PreKeyBundle.new(regId, 
                user.deviceId,
                ephemeral.id, 
                ephemeral.key, 
                midtermKey.tuple.id, 
                midtermKey.tuple.key, 
                midtermKey.signature, 
                idk);
        } else {
            // Out of ephemerals: let Signal handle
            return SignalLib.PreKeyBundle.new(regId, 
                user.deviceId,
                null, 
                null, 
                midtermKey.tuple.id, 
                midtermKey.tuple.key, 
                midtermKey.signature, 
                idk);
        }
    }

    _createDeniablePreKeyBundle(user:denim_proto.IProtocolAddress){
        const userString = Util.denimAddressToString(user);

        if(this.users.get(userString)) {

            const regId = this.users.get(userString);
            const idk = this.identitiyKeys.get(userString);
            const midtermKey = this.signedPreKeys.get(userString);
            // remove keys from maps to avoid giving to multiple users
            const ephemeral = this.deniablePreKeys.get(userString)?.shift();

            if(ephemeral && user && midtermKey){ // defensive
                return SignalLib.PreKeyBundle.new(regId, 
                    user.deviceId,
                    ephemeral.id, 
                    ephemeral.key, 
                    midtermKey.tuple.id, 
                    midtermKey.tuple.key, 
                    midtermKey.signature, 
                    idk);

            } else {
                let keyGenerator = this.keyGenerators.get(userString);
                let key = Util.generateKey(keyGenerator);

                let idGenerator = this.keyIdGenerators.get(userString);
                let existingIds = this.generatedIds.get(userString);
                // loop here to pull a key dedicated for server
                while(existingIds.length%Constants.KEY_ID_PARTITIONING_MULTIPLE!=0) { 
                    const clientKeyId = Util.generateIdWithoutCollision(idGenerator, existingIds);
                    existingIds.push(clientKeyId);
                }
                let keyId = Util.generateIdWithoutCollision(idGenerator, existingIds);
                existingIds.push(keyId);

                info(`${userString} out of deniable ephemerals, generating key with id ${keyId}`);
                // Increase counter to signal that a key has been generated
                let counter = this.counters.get(userString);
                counter++;
                this.counters.set(userString, counter);

                const keyBundle = SignalLib.PreKeyBundle.new(regId, 
                    user.deviceId,
                    keyId, 
                    key.getPublicKey(), 
                    midtermKey.tuple.id, 
                    midtermKey.tuple.key, 
                    midtermKey.signature, 
                    idk);
                
                return keyBundle;
            }
        } else {
            // If user hasn't registered, answer with null
            return null;
        }
    }

}