import {sqrt, acos, hypot, abs, atan2, PI, TWO_PI, fract as sfract, mod} from "../../standard/standard-lib.js";

//Dot product
function dot(vec1, vec2) {
	let result = 0;
	const dimension = vec1.length;
	for (let i = 0; i < dimension; i++) {
		result += vec1[i] * vec2[i];
	}
	return result;
}

function dot2(vec1, vec2) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

function dot3(vec1, vec2) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
}

function dot4(vec1, vec2) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
}

//Cross product
function cross3(vec1, vec2, target = new Float64Array(3)) {
	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
	return target;
}

//Addition
function add(vec1, vec2, target = new Float64Array(vec1.length)) {
	const dimension = vec1.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = vec1[i] + vec2[i];
	}
	return target;
}

function add2(vec1, vec2, target = new Float64Array(2)) {
	target[0] = vec1[0] + vec2[0];
	target[1] = vec1[1] + vec2[1];
	return target;
}

function add3(vec1, vec2, target = new Float64Array(3)) {
	target[0] = vec1[0] + vec2[0];
	target[1] = vec1[1] + vec2[1];
	target[2] = vec1[2] + vec2[2];
	return target;
}

function add4(vec1, vec2, target = new Float64Array(4)) {
	target[0] = vec1[0] + vec2[0];
	target[1] = vec1[1] + vec2[1];
	target[2] = vec1[2] + vec2[2];
	target[3] = vec1[3] + vec2[3];
	return target;
}

//Subtraction
function sub(vec1, vec2, target = new Float64Array(vec1.length)) {
	const dimension = vec1.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = vec1[i] - vec2[i];
	}
	return target;
}

function sub2(vec1, vec2, target = new Float64Array(2)) {
	target[0] = vec1[0] - vec2[0];
	target[1] = vec1[1] - vec2[1];
	return target;
}

function sub3(vec1, vec2, target = new Float64Array(3)) {
	target[0] = vec1[0] - vec2[0];
	target[1] = vec1[1] - vec2[1];
	target[2] = vec1[2] - vec2[2];
	return target;
}

function sub4(vec1, vec2, target = new Float64Array(4)) {
	target[0] = vec1[0] - vec2[0];
	target[1] = vec1[1] - vec2[1];
	target[2] = vec1[2] - vec2[2];
	target[3] = vec1[3] - vec2[3];
	return target;
}

//Magnitude
function mag(vec) {
	return hypot(...vec);
}

function mag2(vec) {
	return hypot(vec[0], vec[1]);
}

function mag3(vec) {
	return hypot(vec[0], vec[1], vec[2]);
}

function mag4(vec) {
	return hypot(vec[0], vec[1], vec[2], vec[3]);
}

//Scaling
function smult(vec, k, target = new Float64Array(vec.length)) {
	const dimension = vec.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = vec[i] * k;
	}
	return target;
}

function smult2(vec, k, target = new Float64Array(2)) {
	target[0] = vec[0] * k;
	target[1] = vec[1] * k;
	return target;
}

function smult3(vec, k, target = new Float64Array(3)) {
	target[0] = vec[0] * k;
	target[1] = vec[1] * k;
	target[2] = vec[2] * k;
	return target;
}

function smult4(vec, k, target = new Float64Array(4)) {
	target[0] = vec[0] * k;
	target[1] = vec[1] * k;
	target[2] = vec[2] * k;
	target[3] = vec[3] * k;
	return target;
}

function normalize(vec, target) { //'target' intentionally defaults to undefined
	return scale(vec, 1 / mag(vec), target);
}

function normalize2(vec, target) {
	return scale2(vec, 1 / mag2(vec), target);
}

function normalize3(vec, target) {
	return scale3(vec, 1 / mag3(vec), target);
}

function normalize4(vec, target) {
	return scale4(vec, 1 / mag4(vec), target);
}

//Angles & rotations
function angle(vec1, vec2) {
	return acos(dot(vec1, vec2) / (mag(vec1) * mag(vec2)));
}

function angle2(vec1, vec2) {
	return acos(dot2(vec1, vec2) / (mag2(vec1) * mag2(vec2)));
}

function angle3(vec1, vec2) {
	return acos(dot3(vec1, vec2) / (mag3(vec1) * mag3(vec2)));
}

function angle4(vec1, vec2) {
	return acos(dot4(vec1, vec2) / (mag4(vec1) * mag4(vec2)));
}

//Other component-wise operations
function fract(vec, target = new Float64Array(vec.length)) {
	const dimension = vec.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = sfract(vec[i]);
	}
	return target;
}

function fract2(vec, target = new Float64Array(2)) {
	target[0] = sfract(vec[0]);
	target[1] = sfract(vec[1]);
	return target;
}

function fract3(vec, target = new Float64Array(3)) {
	target[0] = sfract(vec[0]);
	target[1] = sfract(vec[1]);
	target[2] = sfract(vec[2]);
	return target;
}

function fract4(vec, target = new Float64Array(4)) {
	target[0] = sfract(vec[0]);
	target[1] = sfract(vec[1]);
	target[2] = sfract(vec[2]);
	target[3] = sfract(vec[3]);
	return target;
}

function polar2(vec, target = new Float64Array(2)) {
	target[0] = mag2(vec);
	target[1] = atan2(vec[1], vec[0]) + PI;
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