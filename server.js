var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var ProtoBuf = require("protobufjs");
var ByteBuffer = ProtoBuf.ByteBuffer; // ProtoBuf.js uses and also exposes ByteBuffer.js
var Long = ProtoBuf.Long;  // as well as Long.js (not used in this example)

//file for index.html
app.use("/", express.static('./public'));

//load engine.io.js script from engine.io-client package
app.get('/engine.io.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/node_modules/engine.io-client/engine.io.js'));
});

// Initialize from .proto file
var builder = ProtoBuf.loadProtoFile(path.join(__dirname, "/public", "example.proto")),
    Message = builder.build("Message");

var engine = require('engine.io');
var engineio = new engine.Server({ 'transports': ['websocket', 'polling'] });
engineio.attach(http);
//console.log(engineio);
//console.log(ByteBuffer);
var bb = new ByteBuffer()
            .writeIString("Hello world! Server!")
            .flip()
            .toBuffer();

//console.log(bb.readIString()+" from bytebuffer.js");
//console.log(bb.toArrayBuffer());
//console.log(bb.toBuffer());
console.log(bb);

engineio.on('connection', function (socket) {
    console.log("server data...");
    //console.log(bb);
    socket.send(bb);


    //socket.send('ping');//send text string
    //socket.send(bb.toArrayBuffer());
    var smsg = new Message("server message. server");
    socket.send(smsg.toArrayBuffer());
    //console.log(smsg);

    socket.on('message', function (data) {
        console.log("client data...");
        console.log(data);
        try {
            var source = new ByteBuffer.wrap(data).flip().readIString();
            console.log(source);
        } catch (err) {
            //console.log("server side...");
            //console.log("Processing failed:", err);
        }

        try {
            // Decode the Message
            var msg = Message.decode(data);
            console.log("Received: "+msg.text);
            // Transform the text to upper case
            //msg.text = msg.text.toUpperCase();
            // Re-encode it and send it back
            socket.send(msg.toBuffer());
            console.log("Sent: "+msg.text);
        } catch (err) {
            //console.log("server side...");
            //console.log("Processing failed:", err);
        }

        if(data == 'servermsg'){
            var smsg = new Message("request server message");
            socket.send(smsg.toArrayBuffer());
        }

    });
    socket.on('close', function () {
        console.log("close");
    });
    console.log("connected...");
    //socket.send(new Buffer([0, 1, 2, 3, 4, 5]));
});

var HOSTIP = process.env.IP || "0.0.0.0";
var HOSTPORT = process.env.PORT || 3000;
http.listen(HOSTPORT, HOSTIP, function () {
    console.log('listening on:' + HOSTIP + ':' + HOSTPORT);
    console.log(new Date());
});
