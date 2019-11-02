/* MathicallJS module: matrixf.js
A function-oriented implementation of matrices

Notes:
An m x n matrix is represented by an array of length m containing subarrays each of length n

Dependencies:
vecf.js
*/

var matrixf = (function(){
	"use strict";

	//Dependencies
	//const dotVec = vecf.dotVec;
	const max = Math.max;
	const ceil = Math.ceil;
	const floor = Math.floor;

	//Matrix creation
	function matrix(m, n, value = 0) {
		let result = new Array(m);
		for (let i = 0; i < m; i++) {
			let row = new Array(n);
			row.fill(value);
			result[i] = row;
		}
		return result;
	}

	function identity(n) {
		let result = new Array(n);
		for (let i = 0; i < n; i++) {
			let row = new Array(n);
			row.fill(0);
			row[i] = 1;
			result[i] = row;
		}
		return result;
	}

	function zeros(m, n) {
		return matrix(m, n, 0);
	}

	function ones(m, n) {
		return matrix(m, n, 1);
	}

	//Scalar multiplication
	function scale(matrix, k) {
		const m = matrix.length;
		const n = matrix[0].length;
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < n; j++) {
				matrix[i][j] *= k;
			}
		}
	}

	function scaled(matrix, k) {
		const m = matrix.length;
		const n = matrix[0].length;
		let result = new Array(m);
		for (let i = 0; i < m; i++) {
			const oldRow = matrix[i];
			let newRow = new Array(n);
			for (let j = 0; j < n; j++) {
				row[j] = oldRow[i] * k;
			}
			result[i] = newRow;
		}

		return result;
	}

	//Matrix multiplication

	//Transpose
	function transposed(matrix) {
		const m = matrix.length;
		const n = matrix[0].length;
		let result = new Array(n);
		for (let i = 0; i < n; i++) {
			let row = new Array(m);
			for (let j = 0; j < m; j++) {
				row[j] = matrix[j][i];
			}
			result[i] = row;
		}

		return result;
	}

	//Sizing
	function size(matrix) {
		return [matrix.length, matrix[0].length];
	}

	//Displaying matrices
	function toDisplayString(matrix) {
		const m = matrix.length;
		const n = matrix[0].length;
		let columnWidths = new Array(n);

		//Find longest value in each column
		for (let j = 0; j < n; j++) {
			let maxLen = 0;
			for (let i = 0; i < m; i++) {
				maxLen = max(maxLen, String(matrix[i][j]).length);
			}
			columnWidths[j] = maxLen;
		}

		//Create display string
		let result = "[";

		//Iterate over matrix and add entries to display
		for (let i = 0; i < m; i++) {
			const row = matrix[i];
			for (let j = 0; j < n; j++) {
				const value = String(row[j]);
				const buffer = columnWidths[j] - value.length;
				result += " ".repeat(ceil(buffer/2))+value+" ".repeat(floor(buffer/2)+1);
			}
			if (i != m-1) {
				result += "\n";
				result += " ";
			}
		}
		result += "]";

		return result;
	}

	//Return public functions
	return {
		matrix: matrix,
		identity: identity,
		zeros: zeros,
		ones: ones,
		scale: scale,
		scaled: scaled,
		transposed: transposed,
		size: size,
		toDisplayString: toDisplayString
			};
}());