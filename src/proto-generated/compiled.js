/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const denim_proto = $root.denim_proto = (() => {

    /**
     * Namespace denim_proto.
     * @exports denim_proto
     * @namespace
     */
    const denim_proto = {};

    denim_proto.UserMessage = (function() {

        /**
         * Properties of a UserMessage.
         * @memberof denim_proto
         * @interface IUserMessage
         * @property {denim_proto.IProtocolAddress} address UserMessage address
         * @property {number} signalMessageType UserMessage signalMessageType
         * @property {Uint8Array} signalMessage UserMessage signalMessage
         */

        /**
         * Constructs a new UserMessage.
         * @memberof denim_proto
         * @classdesc Represents a UserMessage.
         * @implements IUserMessage
         * @constructor
         * @param {denim_proto.IUserMessage=} [properties] Properties to set
         */
        function UserMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserMessage address.
         * @member {denim_proto.IProtocolAddress} address
         * @memberof denim_proto.UserMessage
         * @instance
         */
        UserMessage.prototype.address = null;

        /**
         * UserMessage signalMessageType.
         * @member {number} signalMessageType
         * @memberof denim_proto.UserMessage
         * @instance
         */
        UserMessage.prototype.signalMessageType = 0;

        /**
         * UserMessage signalMessage.
         * @member {Uint8Array} signalMessage
         * @memberof denim_proto.UserMessage
         * @instance
         */
        UserMessage.prototype.signalMessage = $util.newBuffer([]);

        /**
         * Creates a new UserMessage instance using the specified properties.
         * @function create
         * @memberof denim_proto.UserMessage
         * @static
         * @param {denim_proto.IUserMessage=} [properties] Properties to set
         * @returns {denim_proto.UserMessage} UserMessage instance
         */
        UserMessage.create = function create(properties) {
            return new UserMessage(properties);
        };

        /**
         * Encodes the specified UserMessage message. Does not implicitly {@link denim_proto.UserMessage.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.UserMessage
         * @static
         * @param {denim_proto.IUserMessage} message UserMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.denim_proto.ProtocolAddress.encode(message.address, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.signalMessageType);
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.signalMessage);
            return writer;
        };

        /**
         * Encodes the specified UserMessage message, length delimited. Does not implicitly {@link denim_proto.UserMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.UserMessage
         * @static
         * @param {denim_proto.IUserMessage} message UserMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserMessage message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.UserMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.UserMessage} UserMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.UserMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.address = $root.denim_proto.ProtocolAddress.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.signalMessageType = reader.int32();
                    break;
                case 3:
                    message.signalMessage = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("address"))
                throw $util.ProtocolError("missing required 'address'", { instance: message });
            if (!message.hasOwnProperty("signalMessageType"))
                throw $util.ProtocolError("missing required 'signalMessageType'", { instance: message });
            if (!message.hasOwnProperty("signalMessage"))
                throw $util.ProtocolError("missing required 'signalMessage'", { instance: message });
            return message;
        };

        /**
         * Decodes a UserMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.UserMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.UserMessage} UserMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserMessage message.
         * @function verify
         * @memberof denim_proto.UserMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.denim_proto.ProtocolAddress.verify(message.address);
                if (error)
                    return "address." + error;
            }
            if (!$util.isInteger(message.signalMessageType))
                return "signalMessageType: integer expected";
            if (!(message.signalMessage && typeof message.signalMessage.length === "number" || $util.isString(message.signalMessage)))
                return "signalMessage: buffer expected";
            return null;
        };

        /**
         * Creates a UserMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.UserMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.UserMessage} UserMessage
         */
        UserMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.UserMessage)
                return object;
            let message = new $root.denim_proto.UserMessage();
            if (object.address != null) {
                if (typeof object.address !== "object")
                    throw TypeError(".denim_proto.UserMessage.address: object expected");
                message.address = $root.denim_proto.ProtocolAddress.fromObject(object.address);
            }
            if (object.signalMessageType != null)
                message.signalMessageType = object.signalMessageType | 0;
            if (object.signalMessage != null)
                if (typeof object.signalMessage === "string")
                    $util.base64.decode(object.signalMessage, message.signalMessage = $util.newBuffer($util.base64.length(object.signalMessage)), 0);
                else if (object.signalMessage.length)
                    message.signalMessage = object.signalMessage;
            return message;
        };

        /**
         * Creates a plain object from a UserMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.UserMessage
         * @static
         * @param {denim_proto.UserMessage} message UserMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.address = null;
                object.signalMessageType = 0;
                if (options.bytes === String)
                    object.signalMessage = "";
                else {
                    object.signalMessage = [];
                    if (options.bytes !== Array)
                        object.signalMessage = $util.newBuffer(object.signalMessage);
                }
            }
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = $root.denim_proto.ProtocolAddress.toObject(message.address, options);
            if (message.signalMessageType != null && message.hasOwnProperty("signalMessageType"))
                object.signalMessageType = message.signalMessageType;
            if (message.signalMessage != null && message.hasOwnProperty("signalMessage"))
                object.signalMessage = options.bytes === String ? $util.base64.encode(message.signalMessage, 0, message.signalMessage.length) : options.bytes === Array ? Array.prototype.slice.call(message.signalMessage) : message.signalMessage;
            return object;
        };

        /**
         * Converts this UserMessage to JSON.
         * @function toJSON
         * @memberof denim_proto.UserMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UserMessage;
    })();

    denim_proto.BlockRequest = (function() {

        /**
         * Properties of a BlockRequest.
         * @memberof denim_proto
         * @interface IBlockRequest
         * @property {string} blockedUuid BlockRequest blockedUuid
         */

        /**
         * Constructs a new BlockRequest.
         * @memberof denim_proto
         * @classdesc Represents a BlockRequest.
         * @implements IBlockRequest
         * @constructor
         * @param {denim_proto.IBlockRequest=} [properties] Properties to set
         */
        function BlockRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BlockRequest blockedUuid.
         * @member {string} blockedUuid
         * @memberof denim_proto.BlockRequest
         * @instance
         */
        BlockRequest.prototype.blockedUuid = "";

        /**
         * Creates a new BlockRequest instance using the specified properties.
         * @function create
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {denim_proto.IBlockRequest=} [properties] Properties to set
         * @returns {denim_proto.BlockRequest} BlockRequest instance
         */
        BlockRequest.create = function create(properties) {
            return new BlockRequest(properties);
        };

        /**
         * Encodes the specified BlockRequest message. Does not implicitly {@link denim_proto.BlockRequest.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {denim_proto.IBlockRequest} message BlockRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlockRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.blockedUuid);
            return writer;
        };

        /**
         * Encodes the specified BlockRequest message, length delimited. Does not implicitly {@link denim_proto.BlockRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {denim_proto.IBlockRequest} message BlockRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlockRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BlockRequest message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.BlockRequest} BlockRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlockRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.BlockRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.blockedUuid = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("blockedUuid"))
                throw $util.ProtocolError("missing required 'blockedUuid'", { instance: message });
            return message;
        };

        /**
         * Decodes a BlockRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.BlockRequest} BlockRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlockRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BlockRequest message.
         * @function verify
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BlockRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.blockedUuid))
                return "blockedUuid: string expected";
            return null;
        };

        /**
         * Creates a BlockRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.BlockRequest} BlockRequest
         */
        BlockRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.BlockRequest)
                return object;
            let message = new $root.denim_proto.BlockRequest();
            if (object.blockedUuid != null)
                message.blockedUuid = String(object.blockedUuid);
            return message;
        };

        /**
         * Creates a plain object from a BlockRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.BlockRequest
         * @static
         * @param {denim_proto.BlockRequest} message BlockRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BlockRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.blockedUuid = "";
            if (message.blockedUuid != null && message.hasOwnProperty("blockedUuid"))
                object.blockedUuid = message.blockedUuid;
            return object;
        };

        /**
         * Converts this BlockRequest to JSON.
         * @function toJSON
         * @memberof denim_proto.BlockRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BlockRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BlockRequest;
    })();

    denim_proto.KeyRequest = (function() {

        /**
         * Properties of a KeyRequest.
         * @memberof denim_proto
         * @interface IKeyRequest
         * @property {denim_proto.IProtocolAddress} address KeyRequest address
         */

        /**
         * Constructs a new KeyRequest.
         * @memberof denim_proto
         * @classdesc Represents a KeyRequest.
         * @implements IKeyRequest
         * @constructor
         * @param {denim_proto.IKeyRequest=} [properties] Properties to set
         */
        function KeyRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyRequest address.
         * @member {denim_proto.IProtocolAddress} address
         * @memberof denim_proto.KeyRequest
         * @instance
         */
        KeyRequest.prototype.address = null;

        /**
         * Creates a new KeyRequest instance using the specified properties.
         * @function create
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {denim_proto.IKeyRequest=} [properties] Properties to set
         * @returns {denim_proto.KeyRequest} KeyRequest instance
         */
        KeyRequest.create = function create(properties) {
            return new KeyRequest(properties);
        };

        /**
         * Encodes the specified KeyRequest message. Does not implicitly {@link denim_proto.KeyRequest.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {denim_proto.IKeyRequest} message KeyRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.denim_proto.ProtocolAddress.encode(message.address, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified KeyRequest message, length delimited. Does not implicitly {@link denim_proto.KeyRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {denim_proto.IKeyRequest} message KeyRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyRequest message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.KeyRequest} KeyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.KeyRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.address = $root.denim_proto.ProtocolAddress.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("address"))
                throw $util.ProtocolError("missing required 'address'", { instance: message });
            return message;
        };

        /**
         * Decodes a KeyRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.KeyRequest} KeyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyRequest message.
         * @function verify
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.denim_proto.ProtocolAddress.verify(message.address);
                if (error)
                    return "address." + error;
            }
            return null;
        };

        /**
         * Creates a KeyRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.KeyRequest} KeyRequest
         */
        KeyRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.KeyRequest)
                return object;
            let message = new $root.denim_proto.KeyRequest();
            if (object.address != null) {
                if (typeof object.address !== "object")
                    throw TypeError(".denim_proto.KeyRequest.address: object expected");
                message.address = $root.denim_proto.ProtocolAddress.fromObject(object.address);
            }
            return message;
        };

        /**
         * Creates a plain object from a KeyRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.KeyRequest
         * @static
         * @param {denim_proto.KeyRequest} message KeyRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.address = null;
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = $root.denim_proto.ProtocolAddress.toObject(message.address, options);
            return object;
        };

        /**
         * Converts this KeyRequest to JSON.
         * @function toJSON
         * @memberof denim_proto.KeyRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeyRequest;
    })();

    denim_proto.KeyResponse = (function() {

        /**
         * Properties of a KeyResponse.
         * @memberof denim_proto
         * @interface IKeyResponse
         * @property {denim_proto.IProtocolAddress} address KeyResponse address
         * @property {denim_proto.IKeyBundle} keyBundle KeyResponse keyBundle
         */

        /**
         * Constructs a new KeyResponse.
         * @memberof denim_proto
         * @classdesc Represents a KeyResponse.
         * @implements IKeyResponse
         * @constructor
         * @param {denim_proto.IKeyResponse=} [properties] Properties to set
         */
        function KeyResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyResponse address.
         * @member {denim_proto.IProtocolAddress} address
         * @memberof denim_proto.KeyResponse
         * @instance
         */
        KeyResponse.prototype.address = null;

        /**
         * KeyResponse keyBundle.
         * @member {denim_proto.IKeyBundle} keyBundle
         * @memberof denim_proto.KeyResponse
         * @instance
         */
        KeyResponse.prototype.keyBundle = null;

        /**
         * Creates a new KeyResponse instance using the specified properties.
         * @function create
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {denim_proto.IKeyResponse=} [properties] Properties to set
         * @returns {denim_proto.KeyResponse} KeyResponse instance
         */
        KeyResponse.create = function create(properties) {
            return new KeyResponse(properties);
        };

        /**
         * Encodes the specified KeyResponse message. Does not implicitly {@link denim_proto.KeyResponse.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {denim_proto.IKeyResponse} message KeyResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.denim_proto.ProtocolAddress.encode(message.address, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            $root.denim_proto.KeyBundle.encode(message.keyBundle, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified KeyResponse message, length delimited. Does not implicitly {@link denim_proto.KeyResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {denim_proto.IKeyResponse} message KeyResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyResponse message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.KeyResponse} KeyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.KeyResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.address = $root.denim_proto.ProtocolAddress.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.keyBundle = $root.denim_proto.KeyBundle.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("address"))
                throw $util.ProtocolError("missing required 'address'", { instance: message });
            if (!message.hasOwnProperty("keyBundle"))
                throw $util.ProtocolError("missing required 'keyBundle'", { instance: message });
            return message;
        };

        /**
         * Decodes a KeyResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.KeyResponse} KeyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyResponse message.
         * @function verify
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.denim_proto.ProtocolAddress.verify(message.address);
                if (error)
                    return "address." + error;
            }
            {
                let error = $root.denim_proto.KeyBundle.verify(message.keyBundle);
                if (error)
                    return "keyBundle." + error;
            }
            return null;
        };

        /**
         * Creates a KeyResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.KeyResponse} KeyResponse
         */
        KeyResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.KeyResponse)
                return object;
            let message = new $root.denim_proto.KeyResponse();
            if (object.address != null) {
                if (typeof object.address !== "object")
                    throw TypeError(".denim_proto.KeyResponse.address: object expected");
                message.address = $root.denim_proto.ProtocolAddress.fromObject(object.address);
            }
            if (object.keyBundle != null) {
                if (typeof object.keyBundle !== "object")
                    throw TypeError(".denim_proto.KeyResponse.keyBundle: object expected");
                message.keyBundle = $root.denim_proto.KeyBundle.fromObject(object.keyBundle);
            }
            return message;
        };

        /**
         * Creates a plain object from a KeyResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.KeyResponse
         * @static
         * @param {denim_proto.KeyResponse} message KeyResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.address = null;
                object.keyBundle = null;
            }
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = $root.denim_proto.ProtocolAddress.toObject(message.address, options);
            if (message.keyBundle != null && message.hasOwnProperty("keyBundle"))
                object.keyBundle = $root.denim_proto.KeyBundle.toObject(message.keyBundle, options);
            return object;
        };

        /**
         * Converts this KeyResponse to JSON.
         * @function toJSON
         * @memberof denim_proto.KeyResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeyResponse;
    })();

    denim_proto.KeyRefill = (function() {

        /**
         * Properties of a KeyRefill.
         * @memberof denim_proto
         * @interface IKeyRefill
         * @property {Array.<denim_proto.IKeyTuple>|null} [keys] KeyRefill keys
         */

        /**
         * Constructs a new KeyRefill.
         * @memberof denim_proto
         * @classdesc Represents a KeyRefill.
         * @implements IKeyRefill
         * @constructor
         * @param {denim_proto.IKeyRefill=} [properties] Properties to set
         */
        function KeyRefill(properties) {
            this.keys = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyRefill keys.
         * @member {Array.<denim_proto.IKeyTuple>} keys
         * @memberof denim_proto.KeyRefill
         * @instance
         */
        KeyRefill.prototype.keys = $util.emptyArray;

        /**
         * Creates a new KeyRefill instance using the specified properties.
         * @function create
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {denim_proto.IKeyRefill=} [properties] Properties to set
         * @returns {denim_proto.KeyRefill} KeyRefill instance
         */
        KeyRefill.create = function create(properties) {
            return new KeyRefill(properties);
        };

        /**
         * Encodes the specified KeyRefill message. Does not implicitly {@link denim_proto.KeyRefill.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {denim_proto.IKeyRefill} message KeyRefill message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyRefill.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.keys != null && message.keys.length)
                for (let i = 0; i < message.keys.length; ++i)
                    $root.denim_proto.KeyTuple.encode(message.keys[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified KeyRefill message, length delimited. Does not implicitly {@link denim_proto.KeyRefill.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {denim_proto.IKeyRefill} message KeyRefill message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyRefill.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyRefill message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.KeyRefill} KeyRefill
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyRefill.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.KeyRefill();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.keys && message.keys.length))
                        message.keys = [];
                    message.keys.push($root.denim_proto.KeyTuple.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a KeyRefill message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.KeyRefill} KeyRefill
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyRefill.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyRefill message.
         * @function verify
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyRefill.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.keys != null && message.hasOwnProperty("keys")) {
                if (!Array.isArray(message.keys))
                    return "keys: array expected";
                for (let i = 0; i < message.keys.length; ++i) {
                    let error = $root.denim_proto.KeyTuple.verify(message.keys[i]);
                    if (error)
                        return "keys." + error;
                }
            }
            return null;
        };

        /**
         * Creates a KeyRefill message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.KeyRefill} KeyRefill
         */
        KeyRefill.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.KeyRefill)
                return object;
            let message = new $root.denim_proto.KeyRefill();
            if (object.keys) {
                if (!Array.isArray(object.keys))
                    throw TypeError(".denim_proto.KeyRefill.keys: array expected");
                message.keys = [];
                for (let i = 0; i < object.keys.length; ++i) {
                    if (typeof object.keys[i] !== "object")
                        throw TypeError(".denim_proto.KeyRefill.keys: object expected");
                    message.keys[i] = $root.denim_proto.KeyTuple.fromObject(object.keys[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a KeyRefill message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.KeyRefill
         * @static
         * @param {denim_proto.KeyRefill} message KeyRefill
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyRefill.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.keys = [];
            if (message.keys && message.keys.length) {
                object.keys = [];
                for (let j = 0; j < message.keys.length; ++j)
                    object.keys[j] = $root.denim_proto.KeyTuple.toObject(message.keys[j], options);
            }
            return object;
        };

        /**
         * Converts this KeyRefill to JSON.
         * @function toJSON
         * @memberof denim_proto.KeyRefill
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyRefill.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeyRefill;
    })();

    denim_proto.StatusMessage = (function() {

        /**
         * Properties of a StatusMessage.
         * @memberof denim_proto
         * @interface IStatusMessage
         * @property {number} keysLeft StatusMessage keysLeft
         */

        /**
         * Constructs a new StatusMessage.
         * @memberof denim_proto
         * @classdesc Represents a StatusMessage.
         * @implements IStatusMessage
         * @constructor
         * @param {denim_proto.IStatusMessage=} [properties] Properties to set
         */
        function StatusMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StatusMessage keysLeft.
         * @member {number} keysLeft
         * @memberof denim_proto.StatusMessage
         * @instance
         */
        StatusMessage.prototype.keysLeft = 0;

        /**
         * Creates a new StatusMessage instance using the specified properties.
         * @function create
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {denim_proto.IStatusMessage=} [properties] Properties to set
         * @returns {denim_proto.StatusMessage} StatusMessage instance
         */
        StatusMessage.create = function create(properties) {
            return new StatusMessage(properties);
        };

        /**
         * Encodes the specified StatusMessage message. Does not implicitly {@link denim_proto.StatusMessage.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {denim_proto.IStatusMessage} message StatusMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatusMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.keysLeft);
            return writer;
        };

        /**
         * Encodes the specified StatusMessage message, length delimited. Does not implicitly {@link denim_proto.StatusMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {denim_proto.IStatusMessage} message StatusMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatusMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StatusMessage message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.StatusMessage} StatusMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatusMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.StatusMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.keysLeft = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("keysLeft"))
                throw $util.ProtocolError("missing required 'keysLeft'", { instance: message });
            return message;
        };

        /**
         * Decodes a StatusMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.StatusMessage} StatusMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatusMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StatusMessage message.
         * @function verify
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StatusMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.keysLeft))
                return "keysLeft: integer expected";
            return null;
        };

        /**
         * Creates a StatusMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.StatusMessage} StatusMessage
         */
        StatusMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.StatusMessage)
                return object;
            let message = new $root.denim_proto.StatusMessage();
            if (object.keysLeft != null)
                message.keysLeft = object.keysLeft | 0;
            return message;
        };

        /**
         * Creates a plain object from a StatusMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.StatusMessage
         * @static
         * @param {denim_proto.StatusMessage} message StatusMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StatusMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.keysLeft = 0;
            if (message.keysLeft != null && message.hasOwnProperty("keysLeft"))
                object.keysLeft = message.keysLeft;
            return object;
        };

        /**
         * Converts this StatusMessage to JSON.
         * @function toJSON
         * @memberof denim_proto.StatusMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StatusMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StatusMessage;
    })();

    denim_proto.InvalidRequest = (function() {

        /**
         * Properties of an InvalidRequest.
         * @memberof denim_proto
         * @interface IInvalidRequest
         * @property {string} error InvalidRequest error
         * @property {denim_proto.IProtocolAddress|null} [receiver] InvalidRequest receiver
         */

        /**
         * Constructs a new InvalidRequest.
         * @memberof denim_proto
         * @classdesc Represents an InvalidRequest.
         * @implements IInvalidRequest
         * @constructor
         * @param {denim_proto.IInvalidRequest=} [properties] Properties to set
         */
        function InvalidRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InvalidRequest error.
         * @member {string} error
         * @memberof denim_proto.InvalidRequest
         * @instance
         */
        InvalidRequest.prototype.error = "";

        /**
         * InvalidRequest receiver.
         * @member {denim_proto.IProtocolAddress|null|undefined} receiver
         * @memberof denim_proto.InvalidRequest
         * @instance
         */
        InvalidRequest.prototype.receiver = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * InvalidRequest _receiver.
         * @member {"receiver"|undefined} _receiver
         * @memberof denim_proto.InvalidRequest
         * @instance
         */
        Object.defineProperty(InvalidRequest.prototype, "_receiver", {
            get: $util.oneOfGetter($oneOfFields = ["receiver"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new InvalidRequest instance using the specified properties.
         * @function create
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {denim_proto.IInvalidRequest=} [properties] Properties to set
         * @returns {denim_proto.InvalidRequest} InvalidRequest instance
         */
        InvalidRequest.create = function create(properties) {
            return new InvalidRequest(properties);
        };

        /**
         * Encodes the specified InvalidRequest message. Does not implicitly {@link denim_proto.InvalidRequest.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {denim_proto.IInvalidRequest} message InvalidRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvalidRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.error);
            if (message.receiver != null && Object.hasOwnProperty.call(message, "receiver"))
                $root.denim_proto.ProtocolAddress.encode(message.receiver, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified InvalidRequest message, length delimited. Does not implicitly {@link denim_proto.InvalidRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {denim_proto.IInvalidRequest} message InvalidRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvalidRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InvalidRequest message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.InvalidRequest} InvalidRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvalidRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.InvalidRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.error = reader.string();
                    break;
                case 2:
                    message.receiver = $root.denim_proto.ProtocolAddress.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("error"))
                throw $util.ProtocolError("missing required 'error'", { instance: message });
            return message;
        };

        /**
         * Decodes an InvalidRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.InvalidRequest} InvalidRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvalidRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InvalidRequest message.
         * @function verify
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InvalidRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (!$util.isString(message.error))
                return "error: string expected";
            if (message.receiver != null && message.hasOwnProperty("receiver")) {
                properties._receiver = 1;
                {
                    let error = $root.denim_proto.ProtocolAddress.verify(message.receiver);
                    if (error)
                        return "receiver." + error;
                }
            }
            return null;
        };

        /**
         * Creates an InvalidRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.InvalidRequest} InvalidRequest
         */
        InvalidRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.InvalidRequest)
                return object;
            let message = new $root.denim_proto.InvalidRequest();
            if (object.error != null)
                message.error = String(object.error);
            if (object.receiver != null) {
                if (typeof object.receiver !== "object")
                    throw TypeError(".denim_proto.InvalidRequest.receiver: object expected");
                message.receiver = $root.denim_proto.ProtocolAddress.fromObject(object.receiver);
            }
            return message;
        };

        /**
         * Creates a plain object from an InvalidRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.InvalidRequest
         * @static
         * @param {denim_proto.InvalidRequest} message InvalidRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InvalidRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.error = "";
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.receiver != null && message.hasOwnProperty("receiver")) {
                object.receiver = $root.denim_proto.ProtocolAddress.toObject(message.receiver, options);
                if (options.oneofs)
                    object._receiver = "receiver";
            }
            return object;
        };

        /**
         * Converts this InvalidRequest to JSON.
         * @function toJSON
         * @memberof denim_proto.InvalidRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InvalidRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InvalidRequest;
    })();

    denim_proto.DummyPadding = (function() {

        /**
         * Properties of a DummyPadding.
         * @memberof denim_proto
         * @interface IDummyPadding
         * @property {Uint8Array} padding DummyPadding padding
         */

        /**
         * Constructs a new DummyPadding.
         * @memberof denim_proto
         * @classdesc Represents a DummyPadding.
         * @implements IDummyPadding
         * @constructor
         * @param {denim_proto.IDummyPadding=} [properties] Properties to set
         */
        function DummyPadding(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DummyPadding padding.
         * @member {Uint8Array} padding
         * @memberof denim_proto.DummyPadding
         * @instance
         */
        DummyPadding.prototype.padding = $util.newBuffer([]);

        /**
         * Creates a new DummyPadding instance using the specified properties.
         * @function create
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {denim_proto.IDummyPadding=} [properties] Properties to set
         * @returns {denim_proto.DummyPadding} DummyPadding instance
         */
        DummyPadding.create = function create(properties) {
            return new DummyPadding(properties);
        };

        /**
         * Encodes the specified DummyPadding message. Does not implicitly {@link denim_proto.DummyPadding.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {denim_proto.IDummyPadding} message DummyPadding message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DummyPadding.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.padding);
            return writer;
        };

        /**
         * Encodes the specified DummyPadding message, length delimited. Does not implicitly {@link denim_proto.DummyPadding.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {denim_proto.IDummyPadding} message DummyPadding message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DummyPadding.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DummyPadding message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.DummyPadding} DummyPadding
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DummyPadding.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.DummyPadding();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.padding = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("padding"))
                throw $util.ProtocolError("missing required 'padding'", { instance: message });
            return message;
        };

        /**
         * Decodes a DummyPadding message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.DummyPadding} DummyPadding
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DummyPadding.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DummyPadding message.
         * @function verify
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DummyPadding.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!(message.padding && typeof message.padding.length === "number" || $util.isString(message.padding)))
                return "padding: buffer expected";
            return null;
        };

        /**
         * Creates a DummyPadding message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.DummyPadding} DummyPadding
         */
        DummyPadding.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.DummyPadding)
                return object;
            let message = new $root.denim_proto.DummyPadding();
            if (object.padding != null)
                if (typeof object.padding === "string")
                    $util.base64.decode(object.padding, message.padding = $util.newBuffer($util.base64.length(object.padding)), 0);
                else if (object.padding.length)
                    message.padding = object.padding;
            return message;
        };

        /**
         * Creates a plain object from a DummyPadding message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.DummyPadding
         * @static
         * @param {denim_proto.DummyPadding} message DummyPadding
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DummyPadding.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.padding = "";
                else {
                    object.padding = [];
                    if (options.bytes !== Array)
                        object.padding = $util.newBuffer(object.padding);
                }
            if (message.padding != null && message.hasOwnProperty("padding"))
                object.padding = options.bytes === String ? $util.base64.encode(message.padding, 0, message.padding.length) : options.bytes === Array ? Array.prototype.slice.call(message.padding) : message.padding;
            return object;
        };

        /**
         * Converts this DummyPadding to JSON.
         * @function toJSON
         * @memberof denim_proto.DummyPadding
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DummyPadding.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DummyPadding;
    })();

    denim_proto.DeniablePayload = (function() {

        /**
         * Properties of a DeniablePayload.
         * @memberof denim_proto
         * @interface IDeniablePayload
         * @property {denim_proto.IBlockRequest|null} [blockRequest] DeniablePayload blockRequest
         * @property {denim_proto.IUserMessage|null} [userMessage] DeniablePayload userMessage
         * @property {denim_proto.IKeyRequest|null} [keyRequest] DeniablePayload keyRequest
         * @property {denim_proto.IKeyResponse|null} [keyResponse] DeniablePayload keyResponse
         * @property {denim_proto.IKeyRefill|null} [keyRefill] DeniablePayload keyRefill
         * @property {denim_proto.IStatusMessage|null} [statusMessage] DeniablePayload statusMessage
         * @property {denim_proto.IDummyPadding|null} [dummy] DeniablePayload dummy
         * @property {denim_proto.IInvalidRequest|null} [error] DeniablePayload error
         */

        /**
         * Constructs a new DeniablePayload.
         * @memberof denim_proto
         * @classdesc Represents a DeniablePayload.
         * @implements IDeniablePayload
         * @constructor
         * @param {denim_proto.IDeniablePayload=} [properties] Properties to set
         */
        function DeniablePayload(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeniablePayload blockRequest.
         * @member {denim_proto.IBlockRequest|null|undefined} blockRequest
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.blockRequest = null;

        /**
         * DeniablePayload userMessage.
         * @member {denim_proto.IUserMessage|null|undefined} userMessage
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.userMessage = null;

        /**
         * DeniablePayload keyRequest.
         * @member {denim_proto.IKeyRequest|null|undefined} keyRequest
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.keyRequest = null;

        /**
         * DeniablePayload keyResponse.
         * @member {denim_proto.IKeyResponse|null|undefined} keyResponse
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.keyResponse = null;

        /**
         * DeniablePayload keyRefill.
         * @member {denim_proto.IKeyRefill|null|undefined} keyRefill
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.keyRefill = null;

        /**
         * DeniablePayload statusMessage.
         * @member {denim_proto.IStatusMessage|null|undefined} statusMessage
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.statusMessage = null;

        /**
         * DeniablePayload dummy.
         * @member {denim_proto.IDummyPadding|null|undefined} dummy
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.dummy = null;

        /**
         * DeniablePayload error.
         * @member {denim_proto.IInvalidRequest|null|undefined} error
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        DeniablePayload.prototype.error = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * DeniablePayload messageKind.
         * @member {"blockRequest"|"userMessage"|"keyRequest"|"keyResponse"|"keyRefill"|"statusMessage"|"dummy"|"error"|undefined} messageKind
         * @memberof denim_proto.DeniablePayload
         * @instance
         */
        Object.defineProperty(DeniablePayload.prototype, "messageKind", {
            get: $util.oneOfGetter($oneOfFields = ["blockRequest", "userMessage", "keyRequest", "keyResponse", "keyRefill", "statusMessage", "dummy", "error"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DeniablePayload instance using the specified properties.
         * @function create
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {denim_proto.IDeniablePayload=} [properties] Properties to set
         * @returns {denim_proto.DeniablePayload} DeniablePayload instance
         */
        DeniablePayload.create = function create(properties) {
            return new DeniablePayload(properties);
        };

        /**
         * Encodes the specified DeniablePayload message. Does not implicitly {@link denim_proto.DeniablePayload.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {denim_proto.IDeniablePayload} message DeniablePayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeniablePayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.blockRequest != null && Object.hasOwnProperty.call(message, "blockRequest"))
                $root.denim_proto.BlockRequest.encode(message.blockRequest, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.userMessage != null && Object.hasOwnProperty.call(message, "userMessage"))
                $root.denim_proto.UserMessage.encode(message.userMessage, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.keyRequest != null && Object.hasOwnProperty.call(message, "keyRequest"))
                $root.denim_proto.KeyRequest.encode(message.keyRequest, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.keyResponse != null && Object.hasOwnProperty.call(message, "keyResponse"))
                $root.denim_proto.KeyResponse.encode(message.keyResponse, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.keyRefill != null && Object.hasOwnProperty.call(message, "keyRefill"))
                $root.denim_proto.KeyRefill.encode(message.keyRefill, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.statusMessage != null && Object.hasOwnProperty.call(message, "statusMessage"))
                $root.denim_proto.StatusMessage.encode(message.statusMessage, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.dummy != null && Object.hasOwnProperty.call(message, "dummy"))
                $root.denim_proto.DummyPadding.encode(message.dummy, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.denim_proto.InvalidRequest.encode(message.error, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DeniablePayload message, length delimited. Does not implicitly {@link denim_proto.DeniablePayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {denim_proto.IDeniablePayload} message DeniablePayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeniablePayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeniablePayload message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.DeniablePayload} DeniablePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeniablePayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.DeniablePayload();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.blockRequest = $root.denim_proto.BlockRequest.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.userMessage = $root.denim_proto.UserMessage.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.keyRequest = $root.denim_proto.KeyRequest.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.keyResponse = $root.denim_proto.KeyResponse.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.keyRefill = $root.denim_proto.KeyRefill.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.statusMessage = $root.denim_proto.StatusMessage.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.dummy = $root.denim_proto.DummyPadding.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.error = $root.denim_proto.InvalidRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeniablePayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.DeniablePayload} DeniablePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeniablePayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeniablePayload message.
         * @function verify
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeniablePayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.blockRequest != null && message.hasOwnProperty("blockRequest")) {
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.BlockRequest.verify(message.blockRequest);
                    if (error)
                        return "blockRequest." + error;
                }
            }
            if (message.userMessage != null && message.hasOwnProperty("userMessage")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.UserMessage.verify(message.userMessage);
                    if (error)
                        return "userMessage." + error;
                }
            }
            if (message.keyRequest != null && message.hasOwnProperty("keyRequest")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.KeyRequest.verify(message.keyRequest);
                    if (error)
                        return "keyRequest." + error;
                }
            }
            if (message.keyResponse != null && message.hasOwnProperty("keyResponse")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.KeyResponse.verify(message.keyResponse);
                    if (error)
                        return "keyResponse." + error;
                }
            }
            if (message.keyRefill != null && message.hasOwnProperty("keyRefill")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.KeyRefill.verify(message.keyRefill);
                    if (error)
                        return "keyRefill." + error;
                }
            }
            if (message.statusMessage != null && message.hasOwnProperty("statusMessage")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.StatusMessage.verify(message.statusMessage);
                    if (error)
                        return "statusMessage." + error;
                }
            }
            if (message.dummy != null && message.hasOwnProperty("dummy")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.DummyPadding.verify(message.dummy);
                    if (error)
                        return "dummy." + error;
                }
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.InvalidRequest.verify(message.error);
                    if (error)
                        return "error." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DeniablePayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.DeniablePayload} DeniablePayload
         */
        DeniablePayload.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.DeniablePayload)
                return object;
            let message = new $root.denim_proto.DeniablePayload();
            if (object.blockRequest != null) {
                if (typeof object.blockRequest !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.blockRequest: object expected");
                message.blockRequest = $root.denim_proto.BlockRequest.fromObject(object.blockRequest);
            }
            if (object.userMessage != null) {
                if (typeof object.userMessage !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.userMessage: object expected");
                message.userMessage = $root.denim_proto.UserMessage.fromObject(object.userMessage);
            }
            if (object.keyRequest != null) {
                if (typeof object.keyRequest !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.keyRequest: object expected");
                message.keyRequest = $root.denim_proto.KeyRequest.fromObject(object.keyRequest);
            }
            if (object.keyResponse != null) {
                if (typeof object.keyResponse !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.keyResponse: object expected");
                message.keyResponse = $root.denim_proto.KeyResponse.fromObject(object.keyResponse);
            }
            if (object.keyRefill != null) {
                if (typeof object.keyRefill !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.keyRefill: object expected");
                message.keyRefill = $root.denim_proto.KeyRefill.fromObject(object.keyRefill);
            }
            if (object.statusMessage != null) {
                if (typeof object.statusMessage !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.statusMessage: object expected");
                message.statusMessage = $root.denim_proto.StatusMessage.fromObject(object.statusMessage);
            }
            if (object.dummy != null) {
                if (typeof object.dummy !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.dummy: object expected");
                message.dummy = $root.denim_proto.DummyPadding.fromObject(object.dummy);
            }
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".denim_proto.DeniablePayload.error: object expected");
                message.error = $root.denim_proto.InvalidRequest.fromObject(object.error);
            }
            return message;
        };

        /**
         * Creates a plain object from a DeniablePayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.DeniablePayload
         * @static
         * @param {denim_proto.DeniablePayload} message DeniablePayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeniablePayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.blockRequest != null && message.hasOwnProperty("blockRequest")) {
                object.blockRequest = $root.denim_proto.BlockRequest.toObject(message.blockRequest, options);
                if (options.oneofs)
                    object.messageKind = "blockRequest";
            }
            if (message.userMessage != null && message.hasOwnProperty("userMessage")) {
                object.userMessage = $root.denim_proto.UserMessage.toObject(message.userMessage, options);
                if (options.oneofs)
                    object.messageKind = "userMessage";
            }
            if (message.keyRequest != null && message.hasOwnProperty("keyRequest")) {
                object.keyRequest = $root.denim_proto.KeyRequest.toObject(message.keyRequest, options);
                if (options.oneofs)
                    object.messageKind = "keyRequest";
            }
            if (message.keyResponse != null && message.hasOwnProperty("keyResponse")) {
                object.keyResponse = $root.denim_proto.KeyResponse.toObject(message.keyResponse, options);
                if (options.oneofs)
                    object.messageKind = "keyResponse";
            }
            if (message.keyRefill != null && message.hasOwnProperty("keyRefill")) {
                object.keyRefill = $root.denim_proto.KeyRefill.toObject(message.keyRefill, options);
                if (options.oneofs)
                    object.messageKind = "keyRefill";
            }
            if (message.statusMessage != null && message.hasOwnProperty("statusMessage")) {
                object.statusMessage = $root.denim_proto.StatusMessage.toObject(message.statusMessage, options);
                if (options.oneofs)
                    object.messageKind = "statusMessage";
            }
            if (message.dummy != null && message.hasOwnProperty("dummy")) {
                object.dummy = $root.denim_proto.DummyPadding.toObject(message.dummy, options);
                if (options.oneofs)
                    object.messageKind = "dummy";
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                object.error = $root.denim_proto.InvalidRequest.toObject(message.error, options);
                if (options.oneofs)
                    object.messageKind = "error";
            }
            return object;
        };

        /**
         * Converts this DeniablePayload to JSON.
         * @function toJSON
         * @memberof denim_proto.DeniablePayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeniablePayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeniablePayload;
    })();

    denim_proto.RegularPayload = (function() {

        /**
         * Properties of a RegularPayload.
         * @memberof denim_proto
         * @interface IRegularPayload
         * @property {denim_proto.IBlockRequest|null} [blockRequest] RegularPayload blockRequest
         * @property {denim_proto.IUserMessage|null} [userMessage] RegularPayload userMessage
         * @property {denim_proto.IKeyRequest|null} [keyRequest] RegularPayload keyRequest
         * @property {denim_proto.IKeyResponse|null} [keyResponse] RegularPayload keyResponse
         * @property {denim_proto.IKeyRefill|null} [keyRefill] RegularPayload keyRefill
         * @property {denim_proto.IStatusMessage|null} [statusMessage] RegularPayload statusMessage
         * @property {denim_proto.IMidTermKeyUpdate|null} [keyUpdate] RegularPayload keyUpdate
         * @property {denim_proto.IRegister|null} [registerUser] RegularPayload registerUser
         * @property {denim_proto.IInvalidRequest|null} [error] RegularPayload error
         */

        /**
         * Constructs a new RegularPayload.
         * @memberof denim_proto
         * @classdesc Represents a RegularPayload.
         * @implements IRegularPayload
         * @constructor
         * @param {denim_proto.IRegularPayload=} [properties] Properties to set
         */
        function RegularPayload(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegularPayload blockRequest.
         * @member {denim_proto.IBlockRequest|null|undefined} blockRequest
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.blockRequest = null;

        /**
         * RegularPayload userMessage.
         * @member {denim_proto.IUserMessage|null|undefined} userMessage
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.userMessage = null;

        /**
         * RegularPayload keyRequest.
         * @member {denim_proto.IKeyRequest|null|undefined} keyRequest
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.keyRequest = null;

        /**
         * RegularPayload keyResponse.
         * @member {denim_proto.IKeyResponse|null|undefined} keyResponse
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.keyResponse = null;

        /**
         * RegularPayload keyRefill.
         * @member {denim_proto.IKeyRefill|null|undefined} keyRefill
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.keyRefill = null;

        /**
         * RegularPayload statusMessage.
         * @member {denim_proto.IStatusMessage|null|undefined} statusMessage
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.statusMessage = null;

        /**
         * RegularPayload keyUpdate.
         * @member {denim_proto.IMidTermKeyUpdate|null|undefined} keyUpdate
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.keyUpdate = null;

        /**
         * RegularPayload registerUser.
         * @member {denim_proto.IRegister|null|undefined} registerUser
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.registerUser = null;

        /**
         * RegularPayload error.
         * @member {denim_proto.IInvalidRequest|null|undefined} error
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        RegularPayload.prototype.error = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * RegularPayload messageKind.
         * @member {"blockRequest"|"userMessage"|"keyRequest"|"keyResponse"|"keyRefill"|"statusMessage"|"keyUpdate"|"registerUser"|"error"|undefined} messageKind
         * @memberof denim_proto.RegularPayload
         * @instance
         */
        Object.defineProperty(RegularPayload.prototype, "messageKind", {
            get: $util.oneOfGetter($oneOfFields = ["blockRequest", "userMessage", "keyRequest", "keyResponse", "keyRefill", "statusMessage", "keyUpdate", "registerUser", "error"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new RegularPayload instance using the specified properties.
         * @function create
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {denim_proto.IRegularPayload=} [properties] Properties to set
         * @returns {denim_proto.RegularPayload} RegularPayload instance
         */
        RegularPayload.create = function create(properties) {
            return new RegularPayload(properties);
        };

        /**
         * Encodes the specified RegularPayload message. Does not implicitly {@link denim_proto.RegularPayload.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {denim_proto.IRegularPayload} message RegularPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegularPayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.blockRequest != null && Object.hasOwnProperty.call(message, "blockRequest"))
                $root.denim_proto.BlockRequest.encode(message.blockRequest, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.userMessage != null && Object.hasOwnProperty.call(message, "userMessage"))
                $root.denim_proto.UserMessage.encode(message.userMessage, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.keyRequest != null && Object.hasOwnProperty.call(message, "keyRequest"))
                $root.denim_proto.KeyRequest.encode(message.keyRequest, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.keyResponse != null && Object.hasOwnProperty.call(message, "keyResponse"))
                $root.denim_proto.KeyResponse.encode(message.keyResponse, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.keyRefill != null && Object.hasOwnProperty.call(message, "keyRefill"))
                $root.denim_proto.KeyRefill.encode(message.keyRefill, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.statusMessage != null && Object.hasOwnProperty.call(message, "statusMessage"))
                $root.denim_proto.StatusMessage.encode(message.statusMessage, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.keyUpdate != null && Object.hasOwnProperty.call(message, "keyUpdate"))
                $root.denim_proto.MidTermKeyUpdate.encode(message.keyUpdate, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.registerUser != null && Object.hasOwnProperty.call(message, "registerUser"))
                $root.denim_proto.Register.encode(message.registerUser, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.denim_proto.InvalidRequest.encode(message.error, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RegularPayload message, length delimited. Does not implicitly {@link denim_proto.RegularPayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {denim_proto.IRegularPayload} message RegularPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegularPayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegularPayload message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.RegularPayload} RegularPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegularPayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.RegularPayload();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.blockRequest = $root.denim_proto.BlockRequest.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.userMessage = $root.denim_proto.UserMessage.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.keyRequest = $root.denim_proto.KeyRequest.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.keyResponse = $root.denim_proto.KeyResponse.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.keyRefill = $root.denim_proto.KeyRefill.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.statusMessage = $root.denim_proto.StatusMessage.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.keyUpdate = $root.denim_proto.MidTermKeyUpdate.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.registerUser = $root.denim_proto.Register.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.error = $root.denim_proto.InvalidRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RegularPayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.RegularPayload} RegularPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegularPayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegularPayload message.
         * @function verify
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegularPayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.blockRequest != null && message.hasOwnProperty("blockRequest")) {
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.BlockRequest.verify(message.blockRequest);
                    if (error)
                        return "blockRequest." + error;
                }
            }
            if (message.userMessage != null && message.hasOwnProperty("userMessage")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.UserMessage.verify(message.userMessage);
                    if (error)
                        return "userMessage." + error;
                }
            }
            if (message.keyRequest != null && message.hasOwnProperty("keyRequest")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.KeyRequest.verify(message.keyRequest);
                    if (error)
                        return "keyRequest." + error;
                }
            }
            if (message.keyResponse != null && message.hasOwnProperty("keyResponse")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.KeyResponse.verify(message.keyResponse);
                    if (error)
                        return "keyResponse." + error;
                }
            }
            if (message.keyRefill != null && message.hasOwnProperty("keyRefill")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.KeyRefill.verify(message.keyRefill);
                    if (error)
                        return "keyRefill." + error;
                }
            }
            if (message.statusMessage != null && message.hasOwnProperty("statusMessage")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.StatusMessage.verify(message.statusMessage);
                    if (error)
                        return "statusMessage." + error;
                }
            }
            if (message.keyUpdate != null && message.hasOwnProperty("keyUpdate")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.MidTermKeyUpdate.verify(message.keyUpdate);
                    if (error)
                        return "keyUpdate." + error;
                }
            }
            if (message.registerUser != null && message.hasOwnProperty("registerUser")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.Register.verify(message.registerUser);
                    if (error)
                        return "registerUser." + error;
                }
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                if (properties.messageKind === 1)
                    return "messageKind: multiple values";
                properties.messageKind = 1;
                {
                    let error = $root.denim_proto.InvalidRequest.verify(message.error);
                    if (error)
                        return "error." + error;
                }
            }
            return null;
        };

        /**
         * Creates a RegularPayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.RegularPayload} RegularPayload
         */
        RegularPayload.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.RegularPayload)
                return object;
            let message = new $root.denim_proto.RegularPayload();
            if (object.blockRequest != null) {
                if (typeof object.blockRequest !== "object")
                    throw TypeError(".denim_proto.RegularPayload.blockRequest: object expected");
                message.blockRequest = $root.denim_proto.BlockRequest.fromObject(object.blockRequest);
            }
            if (object.userMessage != null) {
                if (typeof object.userMessage !== "object")
                    throw TypeError(".denim_proto.RegularPayload.userMessage: object expected");
                message.userMessage = $root.denim_proto.UserMessage.fromObject(object.userMessage);
            }
            if (object.keyRequest != null) {
                if (typeof object.keyRequest !== "object")
                    throw TypeError(".denim_proto.RegularPayload.keyRequest: object expected");
                message.keyRequest = $root.denim_proto.KeyRequest.fromObject(object.keyRequest);
            }
            if (object.keyResponse != null) {
                if (typeof object.keyResponse !== "object")
                    throw TypeError(".denim_proto.RegularPayload.keyResponse: object expected");
                message.keyResponse = $root.denim_proto.KeyResponse.fromObject(object.keyResponse);
            }
            if (object.keyRefill != null) {
                if (typeof object.keyRefill !== "object")
                    throw TypeError(".denim_proto.RegularPayload.keyRefill: object expected");
                message.keyRefill = $root.denim_proto.KeyRefill.fromObject(object.keyRefill);
            }
            if (object.statusMessage != null) {
                if (typeof object.statusMessage !== "object")
                    throw TypeError(".denim_proto.RegularPayload.statusMessage: object expected");
                message.statusMessage = $root.denim_proto.StatusMessage.fromObject(object.statusMessage);
            }
            if (object.keyUpdate != null) {
                if (typeof object.keyUpdate !== "object")
                    throw TypeError(".denim_proto.RegularPayload.keyUpdate: object expected");
                message.keyUpdate = $root.denim_proto.MidTermKeyUpdate.fromObject(object.keyUpdate);
            }
            if (object.registerUser != null) {
                if (typeof object.registerUser !== "object")
                    throw TypeError(".denim_proto.RegularPayload.registerUser: object expected");
                message.registerUser = $root.denim_proto.Register.fromObject(object.registerUser);
            }
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".denim_proto.RegularPayload.error: object expected");
                message.error = $root.denim_proto.InvalidRequest.fromObject(object.error);
            }
            return message;
        };

        /**
         * Creates a plain object from a RegularPayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.RegularPayload
         * @static
         * @param {denim_proto.RegularPayload} message RegularPayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegularPayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.blockRequest != null && message.hasOwnProperty("blockRequest")) {
                object.blockRequest = $root.denim_proto.BlockRequest.toObject(message.blockRequest, options);
                if (options.oneofs)
                    object.messageKind = "blockRequest";
            }
            if (message.userMessage != null && message.hasOwnProperty("userMessage")) {
                object.userMessage = $root.denim_proto.UserMessage.toObject(message.userMessage, options);
                if (options.oneofs)
                    object.messageKind = "userMessage";
            }
            if (message.keyRequest != null && message.hasOwnProperty("keyRequest")) {
                object.keyRequest = $root.denim_proto.KeyRequest.toObject(message.keyRequest, options);
                if (options.oneofs)
                    object.messageKind = "keyRequest";
            }
            if (message.keyResponse != null && message.hasOwnProperty("keyResponse")) {
                object.keyResponse = $root.denim_proto.KeyResponse.toObject(message.keyResponse, options);
                if (options.oneofs)
                    object.messageKind = "keyResponse";
            }
            if (message.keyRefill != null && message.hasOwnProperty("keyRefill")) {
                object.keyRefill = $root.denim_proto.KeyRefill.toObject(message.keyRefill, options);
                if (options.oneofs)
                    object.messageKind = "keyRefill";
            }
            if (message.statusMessage != null && message.hasOwnProperty("statusMessage")) {
                object.statusMessage = $root.denim_proto.StatusMessage.toObject(message.statusMessage, options);
                if (options.oneofs)
                    object.messageKind = "statusMessage";
            }
            if (message.keyUpdate != null && message.hasOwnProperty("keyUpdate")) {
                object.keyUpdate = $root.denim_proto.MidTermKeyUpdate.toObject(message.keyUpdate, options);
                if (options.oneofs)
                    object.messageKind = "keyUpdate";
            }
            if (message.registerUser != null && message.hasOwnProperty("registerUser")) {
                object.registerUser = $root.denim_proto.Register.toObject(message.registerUser, options);
                if (options.oneofs)
                    object.messageKind = "registerUser";
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                object.error = $root.denim_proto.InvalidRequest.toObject(message.error, options);
                if (options.oneofs)
                    object.messageKind = "error";
            }
            return object;
        };

        /**
         * Converts this RegularPayload to JSON.
         * @function toJSON
         * @memberof denim_proto.RegularPayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegularPayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RegularPayload;
    })();

    denim_proto.DenimChunk = (function() {

        /**
         * Properties of a DenimChunk.
         * @memberof denim_proto
         * @interface IDenimChunk
         * @property {Uint8Array} chunk DenimChunk chunk
         * @property {number} flags DenimChunk flags
         */

        /**
         * Constructs a new DenimChunk.
         * @memberof denim_proto
         * @classdesc Represents a DenimChunk.
         * @implements IDenimChunk
         * @constructor
         * @param {denim_proto.IDenimChunk=} [properties] Properties to set
         */
        function DenimChunk(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DenimChunk chunk.
         * @member {Uint8Array} chunk
         * @memberof denim_proto.DenimChunk
         * @instance
         */
        DenimChunk.prototype.chunk = $util.newBuffer([]);

        /**
         * DenimChunk flags.
         * @member {number} flags
         * @memberof denim_proto.DenimChunk
         * @instance
         */
        DenimChunk.prototype.flags = 0;

        /**
         * Creates a new DenimChunk instance using the specified properties.
         * @function create
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {denim_proto.IDenimChunk=} [properties] Properties to set
         * @returns {denim_proto.DenimChunk} DenimChunk instance
         */
        DenimChunk.create = function create(properties) {
            return new DenimChunk(properties);
        };

        /**
         * Encodes the specified DenimChunk message. Does not implicitly {@link denim_proto.DenimChunk.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {denim_proto.IDenimChunk} message DenimChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DenimChunk.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.chunk);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.flags);
            return writer;
        };

        /**
         * Encodes the specified DenimChunk message, length delimited. Does not implicitly {@link denim_proto.DenimChunk.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {denim_proto.IDenimChunk} message DenimChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DenimChunk.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DenimChunk message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.DenimChunk} DenimChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DenimChunk.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.DenimChunk();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chunk = reader.bytes();
                    break;
                case 2:
                    message.flags = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("chunk"))
                throw $util.ProtocolError("missing required 'chunk'", { instance: message });
            if (!message.hasOwnProperty("flags"))
                throw $util.ProtocolError("missing required 'flags'", { instance: message });
            return message;
        };

        /**
         * Decodes a DenimChunk message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.DenimChunk} DenimChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DenimChunk.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DenimChunk message.
         * @function verify
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DenimChunk.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!(message.chunk && typeof message.chunk.length === "number" || $util.isString(message.chunk)))
                return "chunk: buffer expected";
            if (!$util.isInteger(message.flags))
                return "flags: integer expected";
            return null;
        };

        /**
         * Creates a DenimChunk message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.DenimChunk} DenimChunk
         */
        DenimChunk.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.DenimChunk)
                return object;
            let message = new $root.denim_proto.DenimChunk();
            if (object.chunk != null)
                if (typeof object.chunk === "string")
                    $util.base64.decode(object.chunk, message.chunk = $util.newBuffer($util.base64.length(object.chunk)), 0);
                else if (object.chunk.length)
                    message.chunk = object.chunk;
            if (object.flags != null)
                message.flags = object.flags | 0;
            return message;
        };

        /**
         * Creates a plain object from a DenimChunk message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.DenimChunk
         * @static
         * @param {denim_proto.DenimChunk} message DenimChunk
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DenimChunk.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.chunk = "";
                else {
                    object.chunk = [];
                    if (options.bytes !== Array)
                        object.chunk = $util.newBuffer(object.chunk);
                }
                object.flags = 0;
            }
            if (message.chunk != null && message.hasOwnProperty("chunk"))
                object.chunk = options.bytes === String ? $util.base64.encode(message.chunk, 0, message.chunk.length) : options.bytes === Array ? Array.prototype.slice.call(message.chunk) : message.chunk;
            if (message.flags != null && message.hasOwnProperty("flags"))
                object.flags = message.flags;
            return object;
        };

        /**
         * Converts this DenimChunk to JSON.
         * @function toJSON
         * @memberof denim_proto.DenimChunk
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DenimChunk.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DenimChunk;
    })();

    denim_proto.DenimMessage = (function() {

        /**
         * Properties of a DenimMessage.
         * @memberof denim_proto
         * @interface IDenimMessage
         * @property {Uint8Array} regularPayload DenimMessage regularPayload
         * @property {Array.<denim_proto.IDenimChunk>|null} [chunks] DenimMessage chunks
         * @property {number|null} [counter] DenimMessage counter
         * @property {number|null} [q] DenimMessage q
         * @property {number} ballast DenimMessage ballast
         * @property {number|null} [extraBallast] DenimMessage extraBallast
         */

        /**
         * Constructs a new DenimMessage.
         * @memberof denim_proto
         * @classdesc Represents a DenimMessage.
         * @implements IDenimMessage
         * @constructor
         * @param {denim_proto.IDenimMessage=} [properties] Properties to set
         */
        function DenimMessage(properties) {
            this.chunks = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DenimMessage regularPayload.
         * @member {Uint8Array} regularPayload
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        DenimMessage.prototype.regularPayload = $util.newBuffer([]);

        /**
         * DenimMessage chunks.
         * @member {Array.<denim_proto.IDenimChunk>} chunks
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        DenimMessage.prototype.chunks = $util.emptyArray;

        /**
         * DenimMessage counter.
         * @member {number|null|undefined} counter
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        DenimMessage.prototype.counter = null;

        /**
         * DenimMessage q.
         * @member {number|null|undefined} q
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        DenimMessage.prototype.q = null;

        /**
         * DenimMessage ballast.
         * @member {number} ballast
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        DenimMessage.prototype.ballast = 0;

        /**
         * DenimMessage extraBallast.
         * @member {number|null|undefined} extraBallast
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        DenimMessage.prototype.extraBallast = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * DenimMessage _counter.
         * @member {"counter"|undefined} _counter
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        Object.defineProperty(DenimMessage.prototype, "_counter", {
            get: $util.oneOfGetter($oneOfFields = ["counter"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * DenimMessage _q.
         * @member {"q"|undefined} _q
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        Object.defineProperty(DenimMessage.prototype, "_q", {
            get: $util.oneOfGetter($oneOfFields = ["q"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * DenimMessage _extraBallast.
         * @member {"extraBallast"|undefined} _extraBallast
         * @memberof denim_proto.DenimMessage
         * @instance
         */
        Object.defineProperty(DenimMessage.prototype, "_extraBallast", {
            get: $util.oneOfGetter($oneOfFields = ["extraBallast"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DenimMessage instance using the specified properties.
         * @function create
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {denim_proto.IDenimMessage=} [properties] Properties to set
         * @returns {denim_proto.DenimMessage} DenimMessage instance
         */
        DenimMessage.create = function create(properties) {
            return new DenimMessage(properties);
        };

        /**
         * Encodes the specified DenimMessage message. Does not implicitly {@link denim_proto.DenimMessage.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {denim_proto.IDenimMessage} message DenimMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DenimMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.regularPayload);
            if (message.chunks != null && message.chunks.length)
                for (let i = 0; i < message.chunks.length; ++i)
                    $root.denim_proto.DenimChunk.encode(message.chunks[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.counter != null && Object.hasOwnProperty.call(message, "counter"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.counter);
            if (message.q != null && Object.hasOwnProperty.call(message, "q"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.q);
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.ballast);
            if (message.extraBallast != null && Object.hasOwnProperty.call(message, "extraBallast"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.extraBallast);
            return writer;
        };

        /**
         * Encodes the specified DenimMessage message, length delimited. Does not implicitly {@link denim_proto.DenimMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {denim_proto.IDenimMessage} message DenimMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DenimMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DenimMessage message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.DenimMessage} DenimMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DenimMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.DenimMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.regularPayload = reader.bytes();
                    break;
                case 2:
                    if (!(message.chunks && message.chunks.length))
                        message.chunks = [];
                    message.chunks.push($root.denim_proto.DenimChunk.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.counter = reader.int32();
                    break;
                case 4:
                    message.q = reader.double();
                    break;
                case 5:
                    message.ballast = reader.int32();
                    break;
                case 6:
                    message.extraBallast = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("regularPayload"))
                throw $util.ProtocolError("missing required 'regularPayload'", { instance: message });
            if (!message.hasOwnProperty("ballast"))
                throw $util.ProtocolError("missing required 'ballast'", { instance: message });
            return message;
        };

        /**
         * Decodes a DenimMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.DenimMessage} DenimMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DenimMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DenimMessage message.
         * @function verify
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DenimMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (!(message.regularPayload && typeof message.regularPayload.length === "number" || $util.isString(message.regularPayload)))
                return "regularPayload: buffer expected";
            if (message.chunks != null && message.hasOwnProperty("chunks")) {
                if (!Array.isArray(message.chunks))
                    return "chunks: array expected";
                for (let i = 0; i < message.chunks.length; ++i) {
                    let error = $root.denim_proto.DenimChunk.verify(message.chunks[i]);
                    if (error)
                        return "chunks." + error;
                }
            }
            if (message.counter != null && message.hasOwnProperty("counter")) {
                properties._counter = 1;
                if (!$util.isInteger(message.counter))
                    return "counter: integer expected";
            }
            if (message.q != null && message.hasOwnProperty("q")) {
                properties._q = 1;
                if (typeof message.q !== "number")
                    return "q: number expected";
            }
            if (!$util.isInteger(message.ballast))
                return "ballast: integer expected";
            if (message.extraBallast != null && message.hasOwnProperty("extraBallast")) {
                properties._extraBallast = 1;
                if (!$util.isInteger(message.extraBallast))
                    return "extraBallast: integer expected";
            }
            return null;
        };

        /**
         * Creates a DenimMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.DenimMessage} DenimMessage
         */
        DenimMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.DenimMessage)
                return object;
            let message = new $root.denim_proto.DenimMessage();
            if (object.regularPayload != null)
                if (typeof object.regularPayload === "string")
                    $util.base64.decode(object.regularPayload, message.regularPayload = $util.newBuffer($util.base64.length(object.regularPayload)), 0);
                else if (object.regularPayload.length)
                    message.regularPayload = object.regularPayload;
            if (object.chunks) {
                if (!Array.isArray(object.chunks))
                    throw TypeError(".denim_proto.DenimMessage.chunks: array expected");
                message.chunks = [];
                for (let i = 0; i < object.chunks.length; ++i) {
                    if (typeof object.chunks[i] !== "object")
                        throw TypeError(".denim_proto.DenimMessage.chunks: object expected");
                    message.chunks[i] = $root.denim_proto.DenimChunk.fromObject(object.chunks[i]);
                }
            }
            if (object.counter != null)
                message.counter = object.counter | 0;
            if (object.q != null)
                message.q = Number(object.q);
            if (object.ballast != null)
                message.ballast = object.ballast | 0;
            if (object.extraBallast != null)
                message.extraBallast = object.extraBallast | 0;
            return message;
        };

        /**
         * Creates a plain object from a DenimMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.DenimMessage
         * @static
         * @param {denim_proto.DenimMessage} message DenimMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DenimMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.chunks = [];
            if (options.defaults) {
                if (options.bytes === String)
                    object.regularPayload = "";
                else {
                    object.regularPayload = [];
                    if (options.bytes !== Array)
                        object.regularPayload = $util.newBuffer(object.regularPayload);
                }
                object.ballast = 0;
            }
            if (message.regularPayload != null && message.hasOwnProperty("regularPayload"))
                object.regularPayload = options.bytes === String ? $util.base64.encode(message.regularPayload, 0, message.regularPayload.length) : options.bytes === Array ? Array.prototype.slice.call(message.regularPayload) : message.regularPayload;
            if (message.chunks && message.chunks.length) {
                object.chunks = [];
                for (let j = 0; j < message.chunks.length; ++j)
                    object.chunks[j] = $root.denim_proto.DenimChunk.toObject(message.chunks[j], options);
            }
            if (message.counter != null && message.hasOwnProperty("counter")) {
                object.counter = message.counter;
                if (options.oneofs)
                    object._counter = "counter";
            }
            if (message.q != null && message.hasOwnProperty("q")) {
                object.q = options.json && !isFinite(message.q) ? String(message.q) : message.q;
                if (options.oneofs)
                    object._q = "q";
            }
            if (message.ballast != null && message.hasOwnProperty("ballast"))
                object.ballast = message.ballast;
            if (message.extraBallast != null && message.hasOwnProperty("extraBallast")) {
                object.extraBallast = message.extraBallast;
                if (options.oneofs)
                    object._extraBallast = "extraBallast";
            }
            return object;
        };

        /**
         * Converts this DenimMessage to JSON.
         * @function toJSON
         * @memberof denim_proto.DenimMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DenimMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DenimMessage;
    })();

    denim_proto.MidTermKeyUpdate = (function() {

        /**
         * Properties of a MidTermKeyUpdate.
         * @memberof denim_proto
         * @interface IMidTermKeyUpdate
         * @property {denim_proto.ISignedKeyTuple} key MidTermKeyUpdate key
         */

        /**
         * Constructs a new MidTermKeyUpdate.
         * @memberof denim_proto
         * @classdesc Represents a MidTermKeyUpdate.
         * @implements IMidTermKeyUpdate
         * @constructor
         * @param {denim_proto.IMidTermKeyUpdate=} [properties] Properties to set
         */
        function MidTermKeyUpdate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MidTermKeyUpdate key.
         * @member {denim_proto.ISignedKeyTuple} key
         * @memberof denim_proto.MidTermKeyUpdate
         * @instance
         */
        MidTermKeyUpdate.prototype.key = null;

        /**
         * Creates a new MidTermKeyUpdate instance using the specified properties.
         * @function create
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {denim_proto.IMidTermKeyUpdate=} [properties] Properties to set
         * @returns {denim_proto.MidTermKeyUpdate} MidTermKeyUpdate instance
         */
        MidTermKeyUpdate.create = function create(properties) {
            return new MidTermKeyUpdate(properties);
        };

        /**
         * Encodes the specified MidTermKeyUpdate message. Does not implicitly {@link denim_proto.MidTermKeyUpdate.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {denim_proto.IMidTermKeyUpdate} message MidTermKeyUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MidTermKeyUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.denim_proto.SignedKeyTuple.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MidTermKeyUpdate message, length delimited. Does not implicitly {@link denim_proto.MidTermKeyUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {denim_proto.IMidTermKeyUpdate} message MidTermKeyUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MidTermKeyUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MidTermKeyUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.MidTermKeyUpdate} MidTermKeyUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MidTermKeyUpdate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.MidTermKeyUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = $root.denim_proto.SignedKeyTuple.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("key"))
                throw $util.ProtocolError("missing required 'key'", { instance: message });
            return message;
        };

        /**
         * Decodes a MidTermKeyUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.MidTermKeyUpdate} MidTermKeyUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MidTermKeyUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MidTermKeyUpdate message.
         * @function verify
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MidTermKeyUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.denim_proto.SignedKeyTuple.verify(message.key);
                if (error)
                    return "key." + error;
            }
            return null;
        };

        /**
         * Creates a MidTermKeyUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.MidTermKeyUpdate} MidTermKeyUpdate
         */
        MidTermKeyUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.MidTermKeyUpdate)
                return object;
            let message = new $root.denim_proto.MidTermKeyUpdate();
            if (object.key != null) {
                if (typeof object.key !== "object")
                    throw TypeError(".denim_proto.MidTermKeyUpdate.key: object expected");
                message.key = $root.denim_proto.SignedKeyTuple.fromObject(object.key);
            }
            return message;
        };

        /**
         * Creates a plain object from a MidTermKeyUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.MidTermKeyUpdate
         * @static
         * @param {denim_proto.MidTermKeyUpdate} message MidTermKeyUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MidTermKeyUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.key = null;
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = $root.denim_proto.SignedKeyTuple.toObject(message.key, options);
            return object;
        };

        /**
         * Converts this MidTermKeyUpdate to JSON.
         * @function toJSON
         * @memberof denim_proto.MidTermKeyUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MidTermKeyUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MidTermKeyUpdate;
    })();

    denim_proto.Register = (function() {

        /**
         * Properties of a Register.
         * @memberof denim_proto
         * @interface IRegister
         * @property {denim_proto.IProtocolAddress} address Register address
         * @property {Uint8Array} idKey Register idKey
         * @property {number} registrationId Register registrationId
         * @property {denim_proto.ISignedKeyTuple} midTermKey Register midTermKey
         * @property {Array.<denim_proto.IKeyTuple>|null} [ephemeralKeys] Register ephemeralKeys
         * @property {Array.<denim_proto.IKeyTuple>|null} [deniableEphemeralKeys] Register deniableEphemeralKeys
         * @property {Uint8Array} keyGeneratorSeed Register keyGeneratorSeed
         * @property {Uint8Array} keyIdGeneratorSeed Register keyIdGeneratorSeed
         */

        /**
         * Constructs a new Register.
         * @memberof denim_proto
         * @classdesc Represents a Register.
         * @implements IRegister
         * @constructor
         * @param {denim_proto.IRegister=} [properties] Properties to set
         */
        function Register(properties) {
            this.ephemeralKeys = [];
            this.deniableEphemeralKeys = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Register address.
         * @member {denim_proto.IProtocolAddress} address
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.address = null;

        /**
         * Register idKey.
         * @member {Uint8Array} idKey
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.idKey = $util.newBuffer([]);

        /**
         * Register registrationId.
         * @member {number} registrationId
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.registrationId = 0;

        /**
         * Register midTermKey.
         * @member {denim_proto.ISignedKeyTuple} midTermKey
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.midTermKey = null;

        /**
         * Register ephemeralKeys.
         * @member {Array.<denim_proto.IKeyTuple>} ephemeralKeys
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.ephemeralKeys = $util.emptyArray;

        /**
         * Register deniableEphemeralKeys.
         * @member {Array.<denim_proto.IKeyTuple>} deniableEphemeralKeys
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.deniableEphemeralKeys = $util.emptyArray;

        /**
         * Register keyGeneratorSeed.
         * @member {Uint8Array} keyGeneratorSeed
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.keyGeneratorSeed = $util.newBuffer([]);

        /**
         * Register keyIdGeneratorSeed.
         * @member {Uint8Array} keyIdGeneratorSeed
         * @memberof denim_proto.Register
         * @instance
         */
        Register.prototype.keyIdGeneratorSeed = $util.newBuffer([]);

        /**
         * Creates a new Register instance using the specified properties.
         * @function create
         * @memberof denim_proto.Register
         * @static
         * @param {denim_proto.IRegister=} [properties] Properties to set
         * @returns {denim_proto.Register} Register instance
         */
        Register.create = function create(properties) {
            return new Register(properties);
        };

        /**
         * Encodes the specified Register message. Does not implicitly {@link denim_proto.Register.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.Register
         * @static
         * @param {denim_proto.IRegister} message Register message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Register.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.denim_proto.ProtocolAddress.encode(message.address, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.idKey);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.registrationId);
            $root.denim_proto.SignedKeyTuple.encode(message.midTermKey, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.ephemeralKeys != null && message.ephemeralKeys.length)
                for (let i = 0; i < message.ephemeralKeys.length; ++i)
                    $root.denim_proto.KeyTuple.encode(message.ephemeralKeys[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.deniableEphemeralKeys != null && message.deniableEphemeralKeys.length)
                for (let i = 0; i < message.deniableEphemeralKeys.length; ++i)
                    $root.denim_proto.KeyTuple.encode(message.deniableEphemeralKeys[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.keyGeneratorSeed);
            writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.keyIdGeneratorSeed);
            return writer;
        };

        /**
         * Encodes the specified Register message, length delimited. Does not implicitly {@link denim_proto.Register.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.Register
         * @static
         * @param {denim_proto.IRegister} message Register message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Register.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Register message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.Register
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.Register} Register
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Register.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.Register();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.address = $root.denim_proto.ProtocolAddress.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.idKey = reader.bytes();
                    break;
                case 3:
                    message.registrationId = reader.int32();
                    break;
                case 4:
                    message.midTermKey = $root.denim_proto.SignedKeyTuple.decode(reader, reader.uint32());
                    break;
                case 5:
                    if (!(message.ephemeralKeys && message.ephemeralKeys.length))
                        message.ephemeralKeys = [];
                    message.ephemeralKeys.push($root.denim_proto.KeyTuple.decode(reader, reader.uint32()));
                    break;
                case 6:
                    if (!(message.deniableEphemeralKeys && message.deniableEphemeralKeys.length))
                        message.deniableEphemeralKeys = [];
                    message.deniableEphemeralKeys.push($root.denim_proto.KeyTuple.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.keyGeneratorSeed = reader.bytes();
                    break;
                case 8:
                    message.keyIdGeneratorSeed = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("address"))
                throw $util.ProtocolError("missing required 'address'", { instance: message });
            if (!message.hasOwnProperty("idKey"))
                throw $util.ProtocolError("missing required 'idKey'", { instance: message });
            if (!message.hasOwnProperty("registrationId"))
                throw $util.ProtocolError("missing required 'registrationId'", { instance: message });
            if (!message.hasOwnProperty("midTermKey"))
                throw $util.ProtocolError("missing required 'midTermKey'", { instance: message });
            if (!message.hasOwnProperty("keyGeneratorSeed"))
                throw $util.ProtocolError("missing required 'keyGeneratorSeed'", { instance: message });
            if (!message.hasOwnProperty("keyIdGeneratorSeed"))
                throw $util.ProtocolError("missing required 'keyIdGeneratorSeed'", { instance: message });
            return message;
        };

        /**
         * Decodes a Register message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.Register
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.Register} Register
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Register.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Register message.
         * @function verify
         * @memberof denim_proto.Register
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Register.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.denim_proto.ProtocolAddress.verify(message.address);
                if (error)
                    return "address." + error;
            }
            if (!(message.idKey && typeof message.idKey.length === "number" || $util.isString(message.idKey)))
                return "idKey: buffer expected";
            if (!$util.isInteger(message.registrationId))
                return "registrationId: integer expected";
            {
                let error = $root.denim_proto.SignedKeyTuple.verify(message.midTermKey);
                if (error)
                    return "midTermKey." + error;
            }
            if (message.ephemeralKeys != null && message.hasOwnProperty("ephemeralKeys")) {
                if (!Array.isArray(message.ephemeralKeys))
                    return "ephemeralKeys: array expected";
                for (let i = 0; i < message.ephemeralKeys.length; ++i) {
                    let error = $root.denim_proto.KeyTuple.verify(message.ephemeralKeys[i]);
                    if (error)
                        return "ephemeralKeys." + error;
                }
            }
            if (message.deniableEphemeralKeys != null && message.hasOwnProperty("deniableEphemeralKeys")) {
                if (!Array.isArray(message.deniableEphemeralKeys))
                    return "deniableEphemeralKeys: array expected";
                for (let i = 0; i < message.deniableEphemeralKeys.length; ++i) {
                    let error = $root.denim_proto.KeyTuple.verify(message.deniableEphemeralKeys[i]);
                    if (error)
                        return "deniableEphemeralKeys." + error;
                }
            }
            if (!(message.keyGeneratorSeed && typeof message.keyGeneratorSeed.length === "number" || $util.isString(message.keyGeneratorSeed)))
                return "keyGeneratorSeed: buffer expected";
            if (!(message.keyIdGeneratorSeed && typeof message.keyIdGeneratorSeed.length === "number" || $util.isString(message.keyIdGeneratorSeed)))
                return "keyIdGeneratorSeed: buffer expected";
            return null;
        };

        /**
         * Creates a Register message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.Register
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.Register} Register
         */
        Register.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.Register)
                return object;
            let message = new $root.denim_proto.Register();
            if (object.address != null) {
                if (typeof object.address !== "object")
                    throw TypeError(".denim_proto.Register.address: object expected");
                message.address = $root.denim_proto.ProtocolAddress.fromObject(object.address);
            }
            if (object.idKey != null)
                if (typeof object.idKey === "string")
                    $util.base64.decode(object.idKey, message.idKey = $util.newBuffer($util.base64.length(object.idKey)), 0);
                else if (object.idKey.length)
                    message.idKey = object.idKey;
            if (object.registrationId != null)
                message.registrationId = object.registrationId | 0;
            if (object.midTermKey != null) {
                if (typeof object.midTermKey !== "object")
                    throw TypeError(".denim_proto.Register.midTermKey: object expected");
                message.midTermKey = $root.denim_proto.SignedKeyTuple.fromObject(object.midTermKey);
            }
            if (object.ephemeralKeys) {
                if (!Array.isArray(object.ephemeralKeys))
                    throw TypeError(".denim_proto.Register.ephemeralKeys: array expected");
                message.ephemeralKeys = [];
                for (let i = 0; i < object.ephemeralKeys.length; ++i) {
                    if (typeof object.ephemeralKeys[i] !== "object")
                        throw TypeError(".denim_proto.Register.ephemeralKeys: object expected");
                    message.ephemeralKeys[i] = $root.denim_proto.KeyTuple.fromObject(object.ephemeralKeys[i]);
                }
            }
            if (object.deniableEphemeralKeys) {
                if (!Array.isArray(object.deniableEphemeralKeys))
                    throw TypeError(".denim_proto.Register.deniableEphemeralKeys: array expected");
                message.deniableEphemeralKeys = [];
                for (let i = 0; i < object.deniableEphemeralKeys.length; ++i) {
                    if (typeof object.deniableEphemeralKeys[i] !== "object")
                        throw TypeError(".denim_proto.Register.deniableEphemeralKeys: object expected");
                    message.deniableEphemeralKeys[i] = $root.denim_proto.KeyTuple.fromObject(object.deniableEphemeralKeys[i]);
                }
            }
            if (object.keyGeneratorSeed != null)
                if (typeof object.keyGeneratorSeed === "string")
                    $util.base64.decode(object.keyGeneratorSeed, message.keyGeneratorSeed = $util.newBuffer($util.base64.length(object.keyGeneratorSeed)), 0);
                else if (object.keyGeneratorSeed.length)
                    message.keyGeneratorSeed = object.keyGeneratorSeed;
            if (object.keyIdGeneratorSeed != null)
                if (typeof object.keyIdGeneratorSeed === "string")
                    $util.base64.decode(object.keyIdGeneratorSeed, message.keyIdGeneratorSeed = $util.newBuffer($util.base64.length(object.keyIdGeneratorSeed)), 0);
                else if (object.keyIdGeneratorSeed.length)
                    message.keyIdGeneratorSeed = object.keyIdGeneratorSeed;
            return message;
        };

        /**
         * Creates a plain object from a Register message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.Register
         * @static
         * @param {denim_proto.Register} message Register
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Register.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.ephemeralKeys = [];
                object.deniableEphemeralKeys = [];
            }
            if (options.defaults) {
                object.address = null;
                if (options.bytes === String)
                    object.idKey = "";
                else {
                    object.idKey = [];
                    if (options.bytes !== Array)
                        object.idKey = $util.newBuffer(object.idKey);
                }
                object.registrationId = 0;
                object.midTermKey = null;
                if (options.bytes === String)
                    object.keyGeneratorSeed = "";
                else {
                    object.keyGeneratorSeed = [];
                    if (options.bytes !== Array)
                        object.keyGeneratorSeed = $util.newBuffer(object.keyGeneratorSeed);
                }
                if (options.bytes === String)
                    object.keyIdGeneratorSeed = "";
                else {
                    object.keyIdGeneratorSeed = [];
                    if (options.bytes !== Array)
                        object.keyIdGeneratorSeed = $util.newBuffer(object.keyIdGeneratorSeed);
                }
            }
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = $root.denim_proto.ProtocolAddress.toObject(message.address, options);
            if (message.idKey != null && message.hasOwnProperty("idKey"))
                object.idKey = options.bytes === String ? $util.base64.encode(message.idKey, 0, message.idKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.idKey) : message.idKey;
            if (message.registrationId != null && message.hasOwnProperty("registrationId"))
                object.registrationId = message.registrationId;
            if (message.midTermKey != null && message.hasOwnProperty("midTermKey"))
                object.midTermKey = $root.denim_proto.SignedKeyTuple.toObject(message.midTermKey, options);
            if (message.ephemeralKeys && message.ephemeralKeys.length) {
                object.ephemeralKeys = [];
                for (let j = 0; j < message.ephemeralKeys.length; ++j)
                    object.ephemeralKeys[j] = $root.denim_proto.KeyTuple.toObject(message.ephemeralKeys[j], options);
            }
            if (message.deniableEphemeralKeys && message.deniableEphemeralKeys.length) {
                object.deniableEphemeralKeys = [];
                for (let j = 0; j < message.deniableEphemeralKeys.length; ++j)
                    object.deniableEphemeralKeys[j] = $root.denim_proto.KeyTuple.toObject(message.deniableEphemeralKeys[j], options);
            }
            if (message.keyGeneratorSeed != null && message.hasOwnProperty("keyGeneratorSeed"))
                object.keyGeneratorSeed = options.bytes === String ? $util.base64.encode(message.keyGeneratorSeed, 0, message.keyGeneratorSeed.length) : options.bytes === Array ? Array.prototype.slice.call(message.keyGeneratorSeed) : message.keyGeneratorSeed;
            if (message.keyIdGeneratorSeed != null && message.hasOwnProperty("keyIdGeneratorSeed"))
                object.keyIdGeneratorSeed = options.bytes === String ? $util.base64.encode(message.keyIdGeneratorSeed, 0, message.keyIdGeneratorSeed.length) : options.bytes === Array ? Array.prototype.slice.call(message.keyIdGeneratorSeed) : message.keyIdGeneratorSeed;
            return object;
        };

        /**
         * Converts this Register to JSON.
         * @function toJSON
         * @memberof denim_proto.Register
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Register.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Register;
    })();

    denim_proto.ProtocolAddress = (function() {

        /**
         * Properties of a ProtocolAddress.
         * @memberof denim_proto
         * @interface IProtocolAddress
         * @property {string} name ProtocolAddress name
         * @property {number} deviceId ProtocolAddress deviceId
         */

        /**
         * Constructs a new ProtocolAddress.
         * @memberof denim_proto
         * @classdesc Represents a ProtocolAddress.
         * @implements IProtocolAddress
         * @constructor
         * @param {denim_proto.IProtocolAddress=} [properties] Properties to set
         */
        function ProtocolAddress(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProtocolAddress name.
         * @member {string} name
         * @memberof denim_proto.ProtocolAddress
         * @instance
         */
        ProtocolAddress.prototype.name = "";

        /**
         * ProtocolAddress deviceId.
         * @member {number} deviceId
         * @memberof denim_proto.ProtocolAddress
         * @instance
         */
        ProtocolAddress.prototype.deviceId = 0;

        /**
         * Creates a new ProtocolAddress instance using the specified properties.
         * @function create
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {denim_proto.IProtocolAddress=} [properties] Properties to set
         * @returns {denim_proto.ProtocolAddress} ProtocolAddress instance
         */
        ProtocolAddress.create = function create(properties) {
            return new ProtocolAddress(properties);
        };

        /**
         * Encodes the specified ProtocolAddress message. Does not implicitly {@link denim_proto.ProtocolAddress.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {denim_proto.IProtocolAddress} message ProtocolAddress message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProtocolAddress.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.deviceId);
            return writer;
        };

        /**
         * Encodes the specified ProtocolAddress message, length delimited. Does not implicitly {@link denim_proto.ProtocolAddress.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {denim_proto.IProtocolAddress} message ProtocolAddress message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProtocolAddress.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProtocolAddress message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.ProtocolAddress} ProtocolAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProtocolAddress.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.ProtocolAddress();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.deviceId = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            if (!message.hasOwnProperty("deviceId"))
                throw $util.ProtocolError("missing required 'deviceId'", { instance: message });
            return message;
        };

        /**
         * Decodes a ProtocolAddress message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.ProtocolAddress} ProtocolAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProtocolAddress.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProtocolAddress message.
         * @function verify
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProtocolAddress.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.name))
                return "name: string expected";
            if (!$util.isInteger(message.deviceId))
                return "deviceId: integer expected";
            return null;
        };

        /**
         * Creates a ProtocolAddress message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.ProtocolAddress} ProtocolAddress
         */
        ProtocolAddress.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.ProtocolAddress)
                return object;
            let message = new $root.denim_proto.ProtocolAddress();
            if (object.name != null)
                message.name = String(object.name);
            if (object.deviceId != null)
                message.deviceId = object.deviceId | 0;
            return message;
        };

        /**
         * Creates a plain object from a ProtocolAddress message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.ProtocolAddress
         * @static
         * @param {denim_proto.ProtocolAddress} message ProtocolAddress
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProtocolAddress.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.name = "";
                object.deviceId = 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                object.deviceId = message.deviceId;
            return object;
        };

        /**
         * Converts this ProtocolAddress to JSON.
         * @function toJSON
         * @memberof denim_proto.ProtocolAddress
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProtocolAddress.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ProtocolAddress;
    })();

    denim_proto.KeyTuple = (function() {

        /**
         * Properties of a KeyTuple.
         * @memberof denim_proto
         * @interface IKeyTuple
         * @property {number} id KeyTuple id
         * @property {Uint8Array} key KeyTuple key
         */

        /**
         * Constructs a new KeyTuple.
         * @memberof denim_proto
         * @classdesc Represents a KeyTuple.
         * @implements IKeyTuple
         * @constructor
         * @param {denim_proto.IKeyTuple=} [properties] Properties to set
         */
        function KeyTuple(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyTuple id.
         * @member {number} id
         * @memberof denim_proto.KeyTuple
         * @instance
         */
        KeyTuple.prototype.id = 0;

        /**
         * KeyTuple key.
         * @member {Uint8Array} key
         * @memberof denim_proto.KeyTuple
         * @instance
         */
        KeyTuple.prototype.key = $util.newBuffer([]);

        /**
         * Creates a new KeyTuple instance using the specified properties.
         * @function create
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {denim_proto.IKeyTuple=} [properties] Properties to set
         * @returns {denim_proto.KeyTuple} KeyTuple instance
         */
        KeyTuple.create = function create(properties) {
            return new KeyTuple(properties);
        };

        /**
         * Encodes the specified KeyTuple message. Does not implicitly {@link denim_proto.KeyTuple.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {denim_proto.IKeyTuple} message KeyTuple message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyTuple.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.key);
            return writer;
        };

        /**
         * Encodes the specified KeyTuple message, length delimited. Does not implicitly {@link denim_proto.KeyTuple.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {denim_proto.IKeyTuple} message KeyTuple message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyTuple.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyTuple message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.KeyTuple} KeyTuple
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyTuple.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.KeyTuple();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.int32();
                    break;
                case 2:
                    message.key = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            if (!message.hasOwnProperty("key"))
                throw $util.ProtocolError("missing required 'key'", { instance: message });
            return message;
        };

        /**
         * Decodes a KeyTuple message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.KeyTuple} KeyTuple
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyTuple.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyTuple message.
         * @function verify
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyTuple.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.id))
                return "id: integer expected";
            if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                return "key: buffer expected";
            return null;
        };

        /**
         * Creates a KeyTuple message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.KeyTuple} KeyTuple
         */
        KeyTuple.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.KeyTuple)
                return object;
            let message = new $root.denim_proto.KeyTuple();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.key != null)
                if (typeof object.key === "string")
                    $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
                else if (object.key.length)
                    message.key = object.key;
            return message;
        };

        /**
         * Creates a plain object from a KeyTuple message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.KeyTuple
         * @static
         * @param {denim_proto.KeyTuple} message KeyTuple
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyTuple.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                if (options.bytes === String)
                    object.key = "";
                else {
                    object.key = [];
                    if (options.bytes !== Array)
                        object.key = $util.newBuffer(object.key);
                }
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
            return object;
        };

        /**
         * Converts this KeyTuple to JSON.
         * @function toJSON
         * @memberof denim_proto.KeyTuple
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyTuple.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeyTuple;
    })();

    denim_proto.SignedKeyTuple = (function() {

        /**
         * Properties of a SignedKeyTuple.
         * @memberof denim_proto
         * @interface ISignedKeyTuple
         * @property {denim_proto.IKeyTuple} tuple SignedKeyTuple tuple
         * @property {Uint8Array} signature SignedKeyTuple signature
         */

        /**
         * Constructs a new SignedKeyTuple.
         * @memberof denim_proto
         * @classdesc Represents a SignedKeyTuple.
         * @implements ISignedKeyTuple
         * @constructor
         * @param {denim_proto.ISignedKeyTuple=} [properties] Properties to set
         */
        function SignedKeyTuple(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SignedKeyTuple tuple.
         * @member {denim_proto.IKeyTuple} tuple
         * @memberof denim_proto.SignedKeyTuple
         * @instance
         */
        SignedKeyTuple.prototype.tuple = null;

        /**
         * SignedKeyTuple signature.
         * @member {Uint8Array} signature
         * @memberof denim_proto.SignedKeyTuple
         * @instance
         */
        SignedKeyTuple.prototype.signature = $util.newBuffer([]);

        /**
         * Creates a new SignedKeyTuple instance using the specified properties.
         * @function create
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {denim_proto.ISignedKeyTuple=} [properties] Properties to set
         * @returns {denim_proto.SignedKeyTuple} SignedKeyTuple instance
         */
        SignedKeyTuple.create = function create(properties) {
            return new SignedKeyTuple(properties);
        };

        /**
         * Encodes the specified SignedKeyTuple message. Does not implicitly {@link denim_proto.SignedKeyTuple.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {denim_proto.ISignedKeyTuple} message SignedKeyTuple message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SignedKeyTuple.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.denim_proto.KeyTuple.encode(message.tuple, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.signature);
            return writer;
        };

        /**
         * Encodes the specified SignedKeyTuple message, length delimited. Does not implicitly {@link denim_proto.SignedKeyTuple.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {denim_proto.ISignedKeyTuple} message SignedKeyTuple message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SignedKeyTuple.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SignedKeyTuple message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.SignedKeyTuple} SignedKeyTuple
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SignedKeyTuple.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.SignedKeyTuple();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.tuple = $root.denim_proto.KeyTuple.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("tuple"))
                throw $util.ProtocolError("missing required 'tuple'", { instance: message });
            if (!message.hasOwnProperty("signature"))
                throw $util.ProtocolError("missing required 'signature'", { instance: message });
            return message;
        };

        /**
         * Decodes a SignedKeyTuple message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.SignedKeyTuple} SignedKeyTuple
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SignedKeyTuple.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SignedKeyTuple message.
         * @function verify
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SignedKeyTuple.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.denim_proto.KeyTuple.verify(message.tuple);
                if (error)
                    return "tuple." + error;
            }
            if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                return "signature: buffer expected";
            return null;
        };

        /**
         * Creates a SignedKeyTuple message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.SignedKeyTuple} SignedKeyTuple
         */
        SignedKeyTuple.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.SignedKeyTuple)
                return object;
            let message = new $root.denim_proto.SignedKeyTuple();
            if (object.tuple != null) {
                if (typeof object.tuple !== "object")
                    throw TypeError(".denim_proto.SignedKeyTuple.tuple: object expected");
                message.tuple = $root.denim_proto.KeyTuple.fromObject(object.tuple);
            }
            if (object.signature != null)
                if (typeof object.signature === "string")
                    $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                else if (object.signature.length)
                    message.signature = object.signature;
            return message;
        };

        /**
         * Creates a plain object from a SignedKeyTuple message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.SignedKeyTuple
         * @static
         * @param {denim_proto.SignedKeyTuple} message SignedKeyTuple
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SignedKeyTuple.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.tuple = null;
                if (options.bytes === String)
                    object.signature = "";
                else {
                    object.signature = [];
                    if (options.bytes !== Array)
                        object.signature = $util.newBuffer(object.signature);
                }
            }
            if (message.tuple != null && message.hasOwnProperty("tuple"))
                object.tuple = $root.denim_proto.KeyTuple.toObject(message.tuple, options);
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
            return object;
        };

        /**
         * Converts this SignedKeyTuple to JSON.
         * @function toJSON
         * @memberof denim_proto.SignedKeyTuple
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SignedKeyTuple.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SignedKeyTuple;
    })();

    denim_proto.KeyBundle = (function() {

        /**
         * Properties of a KeyBundle.
         * @memberof denim_proto
         * @interface IKeyBundle
         * @property {number} registrationId KeyBundle registrationId
         * @property {number} deviceId KeyBundle deviceId
         * @property {denim_proto.IKeyTuple|null} [ephemeralKey] KeyBundle ephemeralKey
         * @property {denim_proto.ISignedKeyTuple} midTermKey KeyBundle midTermKey
         * @property {Uint8Array} idKey KeyBundle idKey
         */

        /**
         * Constructs a new KeyBundle.
         * @memberof denim_proto
         * @classdesc Represents a KeyBundle.
         * @implements IKeyBundle
         * @constructor
         * @param {denim_proto.IKeyBundle=} [properties] Properties to set
         */
        function KeyBundle(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyBundle registrationId.
         * @member {number} registrationId
         * @memberof denim_proto.KeyBundle
         * @instance
         */
        KeyBundle.prototype.registrationId = 0;

        /**
         * KeyBundle deviceId.
         * @member {number} deviceId
         * @memberof denim_proto.KeyBundle
         * @instance
         */
        KeyBundle.prototype.deviceId = 0;

        /**
         * KeyBundle ephemeralKey.
         * @member {denim_proto.IKeyTuple|null|undefined} ephemeralKey
         * @memberof denim_proto.KeyBundle
         * @instance
         */
        KeyBundle.prototype.ephemeralKey = null;

        /**
         * KeyBundle midTermKey.
         * @member {denim_proto.ISignedKeyTuple} midTermKey
         * @memberof denim_proto.KeyBundle
         * @instance
         */
        KeyBundle.prototype.midTermKey = null;

        /**
         * KeyBundle idKey.
         * @member {Uint8Array} idKey
         * @memberof denim_proto.KeyBundle
         * @instance
         */
        KeyBundle.prototype.idKey = $util.newBuffer([]);

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * KeyBundle _ephemeralKey.
         * @member {"ephemeralKey"|undefined} _ephemeralKey
         * @memberof denim_proto.KeyBundle
         * @instance
         */
        Object.defineProperty(KeyBundle.prototype, "_ephemeralKey", {
            get: $util.oneOfGetter($oneOfFields = ["ephemeralKey"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new KeyBundle instance using the specified properties.
         * @function create
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {denim_proto.IKeyBundle=} [properties] Properties to set
         * @returns {denim_proto.KeyBundle} KeyBundle instance
         */
        KeyBundle.create = function create(properties) {
            return new KeyBundle(properties);
        };

        /**
         * Encodes the specified KeyBundle message. Does not implicitly {@link denim_proto.KeyBundle.verify|verify} messages.
         * @function encode
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {denim_proto.IKeyBundle} message KeyBundle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyBundle.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.registrationId);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.deviceId);
            if (message.ephemeralKey != null && Object.hasOwnProperty.call(message, "ephemeralKey"))
                $root.denim_proto.KeyTuple.encode(message.ephemeralKey, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            $root.denim_proto.SignedKeyTuple.encode(message.midTermKey, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.idKey);
            return writer;
        };

        /**
         * Encodes the specified KeyBundle message, length delimited. Does not implicitly {@link denim_proto.KeyBundle.verify|verify} messages.
         * @function encodeDelimited
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {denim_proto.IKeyBundle} message KeyBundle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyBundle.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyBundle message from the specified reader or buffer.
         * @function decode
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {denim_proto.KeyBundle} KeyBundle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyBundle.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.denim_proto.KeyBundle();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.registrationId = reader.int32();
                    break;
                case 2:
                    message.deviceId = reader.int32();
                    break;
                case 3:
                    message.ephemeralKey = $root.denim_proto.KeyTuple.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.midTermKey = $root.denim_proto.SignedKeyTuple.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.idKey = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("registrationId"))
                throw $util.ProtocolError("missing required 'registrationId'", { instance: message });
            if (!message.hasOwnProperty("deviceId"))
                throw $util.ProtocolError("missing required 'deviceId'", { instance: message });
            if (!message.hasOwnProperty("midTermKey"))
                throw $util.ProtocolError("missing required 'midTermKey'", { instance: message });
            if (!message.hasOwnProperty("idKey"))
                throw $util.ProtocolError("missing required 'idKey'", { instance: message });
            return message;
        };

        /**
         * Decodes a KeyBundle message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {denim_proto.KeyBundle} KeyBundle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyBundle.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyBundle message.
         * @function verify
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyBundle.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (!$util.isInteger(message.registrationId))
                return "registrationId: integer expected";
            if (!$util.isInteger(message.deviceId))
                return "deviceId: integer expected";
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey")) {
                properties._ephemeralKey = 1;
                {
                    let error = $root.denim_proto.KeyTuple.verify(message.ephemeralKey);
                    if (error)
                        return "ephemeralKey." + error;
                }
            }
            {
                let error = $root.denim_proto.SignedKeyTuple.verify(message.midTermKey);
                if (error)
                    return "midTermKey." + error;
            }
            if (!(message.idKey && typeof message.idKey.length === "number" || $util.isString(message.idKey)))
                return "idKey: buffer expected";
            return null;
        };

        /**
         * Creates a KeyBundle message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {denim_proto.KeyBundle} KeyBundle
         */
        KeyBundle.fromObject = function fromObject(object) {
            if (object instanceof $root.denim_proto.KeyBundle)
                return object;
            let message = new $root.denim_proto.KeyBundle();
            if (object.registrationId != null)
                message.registrationId = object.registrationId | 0;
            if (object.deviceId != null)
                message.deviceId = object.deviceId | 0;
            if (object.ephemeralKey != null) {
                if (typeof object.ephemeralKey !== "object")
                    throw TypeError(".denim_proto.KeyBundle.ephemeralKey: object expected");
                message.ephemeralKey = $root.denim_proto.KeyTuple.fromObject(object.ephemeralKey);
            }
            if (object.midTermKey != null) {
                if (typeof object.midTermKey !== "object")
                    throw TypeError(".denim_proto.KeyBundle.midTermKey: object expected");
                message.midTermKey = $root.denim_proto.SignedKeyTuple.fromObject(object.midTermKey);
            }
            if (object.idKey != null)
                if (typeof object.idKey === "string")
                    $util.base64.decode(object.idKey, message.idKey = $util.newBuffer($util.base64.length(object.idKey)), 0);
                else if (object.idKey.length)
                    message.idKey = object.idKey;
            return message;
        };

        /**
         * Creates a plain object from a KeyBundle message. Also converts values to other types if specified.
         * @function toObject
         * @memberof denim_proto.KeyBundle
         * @static
         * @param {denim_proto.KeyBundle} message KeyBundle
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyBundle.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.registrationId = 0;
                object.deviceId = 0;
                object.midTermKey = null;
                if (options.bytes === String)
                    object.idKey = "";
                else {
                    object.idKey = [];
                    if (options.bytes !== Array)
                        object.idKey = $util.newBuffer(object.idKey);
                }
            }
            if (message.registrationId != null && message.hasOwnProperty("registrationId"))
                object.registrationId = message.registrationId;
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                object.deviceId = message.deviceId;
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey")) {
                object.ephemeralKey = $root.denim_proto.KeyTuple.toObject(message.ephemeralKey, options);
                if (options.oneofs)
                    object._ephemeralKey = "ephemeralKey";
            }
            if (message.midTermKey != null && message.hasOwnProperty("midTermKey"))
                object.midTermKey = $root.denim_proto.SignedKeyTuple.toObject(message.midTermKey, options);
            if (message.idKey != null && message.hasOwnProperty("idKey"))
                object.idKey = options.bytes === String ? $util.base64.encode(message.idKey, 0, message.idKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.idKey) : message.idKey;
            return object;
        };

        /**
         * Converts this KeyBundle to JSON.
         * @function toJSON
         * @memberof denim_proto.KeyBundle
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyBundle.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeyBundle;
    })();

    return denim_proto;
})();

export { $root as default };
