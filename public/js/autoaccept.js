function autoAgent(zip) {
	$('#zip').val(zip);
	setTimeout("acceptCall();", 3000);
}

function acceptCall() {
	// accept one call every second.
	setTimeout("acceptCall()", 1000);
	
	//check that there is at least 1 call to take.
	var potatoes = $('#callList').children();
	if(!(potatoes.length > 1)) return;
	
	//click the first button
	$($('button')[0]).click();
	//click the close button of the overlay
	$($($('button')[0]).attr('rel')+' >a:first').each(function(){$(this).click();});
}
