/* MathicallJS module: hash.js

Dependencies: std, vec
*/

var hash = (function(){
	"use strict";

	//Dependencies
	const abs = Math.abs;
	const fract = std.fract;
	const dot3 = vec.dot3;

	//Szudzik pairing functions
	function uSzudzik2(x, y) { //W -> W
		const X = abs(x);
		const Y = abs(y);
		return (X >= Y) ? (X * X + X + Y) : (Y * Y + X);
	}

	function sSzudzik2(x, y) { //Z -> Z
		const X = x >= 0 ? x * 2 : x * -2 - 1;
		const Y = y >= 0 ? y * 2 : y * -2 - 1;
		return (X >= Y) ? (X * X + X + Y) : (Y * Y + X);
	};

	function recursiveSzudzik(...ints) {
		if (ints.length === 2) {
			return sSzudzik2(ints[0], ints[1]);
		} else {
			return sSzudzik2(ints[0], recursiveSzudzik(...ints.slice(1)));
		}
	}

	//Vector hashing
	function float1to1(p) {
		p = fract(p * 0.1031);
		p *= p + 33.33;
		p *= p + p;
		return fract(p);
	}

	function vec2to1(vec) {
		const pX = fract(vec[0] * 0.1031);
		const pY = fract(vec[1] * 0.1031);
		const offset = dot3([pX, pY, pX], [pY + 33.33, pX + 33.33, pX + 33.33]);
		return fract((pX + pY + 2 * offset) * (pX + offset));
	}
	
	return {
		uSzudzik2: uSzudzik2,
		sSzudzik2: sSzudzik2,
		recursiveSzudzik: recursiveSzudzik,
		float1to1: float1to1,
		vec2to1: vec2to1
			};
}());