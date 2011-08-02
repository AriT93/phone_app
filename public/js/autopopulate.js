var fakeData = [["Malinda Molder","(345)421-3080","36041",59],["Darryl Beedle","(670)875-0278","97909",58],["Clinton Deibert","(303)939-6447","99583",41],["Nannie Streater","(995)982-7346","64444",48],["Allan Vonruden","(783)614-1231","76123",39],["Rohner","(589)547-8255","91202",70],["Hugh Cearley","(811)156-3970","35007",32],["Allan Janzen","(954)486-6309","55727",58],["Hugh Kilcrease","(286)842-2289","35540",51],["Hugh Ribas","(914)037-0994","75476",51],["Tyrone Dashner","(562)578-9694","66209",16],["Javier Gholar","(332)433-4700","80233",38],["Ted Heberling","(981)349-0321","17307",24],["Hugh Dilullo","(596)192-7974","55397",29],["Lance Angelucci","(287)934-2619","22937",28],["Rosalinda Meiser","(262)307-2451","32803",74],["Hugh Ashline","(938)280-2363","07052",34],["Katy Leaman","(494)105-3705","14878",52],["Christian Costanza","(629)624-0398","31746",44],["Jeanie Fehr","(720)318-8218","64022",65],["Louisa Parrino","(434)767-8120","47456",55],["Cody Backlund","(392)873-8404","84315",36],["Kelly Shuey","(278)164-4967","66025",47],["Clinton Poirrier","(756)338-6042","52654",29],["Christian Adami","(394)361-6359","23866",24],["Emilia Blocher","(928)175-0285","24265",56],["Fernando Kohan","(311)849-0431","68020",42],["Noemi Tousant","(805)105-0270","24112",16],["Nelson Highfill","(620)173-7366","36270",44],["Erik Sartwell","(361)394-7200","66524",19]];

var currentOne = -1;
var lastOne = -1;

function autoPopulate() {
	addClient(0);
}

function addClient(index) {
	currentOne = index;
	$.each(['name', 'tn', 'age', 'zip'], function(index, data) { $('#'+data).val('');});
	populateFields(fakeData[index][0], fakeData[index][1], fakeData[index][3], fakeData[index][2]);
}

function afterPopulated() {

	if(currentOne < fakeData.length) {
		setTimeout("addClient("+(1 + lastOne)+");", 1000);
	}
}

function populateFields(name, tn, age, zip, index) {
	var didNothing = 0;
	if(name.length > 0) {
		var addLet = name.substr(0,1);
		name = name.substr(1);
		$('#name').val($('#name').val()+addLet);
	} else if(tn.length > 0) {
		var addLet = tn.substr(0,1);
		tn = tn.substr(1);
		$('#tn').val($('#tn').val()+addLet);
	} else if(age.length > 0) {
		var addLet = age.substr(0,1);
		age = age.substr(1);
		$('#age').val($('#age').val()+addLet);
	} else if(zip.length > 0) {
		var addLet = zip.substr(0,1);
		zip = zip.substr(1);
		$('#zip').val($('#zip').val()+addLet);
	} else {
		didNothing = 1;
	}

	if(didNothing > 0) {
		$('#zip').onblur();
		setTimeout('$("#call").submit();', 1000);
		//push button code goes here
		lastOne = currentOne;
		currentOne = -1;
		setTimeout('afterPopulated();', 2000);
	} else {
		setTimeout("populateFields('"+name+"','"+tn+"','"+age+"','"+zip+"');", 100);
	}
}
