import {abs, floor, EPSILON} from "../standard/standard.lib.js";

function frac(num, tolerance = num * EPSILON) { //Farey rational approximation algorithm
	const wholePart = floor(num);
	const fractionalPart = num - whole;
	let leftNumerator = 0;
	let leftDenominator = 1;
	let rightNumerator = 1;
	let rightDenominator = 1;
	let numerator = 1
	let denominator = 2;
	let currentValue = numerator / denominator;
	while (abs(currentValue - num) > tolerance) {
		if (fractionalPart > currentValue) {
			leftNumerator = numerator;
			leftDenominator = denominator;
			numerator += rightNumerator;
			denominator += rightDenominator;
		} else {
			rightNumerator = numerator;
			rightDenominator = denominator;
			numerator += leftNumerator;
			denominator += leftDenominator;
		}
		currentValue = numerator / denominator;
	}
	const result = new Int32Array(2);
	result[0] = numerator + denominator * wholePart;
	result[1] = denominator;
	return result;
}

function deriv(f, x) {
	x0 = x * (1 + EPSILON);
	x1 = x * (1 - EPSILON);
	dx = x1 - x0;
	return (f(x1) - f(x0)) / dx;
}

//Freeze exports
Object.freeze(frac);
Object.freeze(deriv);

export {frac, deriv}