import {PI, TWO_PI, cos, sin, abs as stdAbs, pow as stdPow} from "../../standard/standard-lib.js";

function toArg(angle) { //Not to be exported
	angle = angle%TWO_PI;
	if (angle > PI) {return angle - TWO_PI;}
	if (angle < -PI) {return angle + TWO_PI;}
	return angle;
}

function conj(z, target = new Float64Array(2)) {
	const r = z[0];
	const theta = z[1];
	if (r < 0) {
		target[0] = -r;
		target[1] = -toArg(theta + PI);
	} else {
		target[0] = r;
		target[1] = -toArg(theta);
	}
	return target;
}

function real(z) {
	return z[0] * cos(z[1]);
}

function imag(z) {
	return z[0] * sin(z[1]);
}

function arg(z) {
	return toArg(z[1]);
}

function abs(z) {
	return stdAbs(z[0]);
}

function smult(z, k, target = new Float64Array(2)) {
	const r = z[0] * k;
	const theta = z[1];
	if (r < 0) {
		target[0] = -r;
		target[1] = toArg(theta + PI);
	} else {
		target[0] = r;
		target[1] = toArg(theta);
	}
	return target;
}

function cmult(z1, z2, target = new Float64Array(2)) {
	const r = z1[0] * z2[0];
	const theta = z1[1] + z2[1];
	if (r < 0) {
		target[0] = -r;
		target[1] = toArg(theta + PI);
	} else {
		target[0] = r;
		target[1] = toArg(theta);
	}
	return target;
}

function div(z1, z2, target = new Float64Array(2)) {
	const r2 = z2[0];
	if (r2 === 0) {return undefined;}
	const r = z1[0] / r2;
	const theta = z1[1] - z2[1];
	if (r < 0) {
		target[0] = -r;
		target[1] = toArg(theta + PI);
	} else {
		target[0] = r;
		target[1] = toArg(theta);
	}
	return target;
}

function pow(z, n, target = new Float64Array(2)) {
	const r = z[0];
	const theta = z[1];
	if (r < 0) {
		target[0] = stdPow(-r, n);
		target[1] = toArg(n * (theta + PI));
	} else {
		target[0] = stdPow(r, n);
		target[1] = toArg(n * theta);
	}
	return target;
}

function inverse(z, target = new Float64Array(2)) {
	const r = z[0];
	if (r === 0) {return undefined;}
	const theta = z[1];
	if (r < 0) {
		target[0] = -1/r;
		target[1] = toArg(-theta - PI);
	} else {
		target[0] = 1/r;
		target[1] = toArg(-theta);
	}
	return target;
}

function rect(z, target = new Float64Array(2)) {
	const r = z[0];
	const theta = z[1];
	target[0] = r * cos(theta);
	target[1] = r * sin(theta);
	return target;
}

// Freeze exports
Object.freeze(conj)
Object.freeze(real)
Object.freeze(imag)
Object.freeze(arg)
Object.freeze(abs)
Object.freeze(smult)
Object.freeze(cmult)
Object.freeze(div)
Object.freeze(pow)
Object.freeze(inverse)
Object.freeze(rect)

// Export
export {conj, real, imag, arg, abs, smult, cmult, div, pow, inverse, rect}