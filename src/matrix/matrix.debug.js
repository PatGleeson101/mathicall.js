import {assert} from "../core/core.lib.js";
import * as src from "./matrix.src.js";

function zeros(m, n) {
    const signature = "zeros(m, n)";
    assert.positiveInteger(m, "m", signature);
    assert.positiveInteger(n, "n", signature);
    return src.zeros(m, n);
}

function constant(m, n, value) {
	const signature = "constant(m, n, value)";
    assert.positiveInteger(m, "m", signature);
    assert.positiveInteger(n, "n", signature);
    assert.realNumber(value, "value", signature);
    return src.constant(m, n, value);
}

function identity(m) {
	const signature = "identity(m)";
    assert.positiveInteger(m, "m", signature);
    return src.identity(m);
}

function flatten(mat2d, target) { //Flattens 2D array into 1D array
	const signature = "flatten(mat2d, ?target)";
    //assert that mat2d is valid 2d unflattened matrix
    //assert target
    return src.flatten(mat2d, target);
}

//Scaling
function smult(mat, k, target) {
	const signature = "smult(mat, k, target)";
    assert.flatMatrix(mat, "mat", signature);
    assert.realNumber(k, "k", signature);
    //assert target
    return src.smult(mat, k, target);
}

//Transpose
function transpose2(mat, target) {
    const signature = "transpose2(mat, target)";
	assert.flatMatrix(mat, "mat", signature);
	//assert correct matrix size
    //assert target
    return src.transpose2(mat, target);
}

function transpose3(mat, target) {
	const signature = "transpose3(mat, target)";
	assert.flatMatrix(mat, "mat", signature);
    //assert correct matrix size
    //assert target
    return src.transpose3(mat, target);
}

function transpose4(mat, target) {
	const signature = "transpose4(mat, target)";
	assert.flatMatrix(mat, "mat", signature);
    //assert correct matrix size
    //assert target
    return src.transpose4(mat, target);
}

//Matrix multiplication
function mmult(mat1, mat2) { //consider adding target parameter
	const signature = "mmult(mat1, mat2)";
	assert.flatMatrix(mat1, "mat1", signature);
	assert.flatMatrix(mat2, "mat2", signature);
	//assert.mmultConformable(mat1, mat2, "mat1", "mat2", signature);
    //assert correct matrix size
    //assert target
    return src.mmult(mat1, mat2);
}

//Size
function size(mat) {
	const signature = "size(mat)";
	assert.flatMatrix(mat, "mat", signature);
	return src.size(mat);
}

//Determinant
function det2(mat) {
	const signature = "det2(mat)";
	assert.flatMatrix(mat, "mat", signature);
	//assert correct size
	return src.det2(mat);
}

//Inverse
function inverse2(mat, target) {
	const signature = "inverse2(mat, target)";
	assert.flatMatrix(mat, "mat", signature);
	//assert correct size
	//assert target
	return src.inverse2(mat, target);
}

// Freeze exports
Object.freeze(zeros);
Object.freeze(constant);
Object.freeze(identity);
Object.freeze(flatten);
Object.freeze(smult);
Object.freeze(transpose2);
Object.freeze(transpose3);
Object.freeze(transpose4);
Object.freeze(mmult);
Object.freeze(size);
Object.freeze(det2);
Object.freeze(inverse2);

// Export
export {zeros, constant, identity, flatten, smult, transpose2, transpose3, transpose4, mmult, size, det2, inverse2}