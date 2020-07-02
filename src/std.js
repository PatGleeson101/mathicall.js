/* MathicallJS module: std.js

Dependencies: None
*/

var std = (function(){
	"use strict";

	const trunc = Math.trunc;
	const floor = Math.floor;
	const round = Math.round;
	const abs = Math.abs;

	function min2(a, b) {
		return (a > b) ? b : a;
	}

	function max2(a, b) {
		return (a > b) ? a : b;
	}

	function minA(array) {
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

	function maxA(array) {
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

	function lerp(x, y, r) {
		return x + (y - x) * r;
	}

	//Modular exponentiation
	function powMod(base, exp, m) {
		base = abs(round(base));
		exp = abs(round(exp));
		m = round(m);
		if (m === 1) {
			return 0;
		} else {
			let result = 1;
			base = base % m;
			while (exp > 0) {
				if (exp & 0x1) {
					result = (result * base) % m;
				}
				exp = exp >> 1;
				base = (base ** 2) % m;
			}
			return result;
		}
	}

	function mod(x, m) {
		return x - m * floor(x / m);
	}

	const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 622702800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000];

	function factorial(n) {
		if (n > 18) {
			return Number.MAX_SAFE_INTEGER;
		} else if (n >= 0) {
			return factorials[n];
		} else {
			return undefined;
		}
	}

	function nCr(n, r) {
		return factorial(n)/(factorial(r)*factorial(n-r)); //To be optimised in future by removing common factors or using pascal's triangle
	}

	function nPr(n, r) {
		if ((r > n) || (n < 0) || (r < 0)) {
			return 0;
		} else if (n < 19) {
			return factorials[n]/factorials[r];
		} else {
			result = 1;
			while (n > r) {
				result *= n--;
			}
			return result;
		}
	}

	function fract(x) {
		return x - trunc(x);
	}

	return {
		min2: min2,
		max2: max2,
		minA: minA,
		maxA: maxA,
		lerp: lerp,
		hypot: Math.hypot,
		mod: mod,
		powMod: powMod,
		factorial: factorial,
		nCr: nCr,
		nPr: nPr,
		trunc: trunc,
		fract: fract
	};
}());