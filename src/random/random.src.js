import {E, ln, exp as stdExp, random, floor, abs, sqrt, trunc} from "../standard/standard.lib.js";

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
		result = new Float64Array(count);
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
function norm(mean, sd, count = undefined) { //Ratio-of-uniforms algorithm
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
function exp(lambda, count = undefined) {
	if (count === undefined) { //Return single value
		return -ln(random()) / lambda;
	} else { //Return array of values
		result = new Float64Array(count);
		for (let i = 0; i < count; i++) {
			result[i] = -ln(random()) / lambda;
		}
		return result;
	}
}

//Seeded random number generators

// (Uniform) Multiplicative congruential generator
function MCG(seed, range = [0, 1]) {
	let s, a, b, scaleFactor, state; //Declare variables
	const _seed = function(seed = undefined) {
		if (seed !== undefined) { //Set new seed and reset state
			s = floor(abs(seed));
			state = s;
		}
		return s; //Return current seed (whether updated or not)
	}
	const _range = function(range = undefined) {
		if (range !== undefined) { //Set new range
			a = range[0];
			b = range[1];
			scaleFactor = (b - a) / MCG_M_PLUS_1;
		}
		return [a, b];
	}
	//Initialise variables
	_seed(seed);
	_range(range);

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
function Xorshift32(seed, range = [0, 1]) {
	const state = new Uint32Array(1);
	let a, b, scaleFactor;
	const _seed = function(s = undefined) {
		if (s !== undefined) { //Set new seed and reset state
			seed = trunc(s) || 1;
			state[0] = seed;
		}
		return seed; //Return current seed (whether updated or not)
	}
	const _range = function(r = undefined) {
		if (r !== undefined) { //Set new range
			a = r[0];
			b = r[1];
			scaleFactor = (b - a) / 4294967296;
		}
		return [a, b];
	}

	_seed(seed);
	_range(range);

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

function RU(seed, mean = 0, sd = 1) { //Ratio of uniforms
	const urand = Xorshift32(seed+1);
	//TODO: hash seed instead of just adding 1
	
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

	const _mean = function(u = undefined) {
		if (u !== undefined) {
			mean = u;
		}
		return mean;
	}

	const _sd = function(s = undefined) {
		if (s !== undefined) {
			sd = s;
		}
		return sd;
	}

	generator.seed = urand.seed;
	generator.mean = Object.freeze(mean);
	generator.sd = Object.freeze(sd);

	return Object.freeze(generator);
}

const Unif = Xorshift32;
const Norm = RU;

const Int = function(seed, range = [0, 1]) {
	const urand = Xorshift32(seed, [ceil(range[0]), floor(range[1]) + 1]);

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

	const _range = function(r = undefined) {
		if (r !== undefined) {
			urand.range([ceil(r[0]), floor(r[1]) + 1]);
		}
		return urand.range();
	}

	generator.seed = urand.seed;
	generator.range = Object.freeze(_range);

	return Object.freeze(generator);
}

// Exponential
function Exp(seed, lambda = 1) {
	const urand = Xorshift32(seed);

	const generator = function(count = undefined) {
		if (count === undefined) { //Return single value
			return -ln(urand()) / lambda;
		} else { //Return array of values
			result = new Float64Array(count);
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