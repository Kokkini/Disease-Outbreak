function Calc(){}

//returns html string for displaying calculation on the main page's content area
Calc.prototype.render = function(){
	var html_str = `
		<h2 style="margin-top: 0">Calculation Service</h2>
		<p>This page will allow you to get either the factorial or summation of a positive integer seed. For example, if the given seed is 5, the factorial is 1*2*3*4*5 = 120 and the summation is 1+2+3+4+5 = 15. An appropriate error message is displayed when no input or bad input is supplied.</p>
		<p>Please enter a seed (positive integer), then select the type of calculation from the drop-down:</p>
		<input type="text" id="seed_input" placeholder="Seed">
		<select id="calc_opts">
		<option value="fact">Factorial</option>
		<option value="sum">Summation</option>
		</select>
		<input type="button" onclick="getCalc()" value="Submit">
		<br/>
		<p>Calculation output will appear below:</p>
		<div id="out_calc"></div>`;
	return html_str;
}

//calculate the factorial of an integer seed
Calc.prototype.fact = function(seed){
	var result = 1;
	for(i=1; i<=seed; i++){
		result *= i;
	}
	return result;
}

//calculate the summation of an integer seed
Calc.prototype.sum = function(seed){
	var result = 0;
	for(i=0; i<=seed; i++){
		result += i;
	}
	return result;
}

module.exports = Calc;