import { assert, optional, setContext, clearContext } from "../core/core.lib.js";
import * as src from "./random.src.js";

function unif(a, b, count) {
	setContext("unif(?a, ?b, ?count)", arguments);
	optional.realNumber('a');
	optional.realNumber('b');
	optional.nonNegativeInteger('count');
	clearContext();
	return src.unif(a, b, count);
}

function int(a, b, count) {
	setContext("int(a, b, ?count)", arguments);
	optional.realNumber('a');
	optional.realNumber('b');
	optional.nonNegativeInteger('count');
	clearContext();
	return src.int(a, b, count);
}

function norm(mean, sd, count) {
	setContext("norm(?mean, ?sd, ?count)", arguments);
	optional.realNumber("mean");
	optional.realNumber("sd");
	optional.nonNegative("sd");
	optional.nonNegativeInteger('count');
	clearContext();
	return src.norm(mean, sd, count);
}

function exp(lambda, count) {
	setContext("exp(?lambda, ?count)", arguments);
	optional.realNumber("lambda");
	optional.nonNegativeInteger('count');
	clearContext();
	return src.exp(lambda, count);
}

function MCG(a, b, seed) {
	setContext("MCG(?a, ?b, ?seed)", arguments);
	assert.realNumber(a, "a", signature);
	assert.realNumber(b, "b", signature);
	assert.positiveInteger(seed); //Consider allowing 0 in future
	return src.MCG(a, b, seed);
}

function Xorshift32(a = 0, b = 1, seed = src.int(1, 4294967295)) {
	setContext("Xorshift32(?a, ?b, ?seed)", arguments);
	assert.realNumber(a, "a", signature);
	assert.realNumber(b, "b", signature);
	assert.positiveInteger(seed); //Consider allowing 0 in future
	return src.Xorshift32(a, b, seed);
}

function RU(mean = 0, sd = 1, seed = src.int(1, 4294967295)) { //Ratio of uniforms
	setContext("RU(?mean, ?sd, ?seed)", arguments);
	assert.realNumber(mean, "mean", signature);
	assert.realNumber(sd, "sd", signature);
	//Current implementation technically permits sd < 0, but we disallow it here
	assert.nonNegative(sd, "sd", signature);
	assert.positiveInteger(seed); //Consider allowing 0 in future
	return src.RU(mean, sd, seed);
}

const Unif = Xorshift32; //TODO: will have incorrect signature
const Norm = RU; //TODO: will have incorrect signature

const Int = function(a, b, seed = src.int(1, 4294967295)) {
	setContext("Int(a, b, ?seed)", arguments);
	assert.realNumber(a, "a", signature); //Don't have to be integers
	assert.realNumber(b, "b", signature);
	assert.positiveInteger(seed); //Consider allowing 0 in future
	return src.Int(a, b, seed);
}

// Exponential
function Exp(lambda = 1, seed = int(1, 4294967295)) {

}

// Freeze exports
Object.freeze(unif);
Object.freeze(int);
Object.freeze(norm);
Object.freeze(exp);

Object.freeze(MCG);
Object.freeze(Xorshift32);
Object.freeze(RU);

Object.freeze(Unif);
Object.freeze(Int);
Object.freeze(Norm);
Object.freeze(Exp);

// Export
export {unif, int, norm, exp}
export {MCG, Xorshift32, RU}
export {Unif, Int, Norm, Exp}