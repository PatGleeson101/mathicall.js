import * as src from "./rect.src.js";
import {assert, clearContext, setContext, optional} from "../../core/core.lib.js";

//Dot product
function dot(vec1, vec2) {
	setContext("dot(vec1, vec2)", arguments);
	assert.realArray("vec1");
	assert.realArray("vec2", vec1.length);
	clearContext();
	return src.dot(vec1, vec2);
}

function dot2(vec1, vec2) {
	setContext("dot2(vec1, vec2)", arguments);
	assert.realArray("vec1", 2);
	assert.realArray("vec2", 2);
	clearContext();
	return src.dot2(vec1, vec2);
}

function dot3(vec1, vec2) {
	setContext("dot3(vec1, vec2)", arguments);
	assert.realArray("vec1", 3);
	assert.realArray("vec2", 3);
	clearContext();
	return src.dot3(vec1, vec2);
}

function dot4(vec1, vec2) {
	setContext("dot4(vec1, vec2)", arguments);
	assert.realArray("vec1", 4);
	assert.realArray("vec2", 4);
	clearContext();
	return src.dot4(vec1, vec2);
}

//Cross product
function cross3(vec1, vec2, target) {
	setContext("cross3(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 3);
	assert.realArray("vec2", 3);
	optional.target('target', 3);
	clearContext();
	return src.cross3(vec1, vec2, target);
}

//Addition
function add(vec1, vec2, target) {
	setContext("add(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1");
	assert.realArray("vec2", vec1.length);
	optional.target('target', vec1.length);
	clearContext();
	return src.add(vec1, vec2, target);
}

function add2(vec1, vec2, target) {
	setContext("add2(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 2);
	assert.realArray("vec2", 2);
	optional.target('target', 2);
	clearContext();
	return src.add2(vec1, vec2, target);
}

function add3(vec1, vec2, target) {
	setContext("add3(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 3);
	assert.realArray("vec2", 3);
	optional.target('target', 3);
	clearContext();
	return src.add3(vec1, vec2, target);
}

function add4(vec1, vec2, target) {
	setContext("add4(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 4);
	assert.realArray("vec2", 4);
	optional.target('target', 4);
	clearContext();
	return src.add4(vec1, vec2, target);
}

//Subtraction
function sub(vec1, vec2, target) {
	setContext("sub(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 2);
	assert.realArray("vec2", vec1.length);
	optional.target('target', vec1.length);
	clearContext();
	return src.sub(vec1, vec2, target);
}

function sub2(vec1, vec2, target) {
	setContext("sub2(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 2);
	assert.realArray("vec2", 2);
	optional.target('target', 2);
	clearContext();
	return src.sub2(vec1, vec2, target);
}

function sub3(vec1, vec2, target) {
	setContext("sub3(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 3);
	assert.realArray("vec2", 3);
	optional.target('target', 3);
	clearContext();
	return src.sub3(vec1, vec2, target);
}

function sub4(vec1, vec2, target) {
	setContext("sub4(vec1, vec2, ?target)", arguments);
	assert.realArray("vec1", 4);
	assert.realArray("vec2", 4);
	optional.target('target', 4);
	clearContext();
	return src.sub4(vec1, vec2, target);
}

//Magnitude
function mag(vec) {
	setContext("mag(vec)", arguments);
	assert.realArray("vec");
	clearContext();
	return src.mag(vec);
}

function mag2(vec) {
	setContext("mag2(vec)", arguments);
	assert.realArray("vec", 2);
	clearContext();
	return src.mag2(vec);
}

function mag3(vec) {
	setContext("mag3(vec)", arguments);
	assert.realArray("vec", 3);
	clearContext();
	return src.mag3(vec);
}

function mag4(vec) {
	setContext("mag4(vec)", arguments);
	assert.realArray("vec", 4);
	clearContext();
	return src.mag4(vec);
}

//Scaling
function smult(vec, k, target) {
	setContext("smult(vec, k, ?target)", arguments);
	assert.realArray("vec");
	assert.realNumber("k");
	optional.target('target', vec.length);
	return src.smult(vec, k, target);
}

function smult2(vec, k, target) {
	setContext("smult2(vec, k, ?target)", arguments);
	assert.realArray("vec", 2);
	assert.realNumber("k");
	optional.target('target', 2);
	return src.smult2(vec, k, target);
}

function smult3(vec, k, target) {
	setContext("smult3(vec, k, ?target)", arguments);
	assert.realArray("vec", 3);
	assert.realNumber("k");
	optional.target('target', 3);
	return src.smult3(vec, k, target);
}

function smult4(vec, k, target) {
	setContext("smult4(vec, k, ?target)", arguments);
	assert.realArray("vec", 4);
	assert.realNumber("k");
	optional.target('target', 4);
	return src.smult4(vec, k, target);
}

function normalize(vec, target) { //'target' intentionally defaults to undefined
	setContext("normalize(vec, ?target)", arguments);
	assert.realArray("vec");
	optional.target('target', vec.length);
	return src.normalize(vec, target);
}

function normalize2(vec, target) {
	setContext("normalize2(vec, ?target)", arguments);
	assert.realArray("vec", 2);
	optional.target('target', 2);
	return src.normalize2(vec, target);
}

function normalize3(vec, target) {
	setContext("normalize3(vec, ?target)", arguments);
	assert.realArray("vec", 3);
	optional.target('target', 3);
	return src.normalize3(vec, target);
}

function normalize4(vec, target) {
	setContext("normalize4(vec, ?target)", arguments);
	assert.realArray("vec", 4);
	optional.target('target', 4);
	return src.normalize4(vec, target);
}

//Angles & rotations
function angle(vec1, vec2) {
	setContext("angle(vec1, vec2)", arguments);
	assert.realArray("vec1");
	assert.realArray("vec2", vec1.length);
	return src.angle(vec1, vec2);
}

function angle2(vec1, vec2) {
	setContext("angle2(vec1, vec2)", arguments);
	assert.realArray("vec1", 2);
	assert.realArray("vec2", 2);
	return src.angle2(vec1, vec2);
}

function angle3(vec1, vec2) {
	setContext("angle3(vec1, vec2)", arguments);
	assert.realArray("vec1", 3);
	assert.realArray("vec2", 3);
	return src.angle3(vec1, vec2);
}

function angle4(vec1, vec2) {
	setContext("angle4(vec1, vec2)", arguments);
	assert.realArray("vec1", 4);
	assert.realArray("vec2", 4);
	return src.angle4(vec1, vec2);
}

//Other component-wise operations
function fract(vec, target) {
	setContext("fract(vec, ?target)", arguments);
	assert.realArray("vec");
	optional.target("target", vec.length);
	return src.fract(vec, target);
}

function fract2(vec, target) {
	setContext("fract2(vec, ?target)", arguments);
	assert.realArray("vec", 2);
	optional.target("target", 2);
	return src.fract2(vec, target);
}

function fract3(vec, target) {
	setContext("fract3(vec, ?target)", arguments);
	assert.realArray("vec", 3);
	optional.target("target", 3);
	return src.fract3(vec, target);
}

function fract4(vec, target) {
	setContext("fract4(vec, ?target)", arguments);
	assert.realArray("vec", 4);
	optional.target("target", 4);
	return src.fract4(vec, target);
}

function polar2(vec, target) {
	setContext("polar2(vec, ?target)", arguments);
	assert.realArray("vec", 2);
	optional.target("target", 2);
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