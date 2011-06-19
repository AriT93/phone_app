
/* Author:

*/

function message(obj){
    var list="";
//    var el = document.createElement('p');
    if('message' in obj){
//        el.innerHTML = "<b>" + obj.message[0] + "</b>";

    }
    else if('result' in obj){
        for (var i in obj.result){
            Call = JSON.parse(obj.result[i]);
            if(obj.result[i] != undefined ){
                list += "<li>" + Call.name + " " + Call.tn + "</li>";
            }
        }
        if(list != ""){
          $('<p>').html(list).prependTo($("#chat"));
        }
    }
};

$(document).ready(function(){
    var socket = new io.Socket(null,
                   {port: 8910, rememberTransport: false,
        transports:["websocket","xhr-multipart","flashsocket"]});
    socket.connect();
    socket.on('message',function(obj){
        if(obj != undefined){
        if('buffer' in obj){
            for(var i in obj.buffer){
                if(buffer[i] != undefined){
                    message(obj.buffer[i]);
                }
            }
        }else{
            message(obj);
        }

        }
    });
});
