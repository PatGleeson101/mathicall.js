/* MathicallJS module: set.js

Dependencies: None
*/

var set = (function(){
	"use strict";

	//Cache function dependencies
	const random = Math.random;
	const floor = Math.floor;

	//Constants
	const UNS = 0; //Code for unsorted
	const ASC = 1; //Code for ascending order
	const DES = 2; //Code for descending order

	//Functions
	function contains(set, value, sorted = UNS) {
		const len = set.length;
		if ((sorted === UNS)||(len < 32/*CHOOSE THIS PROPERLY*/)) { //Unsorted or length small; search entire array
			for (let i = 0; i < len; i++) {
				if (set[i] === value) {return i;} //Found it
			}
		} else { //Sorted; use binary search
			let lowerBound = 0;
			let upperBound = len - 1;
			if (sorted === ASC) {
				while (upperBound - lowerBound > 16) {
					let i = floor(0.5 * (lowerBound + upperBound));
					const val = set[i];
					if (val > value) {
						upperBound = i - 1;
					} else if (val < value) {
						lowerBound = i + 1;
					} else { //Found it!
						return i;
					}
				}
			} else if (sorted === DES) {
				while (upperBound - lowerBound > 16) {
					let i = floor(0.5 * (lowerBound + upperBound));
					const val = set[i];
					if (val > value) {
						lowerBound = i + 1;
					} else if (val < value) {
						upperBound = i - 1;
					} else { //Found it!
						return i;
					}
				}
			}
			while (lowerBound <= upperBound) { //Linear search once region becomes small enough
				if (set[lowerBound] === value) {return lowerBound;}
				lowerBound++;
			}
		}
		return -1; //Not contained
	}

	function count(set, value, sorted = UNS) {
		const len = set.length;
		let result = 0;
		if ((sorted === UNS)||(len < 64/*CHOOSE THIS PROPERLY*/)) { //Unsorted or length small; search entire array
			for (let i = 0; i < len; i++) {
				if (set[i] === value) {result += 1;}
			}
		} else {//Sorted; use binary search
			/*WIP*/
		}
		return result;
	}

	function min(set) { //No 'sorted' parameter as min of sorted is trivial
		let min = set[0]; //Defaults to undefined if count is 0
		const count = set.length;
		for (let i = 1; i < count; i++) {
			const element = set[i];
			if (element < min) {
				min = element;
			}
		}
		return min;
	}

	function max(set) { //No 'sorted' parameter as max of sorted is trivial
		let max = set[0]; //Defaults to undefined if count is 0
		const count = set.length;
		for (let i = 1; i < count; i++) {
			const element = set[i];
			if (element > max) {
				max = element;
			}
		}
		return max;
	}

	function sum(set) {
		const count = set.length;
		let sum = 0;
		for (let i = 0; i < count; i++) {
			sum += set[i];
		}
		return sum;
	}

	function mean(set) { //In future must add option to prevent overflow by breaking array down
		return sum(set) / set.length;
	}

	return {
		contains: contains,
		count: count,
		min: min,
		max: max,
		sum: sum,
		mean: mean
	};
}());