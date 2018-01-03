(function() {
  var Call, app, buffer, chartData, connect, db, event, express, handleOld, http, io, jade, millisForUpdates, millisUntilAbandon, millisUntilAllFlag, models, mongoose, port, socketEvent, socketListener, sys, updateChart, wSocket;
  sys = require("sys");
  http = require("http");
  event = require("events");
  io = require("socket.io");
  models = require("./models");
  mongoose = require("mongoose");
  connect = require("connect");
  express = require("express");
  jade = require("jade");
  Call = '';
  db = mongoose.connect("mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PW + "@dbh16.mongolab.com:27167/calls");
  models.defineModels(mongoose, function() {
    return Call = Call = mongoose.model('Call');
  });
  socketEvent = new event.EventEmitter();
  socketListener = socketEvent.addListener("new_call", function(data) {
    return wSocket.broadcast("result: " + data);
  });
  app = module.exports = express.createServer();
  app.configure(function() {
    return app.set('view engine', 'jade');
  }, app.set('views', "" + __dirname + "/views"), app.use(connect.bodyParser()), app.use(connect.static(__dirname + '/public')), app.use(express.cookieParser()), app.use(express.session({
    secret: "shhhhhhhhhhhhhh!"
  })), app.use(express.logger()), app.use(express.methodOverride()), app.use(app.router));
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return res.render('index', {
      locals: {
        title: 'Information Request'
      }
    });
  });
  app.get('/agent', function(req, res) {
    return Call.find({
      "status": {
        "$in": ["new", ""]
      }
    }, function(err, calls) {
      console.log(calls);
      if (err) {
        return err;
      }
      return res.render('agent', {
        locals: {
          title: "Agent",
          calls: calls
        }
      });
    });
  });
  app.get('/crc', function(req, res) {
    return Call.find({
      "allFlag": true,
      "status": {
        "$in": ["new", ""]
      }
    }, function(err, calls) {
      if (err) {
        return err;
      }
      return res.render('crc', {
        locals: {
          title: "CRC",
          calls: calls
        }
      });
    });
  });
  app.get('/charts', function(req, res) {
    return res.render('charts', {
      locals: {
        title: 'Charts'
      }
    });
  });
  port = process.env.PORT || 3000;
  app.listen(port);
  console.log("Express server listening on port " + (app.address().port));
  wSocket = io.listen(app);
  buffer = [];
  wSocket.on('connection', function(client) {
    return client.on('message', function(data) {
      var c, p;
      console.log(data);
      p = data;
      console.log(" this is p: " + JSON.stringify(p));
      if (p['callAction'] != null) {
        return c = Call.find({
          'tn': p.callAction.tn
        }, function(err, docs) {
          var d, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            d = docs[_i];
            if (d.status !== "new") {
              console.log("already being called");
            } else {
              d.status = "calling";
              d.save();
            }
            _results.push(wSocket.broadcast("call: " + (JSON.stringify(p))));
          }
          return _results;
        });
      } else if (p['callDelete'] != null) {
        console.log(p);
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
        p = JSON.parse(data);
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
        socketEvent.emit("new_call", JSON.stringify(c));
        return console.log("saved");
      }
    });
  });
  millisForUpdates = 1000 * 10;
  millisUntilAllFlag = 1000 * 555;
  millisUntilAbandon = 1000 * 1075;
  chartData = {};
  console.log("update: " + millisForUpdates + " allflag: " + millisUntilAllFlag + " abandon: " + millisUntilAbandon);
  handleOld = function() {
    var c, rightnow, statusToCheck, timeToCheck, x, _i, _len;
    rightnow = new Date();
    timeToCheck = new Date(rightnow.getTime() - millisUntilAllFlag);
    c = Call.find({
      'allFlag': false,
      'status': 'new',
      'createdOn': {
        "$lt": timeToCheck
      }
    }, function(err, docs) {
      var d, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        d = docs[_i];
        console.log("setting allFlag=true for " + d.name);
        d.allFlag = true;
        d.save();
        _results.push(wSocket.broadcast("crc_call:" + (JSON.stringify(d))));
      }
      return _results;
    });
    timeToCheck = new Date(rightnow.getTime() - millisUntilAbandon);
    c = Call.find({
      'status': 'new',
      'createdOn': {
        "$lt": timeToCheck
      }
    }, function(err, docs) {
      var ca, d, p, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        d = docs[_i];
        console.log("setting status=abandoned for " + d.name + ": " + d.createdOn + " : " + timeToCheck);
        d.status = 'abandoned';
        d.save();
        p = d;
        ca = {};
        ca.callAction = {};
        ca.callAction.tn = p.tn;
        console.log(ca);
        _results.push(wSocket.broadcast("ab_call: " + (JSON.stringify(ca))));
      }
      return _results;
    });
    statusToCheck = ["new", "calling", "called", "abandoned"];
    for (_i = 0, _len = statusToCheck.length; _i < _len; _i++) {
      x = statusToCheck[_i];
      updateChart(x);
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
        return wSocket.broadcast("chart: " + (JSON.stringify(chartData)));
      }
    });
  };
}).call(this);
