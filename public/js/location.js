(function() {
  var lookupLocation, lookupPosition, toRad;
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
