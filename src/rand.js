/* MathicallJS module: rand.js

Dependencies: std, vec
*/

var rand = (function(){
	"use strict";

	//Cache function dependencies
	const mod = std.mod;
	const floor = Math.floor;
	const abs = Math.abs;
	const fract = std.fract;
	const dot3 = vec.dot3;

	//Park-Miller constants
	const a = 48271;
	const m = 2147483647;
	const mp1 = 2147483648;

	//Multiplicative congruential generator using Park-Miller constants
	function MCG(seed) {
		seed = floor(seed) || 1;
	    return function() {
	    	seed = mod(seed * a, m);
	    	return seed / mp1;
	    }
	};

	//Indexed MCG
	function iMCG(seed) {
		//Constants (seed also remains constant)
		seed = abs(foor(seed)) || 1;
		const minSkip = 700; //Must be optimised

		//Internal state
		let state = seed;
		let i = 0;
		let skip = 0;

		//Function
		return function(index) {
			//Starting state
			index = mod(index, mp1);
			if (index < i) {
				i = 0;
				state = seed;
			}

			//Skip to desired index
			skip = index - i;
			if (skip < minSkip) { //Faster to iterate (small skip)
				for (let j = 0; j < skip; j++) {
					state = mod(state * a, m);
				}
			} else { //Faster to use fast modular exponentiation (large skip)
				let aiMod = 1;
				while (skip > 0) {
					if (skip%2 === 1) {
						aiMod = (aiMod*a) % m
					} //Otherwise, result remains constant
					skip = skip >> 1;
					aiMod = (aiMod**2) % m;
				}
				state = (aiMod * state) % m;
			}

			//Update index
			i = index;

			//Return state mapped to [0,1]
			return state / mp1;
		}
	}

	//Wrapper for window's inbuilt 'Crypto' functions
	const crypto = window.crypto || window.msCrypto;
	let cryptoUint32 = null;
	if (crypto != undefined) {
		cryptoUint32 = function(n = 1) {
			const result = new Uint32Array(n);
			crypto.getRandomValues(result);
			return result;
		}
	} else {
		console.warn('rand: crypto functions unavailable');
	}

	//Random hashing hashing
	function floatfloat(p) {
		p = fract(p * 0.1031);
		p *= p + 33.33;
		p *= p + p;
		return fract(p);
	}

	function vec2float(vec) {
		const pX = fract(vec[0] * 0.1031);
		const pY = fract(vec[1] * 0.1031);
		const offset = dot3([pX, pY, pX], [pY + 33.33, pX + 33.33, pX + 33.33]);
		return fract((pX + pY + 2 * offset) * (pX + offset));
	}

	return {
		MCG: MCG,
		iMCG: iMCG,
		cryptoUint32: cryptoUint32,
		floatfloat: floatfloat,
		vec2float: vec2float
			};
}());