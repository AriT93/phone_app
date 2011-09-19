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
    wSocket.broadcast "result: #{data}"
httpServer = http.createServer (req,res)->
httpServer.listen "8910"
wSocket = io.listen httpServer
buffer = []

#socket.io codes...
wSocket.on 'connection', (client)->
#    wSocket.broadcast {announcement: client.sessionID + " from " + client.connection.remoteAddress + " connected to call routing"}

    client.on 'message', (data)->
        console.log data
        p = data
        #p = JSON.parse data
        console.log " this is p: " + p
        if p['callAction']?
            c = Call.find {'tn': p.callAction.tn}, (err,docs)->
                for d in docs
                    if d.status != "new"
#                        client.send {announcement: "allready being called"}
                    else
                        d.status = "calling"
                        d.save()
            wSocket.broadcast "call: #{p}"
        else if p['callDelete']?
            console.log p
            c = Call.find {'tn': p.callDelete.tn}, (err,docs) ->
                for d in docs
                    d.status = "called"
                    d.save()
        else
            p = JSON.parse data
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
#            client.send {announcement: "message saved"}
            socketEvent.emit "new_call", JSON.stringify(c)
            console.log "saved"

millisForUpdates = (1000 * 10)
millisUntilAllFlag = (1000 * 555)
millisUntilAbandon = (1000 * 1075)
chartData = {}

console.log "update: " + millisForUpdates + " allflag: " + millisUntilAllFlag + " abandon: " + millisUntilAbandon

handleOld = ->
    rightnow = new Date()
#    console.log rightnow.getTime() - millisUntilAllFlag
    timeToCheck = new Date(rightnow.getTime() - millisUntilAllFlag)
    c = Call.find { 'allFlag': false, 'status' : 'new', 'createdOn' : { "$lt" : timeToCheck}},
        (err, docs) ->
            for d in docs
                console.log "setting allFlag=true for " + d.name
                d.allFlag = true
                d.save()
                wSocket.broadcast "crc_call:#{JSON.stringify d}"
    timeToCheck = new Date(rightnow.getTime() - millisUntilAbandon)
    c = Call.find { 'status' : 'new', 'createdOn' : {"$lt": timeToCheck}},
        (err,docs) ->
            for d in docs
                console.log "setting status=abandoned for " + d.name + ": "  + d.createdOn + " : " + timeToCheck
                d.status = 'abandoned'
                d.save()
                p = d
                ca = {}
                ca.callAction = {}
                ca.callAction.tn = p.tn
                console.log ca
                wSocket.broadcast "ab_call: #{ca}"

    statusToCheck = ["new", "calling" , "called", "abandoned"]
    for x in statusToCheck
        updateChart x
    setTimeout(handleOld,millisForUpdates)

setTimeout(handleOld,millisForUpdates)

updateChart = (status)->
    c = Call.count { 'status': status},
    (err,count) ->
        if count isnt chartData[status]
            chartData[status] = count
            console.log  status + " = " + chartData[status]
            wSocket.broadcast "chart: #{JSON.stringify chartData}"
