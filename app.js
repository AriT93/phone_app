(function() {
  var Call, buffer, chartData, db, event, handleOld, http, httpServer, io, millisForUpdates, millisUntilAbandon, millisUntilAllFlag, models, mongoose, socketEvent, socketListener, sys, updateChart, wSocket;
  sys = require("sys");
  http = require("http");
  event = require("events");
  io = require("socket.io");
  models = require("./models");
  mongoose = require("mongoose");
  Call = '';
  db = mongoose.connect("mongodb://localhost/test");
  models.defineModels(mongoose, function() {
    return Call = Call = mongoose.model('Call');
  });
  socketEvent = new event.EventEmitter();
  socketListener = socketEvent.addListener("new_call", function(data) {
    return wSocket.broadcast({
      result: [data]
    });
  });
  httpServer = http.createServer(function(req, res) {});
  httpServer.listen("8910");
  wSocket = io.listen(httpServer);
  buffer = [];
  wSocket.on('connection', function(client) {
    wSocket.broadcast({
      announcement: client.sessionID + " from " + client.connection.remoteAddress + " connected to call routing"
    });
    return client.on('message', function(data) {
      var c, p;
      if (buffer.length > 5) {
        buffer.shift();
      }
      p = JSON.parse(data);
      if (p['callAction'] != null) {
        c = Call.find({
          'tn': p.callAction.tn
        }, function(err, docs) {
          var d, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            d = docs[_i];
            _results.push(d.status !== "new" ? client.send({
              announcement: "all ready being called"
            }) : (d.status = "calling", d.save()));
          }
          return _results;
        });
        return wSocket.broadcast({
          call: [p]
        });
      } else if (p["callDelete"] != null) {
        return c = Call.find({
          'tn': p.callDelete.tn
        }, function(err, docs) {
          var d, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            d = docs[_i];
            d.status = "called";
            _results.push(d.save());
          }
          return _results;
        });
      } else {
        c = new Call();
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
        client.send({
          announcement: "message saved"
        });
        return socketEvent.emit("new_call", JSON.stringify(c));
      }
    });
  });
  millisForUpdates = 1000 * 10;
  millisUntilAllFlag = 1000 * 55;
  millisUntilAbandon = 1000 * 75;
  chartData = {};
  handleOld = function() {
    var c, rightnow, statusToCheck, timeToCheck, x, _i, _len;
    rightnow = new Date();
    timeToCheck = new Date(rightnow.getTime() - millisUntilAllFlag);
    c = Call.find({
      'allFlag': false,
      'status': 'new',
      'createdOn': {
        $lt: timeToCheck
      }
    }, function(err, docs) {
      var d, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        d = docs[_i];
        if (timeToCheck > d.createdOn) {
          console.log(timeToCheck - d.createdOn);
        }
        console.log("setting allFlag=true for " + d.name + " : " + d.createdOn);
        d.allFlag = true;
        d.save();
        _results.push(wSocket.broadcast({
          crc_call: [d]
        }));
      }
      return _results;
    });
    timeToCheck = Date(rightnow.getTime() - millisUntilAbandon);
    console.log(new Date(timeToCheck));
    c = Call.find({
      'status': 'new',
      'createdOn': {
        $lt: timeToCheck
      }
    }, function(err, docs) {
      var ca, d, p, _i, _len, _results;
      if (err != null) {
        console.log("error: " + err);
      }
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        d = docs[_i];
        if (timeToCheck > d.createdOn) {
          console.log(timeToCheck - d.createdOn);
        } else {
          console.log("what?  ");
        }
        console.log("setting status=abandoned for " + d.name + " : " + d.createdOn);
        d.status = 'abandoned';
        d.save();
        p = d;
        ca = {};
        ca.callAction = {};
        ca.callAction.tn = p.tn;
        console.log(ca);
        _results.push(wSocket.broadcast({
          ab_call: [ca]
        }));
      }
      return _results;
    });
    statusToCheck = ["new", "calling", "called", "abandoned"];
    for (_i = 0, _len = statusToCheck.length; _i < _len; _i++) {
      x = statusToCheck[_i];
      updateChart(statusToCheck[x]);
    }
    return setTimeout(handleOld, millisForUpdates);
  };
  setTimeout(handleOld, millisForUpdates);
  updateChart = function(status) {
    var c;
    return c = Call.count({
      'status': status
    }, function(err, count) {
      if (count !== chartData[status]) {
        chartData[status] = count;
        console.log(status + " = " + chartData[status]);
        return wSocket.broadcast({
          chart: [chartData]
        });
      }
    });
  };
}).call(this);
