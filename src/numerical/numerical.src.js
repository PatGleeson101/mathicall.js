import {abs, floor, EPSILON} from "../standard/inbuilt.src.js";

function frac(num, tolerance = num * EPSILON * 10) { //Farey rational approximation algorithm
	const wholePart = floor(num);
	const fractionalPart = num - wholePart;
	let leftNumerator = 0;
	let leftDenominator = 1;
	let rightNumerator = 1;
	let rightDenominator = 1;
	let numerator = leftNumerator
	let denominator = leftDenominator;
	let currentValue = numerator / denominator;
	while (abs(currentValue - fractionalPart) > tolerance) {
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

const epsilon = Math.cbrt(EPSILON);
function derivative(f, x) {
	const x0 = x * (1 + epsilon);
	const x1 = x * (1 - epsilon);
	const dx = x1 - x0;
	return (f(x1) - f(x0)) / dx;
}

//Freeze exports
Object.freeze(frac);
Object.freeze(derivative);

export {frac, derivative}