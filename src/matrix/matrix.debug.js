import { assert, setContext, clearContext, optional } from "../core/core.lib.js";
import * as src from "./matrix.src.js";

function zeros(m, n) {
    setContext("zeros(m, n)", arguments);
    assert.positiveInteger("m");
    assert.positiveInteger("n");
    clearContext();
    return src.zeros(m, n);
}

function constant(m, n, value) {
	setContext("constant(m, n, value)", arguments);
    assert.positiveInteger("m");
    assert.positiveInteger("n");
    assert.realNumber("value");
    clearContext();
    return src.constant(m, n, value);
}

function identity(m) {
	setContext("identity(m)", arguments);
    assert.positiveInteger("m");
    clearContext();
    return src.identity(m);
}

//TODO: debug for 'flatten

//Scaling
function scale(mat, k, target) {
	setContext("scale(mat, k, target)", arguments);
    assert.flatMatrix("mat");
    assert.realNumber("k");
    optional.target('target', mat.length);
    clearContext();
    return src.scale(mat, k, target);
}

//Transpose
function transpose2x2(mat, target) {
    setContext("transpose2x2(mat, target)", arguments);
	assert.flatMatrix("mat", 2, 2);
    optional.target('target', mat.length);
    clearContext();
    return src.transpose2x2(mat, target);
}

function transpose3x3(mat, target) {
	setContext("transpose3x3(mat, target)", arguments);
	assert.flatMatrix("mat", 3, 3);
    optional.target('target', mat.length);
    clearContext();
    return src.transpose3x3(mat, target);
}

function transpose4x4(mat, target) {
	setContext("transpose4x4(mat, target)", arguments);
	assert.flatMatrix("mat", [4, 4] );
    optional.target('target', mat.length);
    clearContext();
    return src.transpose4x4(mat, target);
}

//Matrix multiplication
function mult(mat1, mat2) {
	setContext("mult(mat1, mat2)", arguments);
	assert.flatMatrix("mat1");
	assert.flatMatrix("mat2", mat1.ncols);
    clearContext();
    return src.mult(mat1, mat2);
}

//Size
function size(mat) {
	setContext("size(mat)", arguments);
	assert.flatMatrix("mat");
    clearContext();
	return src.size(mat);
}

//Determinant
function det2x2(mat) {
	setContext("det2x2(mat)", arguments);
	assert.flatMatrix("mat", 2, 2);
	clearContext();
	return src.det2x2(mat);
}

//Inverse
function inverse2x2(mat, target) {
	setContext("inverse2(mat, target)", arguments);
	assert.flatMatrix("mat", 2, 2);
	optional.target('target', 4);
    clearContext();
	return src.inverse2x2(mat, target);
}

// Freeze exports
Object.freeze(zeros);
Object.freeze(constant);
Object.freeze(identity);
//Object.freeze(flatten);
Object.freeze(scale);
Object.freeze(transpose2x2);
Object.freeze(transpose3x3);
Object.freeze(transpose4x4);
Object.freeze(mult);
Object.freeze(size);
Object.freeze(det2x2);
Object.freeze(inverse2x2);

// Export
export {zeros, constant, identity, scale, transpose2x2 }
export { transpose3x3, transpose4x4, mult, size, det2x2, inverse2x2 }
//export {flatten}