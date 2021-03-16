import * as src from "./rect.src.js";
import {assert} from "../../core/core.lib.js";

function conj(z, target) {
    const signature = "conj(z, ?target)";
	assert.rectComplex(z, "z", signature);
    //assert.target...
    return src.conj(z, target);
}

function real(z) {
	const signature = "real(z)";
	assert.rectComplex(z, "z", signature);
    return src.real(z);
}

function imag(z) {
	const signature = "imag(z)";
	assert.rectComplex(z, "z", signature);
    return src.imag(z);
}

function arg(z) {
	const signature = "arg(z)";
	assert.rectComplex(z, "z", signature);
    return src.arg(z);
}

function abs(z) {
	const signature = "abs(z)";
	assert.rectComplex(z, "z", signature);
    return src.abs(z);
}

function add(z1, z2, target) {
	const signature = "add(z1, z2, ?target)";
	assert.rectComplex(z1, "z1", signature);
    assert.rectComplex(z2, "z2", signature);
    //assert target...
    return src.add(z1, z2, target);
}

function sub(z1, z2, target) {
	const signature = "sub(z1, z2, ?target)";
	assert.rectComplex(z1, "z1", signature);
    assert.rectComplex(z2, "z2", signature);
    //assert target...
    return src.sub(z1, z2, target);
}

function cmult(z1, z2, target) {
	const signature = "cmult(z1, z2, ?target)";
	assert.rectComplex(z1, "z1", signature);
    assert.rectComplex(z2, "z2", signature);
    //assert target...
    return src.cmult(z1, z2, target);
}

function smult(z, k, target) {
	const signature = "smult(z, k, ?target)";
	assert.rectComplex(z, "z", signature);
    assert.realNumber(k, "k", signature);
    return src.smult(z, k, target);
}

function div(z1, z2, target) {
	const signature = "div(z1, z2, ?target)";
	assert.rectComplex(z1, "z1", signature);
    assert.rectComplex(z2, "z2", signature);
    //assert target...
    return src.div(z1, z2, target);
    //warn.unDefined...
}

function inverse(z, target) {
	const signature = "inverse(z, ?target)";
	assert.rectComplex(z, "z", signature);
    //assert.target...
    return src.inverse(z, target);
    //warn.unDefined...
}

function polar(z, target) {
	const signature = "inverse(z, ?target)";
	assert.rectComplex(z, "z", signature);
    //assert.target...
    return src.inverse(z, target);
}

// Freeze exports
Object.freeze(conj);
Object.freeze(real);
Object.freeze(imag);
Object.freeze(arg);
Object.freeze(abs);
Object.freeze(add);
Object.freeze(sub);
Object.freeze(cmult);
Object.freeze(smult);
Object.freeze(div);
Object.freeze(inverse);
Object.freeze(polar);

// Export
export {conj, real, imag, arg, abs, add, sub, cmult, smult, div, inverse, polar}