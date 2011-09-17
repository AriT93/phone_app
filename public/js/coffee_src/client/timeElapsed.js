var updateTimeElapsed;
updateTimeElapsed = function() {
  var $callList, currUnixTime, todaysDate;
  setTimeout("updateTimeElapsed();", 10000);
  todaysDate = new Date;
  currUnixTime = Math.round(todaysDate.getTime() / 1000);
  $callList = $('#callList');
  return $callList.children().each(function() {
    var createdDate, unixTime;
    if ($(this).attr('createdOn') !== void 0) {
      createdDate = new Date($(this).attr('createdOn'));
      unixTime = Math.round(createdDate.getTime() / 1000);
      return $(this).children().each(function() {
        var difference, minutes, seconds;
        if ($(this).attr('title') === 'timeElapsed') {
          alert($(this).attr('title'));
          difference = currUnixTime - unixTime;
          alert(difference);
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