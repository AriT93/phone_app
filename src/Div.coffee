class Div extends Element
    constructor: ->
        @div = $('<div>')
        super @div


root = exports ? window
root.Div = Div