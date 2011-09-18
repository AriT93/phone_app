function toRad(degrees) {
  return Math.PI * (degrees / 180);
}

google.maps.LatLng.prototype.distanceTo = function(latlng) {
  var radius = 6371;

  var dLat = toRad(this.lat() - latlng.lat());
  var dLon = toRad(this.lng() - latlng.lng());

  var lat1 = toRad(this.lat());
  var lat2 = toRad(latlng.lat());

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) *
          Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return radius * c * 0.621371192;
}

google.maps.LatLng.prototype.within = function(latlng,radius) {
  return this.distanceTo(latlng) <= radius;
}

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

function lookupPosition(latlng,fn) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
      'location' : latlng
    },
    function(results,status) {
      if (status == google.maps.GeocoderStatus.OK) {
        fn(results[0]);
      }
    }
  );
}
