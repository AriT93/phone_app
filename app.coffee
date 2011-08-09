sys = require "sys"
http = require "http"
event = require "events"
io = require "socket.io"
models = require "./models"
mongoose = require "mongoose"

Call=''

db = mongoose.connect "mongodb://localhost/test"

models.defineModels mongoose, ()->
    Call = Call = mongoose.model 'Call'

socketEvent = new event.EventEmitter()


socketListener = socketEvent.addListener "new_call", (data)->
    wSocket.broadcast {result: [data]}

httpServer = http.createServer (req,res)->

httpServer.listen "8910"


wSocket = io.listen httpServer
buffer = []


wSocket.on 'connection', (client)->
    wSocket.broadcast {announcement: client.sessionID + " from " + client.connection.remoteAddress + " connected to call routing"}


    client.on 'message', (data)->
        if buffer.length > 5
            buffer.shift()
        p = JSON.parse data
        if p['callAction']?
            c = Call.find {'tn': p.callAction.tn}, (err,docs)->
                for d in docs
                    if d.status != "new"
                        client.send {announcement: "all ready being called"}
                    else
                        d.status = "calling"
                        d.save()
            wSocket.broadcast {call: [p]}
        else if p["callDelete"]?
            c = Call.find {'tn': p.callDelete.tn}, (err,docs) ->
                for d in docs
                    d.status = "called"
                    d.save()
        else
            c = new Call()
            c.name = p.name
            c.age = p.age
            c.tn = p.tn
            c.city = p.city
            c.state = p.state
            c.zip = p.zip
            c.status = 'new'
            c.allFlag = false;
            c.latitude = p.latitude
            c.longitude = p.longitude
            c.createdOn = new Date()
            c.save()
            client.send {announcement: "message saved"}
            socketEvent.emit "new_call", JSON.stringify(c)

millisForUpdates   = 1000 *  10;
millisUntilAllFlag = 1000 * 55;
millisUntilAbandon = 1000 * 75;

chartData = {}

handleOld = ->
    rightnow = new Date()
    timeToCheck = new Date(rightnow.getTime() - millisUntilAllFlag)
    c = Call.find { 'allFlag': false, 'status' : 'new', 'createdOn' : { $lt : timeToCheck}},
        (err, docs) ->
            for d in docs
                console.log "setting allFlag=true for " + d.name
                d.allFlag = true
                d.save()
                wSocket.broadcast {crc_call: [d]}
    timeToCheck = new Date(rightnow.getTime() - millisUntilAbandon)
    c = Call.find { 'status' : 'new', 'createdOn' : {$lt: timeToCheck}},
        (err,docs) ->
            for d in docs
                console.log "setting status=abandoned for " + d.name
                d.status = 'abandoned'
                d.save()
                p = d
                ca = {}
                ca.callAction = {}
                ca.callAction.tn = p.tn
                console.log ca
                wSocket.broadcast {ab_call: [ca]}

    statusToCheck = ["new", "calling" , "called", "abandoned"]
    for x in statusToCheck
        console.log x + " : checking"
        updateChart(x)
    setTimeout(handleOld,millisForUpdates)

setTimeout(handleOld,millisForUpdates)


updateChart = (status)->
    c = Call.count { 'status': status},
    (err,count) ->
        if count != chartData[status]
            chartData[status] = count
            console.log "charting: " +  status + " = " + chartData[status]
            wSocket.broadcast {chart: [chartData]}
