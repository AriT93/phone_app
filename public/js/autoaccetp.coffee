autoAgent = (zip) ->
    $('zip').val(zip)
    updateLocation()
    setTimeout "acceptCall()", 100

acceptCall = ->
    setTimeout "acceptCall()", 4000

    potatoes = $('#callList').children
    if ! potatoes.length
        return

    for b in $('button')
        if b.is(":visible")
            b.click()
            b.attr('rel').each(
                () ->
                    this.click()
            )
            break
