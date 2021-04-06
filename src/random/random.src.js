import {E, ln, exp as stdExp, random, floor, ceil, abs, sqrt, trunc} from "../standard/standard.lib.js";
import { sdev } from "../statistics/statistics.src.js";

//Constants
// Ratio-of-uniforms
const RU_SCALE_CONSTANT = sqrt(2 / E);
// Park-Miller
const MCG_A = 48271;
const MCG_M = 2147483647;
const MCG_M_PLUS_1 = MCG_M + 1;

//Unseeded random number generation
// Continuous uniform distribution
function unif(a = 0, b = 1, count = undefined) { //a>b or b>a
	if (count === undefined) { //Return single value
		return a + (b - a) * random();
	} else { //Return array of values
		const result = new Float64Array(count);
		for (let i = 0; i < count; i++) {
			result[i] = a + (b - a) * random();
		}
		return result;
	}
}

// Uniform integer distribution
function int(a, b, count = undefined) { //assumes b > a
	const A = ceil(a)
	const B = floor(b) + 1
	const r = B - A;
	if (count === undefined) { //Return single value
		return floor(A + random() * r);
	} else { //Return array of values
		const result = new Float64Array(count);
		for (let i = 0; i < count; i++) {
			result[i] = floor(A + r * random());
		}
		return result;
	}
}

// Normal distribution
function norm(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
	if (count === undefined) { //Return single value
		while (true) {
			const u1 = random();
			const v2 = random();
			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
			const x = u2 / u1;
			if ( (u1 * u1) <= stdExp(-0.5 * x * x)) {
				return mean + x * sd;
			}
		}
	} else { //Return array of values
		const result = new Float64Array(count);
		let i = 0;
		while (i < count) {
			const u1 = random();
			const v2 = random();
			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
			const x = u2 / u1;
			if ( (u1 * u1) <= stdExp(-0.5 * x * x)) {
				result[i++] = mean + x * sd;
			}
		}
		return result;
	}
}

// Exponential distribution
function exp(lambda = 1, count = undefined) {
	if (count === undefined) { //Return single value
		return -ln(random()) / lambda;
	} else { //Return array of values
		const result = new Float64Array(count);
		for (let i = 0; i < count; i++) {
			result[i] = -ln(random()) / lambda;
		}
		return result;
	}
}

//Seeded random number generators

// (Uniform) Multiplicative congruential generator
function MCG(a = 0, b = 1, seed = int(1, 4294967295)) {
	let scaleFactor, state; //Declare variables
	const _seed = function(s = undefined) {
		if (s !== undefined) { //Set new seed and reset state
			seed = floor(abs(s)); //TODO: use hash instead of just floor(abs())
			state = seed;
		}
		return seed; //Return current seed (whether updated or not)
	}
	const _range = function(r = a, s = b) {
		//Set new range
		a = r;
		b = s;
		scaleFactor = (b - a) / MCG_M_PLUS_1;
		return [a, b];
	}
	//Initialise variables
	_seed(seed);
	_range(a, b);

	const generator = function(count = undefined) {
		if (count === undefined) { //Return single value
			state = (state * MCG_A) % MCG_M;
			return a + state * scaleFactor;
		} else { //Return array of values
			const result = new Float64Array(count);
			for (let i = 0; i < count; i++) {
				state = (state * MCG_A) % MCG_M;
				result[i] = a + state * scaleFactor;
			}
			return result;
		}
	}

	generator.seed = Object.freeze(_seed);
	generator.range = Object.freeze(_range);
	return Object.freeze(generator);
}

