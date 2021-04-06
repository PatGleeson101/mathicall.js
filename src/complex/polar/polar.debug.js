import { optional, assert, setContext, clearContext, warnif } from "../../core/core.lib.js";
import * as src from "./polar.src.js";

function conj(z, target) {
    setContext("conj(z, ?target)", arguments);
    optional.target('target', 2);
    assert.polarComplex("z");
    clearContext();
    return src.conj(z, target);
}

function real(z) {
    setContext("real(z)", arguments);
    assert.polarComplex("z");
    clearContext();
	return src.real(z);
}

function imag(z) {
    setContext("imag(z)", arguments);
    assert.polarComplex("z");
    clearContext();
	return src.imag(z);
}

function arg(z) {
    setContext("arg(z)", arguments);
    assert.polarComplex("z");
    clearContext();
	return src.arg(z);
}

function abs(z) {
    setContext("abs(z)", arguments);
    assert.polarComplex("z");
    clearContext();
	return src.abs(z);
}

function smult(z, k, target) {
    setContext("smult(z, k, ?target)", arguments);
	assert.polarComplex("z");
    assert.realNumber("k");
    optional.target('target', 2);
    clearContext();
    return src.smult(z, k, target);
}

function cmult(z1, z2, target) {
	setContext("cmult(z1, z2, ?target)", arguments);
	assert.polarComplex("z1");
    assert.polarComplex("z2");
    optional.target('target', 2);
    return src.cmult(z1, z2, target);
}

function div(z1, z2, target) {
	setContext("div(z1, z2, ?target)", arguments);
	assert.polarComplex("z1");
    assert.polarComplex("z2");
    optional.target('target', 2);
    const result = src.div(z1, z2, target);
    warnif.notDefined(result);
    clearContext();
    return result;
}

function pow(z, n, target) {
	setContext("pow(z, n, ?target)", arguments);
    assert.polarComplex("z");
    assert.realNumber("n");
    optional.target('target', 2);
    clearContext();
    return src.pow(z, n, target);
}

function inverse(z, target) {
	setContext("inverse(z, ?target)", arguments);
    assert.polarComplex("z");
    optional.target('target', 2);
    clearContext();
    return src.inverse(z, target);
}

function rect(z, target) {
	setContext("rect(z, ?target)", arguments);
    assert.polarComplex("z");
    optional.target('target', 2);
    clearContext();
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