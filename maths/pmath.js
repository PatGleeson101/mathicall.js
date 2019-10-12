/* MathicallJS module: pmath.js
A faster, less friendly extension of Javascript's inbuilt Math library

Dependencies: None
*/

/*
Implemented:
min
max

To check and implement if beneficial:
cbrt
sqrt
ceil
floor
round
sign
trunc

Already super fast in built-in Math module:
abs
hypot (even rivals cases where number of arguments known beforehand and explicitly coded for)

To add:
gcd
lcm
*/

var pmath = (function(){
	"use strict";

	function min(array) {
		let min = array[0];
		let len = array.length;
		let item;
		for (let i = 1; i < len; i++) {
			item = array[i];
			if (item < min) {
				min = item;
			}
		}
		return min;
	}

	function max(array) {
		let max = array[0];
		let len = array.length;
		let item;
		for (let i = 1; i < len; i++) {
			item = array[i];
			if (item > max) {
				max = item;
			}
		}
		return max;
	}

	function lerp(x, y, weight) {
		return x + (y - x)*weight;
	}

	return {
		min: min,
		max: max,
		lerp: lerp,
		hypot: Math.hypot
	};
}());