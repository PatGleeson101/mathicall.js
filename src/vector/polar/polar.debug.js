import * as src from "./polar.src.js";
import {assert} from "../../core/core.lib.js";

function dot2(vec1, vec2) {
	const signature = "dot2(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	//need to assert array sizes too
	return src.dot2(vec1, vec2);
}

function mag(vec) {
	const signature = "mag(vec)";
	assert.realArray(vec, "vec", signature);
	return src.mag(vec);
}

function smult2(vec, k, target) {
	const signature = "smult2(vec, k, ?target)";
	assert.realArray(vec, "vec", signature);
	assert.realNumber(k, "k", signature);
	//assert array size
	//assert target
	return src.smult2(vec, k, target);
}

function normalize2(vec, target) {
	const signature = "normalize2(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert array size
	//assert target
	return src.normalize2(vec, target);
}

function rect2(vec, target) {
	const signature = "rect2(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert array size
	//assert target
	return src.rect2(vec, target);
}

// Freeze exports
Object.freeze(dot2);
Object.freeze(mag);
Object.freeze(smult2);
Object.freeze(normalize2);
Object.freeze(rect2);

// Export
export {dot2, mag, smult2, normalize2, rect2}