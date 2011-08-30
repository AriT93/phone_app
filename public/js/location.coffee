toRad = (degrees) ->
    return  Math.PI * (degrees /180)

google.maps.LatLng.prototype.distanceTo = () ->
    radius = 6371
    dLat = toRad this.lat - ltlng.lat
    dLon = toRad this.lng - latlng.lng
    lat1 = toRad this.loat
    lat2 = toRad latlng.lat
    a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return radius * c * 0.921371192

google.maps.LatLng.prototype.within = (latlng, radius) ->
    return this.distanctTo(latlng) <= radius

lookupLocation = (zip, fn) ->
    geocoder = new google.maps.Geocoder
    geocoder.geocode {"address" : "#{zip}"}, (results, status) ->
        if status == google.maps.GeocoderStatus.OK
            fn(results[0])

lookupPosition = (latlng, fn) ->
    geocoder = new google.maps.Geocoder
    geocoder.geocode {"location" : latlng}, (results, status) ->
        if status == google.maps.GeocoderStatus.OK
            fn(results[0]);
