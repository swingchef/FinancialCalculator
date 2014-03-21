// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/


// TODO Add minimum monthly payment amount to all appropriate areas
// TODO Take out alerts when finished debugging
// TODO Number/has value validation on the input forms
// TODO Create a boolean within the last for loop and set it to false when inputs are blank/not right, or set it to true only when all three have been completed

$(document).ready(function() {

	// Use the boolean to prevent an incomplete array from being sent to the next method.
	var button = $('#calculate_button');


	// NEED TO STILL CREATE A FOR LOOP WHICH STARTS AROUND 20 -> 1, CHECKS FOR dname_scnt_.value, when found, sets i = .value and breaks
	var i = 4;

	// Is this a good amount? this will change to whatever the for loop finds
	var financialArray = [];
	// this is the array which will store the values of each row

	button.click(function() {
		// code which is commented out was a test
		//  var firstCell = $('input[name="dname_scnt_1"]').val();
		//  alert(firstCell);
		//  if(firstCell.length > 0 & !typeof firstCell == "undefined"){
		//  financialArray[0][0] = firstCell;
		//  alert(firstCell);
		//      }

		var inputs, index;

		inputs = document.getElementsByTagName('input');
		for ( index = 0; index < inputs.length; ++index) {
			inputs[index].style.border = "5px solid #999";
		}

		for ( i = 100; i > 1; i--) {// this for loop assumes that the user will have no more than 100 inputs, increase var i to desired amount
			// for loop is finding
			var testerInput = document.getElementsByName("dname_scnt_" + i);
			if (testerInput.length > 0) {
				break;
			}// end if
		}// end for

		alert("number of input rows is: " + i);
		// TODO take this out when debug.complete
		var arrayRowCounter = 0;
		for (var z = 1; z < i + 1; z++) {// this for loop will be correct when i holds the correct number
			// below the values are retrieved from the input boxes

			var dnameVar = $('input[name=\"dname_scnt_' + z + '\"]').val();
			alert("debt namelength: " + dnameVar.length)
			var amountVar = parseFloat($('input[name=\"amount_scnt_' + z + '\"]').val());
			var interestVar = parseFloat($('input[name=\"interest_scnt_' + z + '\"]').val());
			var minPayVar = parseFloat($('input[name=\"minpayamount_scnt_' + z + '\"]').val());
			// alert("dnamevar: " + dnameVar);
			// alert("amountvar " + amountVar);
			// alert("interestVar " + interestVar);
			// alert("minVar " + minPayVar);

			if (dnameVar.length == 0 & isNaN(amountVar) & isNaN(interestVar) & isNaN(minPayVar)) {
				alert("Nothing on this row has anything in it");
				continue;
			};

			if (dnameVar.length > 0 & (isNaN(amountVar) | isNaN(interestVar) | isNaN(minPayVar))) {

				if (isNaN(interestVar)) {
					document.getElementsByName("interest_scnt_" + z)[0].style.border = "5px solid red";
					alert("Please make sure that the highlighted cells are in number format");
				};
				if (isNaN(amountVar)) {
					document.getElementsByName("amount_scnt_" + z)[0].style.border = "5px solid red";
					alert("Please make sure that the highlighted cells are in number format");
				};
				if (isNaN(minPayVar)) {
					document.getElementsByName("minpayamount_scnt_" + z)[0].style.border = "5px solid red";
					alert("Please make sure that the highlighted cells are in number format");
				};

				break;
				// TODO perform this check for amountVar and InterestVar instead

			};
			if (dnameVar.length == 0 & (!isNaN(amountVar) | !isNaN(interestVar) | !isNaN(minPayVar))) {

				document.getElementsByName("dname_scnt_" + z)[0].style.border = "5px solid red";
				alert("Please make sure that the highlighted cell holds the name for its respective row");
				break;
			};
			// get the other inputs in the same row if the first input has something
			// add the values of each row to the array

			alert(dnameVar + amountVar + interestVar + minPayVar);

			alert("Got to array");
			financialArray[arrayRowCounter] = {
				0 : dnameVar,
				1 : amountVar,
				2 : interestVar,
				3 : minPayVar
			};

			// the array is sorted according to AMOUNT(Should this be something else?)
			financialArray = financialArray.sort(function(a, b) {
				return a[1] > b[1];
			});
			console.log(financialArray);
			var total = financialArray[arrayRowCounter][1] + financialArray[arrayRowCounter][2] + financialArray[arrayRowCounter][3];

			// alert("Array sum: "+ total);
			arrayRowCounter++;
			// don't forget to convert this into a decimal
			// as long as the rows hold the right inputs, it doesn't matter what order these are stored in
			// else
		};// for loop
		// alert("Reached End of Inputs, Going to About Page");

		// document.location.href ="/about";
		// this will change to whatever the calculation page is

	});
	// eventListener

 	
	var scntDiv = $('#p_scents');
	var i = $('#p_scents p').size() + 1;

	$('#addScnt').click(function() {
		$('<p><label for="p_scnts"><input type="text" id="p_scnt" size="25" name="dname_scnt_' 
		+(i) +'" value="" placeholder="Debt Name" /><input type="text" id="amount_scnt" size="25" name="amount_scnt_'
		+(i) +'" placeholder="Debt Amount"/><input type="text" id="interest_scnt" size="25" name="interest_scnt_'
		+(i)+'"placeholder="Interest Rate"/><input type="text" id="mpamount_scnt" size="25" name="minpayamount_scnt_'
		+(i)+'"placeholder="Min. Monthly Payment"/></label><a href="#" id="remScnt">Remove</a></p>').appendTo(scntDiv);
		i++;
		return false;
	});

	$('#remScnt').click(function() { 
		if( i > 2 ) {
			$(this).parents('p').remove();

			i--;
		}
		return false;
	});
});
