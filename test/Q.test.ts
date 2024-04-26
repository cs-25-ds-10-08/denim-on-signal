import {DenimClient, newDenimClient } from "../src/core/DenimClient";
import { DenimServer } from '../src/core/DenimServer';
import SignalLib = require('@signalapp/libsignal-client');;
import { KeyTuple, SignedKeyTuple } from "../src/wrappers/KeyWrappers";
import { denim_proto } from "../src/proto-generated/compiled";
import Constants = require('../src/helper/Constants');
import { ProtoFactory } from "../src/helper/ProtoFactory";
import Util = require('../src/helper/Util');

var test = require('tape');

test('Deniable with small q', async (tape)=> {
    const alice = await newDenimClient("Alice", 1);
    const bob = await newDenimClient("Bob", 1);
    const charlie = await newDenimClient("Charlie", 1);
    const dorothy = await newDenimClient("Dorothy", 1);

    const aliceAddressString = Util.signalAddressToString(alice.address);
    const bobAddressString = Util.signalAddressToString(bob.address);
    const charlieAddressString = Util.signalAddressToString(charlie.address);
    const dorothyAddressString = Util.signalAddressToString(dorothy.address);

    const q = 0.1;
    const server = new DenimServer(q);

    const aliceRegister = await alice.createRegisterThreadUnsafe();
    server.process(aliceAddressString, aliceRegister); 
    const bobRegister = await bob.createRegisterThreadUnsafe();
    server.process(bobAddressString, bobRegister);
    const charlieRegister = await charlie.createRegisterThreadUnsafe();
    server.process(charlieAddressString, charlieRegister);
    const dorothyRegister = await dorothy.createRegisterThreadUnsafe();
    server.process(dorothyAddressString, dorothyRegister);

    // Alice wants to communicate deniably with Bob
    await alice.queueDeniableKeyRequest(bob.address);
    await alice.queueDeniableMessage("Privet "+bob.address.name()+"... Can you keep a secret? Let me send you my very secret plans...", bob.address);
    tape.equal(alice.deniableMessagesAwaitingEncryption.get(bobAddressString).length, 1);

    const aliceCharlieKeyRequest = alice.createKeyRequest(charlie.address);
    const aliceCharlieKeyResponse = server.process(aliceAddressString, aliceCharlieKeyRequest)["msg"];
    let decoded = denim_proto.DenimMessage.decode(aliceCharlieKeyResponse);
    await alice.process(decoded);

    // Server processes *after* responding
    const denimMsg1 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieKeyRequest));
    await server._processChunks(aliceAddressString, denimMsg1.chunks);


    const aliceCharlieMsg1 = await alice.createRegularMessage("Very long message for Charlie to flush out the deniable key request", charlie.address);
    const aliceCharlieMsg1Forward = server.process(aliceAddressString, aliceCharlieMsg1)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg1Forward);
    await charlie.process(decoded);

    // Server processes *after* responding
    const denimMsg2 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg1));
    await server._processChunks(aliceAddressString, denimMsg2.chunks);

    // Charlie should respond so Alice can get the deniable key response
    const aliceCharlieMsg2 = await charlie.createRegularMessage("Hello Alice! Let me send you something very long so you can get the key response with this message", alice.address);
    const aliceCharlieMsg2Forward = server.process(charlieAddressString, aliceCharlieMsg2)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg2Forward);
    await alice.process(decoded); // Should contain key response
    
    // Server processes *after* responding
    const denimMsg3 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg2));
    await server._processChunks(charlieAddressString, denimMsg3.chunks);

    const aliceCharlieMsg3 = await charlie.createRegularMessage("Hello Alice! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Vulputate mi sit amet mauris commodo quis. Turpis in eu mi bibendum. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Etiam erat velit scelerisque in dictum. Amet facilisis magna etiam tempor orci eu lobortis. Risus in hendrerit gravida rutrum quisque non. Gravida cum sociis natoque penatibus et. Sapien eget mi proin sed libero enim. Adipiscing elit ut aliquam purus sit amet. Diam volutpat commodo sed egestas. Habitant morbi tristique senectus et netus et malesuada fames. Elementum eu facilisis sed odio morbi. Ullamcorper morbi tincidunt ornare massa eget. Aliquam etiam erat velit scelerisque in dictum non consectetur a. Nam at lectus urna duis convallis convallis tellus. Turpis tincidunt id aliquet risus feugiat in ante. In nulla posuere sollicitudin aliquam ultrices. Eget gravida cum sociis natoque penatibus et magnis. Nulla facilisi cras fermentum odio. A erat nam at lectus urna duis. Id interdum velit laoreet id. Aenean vel elit scelerisque mauris. At augue eget arcu dictum varius duis at consectetur. Mattis ullamcorper velit sed ullamcorper morbi. Mauris in aliquam sem fringilla ut morbi tincidunt augue. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Congue mauris rhoncus aenean vel elit scelerisque mauris. Sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Facilisis magna etiam tempor orci. Et sollicitudin ac orci phasellus egestas tellus. In vitae turpis massa sed elementum tempus egestas sed sed. Nulla malesuada pellentesque elit eget gravida cum sociis. Odio pellentesque diam volutpat commodo. In dictum non consectetur a erat. Turpis egestas integer eget aliquet nibh praesent tristique magna. Mauris cursus mattis molestie a iaculis at erat pellentesque. Ac tortor vitae purus faucibus ornare suspendisse sed. Mi in nulla posuere sollicitudin aliquam. Senectus et netus et malesuada fames ac. Sit amet tellus cras adipiscing enim. Sollicitudin aliquam ultrices sagittis orci a scelerisque. Amet dictum sit amet justo donec enim diam vulputate. Orci dapibus ultrices in iaculis nunc sed. Pellentesque habitant morbi tristique senectus et netus. Odio aenean sed adipiscing diam. Accumsan tortor posuere ac ut consequat. Lacinia quis vel eros donec ac odio tempor. Lorem mollis aliquam ut porttitor leo a. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus. Vitae suscipit tellus mauris a diam maecenas. In mollis nunc sed id semper risus in hendrerit. Pharetra vel turpis nunc eget lorem dolor sed viverra. Sit amet luctus venenatis lectus magna fringilla urna. Odio tempor orci dapibus ultrices in iaculis nunc. Pharetra vel turpis nunc eget lorem dolor sed viverra. Congue eu consequat ac felis. Dictum varius duis at consectetur lorem donec massa sapien faucibus. Ac tincidunt vitae semper quis lectus nulla at volutpat. Sit amet consectetur adipiscing elit. Aenean pharetra magna ac placerat vestibulum lectus mauris ultrices. At varius vel pharetra vel turpis nunc eget lorem. Non blandit massa enim nec dui. Fusce id velit ut tortor pretium viverra suspendisse. Et netus et malesuada fames ac. Ac tortor dignissim convallis aenean et tortor at risus viverra. Tincidunt eget nullam non nisi est sit amet facilisis. Odio pellentesque diam volutpat commodo sed egestas egestas. Laoreet sit amet cursus sit amet. Varius duis at consectetur lorem. Odio aenean sed adipiscing diam donec. Leo in vitae turpis massa sed elementum tempus. Id nibh tortor id aliquet. Turpis egestas pretium aenean pharetra magna ac placerat. Eget sit amet tellus cras adipiscing enim eu turpis. Mauris a diam maecenas sed. Quis hendrerit dolor magna eget est. Nam aliquam sem et tortor consequat. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus et. Gravida neque convallis a cras semper auctor neque.",
     alice.address);
    const aliceCharlieMsg3Forward = server.process(charlieAddressString, aliceCharlieMsg3)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg3Forward);
    await alice.process(decoded); // Should contain key response
    
    // Server processes *after* responding
    const denimMsg4 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg2));
    await server._processChunks(charlieAddressString, denimMsg3.chunks);


    await new Promise(r => setTimeout(r, 3000)); // Sleep to make sure process finishes
    tape.true(alice.deniableSessionStore.getSession(charlie.address));
    console.log(alice.outgoingDeniable);
    tape.true(alice.outgoingDeniable.length, 1); // Message should be encrypted and queued

    // Alice needs to forward deniable to server...
    const aliceCharlieMsg4 = await alice.createRegularMessage("H", charlie.address);
    const aliceCharlieMsg4Forward = server.process(aliceAddressString, aliceCharlieMsg4)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg4Forward);
    await charlie.process(decoded);

    // Server processes *after* responding
    const denimMsg5 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg4));
    await server._processChunks(aliceAddressString, denimMsg5.chunks);


    const aliceCharlieMsg5 = await alice.createRegularMessage("i", charlie.address);
    const aliceCharlieMsg5Forward = server.process(aliceAddressString, aliceCharlieMsg5)["msg"];
    decoded = denim_proto.DenimMessage.decode(aliceCharlieMsg5Forward);
    await charlie.process(decoded);

    // Server processes *after* responding
    const denimMsg6 = denim_proto.DenimMessage.decode(Buffer.from(aliceCharlieMsg5));
    await server._processChunks(aliceAddressString, denimMsg6.chunks);



    // Push Bob's message out using Dorothy
    // Key Request
    const dorothyBobKeyRequest = dorothy.createKeyRequest(bob.address);
    const dorothyBobKeyResponse = server.process(dorothyAddressString, dorothyBobKeyRequest)["msg"];
    decoded = denim_proto.DenimMessage.decode(dorothyBobKeyResponse);
    await dorothy.process(decoded);

     // Server processes *after* responding
     const denimMsg7 = denim_proto.DenimMessage.decode(Buffer.from(dorothyBobKeyRequest));
     await server._processChunks(dorothyAddressString, denimMsg7.chunks);

    //Regular message Dorothy->Bob

    const dorothyBobMsg1 = await dorothy.createRegularMessage("Very long message 1 for Bob to flush out Alice's deniable message...", bob.address);
    const dorothyBobMsg1Forward = server.process(dorothyAddressString, dorothyBobMsg1)["msg"];
    decoded = denim_proto.DenimMessage.decode(dorothyBobMsg1Forward);
    await bob.process(decoded);

    // Server processes *after* responding
    const denimMsg8 = denim_proto.DenimMessage.decode(Buffer.from(dorothyBobMsg1));
    await server._processChunks(dorothyAddressString, denimMsg8.chunks);

    const dorothyBobMsg2 = await dorothy.createRegularMessage("Very long message 2 for Bob to flush out Alice's deniable message...", bob.address);
    const dorothyBobMsg2Forward = server.process(dorothyAddressString, dorothyBobMsg2)["msg"];
    decoded = denim_proto.DenimMessage.decode(dorothyBobMsg2Forward);
    await bob.process(decoded);

    // Server processes *after* responding
    const denimMsg9 = denim_proto.DenimMessage.decode(Buffer.from(dorothyBobMsg2));
    await server._processChunks(dorothyAddressString, denimMsg9.chunks);

    const dorothyBobMsg3 = await dorothy.createRegularMessage("Very long message 3 for Bob to flush out Alice's deniable message...", bob.address);
    const dorothyBobMsg3Forward = server.process(dorothyAddressString, dorothyBobMsg3)["msg"];
    decoded = denim_proto.DenimMessage.decode(dorothyBobMsg3Forward);
    await bob.process(decoded);

    // Server processes *after* responding
    const denimMsg10 = denim_proto.DenimMessage.decode(Buffer.from(dorothyBobMsg3));
    await server._processChunks(dorothyAddressString, denimMsg10.chunks);

    const dorothyBobMsg4 = await dorothy.createRegularMessage("Very long message 4 for Bob to flush out Alice's deniable message... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Vulputate mi sit amet mauris commodo quis. Turpis in eu mi bibendum. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Etiam erat velit scelerisque in dictum. Amet facilisis magna etiam tempor orci eu lobortis. Risus in hendrerit gravida rutrum quisque non. Gravida cum sociis natoque penatibus et. Sapien eget mi proin sed libero enim. Adipiscing elit ut aliquam purus sit amet. Diam volutpat commodo sed egestas. Habitant morbi tristique senectus et netus et malesuada fames. Elementum eu facilisis sed odio morbi. Ullamcorper morbi tincidunt ornare massa eget. Aliquam etiam erat velit scelerisque in dictum non consectetur a. Nam at lectus urna duis convallis convallis tellus. Turpis tincidunt id aliquet risus feugiat in ante. In nulla posuere sollicitudin aliquam ultrices. Eget gravida cum sociis natoque penatibus et magnis. Nulla facilisi cras fermentum odio. A erat nam at lectus urna duis. Id interdum velit laoreet id. Aenean vel elit scelerisque mauris. At augue eget arcu dictum varius duis at consectetur. Mattis ullamcorper velit sed ullamcorper morbi. Mauris in aliquam sem fringilla ut morbi tincidunt augue. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Congue mauris rhoncus aenean vel elit scelerisque mauris. Sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Facilisis magna etiam tempor orci. Et sollicitudin ac orci phasellus egestas tellus. In vitae turpis massa sed elementum tempus egestas sed sed. Nulla malesuada pellentesque elit eget gravida cum sociis. Odio pellentesque diam volutpat commodo. In dictum non consectetur a erat. Turpis egestas integer eget aliquet nibh praesent tristique magna. Mauris cursus mattis molestie a iaculis at erat pellentesque. Ac tortor vitae purus faucibus ornare suspendisse sed. Mi in nulla posuere sollicitudin aliquam. Senectus et netus et malesuada fames ac. Sit amet tellus cras adipiscing enim. Sollicitudin aliquam ultrices sagittis orci a scelerisque. Amet dictum sit amet justo donec enim diam vulputate. Orci dapibus ultrices in iaculis nunc sed. Pellentesque habitant morbi tristique senectus et netus. Odio aenean sed adipiscing diam. Accumsan tortor posuere ac ut consequat. Lacinia quis vel eros donec ac odio tempor. Lorem mollis aliquam ut porttitor leo a. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus. Vitae suscipit tellus mauris a diam maecenas. In mollis nunc sed id semper risus in hendrerit. Pharetra vel turpis nunc eget lorem dolor sed viverra. Sit amet luctus venenatis lectus magna fringilla urna. Odio tempor orci dapibus ultrices in iaculis nunc. Pharetra vel turpis nunc eget lorem dolor sed viverra. Congue eu consequat ac felis. Dictum varius duis at consectetur lorem donec massa sapien faucibus. Ac tincidunt vitae semper quis lectus nulla at volutpat. Sit amet consectetur adipiscing elit. Aenean pharetra magna ac placerat vestibulum lectus mauris ultrices. At varius vel pharetra vel turpis nunc eget lorem. Non blandit massa enim nec dui. Fusce id velit ut tortor pretium viverra suspendisse. Et netus et malesuada fames ac. Ac tortor dignissim convallis aenean et tortor at risus viverra. Tincidunt eget nullam non nisi est sit amet facilisis. Odio pellentesque diam volutpat commodo sed egestas egestas. Laoreet sit amet cursus sit amet. Varius duis at consectetur lorem. Odio aenean sed adipiscing diam donec. Leo in vitae turpis massa sed elementum tempus. Id nibh tortor id aliquet. Turpis egestas pretium aenean pharetra magna ac placerat. Eget sit amet tellus cras adipiscing enim eu turpis. Mauris a diam maecenas sed. Quis hendrerit dolor magna eget est. Nam aliquam sem et tortor consequat. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus et. Gravida neque convallis a cras semper auctor neque.", bob.address);
    const dorothyBobMsg4Forward = server.process(dorothyAddressString, dorothyBobMsg4)["msg"];
    decoded = denim_proto.DenimMessage.decode(dorothyBobMsg4Forward);
    await bob.process(decoded);

    // Server processes *after* responding
    const denimMsg11 = denim_proto.DenimMessage.decode(Buffer.from(dorothyBobMsg4));
    await server._processChunks(dorothyAddressString, denimMsg11.chunks);
});