import {sqrt, acos, hypot, abs, atan2, PI, TWO_PI, fract as sfract, mod} from "../../standard/standard-lib.js";

//Dot product
export function dot(vec1, vec2) {
	let result = 0;
	const dimension = vec1.length;
	for (let i = 0; i < dimension; i++) {
		result += vec1[i] * vec2[i];
	}
	return result;
}

export function dot2(vec1, vec2) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

export function dot3(vec1, vec2) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
}

export function dot4(vec1, vec2) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
}

//Cross product
export function cross3(vec1, vec2, target = new Float64Array(3)) {
	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
	return target;
}

//Addition
export function add(vec1, vec2, target = new Float64Array(vec1.length)) {
	const dimension = vec1.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = vec1[i] + vec2[i];
	}
	return target;
}

export function add2(vec1, vec2, target = new Float64Array(2)) {
	target[0] = vec1[0] + vec2[0];
	target[1] = vec1[1] + vec2[1];
	return target;
}

export function add3(vec1, vec2, target = new Float64Array(3)) {
	target[0] = vec1[0] + vec2[0];
	target[1] = vec1[1] + vec2[1];
	target[2] = vec1[2] + vec2[2];
	return target;
}

export function add4(vec1, vec2, target = new Float64Array(4)) {
	target[0] = vec1[0] + vec2[0];
	target[1] = vec1[1] + vec2[1];
	target[2] = vec1[2] + vec2[2];
	target[3] = vec1[3] + vec2[3];
	return target;
}

//Subtraction
export function sub(vec1, vec2, target = new Float64Array(vec1.length)) {
	const dimension = vec1.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = vec1[i] - vec2[i];
	}
	return target;
}

export function sub2(vec1, vec2, target = new Float64Array(2)) {
	target[0] = vec1[0] - vec2[0];
	target[1] = vec1[1] - vec2[1];
	return target;
}

export function sub3(vec1, vec2, target = new Float64Array(3)) {
	target[0] = vec1[0] - vec2[0];
	target[1] = vec1[1] - vec2[1];
	target[2] = vec1[2] - vec2[2];
	return target;
}

export function sub4(vec1, vec2, target = new Float64Array(4)) {
	target[0] = vec1[0] - vec2[0];
	target[1] = vec1[1] - vec2[1];
	target[2] = vec1[2] - vec2[2];
	target[3] = vec1[3] - vec2[3];
	return target;
}

//Magnitude
export function mag(vec) {
	return hypot(...vec);
}

export function mag2(vec) {
	return hypot(vec[0], vec[1]);
}

export function mag3(vec) {
	return hypot(vec[0], vec[1], vec[2]);
}

export function mag4(vec) {
	return hypot(vec[0], vec[1], vec[2], vec[3]);
}

//Scaling
export function smult(vec, k, target = new Float64Array(vec.length)) {
	const dimension = vec.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = vec[i] * k;
	}
	return target;
}

export function smult2(vec, k, target = new Float64Array(2)) {
	target[0] = vec[0] * k;
	target[1] = vec[1] * k;
	return target;
}

export function smult3(vec, k, target = new Float64Array(3)) {
	target[0] = vec[0] * k;
	target[1] = vec[1] * k;
	target[2] = vec[2] * k;
	return target;
}

export function smult4(vec, k, target = new Float64Array(4)) {
	target[0] = vec[0] * k;
	target[1] = vec[1] * k;
	target[2] = vec[2] * k;
	target[3] = vec[3] * k;
	return target;
}

export function normalize(vec, target) { //'target' intentionally defaults to undefined
	return scale(vec, 1 / mag(vec), target);
}

export function normalize2(vec, target) {
	return scale2(vec, 1 / mag2(vec), target);
}

export function normalize3(vec, target) {
	return scale3(vec, 1 / mag3(vec), target);
}

export function normalize4(vec, target) {
	return scale4(vec, 1 / mag4(vec), target);
}

//Angles & rotations
export function angle(vec1, vec2) {
	return acos(dot(vec1, vec2) / (mag(vec1) * mag(vec2)));
}

export function angle2(vec1, vec2) {
	return acos(dot2(vec1, vec2) / (mag2(vec1) * mag2(vec2)));
}

export function angle3(vec1, vec2) {
	return acos(dot3(vec1, vec2) / (mag3(vec1) * mag3(vec2)));
}

export function angle4(vec1, vec2) {
	return acos(dot4(vec1, vec2) / (mag4(vec1) * mag4(vec2)));
}

//Other component-wise operations
export function fract(vec, target = new Float64Array(vec.length)) {
	const dimension = vec.length;
	for (let i = 0; i < dimension; i++) {
		target[i] = sfract(vec[i]);
	}
	return target;
}

export function fract2(vec, target = new Float64Array(2)) {
	target[0] = sfract(vec[0]);
	target[1] = sfract(vec[1]);
	return target;
}

export function fract3(vec, target = new Float64Array(3)) {
	target[0] = sfract(vec[0]);
	target[1] = sfract(vec[1]);
	target[2] = sfract(vec[2]);
	return target;
}

export function fract4(vec, target = new Float64Array(4)) {
	target[0] = sfract(vec[0]);
	target[1] = sfract(vec[1]);
	target[2] = sfract(vec[2]);
	target[3] = sfract(vec[3]);
	return target;
}

export function polar2(vec, target = new Float64Array(2)) {
	target[0] = mag2(vec);
	target[1] = atan2(vec[1], vec[0]) + PI;
}