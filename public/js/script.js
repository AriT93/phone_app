
/* Author:

*/


function buildCall(obj,callList){
    var li = $('<li>');
    var li2 = $('<li>');
    var bad = ['_id', 'latitude','longitude','age', 'state'];
    for (var key in obj){
        if(obj.hasOwnProperty(key)){
            if($.inArray(key, bad) == -1){
                var d = $('<div>');
                var d2 = $('<div>');
                d.addClass("grid_2");
                d2.addClass("grid_2");
                if(key == 'name'){
                    d.addClass('alpha');
                    d2.addClass('alpha');
                }
                d.html(obj[key]);
                d2.html(obj[key]);
                li.append(d);
                li2.append(d2);

            }
        }
    }
    if(callList){
        var d = $('<div>');
        d.addClass("grid_2");
        d.addClass("omega");
        var b = $("<button rel='#"+ obj.tn +"_ov'>");
        var img=$("<img class='phone_icon' src='/img/phone.png'/>");
        d.append(b);
        b.append(img);
        li.addClass("call");
        li.attr('id',obj.tn);
        li.append(d);
    }
    $("#callList li:first").after(li);
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
        for (var i in obj.result){
            Call = JSON.parse(obj.result[i]);
            if(obj.result[i] != undefined ){
                // list += "<li>" + Call.name + " " + Call.tn + "</li>";
                buildCall(Call,true);
            }
        }
        if(list != ""){
            $('<p>').html(list).appendTo($("#calls"));

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
        }
        $(':input',"#call")
        .not(':button, :reset, :submit, :hidden')
        .val('');
        return false;
    });

    $("#zip").keyup(updateLocation);
    $("#zip").change(updateLocation);
});
