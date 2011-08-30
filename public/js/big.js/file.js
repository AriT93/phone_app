(function() {
  var acceptCall, addClient, afterPopulate, autoAgent, autoPopulate, currentOne, lasOne, lookupLocation, lookupPosition, populateFields, toRad;
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
}).call(this);
