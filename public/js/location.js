function toRad(degrees) {
  return Math.PI * (degrees / 180);
}

function Coordinate(latitude,longitude) {
  this.latitude  = latitude;
  this.longitude = longitude;

  this.distanceTo = distanceTo;
  this.within = within;

  function within(coordinate,radius) {
    return this.distanceTo(coordinate) <= radius;
  }

  function distanceTo(coordinate) {
    var radius = 6371;
    
    var dLat = toRad(this.latitude - coordinate.latitude);    
    var dLon = toRad(this.longitude - coordinate.longitude);    

    var lat1 = toRad(this.latitude);
    var lat2 = toRad(coordinate.latitude);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * 
            Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return radius * c * 0.621371192;
  }
}

function getCoordinate(zip) {
  var coordinate;
  $.ajax({
    async: false,
    type: 'GET',
    //url: 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='+zip,
    url: '/location/'+zip,
    contentType: "application/json; charset=utf-8",
    success: function(data) {
      if (data && data.results && data.results.length >= 1) {
        coordinate = new Coordinate(
          data.results[0].geometry.location.lat,
          data.results[0].geometry.location.lng
        );
      }
    },
    error: function() {
      alert("This ajax call didn't work");
    }
  });
  return coordinate;
}


//This is a test function
function test() {
  var lawton = getCoordinate(51030); 
  var normal = getCoordinate(61761); 
  //var lawton = new Coordinate(42.482883,-96.173912);
  //var normal = new Coordinate(40.518485,-88.989245);

  alert('distance is ' + Math.round(lawton.distanceTo(normal)) + ' miles');
}
