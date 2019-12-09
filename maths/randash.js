/* MathicallJS module: randash.js
Provides basic pseudorandom functions
Provides hash functions

Dependencies:
loadhelper.js
*/

var randash = (function(){
	"use strict";

	//HASHES
	//Pairing functions
	function szudzikPair(x,y) { //Works for nonnegative integers; maps to nonnegative integers
		if (x < y) {
			return y*y + x;
		} else {
			return x*x + x + y;
		}
	}

	//Bitwise pairing functions
	function bit16Pair(x, y) { //Takes two signed integers in the range +/- 65535 (= 2^16 - 1)
		return (x << 16) | y; //Returns a single signed integer in the range +/- 2147483648 (= 2^31 - 1)
	}

	function bit26Pair(x, y) {
		return x*67108864 + y; //Currently unsure if this is entirely unique
	}

	//Higher pair functions
	function recursivePair(...ints) {
		if (ints.length === 2) {
			return szudzikPair(ints[0], ints[1]);
		} else {
			return szudzikPair(ints[0], recursivePair(...ints.slice(1)));
		}
	}

	//RANDOM NUMBER GENERATION
	//Multiplicative congruential generator using Park-Miller constants
	function MCG(seed) {
	    return function() {
	      seed = (seed * 48271) % 2147483647;
	      return seed / 2147483648;
	    }
	};

	//Indexed (skippable) MCG
	function iMCG(seed) {
		//Constants (note seed is constant)
		const a = 48271;
		const m = 2147483647;
		const skipThreshold = 700; //Must be optimised

		//Internal state
		let state = seed;
		let i = 0;
		let skip = 0;

		//Function
		return function(index) {
			//Establish starting state
			index = index % 2147483648;
			if (index < i) {
				i = 0;
				state = seed;
			}

			//Skip to desired index
			skip = index - i;
			if (skip <= skipThreshold) { //Faster to iterate (small skip)
				for (let j = 0; j < skip; j++) {
					state = (state * a) % m;
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

			//Return state mapped to 0-1
			return state / 2147483648;
		}
	}

	//2D indexed MCG
	function iMCG2D(seed) { //Must be nonzero integer seed (0 -> not random)
		return function(a,b) { //Must be nonnegative integer inputs (else breaks)
			const imcg = iMCG(seed); //Initialise 
			const index = szudzikPair(a, b); //Hash input pair to unique value
			return imcg(index);
		}
	}

	//n-dimensional indexed MCG
	function iMCGnD(seed) {
		return function(...ints) {
			const imcg = iMCG(seed);
			const index = recursivePair(...ints);
			return imcg(index);
		}
	}

	//WIP 'true' random function from 
	function createInternalRand() {
		const timeStamp = new Date();
		const l = 0;
	}

	return {
		szudzikPair: szudzikPair,
		bit16Pair: bit16Pair,
		bit26Pair: bit26Pair,
		recursivePair: recursivePair,
		MCG: MCG,
		iMCG: iMCG,
		iMCG2D: iMCG2D,
		iMCGnD: iMCGnD,
			};
}());