/*MathicallJS item: benchmark.js
A small module for benchmarking functions

Dependencies: None
*/

var benchmark = (function(){
	"use strict";

	function createBench(func, inputCount) {
		//Generate input strings
		let inputDeclaration = "";
		let inputString = "";
		for (let i = 0; i < inputCount; i++) {
			inputDeclaration += "let v"+i+"=inputs["+i+"]";
			inputString += "v"+i+",";
		}
		if (inputCount > 0) {
			inputString = inputString.slice(0,-1);
		}

		//Define function
		const funcString = `function(count, inputs){`+ inputDeclaration+ `;
			let time = Date.now();
			for (let i = 0; i < count; i++) {
				func(`+ inputString +`);
			}
			return (Date.now()-time)/count;}`;

		//Create function
		return Function("func", "return " + funcString)(func);
	}

	return {
		createBench: createBench
			};
}());