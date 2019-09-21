/*MathicallJS item: pseudorandom.js
Provides basic pseudorandom functions

Dependencies:
hashing.js
*/

var pseudorandom = (function(){
	//Load dependencies as local variables
	const hsh = hashing; 

	//Multiplicative congruential generator using Park-Miller constants
	function lehmerLCG(seed) {
	    return function() {
	      seed = (seed * 48271) % 2147483647;
	      return seed / 2147483648;
	    }
	};

	function biRand(seed) { //Must be nonzero integer seed (0 -> not random)
		return function(a,b) { //Must be nonnegative integer inputs (else breaks)
			const LCG = lehmerLCG(seed); //Initialise 
			LCG(); //'Throw out' initial value (initial value is predictable)
			const count = hsh.szudzikPair(a,b); //Hash input pair to unique value
			for (let i = 0; i < count-1; i++) { //Skip the next (count-1) LCG values
				LCG();
			}
			return LCG(); //Return next LCG value
		}
	}

	return {lehmerLCG: lehmerLCG,
			biRand: biRand};
}());