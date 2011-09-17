updateTimeElapsed = () ->
    setTimeout("updateTimeElapsed();", 10000)
    todaysDate = new Date
    currUnixTime = Math.round(todaysDate.getTime() /1000)
    $callList = $('#callList')
    $callList.children().each () ->
        if $(this).attr('createdOn') != undefined
            createdDate = new Date($(this).attr('createdOn'))
            unixTime = Math.round(createdDate.getTime() / 1000)
            alert unixTime
            $(this).children().each () ->
                if $(this).attr('title') == 'timeElapsed'
                    alert $(this).attr('title')
                    difference = currUnixTime - unixTime
                    alert difference
                    seconds = difference % 60
                    if seconds < 10
                        seconds = '0' + seconds
                    difference -= seconds
                    minutes = difference/60
                    $(this).html(minutes + ':' + seconds)
