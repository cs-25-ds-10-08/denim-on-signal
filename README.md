# DenIM on Signal
Deniable Instant Messaging (DenIM) is a protocol that adds transport level privacy on top of the Signal encryption protocol. This proof of concept implementation delegates encryption logic to [libsignal](https://github.com/signalapp/libsignal), and provides a simulation of clients chatting to benchmark server performance.

The corresponding paper, "Metadata Privacy Beyond Tunneling for Instant Messaging" is available [online](https://arxiv.org/abs/2210.12776v3).

## Setup

`npm install`
`npm run proto`
`npm run build`

(May require global install of ts-node: `npm install -g ts-node`)

## Tests
`npm run build`
`npm run test`

or

`ts-node node_modules/tape/bin/tape test/**/*.ts`

## Run network simulation

### Dispatcher

`make; ts-node ./src/experiments/Dispatcher.ts ./settings.json`

To suppress responses to each message that results in triangular message growth, pass flag `--noresponse`

Example `settings.json` input file



```
{
    "number_of_clients":20,
    "experiment_duration_ms":300000,
    "event_ticks_ms":1000,
    "regular_message_per_tick":1,
    "deniable_message_per_tick":1,
    "regular_behavior_probability":1,
    "deniable_behavior_probability":0.1,
    "number_regular_ephemerals":10,
    "number_deniable_ephemerals":20,
    "message_length":1,
    "scenario":"REGULAR_BAZAAR_DENIABLE_BAZAAR",
    "number_regular_groups":6,
    "number_deniable_groups":2,
    "clients_respond_on_message_received":false,
    "runs":2,
    "denim_server_address":"wss://192.168.1.0:8080/"
}
```


### Server
`make; ts-node ./src/experiments/WSServer.ts --q=1`

Where passing `q` is optional.

Generates output to:
`./output-server/`

### Clients
Start the desired amount of clients, connecting to the Dispatcher on a given IP, e.g.:

`./startClients.sh "5" "127.0.0.1"`

Generates output to:
`./output/`
