import * as src from "./polar.src.js";
import {assert, clearContext, optional} from "../../core/core.lib.js";

function dot2(vec1, vec2) {
	setContext("dot2(vec1, vec2)", arguments);
	assert.realArray("vec1", 2);
	assert.realArray("vec2", 2);
	clearContext();
	return src.dot2(vec1, vec2);
}

function mag(vec) {
	setContext("mag(vec)", arguments);
	assert.realArray("vec");
	clearContext();
	return src.mag(vec);
}

function scale2(vec, k, target) {
	setContext("scale2(vec, k, ?target)", arguments);
	assert.realArray("vec", 2);
	assert.realNumber("k");
	optional.target('target', 2);
	clearContext();
	return src.scale2(vec, k, target);
}

function normalize2(vec, target) {
	setContext("normalize2(vec, ?target)", arguments);
	assert.realArray("vec", 2);
	optional.target('target', 2);
	clearContext();
	return src.normalize2(vec, target);
}

function toRect2(vec, target) {
	setContext("toRect2(vec, ?target)", arguments);
	assert.realArray("vec", 2);
	optional.target('target', 2);
	clearContext();
	return src.roRect2(vec, target);
}

// Freeze exports
Object.freeze(dot2);
Object.freeze(mag);
Object.freeze(scale2);
Object.freeze(normalize2);
Object.freeze(toRect2);

// Export
export {dot2, mag, scale2, normalize2, toRect2}