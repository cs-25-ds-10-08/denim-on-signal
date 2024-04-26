import SignalLib = require('@signalapp/libsignal-client');;
import { denim_proto } from "../proto-generated/compiled";
import { KeyTuple, SignedKeyTuple } from '../wrappers/KeyWrappers';
import Constants = require('./Constants');

export class ProtoFactory{

    static denimChunk(deniableBytes:Uint8Array, lastChunk:boolean) {
        let bitpattern = lastChunk ? Constants.BITPATTERN_IS_FINAL : 0;

        return denim_proto.DenimChunk.create({
            chunk:deniableBytes,
            flags:bitpattern,
        });

    }

    static dummyChunk(length:number) {
        let bitpattern = Constants.BITPATTERN_IS_DUMMY;

        return denim_proto.DenimChunk.create({
            chunk:new Uint8Array(length),
            flags:bitpattern,
        });

    }

    static getBallastBitPattern(ballast:number) {
        return (128**ballast);
    }

    /**
     * Created by clients, hence no counter or q update
     * @param regularPart 
     * @param chunks 
     */
    static clientDenimMessage(regularPart:Uint8Array, chunks:Array<denim_proto.DenimChunk>, ballast:number) {
        
        if(ballast==0) {
            return denim_proto.DenimMessage.create({
                regularPayload:regularPart,
                chunks:chunks,
                ballast:0,
            });

        } else {
            
            const ret = ProtoFactory.getDenimMessageBallastFields(ballast);
            
            if(ret.extraBallast>0) {
                return denim_proto.DenimMessage.create({
                    regularPayload:regularPart,
                    chunks:chunks,
                    ballast:ret.ballast,
                    extraBallast:ret.extraBallast,
                });
            } else {
                return denim_proto.DenimMessage.create({
                    regularPayload:regularPart,
                    chunks:chunks,
                    ballast:ret.ballast,
                });
            }

        }
        
        
    }

    /**
     * Created by server, contains status of generator's counter and value of q
     * @param regularPart 
     * @param chunks 
     * @param counter 
     * @param q 
     */
    static serverDenimMessage(regularPart:Uint8Array, chunks:Array<denim_proto.DenimChunk>, counter:number, q:number, ballast:number) {

        if(ballast==0) {
            return denim_proto.DenimMessage.create({
                regularPayload:regularPart,
                chunks:chunks,
                counter:counter,
                q:q,
                ballast:0,
            });

        } else {
            const ret = ProtoFactory.getDenimMessageBallastFields(ballast)
            
            if(ret.extraBallast>0) {
                return denim_proto.DenimMessage.create({
                    regularPayload:regularPart,
                    chunks:chunks,
                    counter:counter,
                    q:q,
                    ballast:ret.ballast,
                    extraBallast:ret.extraBallast,
                });
            } else {
                return denim_proto.DenimMessage.create({
                    regularPayload:regularPart,
                    chunks:chunks,
                    counter:counter,
                    q:q,
                    ballast:ret.ballast,
                });
            }
        }
        
    }

    static getDenimMessageBallastFields(ballast:number) {
        if (ballast < 5) {
            return {
                ballast:ProtoFactory.getBallastBitPattern(ballast),
                extraBallast:-1,
            };    
        } else if (ballast == 5) {
            return {
                ballast:0,
                extraBallast : ProtoFactory.getBallastBitPattern(ballast-2),
            };
        } else {
            throw new Error (`ballast size of ${ballast} is not supported`)
        }
    }


