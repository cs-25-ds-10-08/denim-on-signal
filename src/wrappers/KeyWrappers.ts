import SignalLib = require('@signalapp/libsignal-client');;

export class KeyTuple {
    key:SignalLib.PublicKey;
    id:number;

    constructor(key:SignalLib.PublicKey, id:number){
        this.key = key;
        this.id = id;
    }
}

export class SignedKeyTuple {
    tuple:KeyTuple;
    signature:Buffer;


    constructor(key:SignalLib.PublicKey, id:number, signature:Buffer){
        this.tuple = new KeyTuple(key, id);
        this.signature = signature;
    }
}