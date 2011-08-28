currentOne = -1
lasOne = -1

autoPopulate = () ->
    addClient 0

addClient = (index) ->
    currentOne = index
    $.each ['name', 'tn', 'age', 'zip'], (index, data) ->
        $('##{data}').val('')
        populateFields fakeData[index][0], fakeData[index][2],fakeData[index][3], fakeData[index][2]

afterPopulate = () ->
    if lastOne + 1 < fakeData.length
        setTimeout addClient( (lastOne + 1), 1000)

populateFields = () ->
    didNothing = 0