//Xorshift
function Xorshift32(a = 0, b = 1, seed = int(1, 4294967295)) {
	const state = new Uint32Array(1);
	let scaleFactor;
	const _seed = function(s = undefined) {
		if (s !== undefined) { //Set new seed and reset state
			seed = trunc(s) || 1; //TODO: use hash, not just trunc(s)
			state[0] = seed;
		}
		return seed; //Return current seed (whether updated or not)
	}
	const _range = function(r = a, s = b) {
		//Set new range
		a = r;
		b = s;
		scaleFactor = (b - a) / 4294967296;
		return [a, b];
	}

	_seed(seed);
	_range(a, b);

	const generator = function(count = undefined) {
		if (count === undefined) { //Return single value
			state[0] ^= state[0] << 13;
			state[0] ^= state[0] << 17;
			state[0] ^= state[0] << 5;
			return state[0] * scaleFactor;
		} else { //Return array of values
			const result = new Float64Array(count);
			for (let i = 0; i < count; i++) {
				state[0] ^= state[0] << 13;
				state[0] ^= state[0] << 17;
				state[0] ^= state[0] << 5;
				result[i] = state[0] * scaleFactor;
			}
			return result;
		}
	}

	generator.seed = Object.freeze(_seed);
	generator.range = Object.freeze(_range);
	return Object.freeze(generator);
}

function RU(mean = 0, sd = 1, seed = int(1, 4294967295)) { //Ratio of uniforms
	const urand = Xorshift32(0, 1, seed); //TODO: hash seed
	
	const generator = function(count = undefined) {
		if (count === undefined) { //Return single value
			while (true) {
				const u1 = urand();
				const v2 = urand();
				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
				const x = u2 / u1;
				if ( (u1 * u1) <= stdExp(-0.5 * x * x)) {
					return mean + x * sd;
				}
			}
		} else { //Return array of values
			const result = new Float64Array(count);
			let i = 0;
			while (i < count) {
				const u1 = urand();
				const v2 = urand();
				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
				const x = u2 / u1;
				if ( (u1 * u1) <= stdExp(-0.5 * x * x)) {
					result[i++] = mean + x * sd;
				}
			}
			return result;
		}
	}

	const _mean = function(u = mean) {
		mean = u;
		return mean;
	}

	const _sd = function(s = sd) {
		sd = s;
		return sd;
	}

	generator.seed = urand.seed; //TODO: hash seed
	generator.mean = Object.freeze(_mean);
	generator.sd = Object.freeze(_sd);

	return Object.freeze(generator);
}

const Unif = Xorshift32;
const Norm = RU;

const Int = function(a, b, seed = int(1, 4294967295)) {
	const urand = Xorshift32(ceil(a), floor(b) + 1, seed); //TODO: hash seed

	const generator = function(count = undefined) {
		if (count === undefined) { //Return single value
			return floor(urand());
		} else { //Return array of values
			const result = urand(count);
			for (let i = 0; i < count; i++) {
				result[i] = floor(result[i]);
			}
			return result;
		}
	}

	const _range = function(r = a, s = b) {
		a = r;
		b = s;
		urand.range(ceil(a), floor(b) + 1);
		return [a, b];
	}

	generator.seed = urand.seed; //TODO: hash seed
	generator.range = Object.freeze(_range);

	return Object.freeze(generator);
}

// Exponential
function Exp(lambda = 1, seed = int(1, 4294967295)) {
	const urand = Xorshift32(0, 1, seed); //TODO: hash seed

	const generator = function(count = undefined) {
		if (count === undefined) { //Return single value
			return -ln(urand()) / lambda;
		} else { //Return array of values
			const result = new Float64Array(count);
			for (let i = 0; i < count; i++) {
				result[i] = -ln(urand()) / lambda;
			}
			return result;
		}
	}

	const _lambda = function(l = lambda) {
		lambda = l;
		return lambda;
	}

	generator.seed = urand.seed;
	generator.lambda = Object.freeze(_lambda);

	return Object.freeze(generator);
}

// Freeze exports
Object.freeze(unif);
Object.freeze(int);
Object.freeze(norm);
Object.freeze(exp);

Object.freeze(MCG);
Object.freeze(Xorshift32);
Object.freeze(RU);

Object.freeze(Unif);
Object.freeze(Int);
Object.freeze(Norm);
Object.freeze(Exp);

// Export
export {unif, int, norm, exp}
export {MCG, Xorshift32, RU}
export {Unif, Int, Norm, Exp}