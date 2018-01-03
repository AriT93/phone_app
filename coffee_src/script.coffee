socket = ""
CallLive = ""

validPhoneNum = (myNum) ->
    if myNum == undefined
        return false
    myNum = myNum.replace /\D+/g, ""

    if myNum.length > 11 or myNum.length < 10
        return false

    if myNum.length == 11
        if myNum.substr( 0,1) != '1'
            return false
        myNum = myNum.substr 1, 10

    if myNum.substr 0,1 == '1' || myNum.substr 0,1 == '0'
        ieturn false

    return myNum

formatNum = (myNum) ->
    return '(' + myNum.substr(0, 3) + ')' + myNum.substr(3,3)  + '-' + myNum.substr(6,4)


populateCallLine = (callLine, obj)->


buildCall = (obj,callList) ->
    li = new CallLine(obj)
    li.addClass "ui-widget-content"
    lat = obj['latitude']
    lng = obj['longitude']
    state = obj['state']
    createdOn = obj['createdOn']
    li.attr "lat", lat
    li.attr "long", lng
    li.attr "state", state
    li.attr "createdOn", createdOn
    li.getOV()
    li.getLine().appendTo('#callList').hide().fadeIn("slow")

typeAndContent = (message) ->
    [ignore, type, content] = message.match /(.*?):(.*)/
    {type,content}

message = (message) ->
    page = window.location.href
    list = ''
    {type, content} = typeAndContent message
    switch type
        when 'result'
            if page.match /agent/
                Call = JSON.parse content
                buildCall Call, true
                limitCalls()
                if list != ""
                    $('<p>').html(list).appendTo "#messages"
        when 'crc_call'
            if page.match /crc/
                Call = JSON.parse content
                if Call.status == 'new' & Call.allFlag == true
                    buildCall Call, true
                if list != ""
                    $('<p>').html(list).appendTo $("#calls")
        when 'call'
            p = JSON.parse content
            $("#" + p.callAction.tn).fadeOut "slow", -> $(this).remove()
        when 'ab_call'
            ab = JSON.parse content
            $("#"+ab.callAction.tn).fadeOut "slow", -> $(this).remove()
        when 'chart'
            if page.match /charts/
                dataItem = JSON.parse content
                status = ["new", "calling", "called", "abandoned"]
                for item in status
                    count = 0
                    if dataItem[item] != undefined
                        count = dataItem[item]
                    $("#status\\." + item).val count
                drawChart()

drawChart = () ->
    status = ["new", "calling", "called", "abandoned"]
    data = new google.visualization.DataTable()
    data.addColumn 'string', 'Status'
    data.addColumn 'number', 'Count'
    data.addRows status.length
    x = 0
    for item in status
        data.setValue x, 0, item
        count = $('#status\\.' + item).val()
        if count is undefined
            count = 0
        count = parseInt count
        data.setValue x, 1, count
        x++
    if $('#piechart').length
        chart = new google.visualization.PieChart document.getElementById 'piechart'
    chart.draw data, {is3D: true, width: 720, height: 400, title: 'Call Status'}


limitCalls = () ->
    agentLatLng = new google.maps.LatLng $('#latitude').val(), $('#longitude').val()
    distance = $('#distance').val()
    agentState = $('#state').val()
    $('li').each (index, element) ->
        latitude = $(this).attr 'lat'
        longitude = $(this).attr 'long'
        custState = $(this).attr 'state'
        if latitude && longitude && custState
            custLatLng = new google.maps.LatLng latitude, longitude
            if custState == agentState && agentLatLng.within custLatLng, distance
                $(this).show()
            else
                $(this).hide()



updateLocation = ->
    zip = $('#zip').val()
    $('#latitude').val ""
    $('#longitude').val ""
    $('#city').val ""
    $('#state').val ""
    if zip.length >= 5
        lookupLocation zip, (loc) ->
            city = ""
            state = ""
            $.each loc.address_components, (i,v) ->
                if $.inArray("locality", v.types) > -1
                    city = v.short_name
                else if $.inArray("sublocality", v.types) > -1
                    city = v.short_name
                if $.inArray("administrative_area_level_1", v.types) > -1
                    state = v.short_name
            lat = loc.geometry.location.lat()
            lng = loc.geometry.location.lng()
            $('#latitude').val(lat)
            $('#longitude').val(lng)
            $('#city').val(city)
            $('#state').val(state)
            limitCalls()

takeCall = (tn) ->
    s = {callAction: {tn: tn}}
    CallLive = tn
    socket.json.send s


updatePosition = (position) ->
    $('#zip').val ""
    $('#latitude').val ""
    $('#longitude').val ""
    $('#city').val ""
    $('#state').val ""
    latlng = new google.maps.LatLng position.coords.latitude,  position.coords.longitude
    if latlng != null
        lookupPosition latlng, (loc)->
            city = ""
            state = ""
            zip = ""
            $.each loc.address_components, (i,v) ->
                if $.inArray("locality", v.types) > -1
                    city = v.short_name
                else if $.inArray( "sublocality", v.types ) > -1
                    city = v.short_name
                if $.inArray("administrative_area_level_1", v.types  ) > -1
                    state = v.short_name
                if $.inArray("postal_code", v.types) > -1
                    zip = v.short_name
            lat = loc.geometry.location.lat()
            lng = loc.geometry.location.lng()
            $('#latitude').val(lat)
            $('#longitude').val(lng)
            $('#city').val(city)
            $('#state').val(state)
            $('#zip').val(zip)
            limitCalls()

updateButton = ->
    agentPhone = $("#agentPhone").val()
    disable = agentPhone == null || agentPhone == ""
    $('button').attr 'disabled', disable


$(document).ready ->
#    socket = new io.Socket null, { rememberTransport: "false", transports:["websocket","xhr-multipart","flashsocket"]}
 #   socket.connect()
    socket = io.connect()
    socket.on 'message', message

    $('button[rel]').overlay {
        onClose: ->
            s = {callDelete: {tn: CallLive}}
            socket.json.send s
            $('#' + CallLive + '_ov').remove()
        }

    $('#call').submit (e) ->
        if $("#name").val()
            Call = {}
            Call.name      = $('#name').val();
            Call.tn        = $('#tn').val();
            Call.age       = $('#age').val();
            Call.city      = $('#city').val();
            Call.state     = $('#state').val();
            Call.zip       = $('#zip').val();
            Call.latitude  = $('#latitude').val();
            Call.longitude = $('#longitude').val();
            Call.tn        = Call.tn.replace(/\D/g, '');
            Call.zip        = Call.zip.replace(/\D/g, '');
            socket.json.send JSON.stringify Call
            $(':input', '#call').not(':button, :reset, :submit, :hidden, #city, #state, #zip').val ''
            return false

    $('#zip').keyup(updateLocation)
    $('#zip').change(updateLocation)

    $('#distance').keyup(limitCalls)
    $('#distance').change(limitCalls)

    $('#agentPhone').change(updateButton)
    $('#agentPhone').keyup(updateButton)

    updateButton()
    # keeps time elapsed updating.
    updateTimeElapsed()

    navigator.geolocation.getCurrentPosition(updatePosition)
    if window.location.hash && window.location.hash.match(/autopopulate/i)
        autoPopulate()