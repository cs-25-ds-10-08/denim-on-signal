import SignalLib = require('@signalapp/libsignal-client');
import Util = require('../helper/Util')

export class Message {

    message:string;
    sender:SignalLib.ProtocolAddress;
    receiver:SignalLib.ProtocolAddress;
    deniable:boolean;
    messageType:string

    constructor(message:string, sender:SignalLib.ProtocolAddress, receiver:SignalLib.ProtocolAddress, deniable:boolean, messageType:string) {
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.deniable = deniable;
        this.messageType = messageType;
    }

    toString() {
        return `From: ${Util.signalAddressToString(this.sender)}, To: ${Util.signalAddressToString(this.receiver)}, Deniable: ${this.deniable}, Type: ${this.messageType} \n Content: ${this.message}`;
    }

}