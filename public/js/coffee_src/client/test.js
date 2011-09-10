var updatePosition;
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