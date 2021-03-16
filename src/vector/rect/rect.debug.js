import * as src from "./rect.src.js";
import {assert} from "../../core/core.lib.js";

//Dot product
function dot(vec1, vec2) {
	const signature = "dot(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert size match
	return src.dot(vec1, vec2);
}

function dot2(vec1, vec2) {
	const signature = "dot2(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	return src.dot2(vec1, vec2);
}

function dot3(vec1, vec2) {
	const signature = "dot3(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	return src.dot3(vec1, vec2);
}

function dot4(vec1, vec2) {
	const signature = "dot4(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	return src.dot4(vec1, vec2);
}

//Cross product
function cross3(vec1, vec2, target) {
	const signature = "cross3(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.cross3(vec1, vec2, target);
}

//Addition
function add(vec1, vec2, target) {
	const signature = "add(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array size match
	//assert target
	return src.add(vec1, vec2, target);
}

function add2(vec1, vec2, target) {
	const signature = "add2(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.add2(vec1, vec2, target);
}

function add3(vec1, vec2, target) {
	const signature = "add3(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.add3(vec1, vec2, target);
}

function add4(vec1, vec2, target) {
	const signature = "add4(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.add4(vec1, vec2, target);
}

//Subtraction
function sub(vec1, vec2, target) {
	const signature = "sub(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.sub(vec1, vec2, target);
}

function sub2(vec1, vec2, target) {
	const signature = "sub2(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.sub2(vec1, vec2, target);
}

function sub3(vec1, vec2, target) {
	const signature = "sub3(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.sub3(vec1, vec2, target);
}

function sub4(vec1, vec2, target) {
	const signature = "sub4(vec1, vec2, ?target)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	//assert target
	return src.sub4(vec1, vec2, target);
}

//Magnitude
function mag(vec) {
	const signature = "mag(vec)";
	assert.realArray(vec, "vec", signature);
	return src.mag(vec);
}

function mag2(vec) {
	const signature = "mag2(vec)";
	assert.realArray(vec, "vec", signature);
	//warn array size
	return src.mag2(vec);
}

function mag3(vec) {
	const signature = "mag3(vec)";
	assert.realArray(vec, "vec", signature);
	//warn array size
	return src.mag3(vec);
}

function mag4(vec) {
	const signature = "mag4(vec)";
	assert.realArray(vec, "vec", signature);
	//warn array size
	return src.mag4(vec);
}

//Scaling
function smult(vec, k, target) {
	const signature = "smult(vec, k, ?target)";
	assert.realArray(vec, "vec", signature);
	assert.realNumber(k, "k", signature);
	//assert target
	return src.smult(vec, k, target);
}

function smult2(vec, k, target) {
	const signature = "smult2(vec, k, ?target)";
	assert.realArray(vec, "vec", signature);
	assert.realNumber(k, "k", signature);
	//assert target
	// warn vec size
	return src.smult2(vec, k, target);
}

function smult3(vec, k, target) {
	const signature = "smult3(vec, k, ?target)";
	assert.realArray(vec, "vec", signature);
	assert.realNumber(k, "k", signature);
	//assert target
	// warn vec size
	return src.smult3(vec, k, target);
}

function smult4(vec, k, target) {
	const signature = "smult4(vec, k, ?target)";
	assert.realArray(vec, "vec", signature);
	assert.realNumber(k, "k", signature);
	//assert target
	// warn vec size
	return src.smult4(vec, k, target);
}

function normalize(vec, target) { //'target' intentionally defaults to undefined
	const signature = "normalize(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	return src.normalize(vec, target);
}

function normalize2(vec, target) {
	const signature = "normalize2(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	//warn array size
	return src.normalize2(vec, target);
}

function normalize3(vec, target) {
	const signature = "normalize3(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	//warn array size
	return src.normalize3(vec, target);
}

function normalize4(vec, target) {
	const signature = "normalize4(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	//warn array size
	return src.normalize4(vec, target);
}

//Angles & rotations
function angle(vec1, vec2) {
	const signature = "angle(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array size match
	return src.angle(vec1, vec2);
}

function angle2(vec1, vec2) {
	const signature = "angle2(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	return src.angle2(vec1, vec2);
}

function angle3(vec1, vec2) {
	const signature = "angle3(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	return src.angle3(vec1, vec2);
}

function angle4(vec1, vec2) {
	const signature = "angle4(vec1, vec2)";
	assert.realArray(vec1, "vec1", signature);
	assert.realArray(vec2, "vec2", signature);
	// warn/assert array sizes
	return src.angle4(vec1, vec2);
}

//Other component-wise operations
function fract(vec, target) {
	const signature = "fract(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	return src.fract(vec, target);
}

function fract2(vec, target) {
	const signature = "fract2(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	//warn array size
	return src.fract2(vec, target);
}

function fract3(vec, target) {
	const signature = "fract3(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	//warn array size
	return src.fract3(vec, target);
}

function fract4(vec, target) {
	const signature = "fract4(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	//warn array size
	return src.fract4(vec, target);
}

function polar2(vec, target) {
	const signature = "polar2(vec, ?target)";
	assert.realArray(vec, "vec", signature);
	//assert target
	//warn array size
	return src.polar2(vec, target);
}

// Freeze exports
Object.freeze(dot);
Object.freeze(dot2);
Object.freeze(dot3);
Object.freeze(dot4);
Object.freeze(cross3);
Object.freeze(add);
Object.freeze(add2);
Object.freeze(add3);
Object.freeze(add4);
Object.freeze(sub);
Object.freeze(sub2);
Object.freeze(sub3);
Object.freeze(sub4);
Object.freeze(mag);
Object.freeze(mag2);
Object.freeze(mag3);
Object.freeze(mag4);
Object.freeze(smult);
Object.freeze(smult2);
Object.freeze(smult3);
Object.freeze(smult4);
Object.freeze(normalize);
Object.freeze(normalize2);
Object.freeze(normalize3);
Object.freeze(normalize4);
Object.freeze(angle);
Object.freeze(angle2);
Object.freeze(angle3);
Object.freeze(angle4);
Object.freeze(fract);
Object.freeze(fract2);
Object.freeze(fract3);
Object.freeze(fract4);
Object.freeze(polar2);

// Export
export {dot, dot2, dot3, dot4, cross3, add, add2, add3, add4}
export {sub, sub2, sub3, sub4, mag, mag2, mag3, mag4}
export {smult, smult2, smult3, smult4, normalize, normalize2, normalize3, normalize4}
export {angle, angle2, angle3, angle4, fract, fract2, fract3, fract4, polar2}