import {cos, sin, abs, TWO_PI, mod} from "../../standard/standard.lib.js";

function dot2(vec1, vec2) {
	return vec1[0] * vec2[0] * cos(vec1[1] - vec2[1]);
}

function mag(vec) {
	return abs(vec[0]);
}

function scale2(vec, k, target = new Float64Array(2)) {
	target[0] = vec[0] * k;
	target[1] = mod(vec[1], TWO_PI);
	return target;
}

function normalize2(vec, target = new Float64Array(2)) {
	if (vec[0] === 0) {
		return undefined;
	}
	target[0] = 1;
	target[1] = mod(vec[1], TWO_PI);
	return target;
}

function toRect2(vec, target = new Float64Array(2)) {
	const r = vec[0];
	const theta = vec[1];
	target[0] = r * cos(theta);
	target[1] = r * sin(theta);
	return target;
}

// Freeze exports
Object.freeze(dot2);
Object.freeze(mag);
Object.freeze(scale2);
Object.freeze(normalize2);
Object.freeze(toRect2);

// Export
export {dot2, mag, scale2, normalize2, toRect2}