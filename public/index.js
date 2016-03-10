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
//chart
var smoothie = new SmoothieChart();
// Data
var line1 = new TimeSeries();
//var line2 = new TimeSeries();
// Add to SmoothieChart
smoothie.addTimeSeries(line1);
//line1.append(new Date().getTime(), 0);
//make sure this load right
addListener("load", window,function(){
    //smoothie.streamTo(document.getElementById("mycanvas"));
    smoothie.streamTo(document.getElementById("mycanvas"), 1000 /*delay*/);
});

// Add a random value to each line every second
/*
setInterval(function() {
  line1.append(new Date().getTime(), Math.random());
}, 1000);
*/

// Initialize ProtoBuf.js
var ProtoBuf = dcodeIO.ProtoBuf;
var ByteBuffer = dcodeIO.ByteBuffer;
var Message = ProtoBuf.loadProtoFile("/example.proto").build("Message");
//console.log(ByteBuffer);
var engineio = eio('ws://localhost:3000');
/*
var bb = new ByteBuffer()
console.log(ByteBuffer.wrap(bb).capacity());
console.log(ByteBuffer.wrap(bb).compact());
console.log(bb);
bb.writeIString("Hello world! Client!");
console.log(bb);
bb.flip();
console.log(bb);
console.log(bb.readIString()+" from ByteBuffer.js");

console.log(ByteBuffer.wrap(bb).capacity());
console.log(ByteBuffer.wrap(bb).compact());

var source = new ByteBuffer.wrap(bb);//need to follow some orders from export and import

//var source = new ByteBuffer.wrap(bb).flip();
console.log("====");
console.log(source.readIString());
*/

/*
var bb = new ByteBuffer()
            .writeIString("Hello world! Client!")
            .flip()
            .toBuffer();

var src = new ByteBuffer.wrap(bb);
console.log("=====");
console.log(src);
console.log(src.length);
console.log("=====");
*/
console.log(ByteBuffer.DEFAULT_CAPACITY);

var last;

function send_Latency(){
  last = new Date;
  engineio.send('Latency');
  document.getElementById('transport').innerHTML = engineio.transport.name;
}

engineio.on('open', function(){

    send_Latency();
    /*
    var byteBuffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
    var bb = byteBuffer.writeIString("Hello world!")
                                        .flip()
                                        .toBuffer();
    */

    //var bb = new ByteBuffer().writeIString("Hello world! Client!").flip().toBuffer();
    //engineio.send(bb);

    //engineio.send('pong');//send text string
    var msg = new Message('hello world message. client');
    engineio.send(msg.toArrayBuffer());
    //var buf = ProtoBuf(sample);
    //console.log(buf);
    engineio.on('message', function(data){
        //console.log(data);//display data
        //this is to filter out the string name Latency
        if(data == 'Latency'){
            var latency = new Date - last;
            document.getElementById('latency').innerHTML = latency + 'ms';
            //if (time) time.append(+new Date, latency);
            line1.append(+new Date, latency)
            setTimeout(send_Latency, 100);
        }


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
    engineio.on('close', function(){
        if (smoothie) smoothie.stop();
        document.getElementById('transport').innerHTML = '(disconnected)';
    });
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

function send_buffer() {
    if (engineio != null) {
        var inputtext = document.getElementById('bufferinput');
        console.log(inputtext.value);
        var bb_text = new ByteBuffer()
                    .writeIString(inputtext.value)
                    .flip()
                    .toBuffer();
        engineio.send(bb_text);
        console.log("Sent: "+bb_text);
    } else {
        console.log("Not connected");
    }
}
