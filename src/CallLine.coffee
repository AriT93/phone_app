class CallLine extends Element
    constructor: (obj)->
        @li = $('<li>')
        @name = obj["name"]
        @tn = obj["tn"]
        @city = obj["city"]
        @state = obj["state"]
        @zip = obj["zip"]
        @createdOn = obj["createdOn"]
        @li.addClass "ui-widget-content"
        super @li
    getLine: ->
        for value in ['name', 'tn', 'city', 'state', 'zip', 'createdOn']
            d = new Div()
            d.addClass "span2"
            fieldVal = @[value]
            switch value
                when 'tn'
                    d.addClass "alpha"
                    fieldVal = formatNum fieldVal
                when 'createdOn'
                    fieldVal = 0
                    d.attr 'title', 'timeElapsed'
            d.html fieldVal
            @li.append d.elem
        @li.addClass "call"
        @li.attr 'id', @tn
        @li.append d.elem
        d = new Div()
        d.addClass "span1 omega"
        phb = new PhoneButton(@tn)
        d.append phb.button
        @li.append d.elem
        return @li
    getOV: ->
        ulcall = $('<ul>')
        limain = $('<li>')
        lilow = $('<li>')
        ovdiv = new Div()
        ovdiv.attr 'id', @tn + "_ov"
        ovdiv.addClass "simple_overlay"
        for value in ['name', 'tn']
            d = new Div()
            d.addClass "span4 ov_top"
            switch value
                when 'tn'
                    d.html formatNum(@tn)
                when 'name'
                    d.html @name
            limain.append d.elem
        for value in ['city', 'state', 'zip']
            d = new Div()
            d.addClass "span2 ov_bottom"
            d.html @[value]
            lilow.append d.elem
        grid = new Div()
        grid.addClass "span12"
        grid.attr 'id', 'calls'
        limain.appendTo ulcall
        lilow.appendTo ulcall
        grid.append ulcall
        ovdiv.appendTo '<a class="close"></a>'
        ph = new PhoneImage()
        ovdiv.append ph.img
        ovdiv.append grid.elem
        ovdiv.appendTo "#calls_ov"

root = exports ? window
root.CallLine = CallLine