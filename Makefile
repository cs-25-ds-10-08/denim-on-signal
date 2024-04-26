NODE=node --unhandled-rejections=strict

all:
	tsc
run:
	$(NODE) ./build/Client.js

wsserver:
	$(NODE) ./build/WSServer.js
wsclient:
	$(NODE) ./build/WSClient.js