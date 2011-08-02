/* Author:

*/

var socket;

function buildCall(obj,callList){
    var li = $('<li>');
    var li2 = $('<li>');
    var bad = ['_id', 'latitude','longitude','age', 'state'];
    var keys = ['name','tn','city','state','zip'];
    $.each(keys,function(i,key) {
      if(obj.hasOwnProperty(key)){
        var d = $('<div>');
        var d2 = $('<div>');
        d.addClass("grid_2");
        d2.addClass("grid_2");
        if(i == 0){
          d.addClass('alpha');
          d2.addClass('alpha');
        }
        d.html(obj[key]);
        d2.html(obj[key]);
        li.append(d);
        li2.append(d2);
      }
    });
    if(callList){
        var d = $('<div>');
        d.addClass("grid_1");
        d.addClass("omega");
        var b = $("<button rel='#"+ obj.tn +"_ov'>");
        var img=$("<img class='phone_icon' src='/img/phone.png'/>");
        d.append(b);
        b.append(img);
        li.addClass("call");
        li.attr('id',obj.tn);
        li.append(d);
    }
//    $("#callList li:last").last(li);
    li.appendTo("#callList").fadeIn("slow");
    //add to the overlay
     var ovdiv = $('<div id="' + obj.tn + '_ov">');
     ovdiv.addClass("simple_overlay");
     var img2 =$("<img src='/img/phone.png'/>");
     var grid = $('<div>');
     grid.addClass('grid_12');
     grid.attr('id','calls');
     var ulcall = $('<ul>');
     ulcall.append(li2);
     grid.append(ulcall);
     ovdiv.append('<a class="close"></a>');
     ovdiv.append(img2);
     ovdiv.append(grid);
    $("#calls_ov").append(ovdiv);
    $("button[rel]").overlay();

}

function message(obj){
    var list="";
    if('message' in obj){
    }else if('announcement' in obj){
        $('<p>').html(obj.announcement).appendTo($("#messages"));
    }
    else if('result' in obj){
        var agentLatLng = new google.maps.LatLng(
          $('#latitude').val(),
          $('#longitude').val()
        );
        var distance = $('#distance').val();
        var state = $('#state').val();
        for (var i in obj.result){
            Call = JSON.parse(obj.result[i]);
            if(obj.result[i] != undefined ){
              var custLatLng = new google.maps.LatLng(
                Call.latitude,
                Call.longitude
              );
              if (Call.state == state && agentLatLng.within(custLatLng,distance)) {
              // list += "<li>" + Call.name + " " + Call.tn + "</li>";
                buildCall(Call,true);
              }
            }
        }
        if(list != ""){
            $('<p>').html(list).appendTo($("#calls"));

        }
    }
    else if('call' in obj){
        for (var b in obj.call){
            var p = obj.call[b];
              if(obj.call[b] != undefined){
                  $("#"+p.callAction.tn).fadeOut("slow", function(){$(this).remove();});

            }
        }
    }
};

function limitCalls() {
  var agentLatLng = new google.maps.LatLng(
    $('#latitude').val(),
    $('#longitude').val()
  );
  var distance = $('#distance').val();
  var agentState = $('#state').val();

  $('li').each(function(index,element) {
    var latitude  = $(this).attr("lat");
    var longitude = $(this).attr("long");
    var custState = $(this).attr("state");
    if (latitude && longitude && custState) {
      var custLatLng = new google.maps.LatLng(
        latitude,
        longitude
      );
      if (custState == agentState && agentLatLng.within(custLatLng,distance)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    }
  });
}

function updateLocation() {
  var zip = $("#zip").val();
  $("#latitude").val("");
  $("#longitude").val("");
  $("#city").val("");
  $("#state").val("");

  if (zip.length >= 5) {
    lookupLocation(zip,function(loc) {
      var city = "";
      var state = "";
      $.each(loc.address_components,function(i,v) {
         if ($.inArray("locality",v.types) > -1) {
           city = v.short_name;
         }
         if ($.inArray("administrative_area_level_1",v.types) > -1) {
           state = v.short_name;
         }
      });
      var lat = loc.geometry.location.lat();
      var lng = loc.geometry.location.lng();
      $("#latitude").val(lat);
      $("#longitude").val(lng);
      $("#city").val(city);
      $("#state").val(state);
      limitCalls();
    });
  }
}

function takeCall(tn){
    var s = "{\"callAction\":{\"tn\":" + tn + "}}";
    CallLive = tn;
    socket.send(s);
    $.ajax({
    	  url: "/call/?phoneNum="+tn,
	  dataType: "json",
	  success: function(){
          },
	  error: function(){
	  }
    });
}

function updatePosition(position) {
  $("#zip").val("");
  $("#latitude").val("");
  $("#longitude").val("");
  $("#city").val("");
  $("#state").val("");
  var latlng = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
  if (latlng != null) {
    lookupPosition(latlng,function(loc) {
      var city = "";
      var state = "";
      var zip = "";
      $.each(loc.address_components,function(i,v) {
         if ($.inArray("locality",v.types) > -1) {
           city = v.short_name;
         }
         if ($.inArray("administrative_area_level_1",v.types) > -1) {
           state = v.short_name;
         }
         if ($.inArray("postal_code",v.types) > -1) {
           zip = v.short_name;
         }
      });
      var lat = loc.geometry.location.lat();
      var lng = loc.geometry.location.lng();
      $("#latitude").val(lat);
      $("#longitude").val(lng);
      $("#city").val(city);
      $("#state").val(state);
      $("#zip").val(zip);
      limitCalls();
    });
  }
}

$(document).ready(function(){
    socket = new io.Socket(null,
                   {port: 8910, rememberTransport: false,
        transports:["websocket","xhr-multipart","flashsocket"]});
    socket.connect();
    socket.on('message',function(obj){
        if(obj != undefined){
            if('buffer' in obj){
                for(var i in obj.buffer){
                    if(buffer[i] != undefined){
                        message(obj.buffer[i]);
                    }
                }
            }else{
                message(obj);
            }
        }
    });

    $("button[rel]").overlay({
      onClose: function(){
          var s = "{\"callDelete\":{\"tn\":" + CallLive + "}}";
          socket.send(s);
          $("#"+CallLive+"_ov").remove();
        }
    });
    $("#call").submit(function(e){
        if($("#name").val()){
        var Call = {};
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
    $.each(['name', 'tn', 'age', 'city', 'state', 'zip'],function(index, fieldName) {
        if(Call[fieldName] === undefined || Call[fieldName] === '') {
            Call[fieldName] = 'Not Submitted';
        }
    });
        socket.send(JSON.stringify(Call));
        }
        $(':input',"#call")
        .not(':button, :reset, :submit, :hidden')
        .val('');
        return false;
    });

    $("#zip").keyup(updateLocation);
    $("#zip").change(updateLocation);

    $("#distance").keyup(limitCalls);
    $("#distance").change(limitCalls);

    // TODO: Need to put a check in here to make sure
    // the browser supports HTML5
    navigator.geolocation.getCurrentPosition(updatePosition);

});
