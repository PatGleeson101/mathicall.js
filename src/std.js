/* MathicallJS module: std.js

Dependencies: None
*/

var std = (function(){
	"use strict";

	//Cache function dependencies
	const trunc = Math.trunc;
	const floor = Math.floor;

	//Functions
	function min(a, b) {
		return (a < b) ? a : b;
	}

	function max(a, b) {
		return (a > b) ? a : b;
	}

	function lerp(x, y, r) {
		return x + (y - x) * r;
	}

	function mod(x, m) {
		return x - m * floor(x / m);
	}

	function fract(x) {
		return x - trunc(x);
	}

	return {
		min: min,
		max: max,
		lerp: lerp,
		mod: mod,
		fract: fract,
	};
}());