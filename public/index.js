// cross browser way to add an event listener
function addListener(event, obj, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(event, fn, false);   // modern browsers
    } else {
        obj.attachEvent("on"+event, fn);          // older versions of IE
    }
}

console.log("All resources finished loading!");
if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
    throw(new Error("ProtoBuf.js is not present. Please see www/index.html for manual setup instructions."));
}else{
    console.log("dcodeIO file long, bytebuffer, and protobuf are loaded.");
}

// Initialize ProtoBuf.js
var ProtoBuf = dcodeIO.ProtoBuf;
var Message = ProtoBuf.loadProtoFile("/example.proto").build("Message");

var engineio = eio('ws://localhost:3000');

engineio.on('open', function(){
    this.send('pong');//send text string
    //var msg = new Message('hello world message.');
    //engineio.send(msg.toArrayBuffer());
    engineio.on('message', function(data){
        console.log(data);//display data
        try{
            var msg = Message.decode(data);
            console.log("msg:" + msg.text);
        }catch(error){
            console.log("error :"+error);
        }
    });
    engineio.on('close', function(){});
});

function send() {
    if (engineio != null) {
        var msg = new Message('hello world message.');
        //console.log(msg.toArrayBuffer());
        engineio.send(msg.toArrayBuffer());
        //engineio.send('test');
        console.log("Sent: "+msg.text);
    } else {
        console.log("Not connected");
    }
}

function requestmsg() {
    engineio.send('servermsg');
}
