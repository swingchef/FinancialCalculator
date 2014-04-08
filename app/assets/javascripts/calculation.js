// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// TODO Add minimum monthly payment amount to all appropriate areas
// TODO Take out alerts when finished debugging
// TODO Number/has value validation on the input forms
// TODO Create a boolean within the last for loop and set it to false when inputs are blank/not right, or set it to true only when all three have been completed
var FC = FC === undefined ? {} : FC;

FC.calculate = {

	// This is the amount that we want to initially use
	// for monthly payments based on the user's yearly salary
	PAYMENT_PERCENT_OF_YEARLY_SALARY: .01,

	// Creates a <p><div><row of debt inputs></div></p> that is self-contained
	// Returns: jQuery <p> element 
	addDebtRow: function(existingDebt) {

		$(".addButton").hide();

		var accountsDiv = $('#accounts');
		var row = $(' \
		<div class="row"> \
			<div class="input-group col-sm-2"> \
				<input class="debtName form-control" placeholder="Debt Name"/> \
			</div> \
			<div class="input-group col-sm-2"> \
				<span class="input-group-addon">$</span> \
				<input class="debtAmount form-control" placeholder="Debt Amount"/> \
			</div> \
			<div class="input-group col-sm-2"> \
				<input class="interestRate form-control" placeholder="Interest Rate"/> \
				<span class="input-group-addon">%</span>		 \
			</div> \
			<div class="input-group col-sm-2"> \
				<span class="input-group-addon">$</span> \
				<input class="minMonthlyPayment form-control" placeholder="Min. Payment"/> \
			</div>	 \
			<div class="col-sm-2"> \
				<button type="button" class="subtractButton btn btn-default btn-sm">-</button> \
				<button type="button" class="addButton btn btn-default btn-sm">+</button> \
			</div> \
		</div> \
				');
		accountsDiv.append(row);
		
		// Populate the existing debts, if they exist
		if (typeof existingDebt != 'undefined') {
			row.find('.debtName').val(existingDebt.name);
			row.find('.debtAmount').val(existingDebt.amount);
			row.find('.interestRate').val(existingDebt.interest_rate);
			row.find('.minMonthlyPayment').val(existingDebt.min_monthly_payment);
		}

		FC.calculate.toggleMinusButtons();

		$('.subtractButton:last').click(function() {
			$(this).parents('div.row').remove();
			FC.calculate.toggleMinusButtons();
		});

		$('.addButton:last').click(function() {		
			FC.calculate.addDebtRow();
		});
	},

	// Scans the existing rows, and hides/shows the appropriate buttons
	toggleMinusButtons: function() {
		if ($('#accounts div.row').size() > 1) {
			$('button.subtractButton').show();
		}else{
			$('button.subtractButton').hide();
		}
		// Always make sure there is at least one add button visible
		$('.addButton:last').show();
	},

	// nper function
	// TODO What does it do?
	nper:			function(rate, per, pmt, pv, fv) {
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
		nper_value = FC.calculate.conv_number(nper_value, 2);
		return (nper_value);
	},

	// FutureValue Function
	// TODO What does it do?
	fv:				function(rate, per, nper, pmt, pv) {
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
		fv_value = FC.calculate.conv_number(fv_value, 2);
		return (fv_value);
	},

	// This function is from David Goodman's Javascript Bible.
	// TODO What does it do?
	conv_number:	function(expr, decplaces) {
		var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));
		while (str.length <= decplaces) {
			str = "0" + str;
		}
		var decpoint = str.length - decplaces;
		return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));

	},

	saveDebts: function(){
		// Save Salary
		var salary = parseFloat($('#income_input').val());
		$.post('/schedule', {
			salary: salary
		},
		function(data){
			console.log(data);
		});

		// TODO Handle Debt deletion (and save)

		// TODO Resolve code duplication
		$('#accounts div.row').each(function() {
			var debtName = $(this).find('.debtName').val();
			var debtAmount = parseFloat($(this).find('.debtAmount').val());
			var debtInterestRate = parseFloat($(this).find('.interestRate').val());
			var minMonthlyPayment = parseFloat($(this).find('.minMonthlyPayment').val());

			$.post('/debt', {
				name: debtName,
				amount: debtAmount,
				interest_rate: debtInterestRate,
				min_monthly_payment: minMonthlyPayment
				},
				function(data){
					console.log(data);
				}
			);
		});
	}
}

