import {cos, sin, TWO_PI, PI, mod} from "../../standard/standard.lib.js";

function simplify2(vec, target = new Float64Array(2)) {
	const r = vec[0];
	if (r < 0) {
		target[0] = -r;
		target[1] = mod(vec[1] + PI, TWO_PI);
	} else if (r > 0) {
		target[0] = r;
		target[1] = mod(vec[1], TWO_PI);
	} else {
		target[0] = 0;
		target[1] = 0;
	}
	return target;
}

function dot2(vec1, vec2) {
	return vec1[0] * vec2[0] * cos(vec1[1] - vec2[1]);
}

function mag(vec) {
	return vec[0];
}

function scale2(vec, k, target = new Float64Array(2)) {
	target[0] = vec[0] * k;
	target[1] = vec[1];
	return simplify2(target, target);
}

function angle2(vec1, vec2) { //Angle anticlockwise from vec1 to vec2
	return mod(vec2[1] - vec1[1], TWO_PI);
}

function normalize2(vec, target = new Float64Array(2)) {
	if (vec[0] === 0) {return undefined;}
	target[0] = 1;
	target[1] = vec[1];
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
Object.freeze(simplify2);
Object.freeze(dot2);
Object.freeze(mag);
Object.freeze(scale2);
Object.freeze(normalize2);
Object.freeze(toRect2);

// Export
export {simplify2, dot2, mag, scale2, normalize2, toRect2}