import {assert} from "../core/core.lib.js";
import * as src from "./extra.src.js";

function lerp(x, y, r) {
	const signature = "lerp(x, y, r)";
	assert.realNumber(x, "x", signature);
	assert.realNumber(y, "y", signature);
	assert.realNumber(r, "r", signature);
	return src.lerp(x, y, r);
}

function mod(x, m) {
	const signature = "mod(x, m)";
	assert.realNumber(x, "x", signature);
	assert.realNumber(m, "m", signature);
	return src.mod(x, m);
}

function fract(x) {
	const signature = "fract(x)";
	assert.realNumber(x, "x", signature);
	return src.fract(x);
}

function deg(radians) {
	const signature = "deg(radians)";
	assert.realNumber(radians, "radians", signature);
	return src.deg(radians);
}

function rad(degrees) {
	const signature = "rad(degrees)";
	assert.realNumber(degrees, "degrees", signature);
	return src.rad(degrees);
}

function linmap(x, domain, range) {
	const signature = "linmap(x, domain, range)";
	assert.realNumber(x, "x", signature);
	//assert domain
	//assert range
	return src.linmap(x, domain, range);
}

// Freeze function exports
Object.freeze(lerp);
Object.freeze(mod);
Object.freeze(fract);
Object.freeze(deg);
Object.freeze(rad);
Object.freeze(linmap)

// Export functions
export {lerp, mod, fract, deg, rad, linmap}