# express_engineio

 Created by: Lightnet

 license:CCO

  Information:
By using the express, engine.io, engine.io-client
and protobufjs to handle nodejs server and web
browser access wrap around the web socket connection
in bi-directional connection.

Sharing libraries to must have bi-directional
connection to have same functions that share nodejs
and javascript browser to able to code and decode
binary buffer data.

The library that I used is protobufjs to send and
receive object class message style. This is simple
build of the engine.io.

 Nodejs packges:
  * Express
  * Engine.io
  * Engine.io-client
  * protobufjs

 Web browser libraries:
  * long.min.js (load order 1)
  * bytebuffer.min.js (load order 2)
  * protobuf.min.js (load order 3)
  * engine.io.js (from npm engine.io-client)
  * smoothie.js (display chart)

  Note the long, bytebuffer, and protobuf has to load
 in order for html script to work.

[build & run]
```
cmd line

npm install

node server.js
```

 Base Examples from:
  * https://github.com/socketio/engine.io/tree/master/examples/latency
  * https://github.com/dcodeIO/protobuf.js/tree/master/examples/websocket
  * https://github.com/dcodeIO/bytebuffer.js/tree/master/tests
  * http://smoothiecharts.org/

Credits:
 * Playcanvas tanx game.
 * https://github.com/dcodeIO/bytebuffer.js
 * https://github.com/dcodeIO/ProtoBuf.js
 * https://github.com/socketio/engine.io
 * https://github.com/socketio/engine.io-client
