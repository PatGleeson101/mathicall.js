import {round, abs, min} from "../standard/standard-lib.js";

function precomputeFactorials() { //Private to module
	const result = new Float64Array(171);
	result[0] = 1;
	for (let i = 1; i < 171; i++) {
		result[i] = i * result[i-1];
	}
	return result;
}

export function precomputeBinomials(b) {
	let n = 30;
	if ((b.constructor === Number)&&(isFinite(b))) { //Only accept numeric input
		n = abs(round(b));
	} else {
		throw "precomputeBinomials takes numeric input";
	}
	const len = 0.5 * (++n) * (n + 1);
	const result = new Float64Array(len);
	let i = -1;
	for (let k = 0; k < n; k++) {
		result[i++] = 1;
		for (let r = 1; r < k; r++) {
			result[i] = result[i - k - 1] + result[i - k];
			i++;
		}
		result[i++] = 1;
	}
	return result;
}

const FACTORIALS = precomputeFactorials(); //Max factorial is 170!
let BINOM_MAX_STORED_N = 30;
let BINOMIALS = precomputeBinomials(BINOM_MAX_STORED_N);

//Combinatorial functions
export function factorial(n) {
	if (n < 0) {return undefined;}
	if (n > 170) {return Number.MAX_VALUE;}
	return FACTORIALS[n];
}

export function choose(n, r) {
	if ((r > n)||(n < 0)||(r < 0)) {return 0;} //Return 0
	if (n <= BINOM_MAX_STORED_N) {return BINOMIALS[0.5 * n * (n + 1) + r];} //Return pre-computed
	//Not pre-computed
	const k = min(r, n - r);
	if (k > 514) {return Number.MAX_VALUE;} //Overflow check
	const nMinusK = n - k;
	let result = 1;
	let i = 1;
	while (i <= k) {
		result *= (nMinusK + i)/(i++);
	}
	return result;
}

export function permute(n, r) {
	if ((r > n) || (n < 0) || (r < 0)) {return 0;}
	if (r > 170) {return Number.MAX_VALUE;}
	r = n - r;
	if (n < 171) {
		return round(FACTORIALS[n]/FACTORIALS[r]);
	}
	let result = 1;
	if (r < 160) { //Skip multiplication of known values
		result = round(FACTORIALS[170]/FACTORIALS[r]);
		r = 170;
	} 
	while (r < n) {
		result *= ++r;
	}
	return result;
}

//Greatest common divisor
export function gcd(a, b) {
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
	} else { //Input too large to use bitwise operators
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
export function lcm(a, b) {
	if ((a === 0)||(b === 0)) {return 0;}
	return abs((a / gcd(a, b)) * b);
}

//Modular exponentiation
export function mpow(base, exp, m) {
	base = abs(base);
	exp = abs(exp);
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