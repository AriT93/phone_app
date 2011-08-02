var fakeData = [["Malinda Molder","(784)525-5822","51241",28],["Darryl Beedle","(465)140-5982","50455",62],["Clinton Deibert","(414)659-6336","52131",47],["Nannie Streater","(323)032-2106","51455",27],["Allan Vonruden","(431)636-8143","60025",33],["Rohner","(527)792-7092","50836",67],["Hugh Cearley","(574)319-0450","60042",46],["Allan Janzen","(522)368-4039","50565",58],["Hugh Kilcrease","(595)366-8341","62543",16],["Hugh Ribas","(622)943-3526","50027",71],["Tyrone Dashner","(513)999-5541","60145",58],["Javier Gholar","(779)176-7161","50578",28],["Ted Heberling","(875)064-1288","60188",41],["Hugh Dilullo","(591)676-4569","50558",26],["Lance Angelucci","(966)192-6522","50501",67],["Rosalinda Meiser","(628)607-9178","62833",28],["Hugh Ashline","(530)574-7086","50660",41],["Katy Leaman","(539)860-5084","61238",36],["Christian Costanza","(910)167-2698","61078",65],["Jeanie Fehr","(628)021-9059","62048",63],["Louisa Parrino","(558)127-5992","60407",57],["Cody Backlund","(471)098-4737","50131",25],["Kelly Shuey","(931)009-5085","60084",26],["Clinton Poirrier","(417)590-6608","62975",64],["Christian Adami","(833)282-2180","50595",25],["Emilia Blocher","(742)141-9896","51458",37],["Fernando Kohan","(877)680-0311","62353",30],["Noemi Tousant","(840)568-4783","50309",69],["Nelson Highfill","(490)206-7595","52308",59],["Erik Sartwell","(416)703-0307","60913",69]];

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
		updateLocation();
		setTimeout('$("#call").submit();', 1000);
		//push button code goes here
		lastOne = currentOne;
		currentOne = -1;
		setTimeout('afterPopulated();', 1500);
	} else {
		setTimeout("populateFields('"+name+"','"+tn+"','"+age+"','"+zip+"');", 20);
	}
}
