/* MathicallJS module: combi.js
Combinatorics

Dependencies: None
*/

var combi = (function(){
	"use strict";

	function permutations(values, length, mode = "array") { //Values must be distinct
		//Initialise permutations with length-1 permutations
		let permutations = values.map(val => [val]);

		//Iteratively extend each existing permutation by adding each of the possible values to the end
		for (let l = 1; l < length; l++) {
			//Create new list of permutations based on old list and possible values
			let newPermutations = [];
			for (let i = 0; i < permutations.length; i++) {
				for (let j = 0; j < values.length; j++) {
					newPermutations.push(permutations[i].concat([values[j]]));
				}
			}

			//Replace old set of permutations with updated set
			permutations = newPermutations;
		}

		//Return permutations
		return permutations;
	}

	function factorial(n) {
		if (n > 18) {
			return Number.MAX_SAFE_INTEGER;
		} else {
			let result = 1;
			for (let i = 1; i <= n; i++) {
				result *= i;
			}
			return result;
		}
	}

	function nCr(n,r) {
		return factorial(n)/(factorial(r)*factorial(n-r)); //To be optimised in future by removing common factors or using pascal's triangle
	}

	return {
		permutations: permutations,
		factorial: factorial,
		nCr: nCr
		};
}());
