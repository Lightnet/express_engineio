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
var ByteBuffer = dcodeIO.ByteBuffer;
var Message = ProtoBuf.loadProtoFile("/example.proto").build("Message");
//console.log(ByteBuffer);
var engineio = eio('ws://localhost:3000');

var bb = new ByteBuffer()
            .writeIString("Hello world! Client!")
            .flip()
            .toBuffer();

engineio.on('open', function(){
    /*
    var byteBuffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
    var bb = byteBuffer.writeIString("Hello world!")
                                        .flip()
                                        .toBuffer();
    */
    engineio.send(bb);

    //engineio.send('pong');//send text string
    var msg = new Message('hello world message. client');
    engineio.send(msg.toArrayBuffer());
    //var buf = ProtoBuf(sample);
    //console.log(buf);
    engineio.on('message', function(data){
        console.log(data);//display data
        //console.log(ByteBuffer(data));
        try{
            var source = new ByteBuffer.wrap(data).flip().readIString();
            console.log(source);
            //console.log("pass");
        }catch(e){
            //console.log("error :" + e);
        }

        try{
            var msg = Message.decode(data);
            console.log("msg:" + msg.text);
        }catch(error){
            //console.log("error :"+error);
        }
    });
    engineio.on('close', function(){});
});

function send() {
    if (engineio != null) {
        var inputtext = document.getElementById('textinput');
        console.log(inputtext.value);
        var msg = new Message(inputtext.value);
        //var msg = new Message('hello world message.');
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
