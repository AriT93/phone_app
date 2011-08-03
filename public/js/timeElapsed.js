function updateTimeElapsed() {
    setTimeout("updateTimeElapsed()", 10000);
    var todaysDate = new Date();
    var currUnixTime = Math.round(todaysDate.getTime() / 1000);
    $("#callList").children().each(function() {
        if($(this).attr('createdon') !== undefined) {
            var createdDate = new Date($(this).attr('createdon'));
            var unixTime = Math.round(createdDate.getTime()/1000);
            $(this).children().each(function() {
                if($(this).attr('title') == 'timeElapsed') {
                    var difference = currUnixTime - unixTime;
                    var seconds = difference % 60;
                    if(seconds < 10) seconds = '0' + seconds;
                    difference -= seconds;
                    var minutes = difference/60;
                    $(this).html(minutes + ':' + seconds);
                }
            });
        }
    });
}
