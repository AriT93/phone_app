var sys = require('sys');
var http = require('http');
var event = require('events');
var io = require('socket.io');
var models = require('./models');
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
    this.broadcast({announcement: client.sessionId +" from " + client.connection.remoteAddress + " connected to call routing"});

    client.on('message', function(data){
        if(buffer.length > 5)buffer.shift();
        var p = JSON.parse(data);
        console.log(JSON.stringify(p));
        if("callAction" in p){
            var c = Call.find({'tn': p.callAction.tn},function(){
                for(d in docs){
                  if(docs[d].status != ""){
                      client.send({announcement: "all ready being called"});
                  }else{
                      docs[d].status = "calling";
                      docs[d].save();
                  }
                }
            });
            wSocket.broadcast({call: [p]});
        }else if("callDelete" in p){
            var c = Call.find({'tn': p.callDelete.tn},function(err,docs){
                for(d in docs){
                    docs[d].status = "called";
                    docs[d].save();
                }
            });
            console.log(JSON.stringify(c));

          }else{
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
            }
    });
});
