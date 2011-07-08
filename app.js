
require.paths.unshift('.');

var sys = require('sys');
var http = require('http');
var event = require('events');
var io = require('socket.io');
var models = require('models');
var mongoose = require('mongoose');
var Call;
var db = mongoose.connect("mongodb://localhost/test");

models.defineModels(mongoose, function(){
    Call = Call = mongoose.model('Call');
});


var socketEvent = new event.EventEmitter();
var socketListener = socketEvent.addListener("new_call",function(data){
    wSocket.broadcast({result: [data]});
});

var httpServer = http.createServer(function(request, response){

});

httpServer.listen(8910);

var wSocket = io.listen(httpServer), buffer = [];

wSocket.on('connection', function(client){
    console.log("connected!");
    this.broadcast({announcement: client.sessionId +" from " + client.connection.remoteAddress + " connected to call routing"});
    // var c1 = new Call();
    // c1.name = "robert";
    // c1.tn = "3128675309";
    // socketEvent.emit("new_call",JSON.stringify(c1));

    client.on('message', function(data){
        if(buffer.length > 5)buffer.shift();
        var p = JSON.parse(data);
          var c = new Call();
            c.name = p.name;
            c.age = p.age;
            c.tn = p.tn;
            c.city = p.city;
            c.state = p.state;
            c.zip = p.zip;
            c.latitude = p.latitude;
            c.longitude = p.longitude;
            c.save();
            client.send({announcement: "message saved"});
            socketEvent.emit("new_call",JSON.stringify(c));

    });
});
