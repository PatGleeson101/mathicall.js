/*MathicallJS item: benchmark.js
A small module for benchmarking functions

Dependencies: None
*/

var benchmark = (function(){
	"use strict";

	function bench(count, f, ...inputs) {
		let time;
		let sum = 0;
		for (let i = 0; i < count; i++) {
			time = Date.now();
			f(...inputs); //ISSUE: SPREAD TAKES ADDITIONAL TIME
			sum += Date.now()-time;
		}
		return sum/count; //Returns average runtime
	}

	return {
		bench: bench
			};
}());