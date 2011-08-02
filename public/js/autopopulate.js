var fakeData = [["Malinda Molder","(608)677-9491","61701",68],["Darryl Beedle","(291)629-8625","52806",21],["Clinton Deibert","(967)871-4828","52807",18],["Nannie Streater","(302)995-0068","60076",25],["Allan Vonruden","(670)033-9373","61821",22],["Rohner","(558)053-7270","61801",50],["Hugh Cearley","(987)905-5914","52804",55],["Allan Janzen","(288)283-6020","61820",44],["Hugh Kilcrease","(577)621-6210","60091",52],["Hugh Ribas","(750)323-1221","60076",52],["Tyrone Dashner","(607)465-1005","60077",43],["Javier Gholar","(749)020-8106","60077",51],["Ted Heberling","(955)029-9366","60076",74],["Hugh Dilullo","(536)379-4242","52722",16],["Lance Angelucci","(744)542-6334","61265",31],["Rosalinda Meiser","(499)269-0036","60077",22],["Hugh Ashline","(829)353-8394","61701",46],["Katy Leaman","(662)842-8404","52803",50],["Christian Costanza","(425)174-8983","60022",38],["Jeanie Fehr","(690)364-0957","60022",42],["Louisa Parrino","(485)932-7331","61820",62],["Cody Backlund","(590)122-4588","52807",67],["Kelly Shuey","(272)927-2248","52722",46],["Clinton Poirrier","(848)432-5278","61704",50],["Christian Adami","(827)982-4544","60022",66],["Emilia Blocher","(650)436-5508","61265",22],["Fernando Kohan","(420)102-8039","52803",66],["Noemi Tousant","(965)365-3856","61821",18],["Nelson Highfill","(812)189-6884","52802",64],["Erik Sartwell","(780)379-0856","61701",22]];

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
	if(lastOne < fakeData.length) {
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
		updateLocation();
		setTimeout('$("#call").submit();', 1000);
		//push button code goes here
		lastOne = currentOne;
		currentOne = -1;
		setTimeout('afterPopulated();', 1500);
	} else {
		setTimeout("populateFields('"+name+"','"+tn+"','"+age+"','"+zip+"');", 5);
	}
}
