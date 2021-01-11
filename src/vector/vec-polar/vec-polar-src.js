import {cos, sin, abs, TWO_PI, mod} from "../../standard/standard-lib.js";

export function dot2(vec1, vec2) {
	return vec1[0] * vec2[0] * cos(vec1[1] - vec2[1]);
}

export function mag(vec) {
	return abs(vec[0]);
}

export function smult2(vec, k, target = new Float64Array(2)) {
	target[0] = vec[0] * k;
	target[1] = mod(vec[1], TWO_PI);
}

export function normalize2(vec, target = new Float64Array(2)) {
	target[0] = 1;
	target[1] = mod(vec[1], TWO_PI);
}

export function rect2(vec, target = new Float64Array(2)) {
	const r = vec[0];
	const theta = vec[1];
	target[0] = r * cos(theta);
	target[1] = r * sin(theta);
	return target;
}