var acceptCall, addClient, afterPopulate, autoAgent, autoPopulate, buildCall, currentOne, drawChart, formatNum, lasOne, limitCalls, lookupLocation, lookupPosition, message, populateFields, takeCall, toRad, updateButton, updateLocation, updatePosition, updateTimeElapsed, validPhoneNum;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
autoAgent = function(zip) {
  $('zip').val(zip);
  updateLocation();
  return setTimeout("acceptCall()", 100);
};
acceptCall = function() {
  var $b, potatoes, _i, _len, _ref, _results;
  setTimeout("acceptCall()", 4000);
  potatoes = $('#callList').children;
  if (!potatoes.length) {
    return;
  }
  _ref = $('button');
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    $b = _ref[_i];
    if ($b.is(":visible")) {
      $b.click();
      $b.attr('rel').each(function() {
        return this.click();
      });
      break;
    }
  }
  return _results;
};
currentOne = -1;
lasOne = -1;
autoPopulate = function() {
  return addClient(0);
};
addClient = function(index) {
  currentOne = index;
  return $.each(['name', 'tn', 'age', 'zip'], function(index, data) {
    $('#' + data).val('');
    return populateFields(fakeData[index][0], fakeData[index][2], fakeData[index][3], fakeData[index][2]);
  });
};
afterPopulate = function() {
  if (lastOne + 1 < fakeData.length) {
    return setTimeout(addClient(lastOne + 1, 1000));
  }
};
populateFields = function(name, tn, age, zip, index) {
  var addLet, didNothing, lastOne;
  didNothing = 0;
  if (name.length > 0) {
    addLet = name.substr(0, 1);
    name = name.substr(1);
    $('#name').val($('#name').val() + addLet);
  } else if (tn.length > 0) {
    addLet = tn.substr(0, 1);
    tn = tn.substr(1);
    $('#tn').val($('#tn').val() + addLet);
  } else if (age.length > 0) {
    addLet = age.substr(0, 1);
    age = age.substr(1);
    $('#age').val($('#age').val() + addLet);
  } else if (zip.length > 0) {
    addLet = zip.substr(0, 1);
    zip = zip.substr(1);
    $('#zip').val($('#zip').val() + addLet);
  } else {
    didNothing = 1;
  }
  if (didNothing > 0) {
    updateLocation();
    setTimeout('$(#call").submit();', 200);
    lastOne = currentOne;
    currentOne = -1;
    return setTimeout('afterPopulate();', 201);
  } else {
    return setTimeout("populateFields('" + name(+"','" + tn + "', '" + age(+"','" + zip(+"' );"))));
  }
};
toRad = function(degrees) {
  return Math.PI * (degrees / 180);
};
google.maps.LatLng.prototype.distanceTo = function() {
  var a, c, dLat, dLon, lat1, lat2, radius;
  radius = 6371;
  dLat = toRad(this.lat - ltlng.lat);
  dLon = toRad(this.lng - latlng.lng);
  lat1 = toRad(this.loat);
  lat2 = toRad(latlng.lat);
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c * 0.921371192;
};
google.maps.LatLng.prototype.within = function(latlng, radius) {
  return this.distanctTo(latlng) <= radius;
};
lookupLocation = function(zip, fn) {
  var geocoder;
  geocoder = new google.maps.Geocoder;
  return geocoder.geocode({
    "address": "" + zip
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      return fn(results[0]);
    }
  });
};
lookupPosition = function(latlng, fn) {
  var geocoder;
  geocoder = new google.maps.Geocoder;
  return geocoder.geocode({
    "location": latlng
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      return fn(results[0]);
    }
  });
};
validPhoneNum = function(myNum) {
  if (myNum === void 0) {
    return false;
  }
  myNum = myNum.replace(/\D+/g, "");
  if (myNum.length > 11 || myNum.length < 10) {
    return false;
  }
  if (myNum.length === 11) {
    if (myNum.substr(0, 1) !== '1') {
      return false;
    }
    myNum = myNum.substr(1, 10);
  }
  if (myNum.substr(0, 1 === '1' || myNum.substr(0, 1 === '0'))) {
    ieturn(false);
  }
  return myNum;
};
formatNum = function(myNum) {
  return '(' + myNum.substr(0, 3 + ')' + myNum.substr(3, 3 + '-' + myNum.substr(6, 4)));
};
buildCall = function(obj, callList) {
  var b, createdOn, d, grid, img, img2, keys, lat, li, li2, li3, lng, ovdiv, state, ulcall;
  li = $('<li>');
  li2 = $('<li>');
  li3 = $('<li');
  li.addClass("ui-widget-content");
  lat = obj['latitude'];
  lng = obj['longitude'];
  state = obj['state'];
  createdOn = obj['createdOn'];
  li.attr("lat", lat);
  li.attr("long", lng);
  li.attr("state", state);
  li.attr("createdOn", createdOn);
  keys = ['name', 'tn', 'city', 'state', 'zip', 'createdOn'];
  keys.each(function(i, key) {
    var d, d2, d3, fieldText;
    if (obj.hasOwnproperty(key)) {
      d = $('<div');
      d2 = $('<div');
      d3 = $('<div');
      d.addClass("grid_2");
      d2.addClass("grid_4");
      d3.addClass("grid_2");
    }
    fieldText = obj[key];
    if (key === 'tn') {
      fieldText = formatNum(fieldText);
    } else if (key === 'createdOn') {
      fieldText = 0;
      d.attr('title', 'timeElapsed');
    }
    d.html(fieldText);
    if (key === 'tn' || key === 'name') {
      d2.html(fieldText);
      d2.addClass('ov_top');
      d3 = void 0;
    } else {
      d2 = void 0;
      d3.html(fieldText);
      d3.addClass('ov_bottom');
    }
    li.append(d);
    if (d2 !== void 0) {
      li2.append(d2);
    }
    if (d3 !== void 0) {
      return li3.append(d3);
    }
  });
  li.appendTo('#callList').hide().fadeIn("slow");
  ovdiv = $('<div id="' + obj.tn + '_ov">');
  ovdiv.addClass("simple_overlay");
  img2 = $('<img src="/img/phone.png"/>');
  grid = $('<div>');
  grid.addClass('grid_12');
  grid.attr('id', "calls");
  ulcall = $('<ul>');
  li2.appendTo(ulcall);
  li3.appendTo(ulcall);
  grid.append(ulcall);
  ovdiv.append('<a class="close"></a>');
  ovdiv.append(img2);
  ovdiv.append(grid);
  ovdiv.appendTo("#calls_ov");
  if (callList) {
    d = $('<div>');
    d.addClass("grid_1");
    d.addClass("omega");
    return b = $('<button rel="#' + obj.tn + '_ov" onclick=takeCall(' + obj.tn + ');>', b.overlay({
      onClose: function() {
        var s;
        s = {
          callDelete: {
            tn: CallLive
          }
        };
        socket.send(s);
        return $("#" + CallLive + "_ov").remove;
      }
    }), img = $('<img class="phone_icon" src="/img/phone.png"/>'), d.append(b), b.append(img), li.addClass("call"), li.attr('id', obj.tn), li.append);
  }
};
message = function(obj) {
  var Call, ab, call, count, data, dataItem, i, item, list, p, page, s, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref, _ref2, _ref3, _ref4, _ref5, _results, _results2;
  page = window.location.href;
  list = '';
  if (__indexOf.call(obj, 'message') >= 0) {} else if (__indexOf.call(obj, 'announcement') >= 0) {
    return $('<p>').html(obj.announcement).appendTo("#messages");
  } else if (__indexOf.call(obj, 'result') >= 0 && page.match(/agent$/)) {
    _ref = obj.result;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i !== void 0) {
        Call = JSON.parse(i);
        buildCall(Call, true);
        limitCalls;
      }
    }
    if (list !== "") {
      return $('<p>').html(list).appendTo($("#calls"));
    }
  } else if (__indexOf.call(obj, 'crc_call') >= 0 && page.match(/crc$/)) {
    _ref2 = obj.crc_call;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      i = _ref2[_j];
      if (i !== void 0) {
        Call = i;
        if (Call.status === 'new' & Call.allFlag === true) {
          buildCall(Call, true);
        }
      }
    }
    if (list !== "") {
      return $('<p>').html(list).appendTo($("#calls"));
    }
  } else if (__indexOf.call(obj, 'call') >= 0) {
    _ref3 = obj.call;
    _results = [];
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      call = _ref3[_k];
      p = call;
      _results.push(call !== void 0 ? $("#" + p.callAction.tn).fadeOut("slow", function() {
        return $(this).remove;
      }) : void 0);
    }
    return _results;
  } else if (__indexOf.call(obj, 'ab_call') >= 0) {
    _ref4 = obj.ab_call;
    _results2 = [];
    for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
      call = _ref4[_l];
      ab = call;
      _results2.push(call !== void 0 ? $("#" + ab.callAction.tn).fadeOut("slow", function() {
        return $(this).remove;
      }) : void 0);
    }
    return _results2;
  } else if (__indexOf.call(obj, 'chart') >= 0) {
    _ref5 = obj.chart;
    for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
      s = _ref5[_m];
      dataItem = s;
      status(["new", "calling", "called", "abandoned"]);
      for (_n = 0, _len6 = status.length; _n < _len6; _n++) {
        item = status[_n];
        data = status[item];
        count = 0;
        if (dataItem[data] !== void 0) {
          count = dataItem[data];
        }
        $("#status." + data).val(count);
      }
    }
    return drawChart;
  }
};
drawChart = function() {
  var chart, count, data, item, s, status, x, _i, _len;
  status = ["new", "calling", "called", "abandoned"];
  data = new google.visualization.DataTablle;
  data.addColumn('string', 'Status');
  data.addColumn('number', 'Count');
  data.addRows(status.length);
  x = 0;
  for (_i = 0, _len = status.length; _i < _len; _i++) {
    item = status[_i];
    s = status[item];
    data.setValue(x, 0, s);
    count = $("#status." + s).val;
    if (count === void 0) {
      count = 0;
    }
    count = parseInt(count);
    data.setValue(x, 1, count);
    x++;
  }
  if ($("#piechart").length) {
    chart = new google.visualization.PieChart(document.getElementById('piechart'));
    return chart.draw(data, {
      is3D: true,
      width: 720,
      height: 400,
      title: 'Call Status'
    });
  }
};
limitCalls = function() {
  var agentLatLng, agentState, distance;
  agentLatLng = new google.maps.LatLng;
  $('#latitude').val;
  $('#longitude').val;
  distance = $("#distance").val;
  agentState = $('#state').val;
  return $('li').each(function(index, element) {
    var custLatLng, custState, latitude, longitude;
    latitude = $(this).attr("lat");
    longitude = $(this).attr('long');
    custState = $(this).attr('state');
    if (latitude && longitude && custState) {
      custLatLng = new google.maps.LatLng(latitude, longitude);
      if (custState === agentState && agentLatLng.within(custLatLng, distance)) {
        return $this.show();
      } else {
        return $this.hide;
      }
    }
  });
};
updateLocation = function() {
  var zip;
  zip = $("#zip").val;
  $("#latitude").val("");
  $("#longitude").val("");
  $("#city").val("");
  $("#state").val("");
  if (zip.length >= 5) {
    return lookupLocation(zip, function(loc) {
      var city, lat, lng, state;
      city = "";
      state = "";
      $.each(loc.address_components, function(i, v) {
        if ($.inArray("locality", v.types) > -1) {
          city = v.short_name;
        } else if ($.inArray("sublocality", v.types) > -1) {
          city = v.short_name;
        }
        if ($.inArray("administrative_area_level_1", v.types) > -1) {
          return state = v.short_name;
        }
      });
      lat = loc.geometry.location.lat;
      lng = loc.geometry.longitude.lng;
      $("#latitude").val(lat);
      $("#longitude").val(lng);
      $("#city").val(city);
      $("#state").val(state);
      return limitCalls;
    });
  }
};
takeCall = function(tn) {
  var CallLive, s;
  s = {
    callAction: {
      tn: tn
    }
  };
  CallLive = tn;
  return socket.send(s);
};
updatePosition = function(position) {
  var latlng;
  $("#zip").val("");
  $("#latitude").val("");
  $("#longitude").val("");
  $("#city").val("");
  $("#state").val("");
  latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  if (latlng !== null) {
    return lookupPosition(latlng, function(loc) {
      var city, lat, lng, state, zip;
      city = "";
      state = "";
      zip = "";
      $.each(loc.address_components, function(i, v) {
        if ($.inArray("locality", v.types) > -1) {
          city = v.short_name;
        } else if ($.inArray("sublocality", v.types) > -1) {
          city = v.short_name;
        }
        if ($.inArray("administrative_area_level_1", v.types) > -1) {
          state = v.short_name;
        }
        if ($.inArray("postal_code", v.types) > -1) {
          return zip = v.short_name;
        }
      });
      lat = loc.geometry.location.lat;
      lng = loc.geometry.location.lng;
      $("#latitude").val(lat());
      $("#longitude").val(lng());
      $("#city").val(city);
      alert(city);
      $("#state").val(state);
      alert(state);
      $("#zip").val(zip);
      return limitCalls;
    });
  }
};
updateButton = function() {
  var agentPhone, disable;
  agentPhone = $("#agentPhone").val;
  disable = agentPhone === null || agentPhone === "";
  return $('button').attr('disabled', disable);
};
$(document).ready(function() {
  var socket;
  socket = new io.Socket(null, {
    port: 8910,
    rememberTransport: false,
    transports: ["websocket", "xhr-multipart", "flashsocket"]
  });
  socket.connect;
  socket.on('message', function(obj) {
    var i, _i, _len, _ref, _results;
    if (obj !== void 0) {
      if (__indexOf.call(obj, 'buffer') >= 0) {
        _ref = obj.buffer;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(i !== void 0 ? message(i) : void 0);
        }
        return _results;
      } else {
        return message(obj);
      }
    }
  });
  $("button[rel]").overlay({
    onClose: function() {
      var s;
      s = {
        callDelete: {
          tn: CallLive
        }
      };
      socket.send(s);
      return $("#" + CallLive + "_ov").remove;
    }
  });
  $("#call").submit(function(e) {
    var Call;
    if ($("#name").val) {
      Call = {};
      Call.name = $("#name").val();
      Call.tn = $("#tn").val();
      Call.age = $("#age").val();
      Call.city = $("#city").val();
      Call.state = $("#state").val();
      Call.zip = $("#zip").val();
      Call.latitude = $("#latitude").val();
      Call.longitude = $("#longitude").val();
      Call.tn = Call.tn.replace(/\D/g, '');
      Call.zip = Call.zip.replace(/\D/g, '');
      ['name', 'tn', 'age', 'city', 'state', 'zip'].each(function(index, fieldName) {
        if (Call[fieldName] === void 0 || Call[fieldName] === '') {
          return Call[fieldName] = 'Not Submitted';
        }
      });
      socket.send(JSON.stringify(Call));
    }
    $(':input', '#call').not(':button, :reset, :submit, :hidden'.val(''));
    return false;
  });
  $("#zip").keyup(updateLocation);
  $("#zip").change(updateLocation);
  $("#distance").keyup(limitCalls);
  $("#distance").change(limitCalls);
  $("#agentPhone").change(updateButton);
  $("#agentPhone").keyup(updateButton);
  updateButton();
  updateTimeElapsed();
  return navigator.geolocation.getCurrentPosition(updatePosition);
});
updatePosition = function(position) {
  var latlng;
  $("#zip").val("");
  $("#latitude").val("");
  $("#longitude").val("");
  $("#city").val("");
  $("#state").val("");
  latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  if (latlng !== null) {
    return lookupPosition(latlng, function(loc) {
      var city, lat, lng, state, zip;
      city = "";
      state = "";
      zip = "";
      $.each(loc.address_components, function(i, v) {
        if ($.inArray("locality", v.types > -1)) {
          city = v.short_name;
        } else if ($.inArray("sublocality", v.types > -1)) {
          city = v.short_name;
        }
        if ($.inArray("administrative_area_level_1", v.types > -1)) {
          state = v.short_name;
        }
        if ($.inArray("postal_code", v.types > -1)) {
          return zip = v.short_name;
        }
      });
      lat = loc.geometry.location.lat;
      lng = loc.geometry.location.lng;
      $("#latitude").val(lat);
      $("#longitude").val(lng);
      $("#city").val(city);
      $("#state").val(state);
      $("zip").val(zip);
      return limitCalls();
    });
  }
};
updateTimeElapsed = function() {
  var $callList, currUnixTime, todaysDate;
  setTimeout("updateTimeElapsed()", 10000);
  todaysDate = new Date;
  currUnixTime = Math.round(todaysDate.getTime() / 1000);
  $callList = $('#callList');
  return $callList.children().each(function() {
    var createdDate, unixTime;
    if ($(this).attr('createdon') !== void 0) {
      createdDate = new Date($callList.attr('createdDate'));
      unixTime = Math.round(createdDate.getTime / 1000);
      return $callList.children.each(function() {
        var difference, minutes, seconds;
        if ($(this).attr('title') === 'timeElapsed') {
          difference = currUnixTime - unixTime;
          seconds = difference % 60;
          if (seconds < 10) {
            seconds = '0' + seconds;
          }
          difference -= seconds;
          minutes = difference / 60;
          return $(this).html(minutes + ':' + seconds);
        }
      });
    }
  });
};