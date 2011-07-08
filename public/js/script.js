
/* Author:

*/



function message(obj){
    var list="";

    if('message' in obj){
//        el.innerHTML = "<b>" + obj.message[0] + "</b>";

    }else if('announcement' in obj){
        $('<p>').html(obj.announcement).appendTo($("#messages"));
    }
    else if('result' in obj){
        for (var i in obj.result){
            Call = JSON.parse(obj.result[i]);
            if(obj.result[i] != undefined ){
                list += "<li>" + Call.name + " " + Call.tn + "</li>";
            }
        }
        if(list != ""){
          $('<p>').html(list).prependTo($("#chat"));
        }
    }
};

function lookupLocation(zip,fn) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
      'address' : ""+zip
    },
    function(results,status) {
      if (status == google.maps.GeocoderStatus.OK) {
        fn(results[0]);
      }
    }
  );
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
    });
  }
}

$(document).ready(function(){
    $("button[rel]").overlay();
    var socket = new io.Socket(null,
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
        socket.send(JSON.stringify(Call));
        $("#name").val("");
        $("#tn").val("");
        }
        return false;
    });

    $("#zip").keyup(updateLocation);
    $("#zip").change(updateLocation);
});
