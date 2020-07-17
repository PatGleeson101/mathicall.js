/* MathicallJS module: mat.js

Dependencies: vec
*/

var mat = (function(){
	"use strict";

	//Cache function dependencies
	const dot = vec.dot;

	//Common matrices
	function zeros(m, n) {
		const result = new Array(m);
		for (let i = 0; i < m; i++) {
			result[i] = new Float64Array(n);
		}
		return result;
	}

	function constant(m, n, value) {
		const result = new Array(m);
		for (let i = 0; i < m; i++) {
			const row = new Float64Array(n);
			row.fill(value);
			result[i] = row;
		}
		return result;
	}

	function identity(m) {
		const result = new Array(m);
		for (let i = 0; i < m; i++) {
			const row = new Float64Array(m);
			row[i] = 1;
			result[i] = row;
		}
		return result;
	}

	//Scaling
	function scale(mat, k) {
		const m = mat.length;
		const n = mat[0].length;
		const result = Array(m);
		for (let i = 0; i < m; i++) {
			const rowOld = mat[i];
			const rowNew = new Float64Array(n);
			for (let j = 0; j < n; j++) {
				rowNew[j] = rowOld[j] * k;
			}
			result[i] = rowNew;
		}
		return result;
	}

	//Transpose
	function transpose(mat) {
		const m = mat.length;
		const n = mat[0].length;
		const result = new Array(n);
		for (let i = 0; i < n; i++) {
			const row = new Float64Array(m);
			for (let j = 0; j < m; j++) {
				row[j] = mat[j][i];
			}
			result[i] = row;
		}
		return result;
	}
	
	//Matrix multiplication
	function mult(mat1, mat2) {
		const m1 = mat1.length;
		const n1 = mat1[0].length;
		const m2 = mat2.length;
		const n2 = mat2[0].length;
		const result = Array(m1);
		for (let i1 = 0; i1 < m1; i1++) {
			const mat1Row = mat1[i1];
			const newRow = new Float64Array(n2);
			for (let j2 = 0; j2 < n2; j2++) {
				let value = 0;
				for (let i2 = 0; i2 < n2; i2++) {
					value += mat1Row[i2] * mat2[i2][j2];
				}
				newRow[j2] = value;
			}
			result[i1] = newRow;
		}
		return result;
	}

	function vmult(vec, mat) { //Premultply by (assumed row-) vector
		const m = mat.length;
		const n = mat[0].length;
		const result = new Float64Array(n);
		for (let i = 0; i < m; i++) {
			const row = mat[i];
			const component = vec[i];
			for (let j = 0; j < n; j++) {
				result[j] += row[j] * component;
			}
		}
		return result; //Result is a vector, not a matrix
	}

	function multv(mat, vec) { //Postmultply by (assumed column-) vector
		const m = mat.length;
		const result = new Float64Array(m);
		for (let i = 0; i < m; i++) {
			result[i] = dot(mat[i], vec);
		}
		return result; //Result is a vector, not a matrix
	}

	//Sizing
	function size(matrix) {
		return new Float64Array([matrix.length, matrix[0].length]);
	}

	//Return public functions
	return {
		constant: constant,
		identity: identity,
		zeros: zeros,
		scale: scale,
		transpose: transpose,
		mult: mult,
		vmult: vmult,
		multv: multv,
		size: size,
			};
}());