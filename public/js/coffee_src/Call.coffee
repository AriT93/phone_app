class Call extends Element
    constructor: ->
        @li = $('<li>')
        super @li
root = exports ? window
root.Call = Call