var CallLine, CallLive, Div, Element, PhoneButton, PhoneImage, buildCall, drawChart, formatNum, limitCalls, lookupLocation, lookupPosition, message, populateCallLine, root, socket, takeCall, toRad, typeAndContent, updateButton, updateLocation, updatePosition, updateTimeElapsed, validPhoneNum;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
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
populateCallLine = function(callLine, obj) {};
buildCall = function(obj, callList) {
  var createdOn, lat, li, lng, state;
  li = new CallLine(obj);
  li.addClass("ui-widget-content");
  lat = obj['latitude'];
  lng = obj['longitude'];
  state = obj['state'];
  createdOn = obj['createdOn'];
  li.attr("lat", lat);
  li.attr("long", lng);
  li.attr("state", state);
  li.attr("createdOn", createdOn);
  li.getOV();
  return li.getLine().appendTo('#callList').hide().fadeIn("slow");
};
typeAndContent = function(message) {
  var content, ignore, type, _ref;
  _ref = message.match(/(.*?):(.*)/), ignore = _ref[0], type = _ref[1], content = _ref[2];
  return {
    type: type,
    content: content
  };
};
message = function(message) {
  var Call, ab, content, count, dataItem, item, list, p, page, status, type, _i, _len, _ref;
  page = window.location.href;
  list = '';
  _ref = typeAndContent(message), type = _ref.type, content = _ref.content;
  switch (type) {
    case 'result':
      if (page.match(/agent$/)) {
        Call = JSON.parse(content);
        buildCall(Call, true);
        limitCalls();
        if (list !== "") {
          return $('<p>').html(list).appendTo("#messages");
        }
      }
      break;
    case 'crc_call':
      if (page.match(/crc$/)) {
        Call = JSON.parse(content);
        if (Call.status === 'new' & Call.allFlag === true) {
          buildCall(Call, true);
        }
        if (list !== "") {
          return $('<p>').html(list).appendTo($("#calls"));
        }
      }
      break;
    case 'call':
      p = JSON.parse(content);
      return $("#" + p.callAction.tn).fadeOut("slow", function() {
        return $(this).remove();
      });
    case 'ab_call':
      ab = JSON.parse(content);
      return $("#" + ab.callAction.tn).fadeOut("slow", function() {
        return $(this).remove();
      });
    case 'chart':
      if (page.match(/charts$/)) {
        dataItem = JSON.parse(content);
        status = ["new", "calling", "called", "abandoned"];
        for (_i = 0, _len = status.length; _i < _len; _i++) {
          item = status[_i];
          count = 0;
          if (dataItem[item] !== void 0) {
            count = dataItem[item];
          }
          $("#status\\." + item).val(count);
        }
        return drawChart();
      }
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
  return chart.draw(data, {
    is3D: true,
    width: 720,
    height: 400,
    title: 'Call Status'
  });
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
  agentPhone = $("#agentPhone").val();
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
  socket.on('message', message);
  $('button[rel]').overlay({
    onClose: function() {
      var s;
      s = {
        callDelete: {
          tn: CallLive
        }
      };
      socket.send(s);
      return $('#' + CallLive + '_ov').remove();
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
toRad = function(degrees) {
  return Math.PI * (degrees / 180);
};
google.maps.LatLng.prototype.distanceTo = function(latlng) {
  var a, c, dLat, dLon, lat1, lat2, radius;
  radius = 6371;
  dLat = toRad(this.lat() - latlng.lat());
  dLon = toRad(this.lng() - latlng.lng());
  lat1 = toRad(this.lat());
  lat2 = toRad(latlng.lat());
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c * 0.921371192;
};
google.maps.LatLng.prototype.within = function(latlng, radius) {
  return this.distanceTo(latlng) <= radius;
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
updateTimeElapsed = function() {
  var $callList, currUnixTime, todaysDate;
  setTimeout(updateTimeElapsed, 10000);
  todaysDate = new Date();
  currUnixTime = Math.round(todaysDate.getTime() / 1000);
  $callList = $('#callList');
  return $callList.children().each(function() {
    var createdDate, unixTime;
    if ($(this).attr('createdOn') !== void 0) {
      createdDate = new Date($(this).attr('createdOn'));
      unixTime = Math.round(createdDate.getTime() / 1000);
      return $(this).children().each(function() {
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
Element = (function() {
  function Element(elem) {
    this.elem = elem;
  }
  Element.prototype.addClass = function(cssClass) {
    return this.elem.addClass(cssClass);
  };
  Element.prototype.attr = function(attr, val) {
    return this.elem.attr(attr, val);
  };
  Element.prototype.appendTo = function(elem) {
    return this.elem.appendTo(elem);
  };
  Element.prototype.append = function(elem) {
    return this.elem.append(elem);
  };
  Element.prototype.html = function(elem) {
    return this.elem.html(elem);
  };
  Element.prototype.elem = function() {
    return this.elem;
  };
  return Element;
})();
root = typeof exports !== "undefined" && exports !== null ? exports : window;
root.Element = Element;
Div = (function() {
  __extends(Div, Element);
  function Div() {
    this.div = $('<div>');
    Div.__super__.constructor.call(this, this.div);
  }
  return Div;
})();
root = typeof exports !== "undefined" && exports !== null ? exports : window;
root.Div = Div;
CallLine = (function() {
  __extends(CallLine, Element);
  function CallLine(obj) {
    this.li = $('<li>');
    this.name = obj["name"];
    this.tn = obj["tn"];
    this.city = obj["city"];
    this.state = obj["state"];
    this.zip = obj["zip"];
    this.createdOn = obj["createdOn"];
    this.li.addClass("ui-widget-content");
    CallLine.__super__.constructor.call(this, this.li);
  }
  CallLine.prototype.getLine = function() {
    var d, fieldVal, phb, value, _i, _len, _ref;
    _ref = ['name', 'tn', 'city', 'state', 'zip', 'createdOn'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      value = _ref[_i];
      d = new Div();
      d.addClass("grid_2");
      fieldVal = this[value];
      switch (value) {
        case 'tn':
          d.addClass("alpha");
          fieldVal = formatNum(fieldVal);
          break;
        case 'createdOn':
          fieldVal = 0;
          d.attr('title', 'timeElapsed');
      }
      d.html(fieldVal);
      this.li.append(d.elem);
    }
    this.li.addClass("call");
    this.li.attr('id', this.tn);
    this.li.append(d.elem);
    d = new Div();
    d.addClass("grid_1 omega");
    phb = new PhoneButton(this.tn);
    d.append(phb.button);
    this.li.append(d.elem);
    return this.li;
  };
  CallLine.prototype.getOV = function() {
    var d, grid, lilow, limain, ovdiv, ph, ulcall, value, _i, _j, _len, _len2, _ref, _ref2;
    ulcall = $('<ul>');
    limain = $('<li>');
    lilow = $('<li>');
    ovdiv = new Div();
    ovdiv.attr('id', this.tn + "_ov");
    ovdiv.addClass("simple_overlay");
    _ref = ['name', 'tn'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      value = _ref[_i];
      d = new Div();
      d.addClass("grid_4 ov_top");
      switch (value) {
        case 'tn':
          d.html(formatNum(this.tn));
          break;
        case 'name':
          d.html(this.name);
      }
      limain.append(d.elem);
    }
    _ref2 = ['city', 'state', 'zip'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      value = _ref2[_j];
      d = new Div();
      d.addClass("grid_2 ov_bottom");
      d.html(this[value]);
      lilow.append(d.elem);
    }
    grid = new Div();
    grid.addClass("grid_12");
    grid.attr('id', 'calls');
    limain.appendTo(ulcall);
    lilow.appendTo(ulcall);
    grid.append(ulcall);
    ovdiv.appendTo('<a class="close"></a>');
    ph = new PhoneImage();
    ovdiv.append(ph.img);
    ovdiv.append(grid.elem);
    return ovdiv.appendTo("#calls_ov");
  };
  return CallLine;
})();
root = typeof exports !== "undefined" && exports !== null ? exports : window;
root.CallLine = CallLine;
PhoneImage = (function() {
  __extends(PhoneImage, Element);
  function PhoneImage() {
    this.img = $('<img class="phone_icon" src="/img/phone.png"/>');
  }
  return PhoneImage;
})();
PhoneButton = (function() {
  __extends(PhoneButton, Element);
  function PhoneButton(tn) {
    var img;
    this.button = $('<button rel="#' + tn + '_ov" onclick=takeCall(' + tn + ');>');
    this.button.overlay({
      onClose: function() {
        var s;
        s = {
          callDelete: {
            tn: CallLive
          }
        };
        socket.send(s);
        return $("#" + CallLive + "_ov").remove();
      }
    });
    img = new PhoneImage();
    this.button.append(img.img);
  }
  return PhoneButton;
})();