/////////////////////////////////
//	Document.Ready
/////////////////////////////////
$(document).ready(function() {

	if (typeof existing_salary != 'undefined' && existing_salary) {
		$('#income_input').val(existing_salary);
	}
	// TODO This should not return '1' if there is nothing there...
	if (typeof existing_debt_array != 'undefined' && existing_debt_array) {
		console.log('existing_debt_array.length = ' + existing_debt_array.length);
		for (var i = 0; i < existing_debt_array.length; i++){
			FC.calculate.addDebtRow(existing_debt_array[i]);
		}
	}
	// Add a new debt row if needed
	if ($('#accounts div.row').size() < 1) {
		FC.calculate.addDebtRow();
	}

	$('#save_button').click(FC.calculate.saveDebts);
	// NEED TO STILL CREATE A FOR LOOP WHICH STARTS AROUND 20 -> 1, CHECKS FOR dname_.value, when found, sets i = .value and breaks
	var i = 4;

	// Is this a good amount? this will change to whatever the for loop finds
	var financialArray = [];
	// this is the array which will store the values of each row

	// Use the boolean to prevent an incomplete array from being sent to the next method.
	var button = $('#calculate_button');

	button.click(function() {
		// Get the yearly salary and derive the the monthly payment
		// TODO add in validation to see if income has value
		var yearlySalary = $('#income_input').val();
		var payment = parseFloat(yearlySalary)/12 * FC.calculate.PAYMENT_PERCENT_OF_YEARLY_SALARY;
		//alert("This is your initial income-based payment: "+ payment);

		var financialArray = [];
		// Iterate through all the visible Debt paragraphs
		$('#accounts div.row').each(function() {
			var debtName = $(this).find('.debtName').val();
			var debtAmount = parseFloat($(this).find('.debtAmount').val());
			var debtInterestRate = parseFloat($(this).find('.interestRate').val());
			var minMonthlyPayment = parseFloat($(this).find('.minMonthlyPayment').val());

			financialArray.push({
				name: debtName,
				amount: debtAmount * -1,
				rate: debtInterestRate,
				minPay: minMonthlyPayment
			});
		});

		// Resets all of the input fields to a non-error state
		$('input').removeClass('error');

		// The array is sorted according to AMOUNT(Should this be something else?)
		financialArray = financialArray.sort(function(a, b) {
			return a[1] > b[1];
		});

		console.log(financialArray);

		// TODO Need to review this against an external site that does the same
		// TODO Make this its own function, for organization
		var storedArray = [];

		// This accumulates each iteration, at the beginning we assume
		// that the amount(10) is 1% of the person's income
		var futureValue = 0;

		// This doesn't change and is only used in the nper function
		var totalMonthsPassed = 0;

		// This adds the nper calculations per iteration, plus the
		// special "rollover" payment month when one debt is finished
		// and the difference is applied to the next
		var finalMonthRolloverAmount = 0;

		// This holds the unique value applied to the next debt during rollover month
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

			payoffMonths = FC.calculate.nper(parseFloat(financialArray[i]["rate"]), 12, payment, financialArray[i]["amount"], futureValue);

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
			var lastMonthAmount = FC.calculate.fv(parseFloat(financialArray[i]["rate"]), 12, roundedPayoffMonths, payment, financialArray[i]["amount"]);
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
			currentDebtAmount = FC.calculate.fv(financialArray[i+1]["rate"], 12, totalMonthsPassed, financialArray[i+1]["minPay"], financialArray[i+1]["amount"]);
			console.log("The next debt's current amount at " + totalMonthsPassed + " months is " + currentDebtAmount);
			//calculates next month's fv with rollover payment
			var amountAfterRollover = FC.calculate.fv(financialArray[i+1]["rate"], 12, 1, financialArray[i+1]["minPay"] + finalMonthRolloverAmount, (currentDebtAmount * -1));
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
	});
	// eventListener
});

