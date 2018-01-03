class PhoneButton extends Element
    constructor: (tn)->
        @button = $('<button rel="#' + tn + '_ov" onclick=takeCall(' + tn + ');>')
        @button.overlay {
            onClose: () ->
                s = {callDelete:{tn: CallLive}}
                socket.json.send s
                $("#" + CallLive + "_ov").remove()
                }
        img = new PhoneImage()
        @button.append img.img
