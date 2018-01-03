sys = require "util"
http = require "http"
event = require "events"
io = require "socket.io"
models = require "./models"
mongoose = require "mongoose"
connect = require "connect"
express = require "express"
jade = require "jade"



Call=''
#db = mongoose.connect "mongodb://localhost/test", (error)->
#        if error
#                console.log "failed to connect " + error
#        else
#            console.log "connected"
                        
#db = mongoose.connect "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PW + "@dbh16.mlab.com:27167/calls",{useMongoClient: true, user: process.env.MONGO_USER, pass: process.env.MONGO_PW}
#db = mongoose.connect "mongodb://dbh16.mlab.com:27167/calls",{useMongoClient: true, user: process.env.MONGO_USER, pass: process.env.MONGO_PW}
uri = "mongodb://phone_app:phone_app@dbh16.mlab.com:27167/calls"
db = mongoose.connect(uri, (err)->
        if err
                console.log "error connecting " + err
        else
                console.log "connected"
        )
mongoose.connection.on 'error', (error)->
                console.log "failed to connect " + error

#mongoose.Promise = global.Promise
#db = mongoose.connect "mongodb://phone_app:phone_app@dbh16.mlab.com:27167/calls"
#"mongodb://localhost/test"
models.defineModels mongoose, ()->
    Call = Call = mongoose.model 'Call'



socketEvent = new event.EventEmitter()
socketListener = socketEvent.addListener "new_call", (data)->
    wSocket.sockets.send "result: #{data}"

app = module.exports = express.createServer()

# CONFIGURATION

app.configure(() ->
    app.set 'view engine', 'jade'
    app.set 'views', "#{__dirname}/views"

    app.use connect.bodyParser()
    app.use connect.static(__dirname + '/public')
    app.use express.cookieParser()
    app.use express.session({secret : "shhhhhhhhhhhhhh!"})
    app.use express.logger()
    app.use express.methodOverride()
    app.use app.router
)

app.configure 'development', () ->
    app.use express.errorHandler({
        dumpExceptions: true
        showStack     : true
    })

app.configure 'production', () ->
    app.use express.errorHandler()


# ROUTES

app.get '/', (req, res) ->
    res.render 'index',
        locals:
            title: 'Information Request'

app.post '/', (req, res) ->
    c = new Call()
    c.name = req.param 'name'
    c.age = req.param 'age'
    c.tn = req.param 'tn'
    c.city = req.param 'city'
    c.state = req.param 'state'
    c.zip = req.param 'zip'
    c.status = 'new'
    c.allFlag = false;
    c.latitude = req.param 'latitude'
    c.longitude = req.param 'longitude'
    c.createdOn = new Date()
    c.save( (err)->
            if err
                    console.log "there was a problem: " + err
            else
                    console.log "saved!"
        )
    console.log "Express server listening on port #{app.address().port}"
    socketEvent.emit "new_call", JSON.stringify(c)
    res.redirect('/')


app.get '/agent', (req, res) ->
    Call.find {"status": {"$in": ["new",""]}},(err, calls) ->
        if err
            return err
        res.render 'agent',
            locals:
                title: "Agent",
                calls: calls

app.get '/crc', (req, res) ->
    Call.find { "allFlag": true, "status": {"$in": ["new",""]}},(err, calls) ->
        if err
            return err
        res.render 'crc',
            locals:
                title: "CRC",
                calls: calls

app.get '/charts',(req, res) ->
    res.render 'charts',
        locals:
            title: 'Charts'


# SERVER
port = process.env.PORT || 3000
app.listen(port)
console.log "Express server listening on port #{app.address().port}"


#httpServer = http.createServer (req,res)->
#httpServer.listen "8910"
wSocket = io.listen app
#configure socket.io
#

wSocket.configure ()->
    wSocket.enable 'browser client minification'
    wSocket.set 'transports', ['xhr-polling', 'jsonp-polling','htmlfile','flashsocket']
    wSocket.set 'log level',2
    wSocket.set 'polling duration', 10

#socket.io codes...
wSocket.sockets.on 'connection', (client)->
#    wSocket.broadcast {announcement: pclient.sessionID + " from " + client.connection.remoteAddress + " connected to call routing"}
    client.on 'message', (data)->
        p = data
        if p['callAction']?
            c = Call.find {'tn': p.callAction.tn}, (err,docs)->
                for d in docs
                    if d.status != "new"
                    else
                        d.status = "calling"
                        d.save()
                    wSocket.sockets.send "call: #{JSON.stringify p}"
        else if p['callDelete']?
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
            c.save( (err) ->
                    if err
                            console.log "there was an error: " + err
                    else
                            console.log "saved a call"
                )
            socketEvent.emit "new_call", JSON.stringify(c)

millisForUpdates = (1000 * 10)
millisUntilAllFlag = (1000 * 30)
millisUntilAbandon = (1000 * 60)
chartData = {}

handleOld = ->
    rightnow = new Date()
    timeToCheck = new Date(rightnow.getTime() - millisUntilAllFlag)
    c = Call.find { 'allFlag': false, 'status' : 'new', 'createdOn' : { "$lt" : timeToCheck}},
        (err, docs) ->
            if docs
                for d in docs
                    d.allFlag = true
                    d.save()
                    wSocket.sockets.send "crc_call:#{JSON.stringify d}"
    timeToCheck = new Date(rightnow.getTime() - millisUntilAbandon)
    c = Call.find { 'status' : 'new', 'createdOn' : {"$lt": timeToCheck}},
        (err,docs) ->
            if docs
                for d in docs
                    d.status = 'abandoned'
                    d.save()
                    p = d
                    ca = {}
                    ca.callAction = {}
                    ca.callAction.tn = p.tn
                    wSocket.sockets.send "ab_call: #{JSON.stringify ca}"
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
    wSocket.sockets.send "chart: #{JSON.stringify chartData}"
