updatePosition = (position) ->
    $("#zip").val ""
    $("#latitude").val ""
    $("#longitude").val ""
    $("#city").val ""
    $("#state").val ""
    latlng = new google.maps.LatLng  position.coords.latitude,  position.coords.longitude
    if latlng != null
        lookupPosition latlng, (loc)->
            city = ""
            state = ""
            zip = ""
            $.each loc.address_components, (i,v) ->
                if $.inArray "locality", v.types > -1
                    city = v.short_name
                else if $.inArray "sublocality", v.types > -1
                    city = v.short_name
                if $.inArray "administrative_area_level_1", v.types > -1
                    state = v.short_name
                if $.inArray "postal_code", v.types > -1
                    zip = v.short_name
            lat = loc.geometry.location.lat
            lng = loc.geometry.location.lng
            $("#latitude").val lat
            $("#longitude").val lng
            $("#city").val city
            $("#state").val state
            $("zip").val zip
            limitCalls()