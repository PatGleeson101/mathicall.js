function zeros(nrows, ncols) {
	const result = new Float64Array(nrows * ncols);
	result.nrows = nrows;
	result.ncols = ncols;
	return result;
}

function constant(nrows, ncols, value) {
	const result = new Float64Array(nrows * ncols);
	result.fill(value);
	result.nrows = nrows;
	result.ncols = ncols;
	return result;
}

function identity(n) {
	const len = n * n;
	const inc = n + 1;
	const result = new Float64Array(len);
	for (let i = 0; i < len; i += inc) {
		result[i] = 1;
	}
	result.nrows = n;
	result.ncols = n;
	return result;
}

function flatten(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
	const rows = mat2d.length;
	const cols = mat2d[0].length;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			target[i * rows + j] = mat2d[i][j];
		}
	}
	target.rows = rows;
	target.cols = cols;
	return target;
}

//Scaling
function smult(mat, k, target = new Float64Array(mat.length)) {
	const len = mat.length;
	for (let i = 0; i < len; i++) {
		target[i] = mat[i] * k;
	}
	target.nrows = mat.nrows;
	target.ncols = mat.ncols;
	return target;
}

//Transpose
function transpose2x2(mat, target = new Float64Array(4)) {
	//Main diagonal
	target[0] = mat[0];
	target[3] = mat[3];
	//Other entries
	const cached = mat[1];
	target[1] = mat[2];
	target[2] = cached;
	target.nrows = 2;
	target.ncols = 2;
	return target;
}

function transpose3x3(mat, target = new Float64Array(9)) {
	//Main diagonal
	target[0] = mat[0];
	target[4] = mat[4];
	target[8] = mat[8];
	//Other entries
	let cached = mat[1];
	target[1] = mat[3];
	target[3] = cached;
	cached = mat[2];
	target[2] = mat[6];
	target[6] = cached;
	cached = mat[5];
	target[5] = mat[7];
	target[7] = cached;
	target.nrows = 3;
	target.ncols = 3;
	return target;
}

function transpose4x4(mat, target = new Float64Array(16)) {
	//Main diagonal
	target[0] = mat[0];
	target[5] = mat[5];
	target[10] = mat[10];
	target[15] = mat[15];
	//Other entries
	let cached = mat[1];
	target[1] = mat[4];
	target[4] = cached;
	cached = mat[2];
	target[2] = mat[8];
	target[8] = cached;
	cached = mat[3];
	target[3] = mat[12];
	target[12] = cached;
	cached = mat[6];
	target[6] = mat[9];
	target[9] = cached;
	cached = mat[7];
	target[7] = mat[13];
	target[13] = cached;
	cached = mat[11];
	target[11] = mat[14];
	target[14] = cached;
	target.nrows = 4;
	target.ncols = 4;
	return target;
}

//Matrix multiplication
function mmult(mat1, mat2) { //consider adding target parameter
	const r1 = mat1.nrows;
	const c1 = mat1.ncols;
	const r2 = mat2.nrows;
	const c2 = mat2.ncols;
	const target = new Float64Array(r1 * c2);
	target.nrows = r1;
	target.ncols = c2;
	let value = 0;
	let x = 0;
	let y = 0;
	for (let i = 0; i < r1; i++) {
		for (let j = 0; j < c2; j += 1) {
			value = 0;
			x = c1 * i;
			y = j;
			for (let k = 0; k < c1; k += 1) {
				value += mat1[x] * mat2[y];
				x += 1;
				y += c2;
			}
			target[i * c2 + j] = value;
		}
	}
	return target;
}

//Size
function size(mat) {
	return [mat.rnows, mat.ncols];
}

//Determinant
function det2x2(mat) {
	return mat[0] * mat[3] - mat[1] * mat[2];
}

//Inverse
function inverse2x2(mat, target = new Float64Array(4)) {
	const a00 = mat[0];
	const a01 = mat[1];
	const a10 = mat[2];
	const a11 = mat[3];
	const detM = a00 * a11 - a01 * a10;
	if (detM === 0) {return undefined;}
	const coefficient = 1 / detM;
	target[0] = a11 * coefficient;
	target[3] = a00 * coefficient;
	target[1] = -a01 * coefficient;
	target[2] = -a10 * coefficient;
	target.nrows = 2;
	target.ncols = 2;
	return target;
}

//Matrix-vector multiplication
function vmult(vec, mat) { //Premultiply by vector (assumed row-vector)
	const ncols = mat.ncols;
	const dimension = vec.length;
	if (dimension !== mat.nrows) {return undefined;}
	const target = new Float64Array(ncols);
	let matIndex = 0;
	for (let i = 0; i < dimension; i++) {
		vi = vec[i];
		for (let j = 0; j < ncols; j++) {
			target[j] += vi * mat[matIndex++];
		}
	}
	return target; //Result is a vector, not a matrix
}

function vmult2x2(vec, mat) {
	const target = new Float64Array(2);
	const v0 = vec[0];
	const v1 = vec[1];
	target[0] = v1 * mat[0] + v2 * mat[2];
	target[0] = v1 * mat[1] + v2 * mat[3];
	return target
}

function multv(mat, vec) {
	const nrows = mat.nrows;
	const ncols = mat.ncols;
	const len = mat.length;
	if (vec.length !== ncols) {return undefined;}
	const target = new Float64Array(ncols);
	for (let j = 0; j < ncols; j++) {
		vj = vec[j];
		let k = 0;
		for (let index = j; index < len; index += ncols) {
			target[k++] += vj * mat[index];
		}
	}
	return target;
}

// Freeze exports
Object.freeze(zeros);
Object.freeze(constant);
Object.freeze(identity);
Object.freeze(flatten);
Object.freeze(smult);
Object.freeze(transpose2x2);
Object.freeze(transpose3x3);
Object.freeze(transpose4x4);
Object.freeze(mmult);
Object.freeze(size);
Object.freeze(det2x2);
Object.freeze(inverse2x2);
Object.freeze(vmult);
Object.freeze(vmult2x2);
Object.freeze(multv);

// Export
export {zeros, constant, identity, flatten, smult, transpose2x2, transpose3x3, transpose4x4, mmult, size, det2x2, inverse2x2}
export {vmult, vmult2x2, multv}