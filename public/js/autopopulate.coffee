currentOne = -1
lasOne = -1

autoPopulate = () ->
    addClient 0

addClient = (index) ->
    currentOne = index
    $.each ['name', 'tn', 'age', 'zip'], (index, data) ->
        $('#' + data).val('')
        populateFields fakeData[index][0], fakeData[index][2],fakeData[index][3], fakeData[index][2]

afterPopulate = () ->
    if lastOne + 1 < fakeData.length
        setTimeout addClient( (lastOne + 1), 1000)

populateFields = (name, tn, age, zip, index) ->
    didNothing = 0
    if name.length > 0
        addLet = name.substr(0,1)
        name = name.substr(1)
        $('#name').val($('#name').val()+addLet)
    else if tn.length > 0
        addLet = tn.substr(0,1)
        tn = tn.substr(1)
        $('#tn').val($('#tn').val()+addLet)
    else if age.length > 0
        addLet = age.substr(0,1)
        age = age.substr(1)
        $('#age').val($('#age').val()+addLet)
    else if zip.length > 0
        addLet = zip.substr(0,1)
        zip = zip.substr(1)
        $('#zip').val($('#zip').val()+addLet)
    else
        didNothing = 1


    if didNothing > 0
        updateLocation()
        setTimeout '$(#call").submit();', 200;
        lastOne = currentOne
        currentOne = -1
        setTimeout 'afterPopulate();', 201
    else
        setTimeout("populateFields('"+ name +"','" + tn + "', '" + age +"','" + zip +"' );", 10