    /*
    *
    *           Deniable payloads
    *
    */
    static deniableBlockRequest(address:SignalLib.ProtocolAddress):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            blockRequest:ProtoFactory._blockRequest(address)
        });
    }

    static deniableUserMessage(address:SignalLib.ProtocolAddress, msgType:number, message:Buffer):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            userMessage:ProtoFactory._userMessage(address, msgType, message)
        });
    }

    static deniableUserMessageFromSerialized(address:denim_proto.IProtocolAddress, msgType:number, message:Uint8Array):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            userMessage:ProtoFactory._userMessageFromSerialized(address, msgType, message)
        });
    }

    static deniableKeyRequest(address:SignalLib.ProtocolAddress):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            keyRequest:ProtoFactory._keyRequest(address)
        });
    }

    static deniableKeyResponse(address:denim_proto.IProtocolAddress, keyBundle:SignalLib.PreKeyBundle):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            keyResponse:ProtoFactory._keyResponse(address, keyBundle)
        });
    }

    static deniableKeyRefill(keys:Array<KeyTuple>):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            keyRefill:ProtoFactory._keyRefill(keys)
        });
    }

    static deniableStatusMessage(keysLeft:number):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            statusMessage:ProtoFactory._statusMessage(keysLeft)
        });
    }

    static deniableInvalidRequest(error:string, address:string):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
                error:ProtoFactory._invalidRequest(error, address)
        });
    }

    static deniableDummyPadding(padding:Buffer):denim_proto.DeniablePayload {
        return denim_proto.DeniablePayload.create({
            dummy:ProtoFactory._dummyPadding(padding)
        });
    }

   /*
    *
    *           Regular payloads
    *
    */
    static regularBlockRequest(address:SignalLib.ProtocolAddress):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            blockRequest:ProtoFactory._blockRequest(address)
        });
    }

    static regularUserMessage(address:SignalLib.ProtocolAddress, msgType:number, message:Buffer):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            userMessage:ProtoFactory._userMessage(address, msgType, message)
        });
    }

    static regularUserMessageFromSerialized(address:denim_proto.IProtocolAddress, msgType:number, message:Uint8Array):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            userMessage:ProtoFactory._userMessageFromSerialized(address, msgType, message)
        });
    }

    static regularKeyRequest(address:SignalLib.ProtocolAddress):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            keyRequest:ProtoFactory._keyRequest(address)
        });
    }

    static regularKeyResponse(address:denim_proto.IProtocolAddress, keyBundle:SignalLib.PreKeyBundle):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            keyResponse:ProtoFactory._keyResponse(address, keyBundle)
        });
    }

    static regularKeyRefill(keys:Array<KeyTuple>):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            keyRefill:ProtoFactory._keyRefill(keys)
        });
    }

    static regularStatusMessage(keysLeft:number):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            statusMessage:ProtoFactory._statusMessage(keysLeft)
        });
    }

    static regularInvalidRequest(error:string, address:string):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
                error:ProtoFactory._invalidRequest(error, address)
        });
    }

    static regularMidTermKeyUpdate(midTermKey:SignedKeyTuple):denim_proto.RegularPayload {
        return denim_proto.RegularPayload.create({
            keyUpdate:ProtoFactory._midTermKeyUpdate(midTermKey)
        });
    }

    static regularRegister(address:SignalLib.ProtocolAddress,
        idKey:Uint8Array, 
        registrationId:number,
        midTermKey:SignedKeyTuple,
        ephemeralKeys:Array<KeyTuple>,
        deniableEphemeralKeys:Array<KeyTuple>,
        keySeed:Uint8Array,
        keyIdSeed:Uint8Array):denim_proto.RegularPayload {
            
        return denim_proto.RegularPayload.create({
            registerUser: ProtoFactory._register(address, idKey, registrationId, midTermKey, ephemeralKeys, deniableEphemeralKeys, keySeed, keyIdSeed)
        });
    }

    /*
    *
    *           Helpers
    *
    */
    static _userMessage(address:SignalLib.ProtocolAddress, msgType:number, signalMessage:Buffer) {
        return denim_proto.UserMessage.create({
            address:ProtoFactory._protocolAddress(address),
            signalMessageType:msgType,
            signalMessage:signalMessage
        });
    }

    static _userMessageFromSerialized(address:denim_proto.IProtocolAddress, msgType:number, signalMessage:Uint8Array) {
        return denim_proto.UserMessage.create({
            address:address,
            signalMessageType:msgType,
            signalMessage:signalMessage
        });
    }

    static _blockRequest(address:SignalLib.ProtocolAddress) {
        return denim_proto.BlockRequest.create({
            blockedUuid:address.name()
        });
    }

    static _keyRequest(address:SignalLib.ProtocolAddress) {
        return denim_proto.KeyRequest.create({
            address:ProtoFactory._protocolAddress(address)
        });
    }

    static _keyResponse(address:denim_proto.IProtocolAddress, keyBundle:SignalLib.PreKeyBundle){
        return denim_proto.KeyResponse.create({
            address:address,
            keyBundle:ProtoFactory._keyBundle(keyBundle)
        });
    }

    static _keyRefill(keys:Array<KeyTuple>) {
        var transformedKeys = keys.map(function (key) {
            return ProtoFactory._keyTuple(key);
        });

        return denim_proto.KeyRefill.create({
            keys:transformedKeys
        });
    }

    static _statusMessage(keysLeft:number) {
        return denim_proto.StatusMessage.create({
            keysLeft:keysLeft
        });
    }

    static _invalidRequest(error:string, address:string) {
        return denim_proto.InvalidRequest.create({
            error:error,
            receiver:ProtoFactory._protocolAddressFromString(address)
        });
    }

    static _dummyPadding(padding:Uint8Array) {
        return denim_proto.DummyPadding.create({
            padding:padding
        });
    }

    static _midTermKeyUpdate(key:SignedKeyTuple){
        return denim_proto.MidTermKeyUpdate.create({
            key:ProtoFactory._signedKeyTuple(key)
        });
    }

    static _register(address:SignalLib.ProtocolAddress,
        idKey:Uint8Array, 
        registrationId:number,
        midTermKey:SignedKeyTuple, 
        ephemeralKeys:Array<KeyTuple>,
        deniableEphemeralKeys:Array<KeyTuple>,
        keySeed:Uint8Array,
        keyIdSeed:Uint8Array){
        var transformedKeys = ephemeralKeys.map(function (key) {
            return ProtoFactory._keyTuple(key);
        });

        var transformedDeniableKeys = deniableEphemeralKeys.map(function (key) {
            return ProtoFactory._keyTuple(key);
        });

        return denim_proto.Register.create({
            address:ProtoFactory._protocolAddress(address),
            idKey:idKey,
            registrationId:registrationId,
            midTermKey:ProtoFactory._signedKeyTuple(midTermKey),
            ephemeralKeys:transformedKeys,
            deniableEphemeralKeys:transformedDeniableKeys,
            keyGeneratorSeed:keySeed,
            keyIdGeneratorSeed:keyIdSeed
        });
    }

    static _protocolAddress(address:SignalLib.ProtocolAddress){
        return denim_proto.ProtocolAddress.create({
            name:address.name(), 
            deviceId:address.deviceId()
        });
    }

    static _protocolAddressFromString(stringified:string) {
        const dict = JSON.parse(stringified);
        return denim_proto.ProtocolAddress.create({
            name:dict["name"],
            deviceId:dict["deviceId"]
        });
    }

    static _keyTuple(tuple:KeyTuple) {
        return denim_proto.KeyTuple.create({
            id:tuple.id,
            key:tuple.key.serialize()
        });
    }

    static _signedKeyTuple(signedTuple:SignedKeyTuple) {
        return denim_proto.SignedKeyTuple.create({
            tuple:ProtoFactory._keyTuple(signedTuple.tuple),
            signature:signedTuple.signature
        });
    }

    static _keyBundle(keyBundle:SignalLib.PreKeyBundle){
        
        if(keyBundle.preKeyPublic()) {
            return denim_proto.KeyBundle.create({
                deviceId:keyBundle.deviceId(),
                ephemeralKey:ProtoFactory._keyTuple(
                    new KeyTuple(keyBundle.preKeyPublic(), keyBundle.preKeyId())),
                midTermKey:ProtoFactory._signedKeyTuple(
                    new SignedKeyTuple(keyBundle.signedPreKeyPublic(), keyBundle.signedPreKeyId(), keyBundle.signedPreKeySignature())),
                idKey:keyBundle.identityKey().serialize(),
                registrationId:keyBundle.registrationId()
            });
        } else {
            return denim_proto.KeyBundle.create({
                deviceId:keyBundle.deviceId(),
                midTermKey:ProtoFactory._signedKeyTuple(
                    new SignedKeyTuple(keyBundle.signedPreKeyPublic(), keyBundle.signedPreKeyId(), keyBundle.signedPreKeySignature())),
                idKey:keyBundle.identityKey().serialize(),
                registrationId:keyBundle.registrationId()
            });
        }
    }


}