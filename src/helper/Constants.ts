import { ProtoFactory } from "./ProtoFactory";
import SignalLib = require('@signalapp/libsignal-client');;

export const CLIENT_DEFAULT_REGULAR_EPHEMERAL_KEYS = 10;
export const CLIENT_DEFAULT_DENIABLE_EPHEMERAL_KEYS = 10;
export const TEST_CHUNK = Buffer.from("DUMMYPADDING", "utf8");

export const SIGNAL_KEY_LENGTH = 32; // bytes
export const KEY_START_ID = 1;
export const KEY_STOP_ID = 2147483647; //7FFF FFFF
export const KEY_ID_SEED_LENGTH = 4; // to seed a uint32, use 4 bytes
export const KEY_ID_PARTITIONING_MULTIPLE = 10; // Every index divisible by n belongs to the server

export const DEFAULT_Q = 0.25; // Tweak me!

// Parameters for websockets connections
export const PROTOCOL = 'denim-protocol';
export const EXPERIMENT_PROTOCOL = 'dispatcher-protocol';
export const CLIENT_CONNECT = '##CLIENT_CONNECT##';
export const CLIENT_READY = '##CLIENT_READY##';
export const CLIENT_DONE = '##CLIENT_DONE##';
export const DENIM_SERVER_RESTARTED = '##DENIM_SERVER_SUCCESSFULLY_RESTARTED##';
export const SERVER_INSTRUCTIONS = '##SERVER_INSTRUCTIONS##';
export const SERVER_START = '##SERVER_START##';
export const SERVER_PRINT_STATISTICS = '##SERVER_PRINT_STATISTICS##';
export const SERVER_EXPERIMENT_DONE = '##SERVER_EXPERIMENT_DONE##\nNvtg36WSGz6psOrTbiGOVa9VHBzGMN5s43EkRFM9rzXbjppc2r0pDsbBJmx9imCVwrHGqGixfLQpUSONTfA35HWX9BOxODlGRIZB'
export const MESSAGE_TIMESTAMP_START_DELIMITER = '##TIMESTAMP_START##';
export const MESSAGE_TIMESTAMP_END_DELIMITER = '##TIMESTAMP_END##';
export const NETWORK_SERVER_ADDRESS = 'wss://174.138.10.61:8080/';
export const DISPATCHER_PORT = 8081;
export const DISPATCHER_NETWORK_ADDRESS = '174.138.10.61';

// Messages types
export const MESSAGE_TYPE_KEY_RESPONSE = "KEY_RESPONSE";
export const MESSAGE_TYPE_TEXT = "TEXT";
export const MESSAGE_TYPE_ERROR_KEY_REQUEST = "ERROR_KEY_RESPONSE";

// Key states (for experiments)
export const KEY_STATE_IN_FLIGHT = "IN_FLIGHT";
export const KEY_STATE_RECEIVED = "KEY_RECEIVED";

export const EMPTY_UINT8ARRAY = new Uint8Array();

// A chunk with an empty byte array has size 4:
// const emptyChunk = ProtoFactory.denimChunk(Buffer.alloc(0), true);
// const serializedEmpty = denim_proto.DenimChunk.encode(emptyChunk).finish();
// serializedEmpty.byteLength;

export const EMPTY_DENIMCHUNK_SIZE = 4;
export const EMPTY_DENIABLE_PAYLOAD_SIZE = 4;
export const DENIMARRAY_WITH_EMPTY_DENIMCHUNK_SIZE = 6;
export const CHUNK_FIXED_OVERHEAD = 3;
export const UNUSED_BALLAST_FLAG_OVERHEAD = 2;
export const _BYTE_SIZE_GAPS = [129, 16386, 2097155, 268435460, 34359738373];
export const BYTE_SIZE_GAPS = [130, 16387, 2097156, 268435461, 34359738374];
export const GAP_TO_CONTENT_SIZE = {130:122, 16387:16377, 2097156:2097144, 268435461:268435447};
// export const GAP_TO_CONTENT_SIZE = {129:122, 16386:16377, 2097155:2097144, 268435460:268435447};
export const BITPATTERN_IS_DUMMY = 1; //0000000000000001
export const BITPATTERN_IS_FINAL = 2; //0000000000000010

export const MIN_PADDING = DENIMARRAY_WITH_EMPTY_DENIMCHUNK_SIZE+UNUSED_BALLAST_FLAG_OVERHEAD+1;

export const DENIMCHUNK_NONCHUNK_MIN_LENGTH = 3
export const PROTO_TAG_SIZE = 1
export const SERVER_NAME = "SERVER";
export const SERVER_DEVICE_ID = 1;
export const SERVER_ADDRESS = SignalLib.ProtocolAddress.new(SERVER_NAME, SERVER_DEVICE_ID);
export const DEFAULT_DEVICE_ID = 1;

export const LOGLEVEL = "info";

export const ERROR_USER_NOT_REGISTERED = "ERROR_USER_NOT_REGISTERED";

export const OUTPUT_DIR_CLIENTS = "./output-clients/"
export const OUTPUT_DIR_SERVER = "./output-server/"
export const EXPERIMENT_SCENARIO_SATURATION = "REGULAR_BAZAAR_DENIABLE_BAZAAR";
export const EXPERIMENT_SCENARIO_DENIABLE_LATENCY = "REGULAR_GROUP_DENIABLE_BAZAAR";
export const EXPERIMENT_SCENARIO_DENIABLE_GROUP_LATENCY = "REGULAR_GROUP_DENIABLE_GROUP";
export const BEHAVIOR_BAZAAR = "bazaar";
export const BEHAVIOR_SILENT = "silent";
export const BEHAVIOR_GROUP_CHAT = "group";

export const SERVER_COMMAND_RESTART_STRING = "##yUA2Ce0vrP1VOnKvo2IW4nLhxjJHkevDBekQGajBfjrRgptojYtl1Z9l7ADnlcCCtAgIFgYL3Nk6bnwJtDY1VnJUDTVeyVnw2FT6##";