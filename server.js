var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

//file for index.html
app.use("/", express.static('./public'));

//load engine.io.js script from engine.io-client package
app.get('/engine.io.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/node_modules/engine.io-client/engine.io.js'));
});

var engine = require('engine.io');
var engineio = new engine.Server({ 'transports': ['websocket', 'polling'] });

//add engine.io to http to handle request
engineio.attach(http);
console.log(engineio);

engineio.on('connection', function (socket) {
    socket.send('ping');//send text string
    socket.on('message', function (data) {
        console.log(data);
    });
    socket.on('close', function () {
        console.log("close");
    });
    console.log("connected...");
    socket.send(new Buffer([0, 1, 2, 3, 4, 5]));
});

var HOSTIP = process.env.IP || "0.0.0.0";
var HOSTPORT = process.env.PORT || 3000;
http.listen(HOSTPORT, HOSTIP, function () {
    console.log('listening on:' + HOSTIP + ':' + HOSTPORT);
    console.log(new Date());
});
