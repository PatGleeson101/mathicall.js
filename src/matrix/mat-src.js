export function zeros(m, n) {
	const result = new Float64Array(m * n);
	result.rows = m;
	result.cols = n;
	return result;
}

export function constant(m, n, value) {
	const result = new Float64Array(m * n);
	result.fill(value);
	result.rows = m;
	result.cols = n;
	return result;
}

export function identity(m) {
	const len = m * m;
	const inc = m + 1;
	const result = new Float64Array(len);
	for (let i = 0; i < len; i += inc) {
		result[i] = 1;
	}
	result.rows = m;
	result.cols = m;
	return result;
}

export function flatten(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
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
export function smult(mat, k, target = new Float64Array(mat.length)) {
	const len = mat.length;
	for (let i = 0; i < len; i++) {
		target[i] = mat[i] * k;
	}
	target.rows = mat.rows;
	target.cols = mat.cols;
	return target;
}

//Transpose
export function transpose2(mat, target = new Float64Array(4)) {
	//Main diagonal
	target[0] = mat[0];
	target[3] = mat[3];
	//Other entries
	const cached = mat[1];
	target[1] = mat[2];
	target[2] = cached;
	target.rows = 2;
	target.cols = 2;
	return target;
}

export function transpose3(mat, target = new Float64Array(9)) {
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
	target.rows = 3;
	target.cols = 3;
	return target;
}

export function transpose4(mat, target = new Float64Array(16)) {
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
	target.rows = 4;
	target.cols = 4;
	return target;
}

//Matrix multiplication
export function mmult(mat1, mat2) { //consider adding target parameter
	const r1 = mat1.rows;
	const c1 = mat1.cols;
	const r2 = mat2.rows;
	const c2 = mat2.cols;
	const target = new Float64Array(r1 * c2);
	target.rows = r1;
	target.cols = c2;
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
export function size(mat) {
	return [mat.rows, mat.cols];
}

//Determinant
export function det2(mat) {
	return mat[0] * mat[3] - mat[1] * mat[2];
}

//Inverse
export function inverse2(mat, target = new Float64Array(4)) {
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
	target.rows = 2;
	target.cols = 2;
	return target;
}