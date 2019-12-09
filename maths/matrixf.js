/* MathicallJS module: matrixf.js
A function-oriented implementation of matrices

Notes:
An m x n matrix is represented by an array of length m containing subarrays each of length n

Dependencies:
None

To implement:
- class-like version of matrix built on modified array 
  (for compatibility with rest of functions)
- generator functions to create specific matrix multipliers/other operations (for efficiency in known situations)
- matrix joining functions
- rref
- use [m, n] size arrays instead of inputs (m,n)?
*/

var matrixf = (function(){
	"use strict";

	//Dependencies
	const max = Math.max;
	const ceil = Math.ceil;
	const floor = Math.floor;

	//Matrix creation
	//To modify this function: make 'values' list input which represents uniform value if its length is 1, or list ov values otherwise
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
	function scale(matrix, k) { //This function modifies the original matrix
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

	//Matrices from vectors
	function rowVector(vector) {
		return [[...vector]]; //Clones vector array and wraps inside outer array
	}

	function columnVector(vector) {
		const m = vector.length;
		let result = new Array(m);
		for (let i = 0; i < m; i++) {
			result[i] = [vector[i]];
		}
		return result;
	}

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

	//Nonscalar multiplication
	
	//TO implement: multT & multV (plus variants)

	function mult(mtx1, mtx2) {
		const m = mtx1.length;
		const n = mtx2[0].length;
		const m2 = mtx2.length;
		const n1 = mtx1[0].length;
		let result = new Array(m);
		for (let i = 0; i < m; i++) {
			const newRow = new Array(n);
			newRow.fill(0);
			const oldRow = mtx1[i];
			for (let j = 0; j < n; j++) {
				for (let k = 0; k < n; k++) {
					newRow[j] += oldRow[k] * mtx2[k][j];
				}
			}
			result[i] = newRow;
		}

		return result;
	}

	//Sizing
	function size(matrix) {
		return [matrix.length, matrix[0].length];
	}

	function resized(matrix, M, N) {
		const m = matrix.length;
		const n = matrix[0].length;
		let result = new Array(M);

		const minRows = Math.min(M, m);
		const minColumns = Math.min(N, n);
		for (let i = 0; i < minRows; i++) {
			const oldRow = matrix[i];
			let newRow = new Array(N);
			for (let j = 0; j < minColumns; j++) {
				newRow[j] = oldRow[j];
			}
			for (let j = minColumns; j < N; j++) {
				newRow[j] = 0;
			}
			result[i] = newRow;
		}

		for (let i = minRows; i < M; i++) {
			let newRow = new Array(N);
			newRow.fill(0);
			result[i] = newRow;
		}

		return result;
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
		let result = "[ ";

		//Iterate over matrix and add entries to display
		for (let i = 0; i < m; i++) {
			const row = matrix[i];
			for (let j = 0; j < n; j++) {
				const value = String(row[j]);
				const buffer = columnWidths[j] - value.length;
				result += " ".repeat(ceil(buffer/2))+value+" ".repeat(floor(buffer/2)+1);
			}
			if (i != m-1) { 
				result += " \n ";
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
		mult: mult,
		size: size,
		toDisplayString: toDisplayString,
		rowVector: rowVector,
		columnVector: columnVector,
		resized: resized
			};
}());