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

		// Resets all of the input fields to a non-error state
		$('input').removeClass('error');

		var payment = parseFloat($("input[name=\"income_input\"]").val())/12 * .01 ;
		alert("This is your income-based payment: "+ payment);
		//TODO add in validation to see if income has value
		for ( i = 100; i > 1; i--) {// this for loop assumes that the user will have no more than 100 inputs, increase var i to desired amount
			// for loop is finding
			// TODO Add a class to designate inputs, so we don't need to use the magic number, 100
			var testerInput = document.getElementsByName("dname_scnt_" + i);
			if (testerInput.length > 0) {
				break;
			}// end if
		}// end for

		//alert("number of input rows is: " + i);
		// TODO take this out when debug.complete
		var arrayRowCounter = 0;
		for (var z = 1; z < i + 1; z++) {// this for loop will be correct when i holds the correct number
			// below the values are retrieved from the input boxes

			var dnameVar = $('input[name=\"dname_scnt_' + z + '\"]').val();
			//alert("debt namelength: " + dnameVar.length)
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
					$('input[name="interest_scnt_' + z + '"]').addClass('error');
					alert("Please make sure that the highlighted cells are in number format");
				};
				if (isNaN(amountVar)) {
					$('input[name="amount_scnt_' + z + '"]').addClass('error');
					alert("Please make sure that the highlighted cells are in number format");
				};
				if (isNaN(minPayVar)) {
					$('input[name="minpayamount_scnt_' + z + '"]').addClass('error');
					alert("Please make sure that the highlighted cells are in number format");
				};

				break;
				// TODO perform this check for amountVar and InterestVar instead

			};
			if (dnameVar.length == 0 & (!isNaN(amountVar) | !isNaN(interestVar) | !isNaN(minPayVar))) {

				$('input[name="dname_scnt_' + z + '"]').addClass('error');
				alert("Please make sure that the highlighted cell holds the name for its respective row");
				break;
			};
			// get the other inputs in the same row if the first input has something
			// add the values of each row to the array

			//alert(dnameVar + amountVar + interestVar + minPayVar);

			//alert("Got to array");
			financialArray[arrayRowCounter] = {
				name : dnameVar,
				amount : amountVar * -1,
				rate : interestVar,
				minPay : minPayVar
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
		 //alert("Reached End of Inputs, Going to About Page");

		// document.location.href ="/about";
		// this will change to whatever the calculation page is

		var storedArray = [];

		//var payment = parseFloat(document.getElementsByName("income_input").value) / 12 * .01;
		//alert("This is your income-based payment: "+ payment);
		//this accumulates each iteration, at the beginning we assume that the amount(10) is 1% of the person's income
		var futureValue = 0;
		//this doesn't change and is only used in the nper function
		var totalMonthsPassed = 0;
		//this adds the nper calculations per iteration, plus the special "rollover" payment month when one debt is finished and the difference is applied to the next
		var finalMonthRolloverAmount = 0;
		// this holds the unique value applied to the next debt during rollover month
		payment = payment + financialArray[0]["minPay"];
		var currentDebtAmount = 0;
		var payoffMonths;

		for (var i = 0; i < financialArray.length; i++) {
			var paymentSchedule = [];
			storedArray[i] = {
				"debtName" : financialArray[i]["name"],
				"debtAmount" : financialArray[i]["amount"]
			};
			console.log("Debt: " + financialArray[i]["name"] + " Amount: " + financialArray[i]["amount"]);

			payoffMonths = nper(parseFloat(financialArray[i]["rate"]), 12, payment, financialArray[i]["amount"], futureValue);

			//we round down in order to perform the fv function
			var roundedPayoffMonths = Math.floor(payoffMonths);
			console.log("Number of complete months to payoff debt " + financialArray[i]["name"] + ": " + roundedPayoffMonths);

			//updating first payment schedule slot for each debt
			if (i == 0) {
				paymentSchedule[0] = {
					"payment" : 0,
					"months" : totalMonthsPassed,
					"period" : 0
				};

			} else {
				paymentSchedule[0] = {
					"payment" : financialArray[i]["minPay"],
					"months" : totalMonthsPassed - 1, //last month is accounted for in paymentSchedule[1]
					"period" : 0
				};

			};

			totalMonthsPassed = totalMonthsPassed + roundedPayoffMonths;

			//this calculates the last month amount and then adds the difference to the minPay of the next debt
			var lastMonthAmount = fv(parseFloat(financialArray[i]["rate"]), 12, roundedPayoffMonths, payment, financialArray[i]["amount"]);
			lastMonthAmount = lastMonthAmount * (1+(financialArray[i]["rate"]*.01));
			console.log("The residual amount in the last month is for " + financialArray[i]["name"] + ": " + lastMonthAmount);
			console.log("Rollover Amount: " + finalMonthRolloverAmount+ " going into array storage");
			if (i == 0) {
				paymentSchedule[1] = {
					"payment" : 0,
					"months" : 0,
					"period" : 1
				};

			} else {
				paymentSchedule[1] = {
					"payment" : financialArray[i]["minPay"] + finalMonthRolloverAmount,
					"months" : 1,
					"period" : 1
				};

			};

			finalMonthRolloverAmount = payment - (lastMonthAmount); //TODO account for interest in the last month

			console.log("Rollover Amount: " + finalMonthRolloverAmount);
			//function nper(rate, per, pmt, pv, fv)
			//function fv(rate, per, nper, pmt, pv)
			paymentSchedule[2] = {
				"payment" : payment,
				"months" : roundedPayoffMonths,
				"period" : 2
			};

			paymentSchedule[3] = {
				"payment" : lastMonthAmount,
				"months" : 1,
				"period" : 3
			};

			storedArray[i]["paymentSchedule"] = paymentSchedule;
			if (i + 2 > financialArray.length) {
				break;
			}
			//here currentDebtAmount refers to the next loans value using the totalMonthPassed as the number of periods and 12 as NPER/YR
			currentDebtAmount = fv(financialArray[i+1]["rate"], 12, totalMonthsPassed, financialArray[i+1]["minPay"], financialArray[i+1]["amount"]);
			console.log("The next debt's current amount at " + totalMonthsPassed + " months is " + currentDebtAmount);
			//calculates next month's fv with rollover payment
			var amountAfterRollover = fv(financialArray[i+1]["rate"], 12, 1, financialArray[i+1]["minPay"] + finalMonthRolloverAmount, (currentDebtAmount * -1));
			console.log("Amount after rollover payment month: " + amountAfterRollover);
			//below, the original array is altered to hold the current amount for the next debt for the start of it's iteration
			financialArray[i+1]["amount"] = amountAfterRollover * -1;
			//accounting for rollover month timewise
			totalMonthsPassed = totalMonthsPassed + 1;

			payment = payment + financialArray[i+1]["minPay"];
			console.log("The base pay is now " + payment + " END LOOP");

		}//end for

		for (var i = 0; i < financialArray.length; i++) {
			console.log("Printing the payment schedule " + storedArray[i]["debtName"]);
			console.log(storedArray[i]["paymentSchedule"]);
		}//end for

		function nper(rate, per, pmt, pv, fv) {

			fv = parseFloat(fv);

			pmt = parseFloat(pmt);

			pv = parseFloat(pv);

			per = parseFloat(per);

			if ((per == 0 ) || (pmt == 0 )) {

				alert("Why do you want to test me with zeros?");

				return (0);

			}

			rate = eval((rate) / (per * 100));

			if (rate == 0)// Interest rate is 0

			{

				nper_value = -(fv + pv) / pmt;

			} else {

				nper_value = Math.log((-fv * rate + pmt) / (pmt + rate * pv)) / Math.log(1 + rate);

			}

			nper_value = conv_number(nper_value, 2);

			return (nper_value);

		}

		function conv_number(expr, decplaces) {// This function is from David Goodman's Javascript Bible.

			var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));

			while (str.length <= decplaces) {

				str = "0" + str;

			}

			var decpoint = str.length - decplaces;

			return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));

		}

		//futureValue Function//////////////////////////////////////////////

		function fv(rate, per, nper, pmt, pv) {

			nper = parseFloat(nper);

			pmt = parseFloat(pmt);

			pv = parseFloat(pv);

			rate = eval((rate) / (per * 100));

			if ((pmt == 0 ) || (nper == 0 )) {

				alert("Why do you want to test me with zeros?");

				return (0);

			}

			if (rate == 0)// Interest rate is 0

			{

				fv_value = -(pv + (pmt * nper));

			} else {

				x = Math.pow(1 + rate, nper);

				// y = Math.pow(1 + rate, nper);

				fv_value = -(-pmt + x * pmt + rate * x * pv ) / rate;

			}

			fv_value = conv_number(fv_value, 2);

			return (fv_value);

		}

		function conv_number(expr, decplaces) {// This function is from David Goodman's Javascript Bible.

			var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));

			while (str.length <= decplaces) {

				str = "0" + str;

			}

			var decpoint = str.length - decplaces;

			return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));

		}

	});
	// eventListener

	var scntDiv = $('#p_scents');
	var i = $('#p_scents p').size() + 1;

	$('#addScnt').click(function() { 
		$('<p><label for="p_scnts"><input type="text" id="p_scnt" size="25" name="dname_scnt_' + (i) + '" value="" placeholder="Debt Name" /><input type="text" id="amount_scnt" size="25" name="amount_scnt_' + (i) + '" placeholder="Debt Amount"/><input type="text" id="interest_scnt" size="25" name="interest_scnt_' + (i) + '"placeholder="Interest Rate"/><input type="text" id="mpamount_scnt" size="25" name="minpayamount_scnt_' + (i) + '"placeholder="Min. Monthly Payment"/></label><a href="#" id="remScnt">Remove</a></p>').appendTo(scntDiv);
		i++;
		return false;
	});

	$('#remScnt').live('click', function() {
		if (i > 2) {
			$(this).parents('p').remove();

			i--;
		}
		return false;
	});
});
