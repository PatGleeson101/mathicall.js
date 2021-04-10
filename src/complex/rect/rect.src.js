import {atan2, sin, hypot, abs as stdAbs} from "../../standard/standard.lib.js";

function conj(z, target = new Float64Array(2)) {
	target[0] = z[0];
	target[1] = -z[1];
	return target;
}

function real(z) {
	return z[0];
}

function imag(z) {
	return z[1];
}

function arg(z) {
	return atan2(z[1], z[0]);
}

function abs(z) {
	return hypot(z[0], z[1]);
}

function add(z1, z2, target = new Float64Array(2)) {
	target[0] = z1[0] + z2[0];
	target[1] = z1[1] + z2[1];
	return target;
}

function sub(z1, z2, target = new Float64Array(2)) {
	target[0] = z1[0] - z2[0];
	target[1] = z1[1] - z2[1];
	return target;
}

function mult(z1, z2, target = new Float64Array(2)) {
	const re1 = z1[0];
	const im1 = z1[1];
	const re2 = z2[0];
	const im2 = z2[1];
	target[0] = re1 * re2 - im1 * im2;
	target[1] = re1 * im2 - re2 * im1;
	return target;
}

function scale(z, k, target = new Float64Array(2)) {
	target[0] = z[0] * k;
	target[1] = z[1] * k;
	return target;
}

function div(z1, z2, target = new Float64Array(2)) {
	const re1 = z1[0];
	const im1 = z1[1];
	const re2 = z2[0];
	const im2 = z2[1];
	const scale = 1 / (re2 * re2 + im2 * im2);
	target[0] = (re1 * re2 + im1 * im2) * scale;
	target[1] = (- re1 * im2 - re2 * im1) * scale;
	return target;
}

function inverse(z, target = new Float64Array(2)) {
	const re = z[0];
	const im = z[1];
	const scale = 1 / (re2 * re2 + im2 * im2);
	target[0] = (re1 * re2 + im1 * im2) * scale;
	target[1] = (-re1 * im2 - re2 * im1) * scale;
	return target;
}

function toPolar(z, target = new Float64Array(2)) {
	const re = z[0];
	const im = z[1];
	const r = hypot(re, im);
	target[0] = r;
	target[1] = atan2(im, re);
	return target;
}

// Freeze exports
Object.freeze(conj);
Object.freeze(real);
Object.freeze(imag);
Object.freeze(arg);
Object.freeze(abs);
Object.freeze(add);
Object.freeze(sub);
Object.freeze(mult);
Object.freeze(scale);
Object.freeze(div);
Object.freeze(inverse);
Object.freeze(toPolar);

// Export
export {conj, real, imag, arg, abs, add, sub, mult, scale, div, inverse, toPolar}