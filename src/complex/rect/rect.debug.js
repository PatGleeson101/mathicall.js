import * as src from "./rect.src.js";
import {assert, clearContext, optional, warnif} from "../../core/core.lib.js";

function conj(z, target) {
    setContext("conj(z, ?target)", arguments);
	assert.rectComplex("z");
    optional.target('target', 2);
    clearContext();
    return src.conj(z, target);
}

function real(z) {
	setContext("real(z)", arguments);
	assert.rectComplex("z");
    clearContext();
    return src.real(z);
}

function imag(z) {
	setContext("imag(z)", arguments);
	assert.rectComplex("z");
    clearContext();
    return src.imag(z);
}

function arg(z) {
	setContext("arg(z)", arguments);
	assert.rectComplex("z");
    clearContext();
    return src.arg(z);
}

function abs(z) {
	setContext("abs(z)", arguments);
	assert.rectComplex("z");
    clearContext();
    return src.abs(z);
}

function add(z1, z2, target) {
	setContext("add(z1, z2, ?target)", arguments);
	assert.rectComplex("z1");
    assert.rectComplex("z2");
    optional.target('target', 2);
    clearContext();
    return src.add(z1, z2, target);
}

function sub(z1, z2, target) {
	setContext("sub(z1, z2, ?target)", arguments);
	assert.rectComplex("z1");
    assert.rectComplex("z2");
    optional.target('target', 2);
    clearContext();
    return src.sub(z1, z2, target);
}

function mult(z1, z2, target) {
	setContext("mult(z1, z2, ?target)", arguments);
	assert.rectComplex("z1");
    assert.rectComplex("z2");
    optional.target('target', 2);
    clearContext();
    return src.mult(z1, z2, target);
}

function scale(z, k, target) {
	setContext("scale(z, k, ?target)", arguments);
	assert.rectComplex("z");
    assert.realNumber("k");
    optional.target('target', 2);
    clearContext();
    return src.scale(z, k, target);
}

function div(z1, z2, target) {
	setContext("div(z1, z2, ?target)", arguments);
	assert.rectComplex("z1");
    assert.rectComplex("z2");
    optional.target('target', 2);
    const result = src.div(z1, z2, target);
    warnif.notDefined(result);
    clearContext();
    return result;
}

function inverse(z, target) {
	setContext("inverse(z, ?target)", arguments);
	assert.rectComplex("z");
    optional.target('target', 2);
    const result = src.inverse(z, target);
    warnif.notDefined(result);
    clearContext();
    return result;
}

function toPolar(z, target) {
	setContext("toPolar(z, ?target)", arguments);
	assert.rectComplex("z");
    optional.target('target', 2);
    const result = src.toPolar(z, target);
    warnif.notDefined(result);
    clearContext();
    return result;
}

// Freeze exports
Object.freeze(conj);
Object.freeze(real);
Object.freeze(imag);
Object.freeze(arg);
Object.freeze(abs);
Object.freeze(add);
Object.freeze(sub);
Object.freeze(mult);
Object.freeze(scale);
Object.freeze(div);
Object.freeze(inverse);
Object.freeze(toPolar);

// Export
export {conj, real, imag, arg, abs, add, sub, mult, scale, div, inverse, toPolar}