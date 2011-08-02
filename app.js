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
            var c = Call.find({'tn': p.callAction.tn},function(err, docs){
                for(d in docs){
                  if(docs[d].status != ""){
                      client.send({announcement: "all ready being called"});
                  }else{
                      docs[d].status = "calling";
                      docs[d].save();
                  }
                }
            });
            console.log(p);
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
              c.status = 'new';
              c.allFlag = false;
              c.latitude = p.latitude;
              c.longitude = p.longitude;
              c.createdOn = new Date();
              c.save();
              client.send({announcement: "message saved"});
              socketEvent.emit("new_call",JSON.stringify(c));
            }
    });
});

var millisForTimeout   = 1000 *  15;
var millisUntilAllFlag = 1000 * 120;
var millisUntilAbandon = 1000 * 300;

setTimeout(handleOld, millisForTimeout);

function handleOld() {
  var c;
  var timeToCheck;
  var rightnow = new Date();
  // we want to query old calls, where allFlag is false.
  timeToCheck = new Date(rightnow.getTime() - millisUntilAllFlag);
  c = Call.find(
        {
          'allFlag'   : false,
          'status'    : 'new',
          'createdOn' : { $lt : timeToCheck }
        }, function(err, docs) {
             for (d in docs) {
               console.log("setting allFlag=true for " + docs[d].name);
               docs[d].allFlag = true;
               docs[d].save();
             }
           }
  );
  // we want to query really old calls.
  timeToCheck = new Date(rightnow.getTime() - millisUntilAbandon);
  c = Call.find(
        {
          'status'    : 'new',
          'createdOn' : { $lt : timeToCheck }
        }, function(err, docs) {
             for (d in docs) {
               console.log("setting status=abandoned for " + docs[d].name);
               docs[d].status = 'abandoned';
               docs[d].save();
               var p = docs[d];
               var ca = { };
               ca.callAction={ };
               ca.callAction.tn=p.tn;
               console.log(ca);
               wSocket.broadcast({call: [ca]});
             }
           }
  );
  setTimeout(handleOld, millisForTimeout);
}
