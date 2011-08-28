(function() {
  var acceptCall, autoAgent;
  autoAgent = function(zip) {
    $('zip').val(zip);
    updateLocation();
    return setTimeout("acceptCall()", 100);
  };
  acceptCall = function() {
    var b, potatoes, _i, _len, _ref, _results;
    setTimeout("acceptCall()", 4000);
    potatoes = $('#callList').children;
    if (!potatoes.length) {
      return;
    }
    _ref = $('button');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      if (b.is(":visible")) {
        b.click();
        b.attr('rel').each(function() {
          return this.click();
        });
        break;
      }
    }
      return _results;
  };
}).call(this);
