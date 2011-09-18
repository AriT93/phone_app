var CallLive, buildCall, drawChart, formatNum, limitCalls, message, socket, takeCall, updateButton, updateLocation, updatePosition, validPhoneNum;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
socket = "";
CallLive = "";
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
  return '(' + myNum.substr(0, 3) + ')' + myNum.substr(3, 3) + '-' + myNum.substr(6, 4);
};
buildCall = function(obj, callList) {
  var b, createdOn, d, d2, d3, fieldText, grid, img, img2, key, keys, lat, li, li2, li3, lng, ovdiv, state, ulcall, _i, _len;
  li = $('<li>');
  li2 = $('<li>');
  li3 = $('<li>');
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
  for (_i = 0, _len = keys.length; _i < _len; _i++) {
    key = keys[_i];
    if (obj.hasOwnProperty(key)) {
      d = $('<div>');
      d2 = $('<div>');
      d3 = $('<div>');
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
      li3.append(d3);
    }
  }
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
    b = $('<button rel="#' + obj.tn + '_ov" onclick=takeCall(' + obj.tn + ');>');
    b.overlay({
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
    img = $('<img class="phone_icon" src="/img/phone.png"/>');
    d.append(b);
    b.append(img);
    li.addClass("call");
    li.attr('id', obj.tn);
    return li.append(d);
  }
};
message = function(obj) {
  var Call, ab, call, count, dataItem, i, item, list, p, page, s, status, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref, _ref2, _ref3, _ref4, _ref5, _results, _results2;
  page = window.location.href;
  list = '';
  if (__indexOf.call(obj, 'message') >= 0) {} else if (__indexOf.call(obj, 'announcement') >= 0) {
    return $('<p>').html(obj.announcement).appendTo("#messages");
  } else if ((obj.result != null) && page.match(/agent$/)) {
    _ref = obj.result;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i !== void 0) {
        Call = JSON.parse(i);
        buildCall(Call, true);
        limitCalls();
      }
    }
    if (list !== "") {
      return $('<p>').html(list).appendTo($("#calls"));
    }
  } else if ((obj.crc_call != null) && page.match(/crc$/)) {
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
  } else if (obj.call != null) {
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
  } else if (obj.ab_call != null) {
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
  } else if ((obj.chart != null) && page.match(/charts$/)) {
    _ref5 = obj.chart;
    for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
      s = _ref5[_m];
      dataItem = s;
      status = ["new", "calling", "called", "abandoned"];
      for (_n = 0, _len6 = status.length; _n < _len6; _n++) {
        item = status[_n];
        count = 0;
        if (dataItem[item] !== void 0) {
          count = dataItem[item];
        }
        $("#status\\." + item).val(count);
      }
    }
    return drawChart();
  }
};
drawChart = function() {
  var chart, count, data, item, status, x, _i, _len;
  status = ["new", "calling", "called", "abandoned"];
  data = new google.visualization.DataTable();
  data.addColumn('string', 'Status');
  data.addColumn('number', 'Count');
  data.addRows(status.length);
  x = 0;
  for (_i = 0, _len = status.length; _i < _len; _i++) {
    item = status[_i];
    data.setValue(x, 0, item);
    count = $('#status\\.' + item).val();
    if (count === void 0) {
      count = 0;
    }
    count = parseInt(count);
    data.setValue(x, 1, count);
    x++;
  }
  if ($('#piechart').length) {
    chart = new google.visualization.PieChart(document.getElementById('piechart'));
  }
  chart.draw(data, {
    is3D: true,
    width: 720,
    height: 400,
    title: 'Call Status'
  });
  return true;
};
limitCalls = function() {
  var agentLatLng, agentState, distance;
  agentLatLng = new google.maps.LatLng($('#latitude').val(), $('#longitude').val());
  distance = $('#distance').val();
  agentState = $('#state').val();
  return $('li').each(function(index, element) {
    var custLatLng, custState, latitude, longitude;
    latitude = $(this).attr('lat');
    longitude = $(this).attr('long');
    custState = $(this).attr('state');
    if (latitude && longitude && custState) {
      custLatLng = new google.maps.LatLng(latitude, longitude);
      if (custState === agentState && agentLatLng.within(custLatLng, distance)) {
        return $(this).show();
      } else {
        return $(this).hide();
      }
    }
  });
};
updateLocation = function() {
  var zip;
  zip = $('#zip').val();
  $('#latitude').val("");
  $('#longitude').val("");
  $('#city').val("");
  $('#state').val("");
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
      lat = loc.geometry.location.lat();
      lng = loc.geometry.location.lng();
      $('#latitude').val(lat);
      $('#longitude').val(lng);
      $('#city').val(city);
      $('#state').val(state);
      return limitCalls();
    });
  }
};
takeCall = function(tn) {
  var s;
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
  $('#zip').val("");
  $('#latitude').val("");
  $('#longitude').val("");
  $('#city').val("");
  $('#state').val("");
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
      lat = loc.geometry.location.lat();
      lng = loc.geometry.location.lng();
      $('#latitude').val(lat);
      $('#longitude').val(lng);
      $('#city').val(city);
      $('#state').val(state);
      $('#zip').val(zip);
      return limitCalls();
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
  socket = new io.Socket(null, {
    port: "8910",
    rememberTransport: "false",
    transports: ["websocket", "xhr-multipart", "flashsocket"]
  });
  socket.connect();
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
  $('button[rel]').overlay({
    onClose: function() {
      var s;
      s = {
        callDelete: {
          tn: CallLive
        }
      };
      socket.send(s);
      return $('#' + CallLive + '_ov').remove;
    }
  });
  $('#call').submit(function(e) {
    var Call;
    if ($("#name").val()) {
      Call = {};
      Call.name = $('#name').val();
      Call.tn = $('#tn').val();
      Call.age = $('#age').val();
      Call.city = $('#city').val();
      Call.state = $('#state').val();
      Call.zip = $('#zip').val();
      Call.latitude = $('#latitude').val();
      Call.longitude = $('#longitude').val();
      Call.tn = Call.tn.replace(/\D/g, '');
      Call.zip = Call.zip.replace(/\D/g, '');
      socket.send(JSON.stringify(Call));
      ['name', 'tn', 'age', 'city', 'state', 'zip'].each(function(index, fieldName) {
        if (Call[fieldName] === void 0 || Call[fieldName] === '') {
          return Call[fieldName] = 'Not Submitted';
        }
      });
    }
    $(':input', '#call').not(':button, :reset, :submit, :hidden'.val(''));
    return false;
  });
  $('#zip').keyup(updateLocation);
  $('#zip').change(updateLocation);
  $('#distance').keyup(limitCalls);
  $('#distance').change(limitCalls);
  $('#agentPhone').change(updateButton);
  $('#agentPhone').keyup(updateButton);
  updateButton();
  updateTimeElapsed();
  return navigator.geolocation.getCurrentPosition(updatePosition);
});