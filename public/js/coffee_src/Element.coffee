class Element
    constructor: (elem)->
        @elem = elem
    addClass: (cssClass) ->
        @elem.addClass cssClass
    attr: (attr, val) ->
        @elem.attr attr, val
    appendTo: (elem) ->
        @elem.appendTo elem
    append: (elem) ->
        @elem.append elem
    html: (elem)->
        @elem.html elem
    elem: ->
        @elem

root = exports ? window
root.Element = Element