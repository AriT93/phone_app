var addClient, afterPopulate, autoPopulate, currentOne, lasOne, populateFields;
currentOne = -1;
lasOne = -1;
autoPopulate = function() {
  return addClient(0);
};
addClient = function(index) {
  currentOne = index;
  return $.each(['name', 'tn', 'age', 'zip'], function(index, data) {
    $('#' + data).val('');
    return populateFields(fakeData[index][0], fakeData[index][2], fakeData[index][3], fakeData[index][2]);
  });
};
afterPopulate = function() {
  if (lastOne + 1 < fakeData.length) {
    return setTimeout(addClient(lastOne + 1, 1000));
  }
};
populateFields = function(name, tn, age, zip, index) {
  var addLet, didNothing, lastOne;
  didNothing = 0;
  if (name.length > 0) {
    addLet = name.substr(0, 1);
    name = name.substr(1);
    $('#name').val($('#name').val() + addLet);
  } else if (tn.length > 0) {
    addLet = tn.substr(0, 1);
    tn = tn.substr(1);
    $('#tn').val($('#tn').val() + addLet);
  } else if (age.length > 0) {
    addLet = age.substr(0, 1);
    age = age.substr(1);
    $('#age').val($('#age').val() + addLet);
  } else if (zip.length > 0) {
    addLet = zip.substr(0, 1);
    zip = zip.substr(1);
    $('#zip').val($('#zip').val() + addLet);
  } else {
    didNothing = 1;
  }
  if (didNothing > 0) {
    updateLocation();
    setTimeout('$(#call").submit();', 200);
    lastOne = currentOne;
    currentOne = -1;
    return setTimeout('afterPopulate();', 201);
  } else {
    return setTimeout("populateFields('" + name(+"','" + tn + "', '" + age(+"','" + zip(+"' );"))));
  }
};