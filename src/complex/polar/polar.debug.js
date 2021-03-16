import { assert } from "../../core/core.lib.js";
import * as src from "./polar.src.js";

function conj(z, target) {
    const signature = "conj(z, ?target)";
    //assert.complexTarget
    assert.polarComplex(z, "z", signature);
    return src.conj(z, target);
}

function real(z) {
    const signature = "real(z)";
    assert.polarComplex(z, "z", signature);
	return src.real(z);
}

function imag(z) {
    const signature = "imag(z)";
    assert.polarComplex(z, "z", signature);
	return src.imag(z);
}

function arg(z) {
    const signature = "arg(z)";
    assert.polarComplex(z, "z", signature);
	return src.arg(z);
}

function abs(z) {
    const signature = "abs(z)";
    assert.polarComplex(z, "z", signature);
	return src.abs(z);
}

function smult(z, k, target) {
    const signature = "smult(z, k, ?target)";
	assert.polarComplex(z, "z", signature);
    assert.realNumber(k, "k", signature)
    //assert.target...
    return src.smult(z, k, target);
}

function cmult(z1, z2, target) {
	const signature = "cmult(z1, z2, ?target)";
	assert.polarComplex(z1, "z1", signature);
    assert.polarComplex(z2, "z2", signature);
    //assert.target...
    return src.cmult(z1, z2, target);
}

function div(z1, z2, target) {
	const signature = "div(z1, z2, ?target)";
	assert.polarComplex(z1, "z1", signature);
    assert.polarComplex(z2, "z2", signature);
    //assert.target...
    return src.div(z1, z2, target);
    //warn.notDefined
}

function pow(z, n, target) {
	const signature = "pow(z, n, ?target)";
    assert.polarComplex(z, "z", signature);
    assert.realNumber(n, "n", signature);
    //assert.target...
    return src.pow(z, n, target);
}

function inverse(z, target) {
	const signature = "inverse(z, ?target)";
    assert.polarComplex(z, "z", signature);
    //assert.target...
    return src.inverse(z, target);
}

function rect(z, target) {
	const signature = "rect(z, ?target)";
    assert.polarComplex(z, "z", signature);
    //assert.target...
    return src.rect(z, target);
}

// Freeze exports
Object.freeze(conj)
Object.freeze(real)
Object.freeze(imag)
Object.freeze(arg)
Object.freeze(abs)
Object.freeze(smult)
Object.freeze(cmult)
Object.freeze(div)
Object.freeze(pow)
Object.freeze(inverse)
Object.freeze(rect)

// Export
export {conj, real, imag, arg, abs, smult, cmult, div, pow, inverse, rect}