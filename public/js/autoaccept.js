function autoAgent(zip) {
	$('#zip').val(zip);
	updateLocation();
	setTimeout("acceptCall();", 100);
}

function acceptCall() {
	// accept one call every second.
	setTimeout("acceptCall()", 4000);
	
	//check that there is at least 1 call to take.
	var potatoes = $('#callList').children();
	if(!(potatoes.length > 1)) return;
	
	//click the first button that's visible.
	for(var i = 0; i < $('button').length; i++) {
		if($($('button')[i]).is(":visible")) {
			$($('button')[i]).click();
			$($($('button')[i]).attr('rel')+' >a:first').each(function(){$(this).click();});
			break;
		}
	}
	//click the close button of the overlay
}
