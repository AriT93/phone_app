updateTimeelapsed = () ->
    setTimeout("updateTimeelapsed()", 10000)
    todaysDate = new Date
    currUnixTime = Math.round todaysDate.getTime() /1000
    $callList = $('#callList')
    $callList.children.each () ->
        if $this.attr('createdon') !== undefined
            createdDate = new Date $callList.attr('createdDate')
            unixTime = Math.round createdDate.getTime / 1000
            $callList.children.each () ->
                if $this.attr('title') == 'timeElapsed'
                    difference = currUnixTime - unixTime
                    seconds = difference % 60
                    if seconds < 10
                        seconds = '0' + seconds
                    difference -= seconds
                    minutes = difference/60
                    $this.html minutes + ':' + seconds