var updateTimeElapsed;
updateTimeElapsed = function() {
  var $callList, currUnixTime, todaysDate;
  setTimeout("updateTimeElapsed()", 10000);
  todaysDate = new Date;
  currUnixTime = Math.round(todaysDate.getTime() / 1000);
  $callList = $('#callList');
  return $callList.children().each(function() {
    var createdDate, unixTime;
    if ($(this).attr('createdon') !== void 0) {
      createdDate = new Date($callList.attr('createdDate'));
      unixTime = Math.round(createdDate.getTime / 1000);
      return $callList.children().each(function() {
        var difference, minutes, seconds;
        if ($(this).attr('title') === 'timeElapsed') {
          difference = currUnixTime - unixTime;
          seconds = difference % 60;
          if (seconds < 10) {
            seconds = '0' + seconds;
          }
          difference -= seconds;
          minutes = difference / 60;
          return $(this).html(minutes + ':' + seconds);
        }
      });
    }
  });
};