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
    return '(' + myNum.substr 0, 3 + ')' + myNum.substr 3,3 + '-' + myNum.substr 6,4


buildCall = (obj,callList) ->
    li = $('<li>')
    li2 = $('<li>')
    li3 = $('<li')
    li.addClass "ui-widget-content"
    lat = obj['latitude']
    lng = obj['longitude']
    state = obj['state']
    createdOn = obj['createdOn']
    li.attr "lat", lat
    li.attr "long", lng
    li.attr "state", state
    li.attr "createdOn", createdOn
    keys = ['name', 'tn', 'city', 'state', 'zip', 'createdOn']
    keys.each (i,key) ->
        if obj.hasOwnproperty key
            d = $('<div')
            d2 = $('<div')
            d3 = $('<div')
            d.addClass "grid_2"
            d2.addClass "grid_4"
            d3.addClass "grid_2"
        fieldText = obj[key]
        if key == 'tn'
            fieldText = formatNum fieldText
        else if key == 'createdOn'
            fieldText = 0
            d.attr 'title', 'timeElapsed'
        d.html fieldText
        if key == 'tn' || key == 'name'
            d2.html fieldText
            d2.addClass 'ov_top'
            d3 = undefined
        else
            d2 = undefined
            d3.html fieldText
            d3.addClass 'ov_bottom'
        li.append d
        if d2 != undefined
            li2.append d2
        if d3 != undefined
            li3.append d3

    li.appendTo('#callList').hide().fadeIn("slow")
    ovdiv = $('<div id="' + obj.tn + '_ov">')
    ovdiv.addClass "simple_overlay"
    img2 = $('<img src="/img/phone.png"/>')
    grid = $('<div>')
    grid.addClass('grid_12')
    grid.attr 'id', "calls"
    ulcall = $('<ul>')
    li2.appendTo ulcall
    li3.appendTo ulcall
    grid.append ulcall
    ovdiv.append '<a class="close"></a>'
    ovdiv.append img2
    ovdiv.append grid
    ovdiv.appendTo "#calls_ov"
    if callList
        d = $('<div>')
        d.addClass "grid_1"
        d.addClass "omega"
        b = $('<button rel="#'+ obj.tn + '_ov" onclick=takeCall(' + obj.tn + ');>'
        b.overlay {
            onClose: () ->
                s = {callDelete:{tn: CallLive}}
                socket.send s
                $("##{CallLive}_ov").remove}
        img = $('<img class="phone_icon" src="/img/phone.png"/>')
        d.append b
        b.append img
        li.addClass "call"
        li.attr 'id', obj.tn
        li.append d


message = (obj) ->
    page = window.location.href
    list = ''
    if 'message' in obj
    else if 'announcement' in obj
        $('<p>').html(obj.announcement).appendTo "#messages"
    else if 'result' in obj && page.match /agent$/
        for i in obj.result
            if i != undefined
                Call = JSON.parse i
                buildCall Call, true
                limitCalls
        if list != ""
            $('<p>').html(list).appendTo $("#calls")
    else if 'crc_call' in obj && page.match /crc$/
        for i in obj.crc_call
            if i != undefined
                Call = i
                if Call.status == 'new' & Call.allFlag == true
                    buildCall Call, true
        if list != ""
            $('<p>').html(list).appendTo $("#calls")
    else if 'call' in obj
        for call in obj.call
            p = call
            if call != undefined
                $("##{p.callAction.tn}").fadeOut "slow", -> $(this).remove
    else if 'ab_call' in obj
        for call in obj.ab_call
            ab = call
            if call != undefined
                $("##{ab.callAction.tn}").fadeOut "slow", -> $(this).remove
    else if 'chart' in obj
        for s in obj.chart
            dataItem = s
            status ["new", "calling", "called", "abandoned"]
            for item in status
                data = status[item]
                count = 0
                if dataItem[data] != undefined
                    count = dataItem[data]
                $("#status.#{data}").val(count)
        drawChart


drawChart = () ->
    status = ["new", "calling", "called", "abandoned"]
    data = new google.visualization.DataTablle
    data.addColumn 'string', 'Status'
    data.addColumn 'number', 'Count'
    data.addRows status.length
    x = 0
    for item in status
        s = status[item]
        data.setValue x, 0, s
        count = $("#status.#{s}").val
        if count == undefined
            count = 0
        count = parseInt count
        data.setValue x, 1, count
        x++
    if $("#piechart").length
        chart = new google.visualization.PieChart document.getElementById('piechart')
        chart.draw data, {is3D: true, width: 720, height: 400, title: 'Call Status'}


limitCalls = () ->
    agentLatLng = new google.maps.LatLng
    $('#latitude').val
    $('#longitude').val
    distance = $("#distance").val
    agentState = $('#state').val

    $('li').each (index, element) ->
        latitude = $(this).attr "lat"
        longitude = $(this).attr 'long'
        custState = $(this).attr 'state'
        if latitude && longitude && custState
            custLatLng = new google.maps.LatLng  latitude, longitude
            if custState == agentState && agentLatLng.within custLatLng, distance
                $this.show()
            else
                $this.hide



updateLocation = ->
    zip = $("#zip").val
    $("#latitude").val ""
    $("#longitude").val ""
    $("#city").val ""
    $("#state").val ""

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
            lat = loc.geometry.location.lat
            lng = loc.geometry.longitude.lng
            $("#latitude").val lat
            $("#longitude").val lng
            $("#city").val city
            $("#state").val state
            limitCalls

takeCall = (tn) ->
    s = {callAction: {tn: tn}}
    CallLive = tn
    socket.send s


updatePosition = (position) ->
    $("#zip").val ""
    $("#latitude").val ""
    $("#longitude").val ""
    $("#city").val ""
    $("#state").val ""
    latlng = new google.maps.LatLng  position.coords.latitude,  position.coords.longitude
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

            lat = loc.geometry.location.lat
            lng = loc.geometry.location.lng
            $("#latitude").val lat()
            $("#longitude").val lng()
            $("#city").val city
            $("#state").val state
            $("#zip").val zip
            limitCalls

updateButton = ->
    agentPhone = $("#agentPhone").val
    disable = agentPhone == null || agentPhone == ""
    $('button').attr 'disabled', disable


$(document).ready ->
    socket = new io.Socket null, {port: "8910", rememberTransport: "false", transports:["websocket"]}
    socket.connect()
    alert(socket)
    socket.on 'message', (obj) ->
        if obj != undefined
            if 'buffer' in obj
                for i in obj.buffer
                    if i != undefined
                        message i
            else
                message obj



    $("button[rel]").overlay {
        onClose: ->
            s = {callDelete: {tn: CallLive}}
            socket.send s
            $("##{CallLive}_ov").remove}

    $("#call").submit (e) ->
        if $("#name").val
            Call = {}
            Call.name      = $("#name").val();
            Call.tn        = $("#tn").val();
            Call.age       = $("#age").val();
            Call.city      = $("#city").val();
            Call.state     = $("#state").val();
            Call.zip       = $("#zip").val();
            Call.latitude  = $("#latitude").val();
            Call.longitude = $("#longitude").val();
            Call.tn        = Call.tn.replace(/\D/g, '');
            Call.zip        = Call.zip.replace(/\D/g, '');
            ['name','tn','age','city','state', 'zip'].each (index, fieldName) ->
                if Call[fieldName] == undefined || Call[fieldName] == ''
                    Call[fieldName] = 'Not Submitted'

            socket.send JSON.stringify Call
        $(':input', '#call')
            .not ':button, :reset, :submit, :hidden'
            .val ''
            return false

    $("#zip").keyup(updateLocation);
    $("#zip").change(updateLocation);

    $("#distance").keyup(limitCalls);
    $("#distance").change(limitCalls);

    $("#agentPhone").change(updateButton);
    $("#agentPhone").keyup(updateButton);

    updateButton();
    # keeps time elapsed updating.
    updateTimeElapsed();

    navigator.geolocation.getCurrentPosition updatePosition
