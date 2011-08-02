/* Author:

*/

var socket;
var CallLive;
/* Returns 10 digit number with no formatting if thinks is a phone number.
 * Returns false otherwise. */
function isValidPhoneNum(myNum) {
        if(myNum == undefined) return false;
        myNum = myNum.replace(/\D+/g, "");

        //I might want to do more checking that the tech didn't do something really dumb.
        //TODO!

        if(myNum.length > 11 || myNum.length < 10) return false;

        if (myNum.length == 11) {
                if(myNum.substr(0, 1) != '1') return false;
                myNum = myNum.substr(1,10); /*chop off first 1.*/
        }

        if(myNum.substr(0, 1) == '1' || myNum.substr(0, 1) == '0') return false;
        return myNum;
}

function formatNum(myNum) {
        return '('+myNum.substr(0, 3)+')'+myNum.substr(3, 3) + '-' + myNum.substr(6, 4);
}

function buildCall(obj,callList){
    var li = $('<li>');
    var li2 = $('<li>');
    li.addClass("ui-widget-content");
    li2.addClass("ui-widget-content");
    var lat = obj["latitude"];
    var lng = obj["longitude"];
    var state = obj["state"];
    var createdOn = obj["createdOn"];
    li.attr("lat",lat);
    li.attr("long",lng);
    li.attr("state",state);
    li.attr("createdon",createdOn);
    li2.attr("lat",lat);
    li2.attr("long",lng);
    li2.attr("state",state);
    li2.attr("createdon",createdOn);
    var keys = ['name','tn','city','state','zip','createdOn'];
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
    var fieldText = obj[key];

    if(key == 'tn' && isValidPhoneNum(fieldText)) {
        fieldText = formatNum(isValidPhoneNum(fieldText));
    } else if(key == 'createdOn') {
        fieldText = 0;
        d.attr('title', 'timeElapsed');
        d2.attr('title', 'timeElapsed');
    }

    d.html(fieldText);
        d2.html(fieldText);
        li.append(d);
        li2.append(d2);
      }
    });
    if(callList){
        var d = $('<div>');
        d.addClass("grid_1");
        d.addClass("omega");
        var b = $("<button rel='#"+ obj.tn +"_ov' onclick=takeCall("+ obj.tn +")>");
        var img=$("<img class='phone_icon' src='/img/phone.png'/>");
        d.append(b);
        b.append(img);
        li.addClass("call");
        li.attr('id',obj.tn);
        li.append(d);
    }
//    $("#callList li:last").last(li);
      li.appendTo("#callList").hide().fadeIn("slow");
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
      var page = window.location;
      if (page.match(/agent$/)) {
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
              if (Call.allFlag == false && Call.state == state && agentLatLng.within(custLatLng,distance)) {
                buildCall(Call,true);
              }
            }
        }
        } else if (page.match(/crc$/)) {
          for (var i in obj.result){
            if(obj.result[i] != undefined ){
              Call = JSON.parse(obj.result[i]);
              if (Call.status == "new" && Call.allFlag) {
                buildCall(Call,true);
              }
            }
          }
        }
        if(list != ""){
            $('<p>').html(list).appendTo($("#calls"));
        }
    }
    else if ('call' in obj) {
        for (var b in obj.call){
            var p = obj.call[b];
              if(obj.call[b] != undefined){
                  $("#"+p.callAction.tn).fadeOut("slow", function(){$(this).remove();});

            }
        }
    }
    else if('chart' in obj){
      for (var s in obj.chart) {
        var dataItem = obj.chart[s];
        var status = [ "new", "calling", "called", "abandoned" ];
        for (var item in status) {
          var data = status[item];
          var count = 0;
          if (dataItem[data] != undefined) {
            count = dataItem[data];
          }
          $("#status\\."+data).val(count);
        }
      }
      drawChart();
    }
};

function drawChart() {
  var status = [ "new", "calling", "called", "abandoned" ];
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Status');
  data.addColumn('number', 'Count');
  data.addRows(status.length);
  var x = 0;
  for (var item in status) {
    var s = status[item];
    data.setValue(x, 0, s);
    var count = $("#status\\."+s).val();
    if (count == undefined) {
      count = 0;
    }
    count = parseInt(count);
    data.setValue(x, 1, count);
    x++;
  }
  if ($("#piechart").length) {
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, {width: 720, height: 400, title: 'Call Status'});
  }
}

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
         } else if ($.inArray("sublocality",v.types) > -1) {
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
          url: "/call/phoneNum="+tn,
      dataType: "jsonp",
      success: function(data){
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
         } else if ($.inArray("sublocality",v.types) > -1) {
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

function updateButton() {
  var agentPhone = $("#agentPhone").val();
  var disable = agentPhone == null || agentPhone == "";
  $('button').attr('disabled',disable);
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

    $("#agentPhone").change(updateButton);
    $("#agentPhone").keyup(updateButton);

    updateButton();
    // keeps time elapsed updating.
//    updateTimeElapsed();

    // TODO: Need to put a check in here to make sure
    // the browser supports HTML5
    navigator.geolocation.getCurrentPosition(updatePosition);
});
