import * as $protobuf from "protobufjs";
export namespace denim_proto {

    interface IUserMessage {
        address: denim_proto.IProtocolAddress;
        signalMessageType: number;
        signalMessage: Uint8Array;
    }

    class UserMessage implements IUserMessage {
        constructor(properties?: denim_proto.IUserMessage);
        public address: denim_proto.IProtocolAddress;
        public signalMessageType: number;
        public signalMessage: Uint8Array;
        public static create(properties?: denim_proto.IUserMessage): denim_proto.UserMessage;
        public static encode(message: denim_proto.IUserMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IUserMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.UserMessage;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.UserMessage;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.UserMessage;
        public static toObject(message: denim_proto.UserMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IBlockRequest {
        blockedUuid: string;
    }

    class BlockRequest implements IBlockRequest {
        constructor(properties?: denim_proto.IBlockRequest);
        public blockedUuid: string;
        public static create(properties?: denim_proto.IBlockRequest): denim_proto.BlockRequest;
        public static encode(message: denim_proto.IBlockRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IBlockRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.BlockRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.BlockRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.BlockRequest;
        public static toObject(message: denim_proto.BlockRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IKeyRequest {
        address: denim_proto.IProtocolAddress;
    }

    class KeyRequest implements IKeyRequest {
        constructor(properties?: denim_proto.IKeyRequest);
        public address: denim_proto.IProtocolAddress;
        public static create(properties?: denim_proto.IKeyRequest): denim_proto.KeyRequest;
        public static encode(message: denim_proto.IKeyRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IKeyRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.KeyRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.KeyRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.KeyRequest;
        public static toObject(message: denim_proto.KeyRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IKeyResponse {
        address: denim_proto.IProtocolAddress;
        keyBundle: denim_proto.IKeyBundle;
    }

    class KeyResponse implements IKeyResponse {
        constructor(properties?: denim_proto.IKeyResponse);
        public address: denim_proto.IProtocolAddress;
        public keyBundle: denim_proto.IKeyBundle;
        public static create(properties?: denim_proto.IKeyResponse): denim_proto.KeyResponse;
        public static encode(message: denim_proto.IKeyResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IKeyResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.KeyResponse;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.KeyResponse;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.KeyResponse;
        public static toObject(message: denim_proto.KeyResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IKeyRefill {
        keys?: (denim_proto.IKeyTuple[]|null);
    }

    class KeyRefill implements IKeyRefill {
        constructor(properties?: denim_proto.IKeyRefill);
        public keys: denim_proto.IKeyTuple[];
        public static create(properties?: denim_proto.IKeyRefill): denim_proto.KeyRefill;
        public static encode(message: denim_proto.IKeyRefill, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IKeyRefill, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.KeyRefill;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.KeyRefill;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.KeyRefill;
        public static toObject(message: denim_proto.KeyRefill, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IStatusMessage {
        keysLeft: number;
    }

    class StatusMessage implements IStatusMessage {
        constructor(properties?: denim_proto.IStatusMessage);
        public keysLeft: number;
        public static create(properties?: denim_proto.IStatusMessage): denim_proto.StatusMessage;
        public static encode(message: denim_proto.IStatusMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IStatusMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.StatusMessage;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.StatusMessage;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.StatusMessage;
        public static toObject(message: denim_proto.StatusMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IInvalidRequest {
        error: string;
        receiver?: (denim_proto.IProtocolAddress|null);
    }

    class InvalidRequest implements IInvalidRequest {
        constructor(properties?: denim_proto.IInvalidRequest);
        public error: string;
        public receiver?: (denim_proto.IProtocolAddress|null);
        public _receiver?: "receiver";
        public static create(properties?: denim_proto.IInvalidRequest): denim_proto.InvalidRequest;
        public static encode(message: denim_proto.IInvalidRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IInvalidRequest, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.InvalidRequest;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.InvalidRequest;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.InvalidRequest;
        public static toObject(message: denim_proto.InvalidRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IDummyPadding {
        padding: Uint8Array;
    }

    class DummyPadding implements IDummyPadding {
        constructor(properties?: denim_proto.IDummyPadding);
        public padding: Uint8Array;
        public static create(properties?: denim_proto.IDummyPadding): denim_proto.DummyPadding;
        public static encode(message: denim_proto.IDummyPadding, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IDummyPadding, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.DummyPadding;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.DummyPadding;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.DummyPadding;
        public static toObject(message: denim_proto.DummyPadding, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IDeniablePayload {
        blockRequest?: (denim_proto.IBlockRequest|null);
        userMessage?: (denim_proto.IUserMessage|null);
        keyRequest?: (denim_proto.IKeyRequest|null);
        keyResponse?: (denim_proto.IKeyResponse|null);
        keyRefill?: (denim_proto.IKeyRefill|null);
        statusMessage?: (denim_proto.IStatusMessage|null);
        dummy?: (denim_proto.IDummyPadding|null);
        error?: (denim_proto.IInvalidRequest|null);
    }

    class DeniablePayload implements IDeniablePayload {
        constructor(properties?: denim_proto.IDeniablePayload);
        public blockRequest?: (denim_proto.IBlockRequest|null);
        public userMessage?: (denim_proto.IUserMessage|null);
        public keyRequest?: (denim_proto.IKeyRequest|null);
        public keyResponse?: (denim_proto.IKeyResponse|null);
        public keyRefill?: (denim_proto.IKeyRefill|null);
        public statusMessage?: (denim_proto.IStatusMessage|null);
        public dummy?: (denim_proto.IDummyPadding|null);
        public error?: (denim_proto.IInvalidRequest|null);
        public messageKind?: ("blockRequest"|"userMessage"|"keyRequest"|"keyResponse"|"keyRefill"|"statusMessage"|"dummy"|"error");
        public static create(properties?: denim_proto.IDeniablePayload): denim_proto.DeniablePayload;
        public static encode(message: denim_proto.IDeniablePayload, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IDeniablePayload, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.DeniablePayload;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.DeniablePayload;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.DeniablePayload;
        public static toObject(message: denim_proto.DeniablePayload, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IRegularPayload {
        blockRequest?: (denim_proto.IBlockRequest|null);
        userMessage?: (denim_proto.IUserMessage|null);
        keyRequest?: (denim_proto.IKeyRequest|null);
        keyResponse?: (denim_proto.IKeyResponse|null);
        keyRefill?: (denim_proto.IKeyRefill|null);
        statusMessage?: (denim_proto.IStatusMessage|null);
        keyUpdate?: (denim_proto.IMidTermKeyUpdate|null);
        registerUser?: (denim_proto.IRegister|null);
        error?: (denim_proto.IInvalidRequest|null);
    }

    class RegularPayload implements IRegularPayload {
        constructor(properties?: denim_proto.IRegularPayload);
        public blockRequest?: (denim_proto.IBlockRequest|null);
        public userMessage?: (denim_proto.IUserMessage|null);
        public keyRequest?: (denim_proto.IKeyRequest|null);
        public keyResponse?: (denim_proto.IKeyResponse|null);
        public keyRefill?: (denim_proto.IKeyRefill|null);
        public statusMessage?: (denim_proto.IStatusMessage|null);
        public keyUpdate?: (denim_proto.IMidTermKeyUpdate|null);
        public registerUser?: (denim_proto.IRegister|null);
        public error?: (denim_proto.IInvalidRequest|null);
        public messageKind?: ("blockRequest"|"userMessage"|"keyRequest"|"keyResponse"|"keyRefill"|"statusMessage"|"keyUpdate"|"registerUser"|"error");
        public static create(properties?: denim_proto.IRegularPayload): denim_proto.RegularPayload;
        public static encode(message: denim_proto.IRegularPayload, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IRegularPayload, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.RegularPayload;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.RegularPayload;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.RegularPayload;
        public static toObject(message: denim_proto.RegularPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IDenimChunk {
        chunk: Uint8Array;
        flags: number;
    }

    class DenimChunk implements IDenimChunk {
        constructor(properties?: denim_proto.IDenimChunk);
        public chunk: Uint8Array;
        public flags: number;
        public static create(properties?: denim_proto.IDenimChunk): denim_proto.DenimChunk;
        public static encode(message: denim_proto.IDenimChunk, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IDenimChunk, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.DenimChunk;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.DenimChunk;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.DenimChunk;
        public static toObject(message: denim_proto.DenimChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IDenimMessage {
        regularPayload: Uint8Array;
        chunks?: (denim_proto.IDenimChunk[]|null);
        counter?: (number|null);
        q?: (number|null);
        ballast: number;
        extraBallast?: (number|null);
    }

    class DenimMessage implements IDenimMessage {
        constructor(properties?: denim_proto.IDenimMessage);
        public regularPayload: Uint8Array;
        public chunks: denim_proto.IDenimChunk[];
        public counter?: (number|null);
        public q?: (number|null);
        public ballast: number;
        public extraBallast?: (number|null);
        public _counter?: "counter";
        public _q?: "q";
        public _extraBallast?: "extraBallast";
        public static create(properties?: denim_proto.IDenimMessage): denim_proto.DenimMessage;
        public static encode(message: denim_proto.IDenimMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IDenimMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.DenimMessage;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.DenimMessage;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.DenimMessage;
        public static toObject(message: denim_proto.DenimMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IMidTermKeyUpdate {
        key: denim_proto.ISignedKeyTuple;
    }

    class MidTermKeyUpdate implements IMidTermKeyUpdate {
        constructor(properties?: denim_proto.IMidTermKeyUpdate);
        public key: denim_proto.ISignedKeyTuple;
        public static create(properties?: denim_proto.IMidTermKeyUpdate): denim_proto.MidTermKeyUpdate;
        public static encode(message: denim_proto.IMidTermKeyUpdate, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IMidTermKeyUpdate, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.MidTermKeyUpdate;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.MidTermKeyUpdate;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.MidTermKeyUpdate;
        public static toObject(message: denim_proto.MidTermKeyUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IRegister {
        address: denim_proto.IProtocolAddress;
        idKey: Uint8Array;
        registrationId: number;
        midTermKey: denim_proto.ISignedKeyTuple;
        ephemeralKeys?: (denim_proto.IKeyTuple[]|null);
        deniableEphemeralKeys?: (denim_proto.IKeyTuple[]|null);
        keyGeneratorSeed: Uint8Array;
        keyIdGeneratorSeed: Uint8Array;
    }

    class Register implements IRegister {
        constructor(properties?: denim_proto.IRegister);
        public address: denim_proto.IProtocolAddress;
        public idKey: Uint8Array;
        public registrationId: number;
        public midTermKey: denim_proto.ISignedKeyTuple;
        public ephemeralKeys: denim_proto.IKeyTuple[];
        public deniableEphemeralKeys: denim_proto.IKeyTuple[];
        public keyGeneratorSeed: Uint8Array;
        public keyIdGeneratorSeed: Uint8Array;
        public static create(properties?: denim_proto.IRegister): denim_proto.Register;
        public static encode(message: denim_proto.IRegister, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IRegister, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.Register;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.Register;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.Register;
        public static toObject(message: denim_proto.Register, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IProtocolAddress {
        name: string;
        deviceId: number;
    }

    class ProtocolAddress implements IProtocolAddress {
        constructor(properties?: denim_proto.IProtocolAddress);
        public name: string;
        public deviceId: number;
        public static create(properties?: denim_proto.IProtocolAddress): denim_proto.ProtocolAddress;
        public static encode(message: denim_proto.IProtocolAddress, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IProtocolAddress, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.ProtocolAddress;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.ProtocolAddress;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.ProtocolAddress;
        public static toObject(message: denim_proto.ProtocolAddress, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IKeyTuple {
        id: number;
        key: Uint8Array;
    }

    class KeyTuple implements IKeyTuple {
        constructor(properties?: denim_proto.IKeyTuple);
        public id: number;
        public key: Uint8Array;
        public static create(properties?: denim_proto.IKeyTuple): denim_proto.KeyTuple;
        public static encode(message: denim_proto.IKeyTuple, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IKeyTuple, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.KeyTuple;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.KeyTuple;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.KeyTuple;
        public static toObject(message: denim_proto.KeyTuple, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface ISignedKeyTuple {
        tuple: denim_proto.IKeyTuple;
        signature: Uint8Array;
    }

    class SignedKeyTuple implements ISignedKeyTuple {
        constructor(properties?: denim_proto.ISignedKeyTuple);
        public tuple: denim_proto.IKeyTuple;
        public signature: Uint8Array;
        public static create(properties?: denim_proto.ISignedKeyTuple): denim_proto.SignedKeyTuple;
        public static encode(message: denim_proto.ISignedKeyTuple, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.ISignedKeyTuple, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.SignedKeyTuple;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.SignedKeyTuple;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.SignedKeyTuple;
        public static toObject(message: denim_proto.SignedKeyTuple, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IKeyBundle {
        registrationId: number;
        deviceId: number;
        ephemeralKey?: (denim_proto.IKeyTuple|null);
        midTermKey: denim_proto.ISignedKeyTuple;
        idKey: Uint8Array;
    }

    class KeyBundle implements IKeyBundle {
        constructor(properties?: denim_proto.IKeyBundle);
        public registrationId: number;
        public deviceId: number;
        public ephemeralKey?: (denim_proto.IKeyTuple|null);
        public midTermKey: denim_proto.ISignedKeyTuple;
        public idKey: Uint8Array;
        public _ephemeralKey?: "ephemeralKey";
        public static create(properties?: denim_proto.IKeyBundle): denim_proto.KeyBundle;
        public static encode(message: denim_proto.IKeyBundle, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: denim_proto.IKeyBundle, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): denim_proto.KeyBundle;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): denim_proto.KeyBundle;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): denim_proto.KeyBundle;
        public static toObject(message: denim_proto.KeyBundle, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }
}
