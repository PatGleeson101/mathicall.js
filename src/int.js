/* MathicallJS module: int.js

Dependencies: std
*/

var int = (function(){
	"use strict";

	//Cache function dependencies
	const round = Math.round;
	const abs = Math.abs;
	const min = std.min;

	//Constants
	function computeFactorials() { //Private to module
		const result = new Float64Array(171);
		result[0] = 1;
		for (let i = 1; i < 171; i++) {
			result[i] = i * result[i-1];
		}
		return result;
	}

	function computeBinomials(n) { //Private to module
		const result = Array(++n);
		let row = new Float64Array([1]);
		let prev = row;
		result[0] = row;
		for (let i = 1; i < n; i++) {
			row = new Float64Array(i+1);
			row[0] = 1;
			for (let j = 1; j < i; j++) {
				row[j] = prev[j-1] + prev[j];
			}
			row[i] = 1;
			prev = row;
			result[i] = row;
		}
		return result;
	}

	const FACTORIALS = computeFactorials();
	const PASCAL_MAX_ROW = 10;
	const BINOMIALS = computeBinomials(PASCAL_MAX_ROW);

    //Combinatorial functions
    function factorial(n) {
		if (n > 170) {return Number.MAX_VALUE;}
		if (n < 0) {return undefined;}
		return FACTORIALS[n];
	}

	function choose(n, r) {
		if ((r > n)||(n < 0)||(r < 0)) {return 0;} //Return 0
		if (n <= PASCAL_MAX_ROW) {return BINOMIALS[n][r];} //Return pre-computed
		//Not pre-computed
		const k = min(r, n - r);
		const nMinusK = n - k;
		let result = 1;
		let i = 1;
		while (i <= k) {
    		result *= (nMinusK + i)/(i++);
		}
		return result;
	}

	function permute(n, r) {
		if ((r > n) || (n < 0) || (r < 0)) {return 0;}
		r = n - r;
		if (n < 171) {
			return round(FACTORIALS[n]/FACTORIALS[r]);
		}
		let result = 1;
		if (r < 168) { //MUST OPTIMISE THIS CONSTANT (cannot be larger than 170)
			result = round(FACTORIALS[170]/FACTORIALS[r]);
			r = 170;
		} 
		while (r < n) {
				result *= ++r;
		}
		return result;
	}

	//Greatest common divisor
	function gcd(a, b) {
		//Input & trivial cases
		a = abs(a);
		b = abs(b);
		if (a===0) {return b;}
		if (b===0) {return a;}
		//Algorithm
		if ((a < 4294967296)&&(b < 4294967296)) { //Safe to use bitwise operators
			let shift = 0;
			while (((a | b)&1) === 0) { //Remove common factors of 2
				a = a >>> 1;
				b = b >>> 1;
				shift++;
			}
			while ((a & 1) === 0) { //Remove extra factors of 2 from a
				a = a >>> 1;
			}
			while (b !== 0) {
				while ((b & 1) === 0) { //Remove extra factors of 2 from b
					b = b >>> 1;
				}
				if (a > b) { //Swap if a > b
					const temp = a;
					a = b;
					b = temp;
				}
				b -= a;
			}
			return a << shift;
		} else { //Numbers too large to use bitwise operators
			while (a !== b) {
				if (a > b) {
					a -= b;
				} else {
					b -= a;
				}
			}
			return a;
		}
	}

	//Lowest common multiple
	function lcm(a, b) {
		if ((a === 0)||(b === 0)) {return 0;}
		return abs((a / gcd(a, b)) * b);
	}

	//Szudzik integer pairing functions
	function pair(x, y) { //signed to signed
		x = (x < 0) ? (-2 * x - 1) : (x * 2);
		y = (y < 0) ? (-2 * y - 1) : (y * 2);
		return (y < x) ? (x * x + x + y) : (y * y + x);
	}

	function upair(x, y) { //unsigned to unsigned
		x = abs(x);
		y = abs(y);
		return (y < x) ? (x * x + x + y) : (y * y + x);
	}

	//Modular exponentiation
	function mpow(base, exp, m) {
		base = abs(round(base));
		exp = abs(round(exp));
		m = round(m);
		if (m === 1) {
			return 0;
		} else {
			let result = 1;
			base = base % m;
			while (exp > 0) {
				if (exp & 1) {
					result = (result * base) % m;
				}
				exp = exp >> 1;
				base = (base ** 2) % m;
			}
			return result;
		}
	}
	
	return {
		factorial: factorial,
		choose: choose,
		permute: permute,
		gcd: gcd,
		lcm: lcm,
		pair: pair,
		upair: upair,
		mpow: mpow,
	};
}());
	