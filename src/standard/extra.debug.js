import {assert, clearContext} from "../core/core.lib.js";
import * as src from "./extra.src.js";

function lerp(x, y, r) {
	setContext("lerp(x, y, r)", arguments);
	assert.realNumber("x");
	assert.realNumber("y");
	assert.realNumber("r");
	clearContext();
	return src.lerp(x, y, r);
}

function mod(x, m) {
	setContext("mod(x, m)", arguments);
	assert.realNumber("x");
	assert.realNumber("m");
	clearContext();
	return src.mod(x, m);
}

function fract(x) {
	setContext("fract(x)", arguments);
	assert.realNumber("x");
	clearContext();
	return src.fract(x);
}

function deg(radians) {
	setContext("deg(radians)", arguments);
	assert.realNumber("radians");
	clearContext();
	return src.deg(radians);
}

function rad(degrees) {
	setContext("rad(degrees)", arguments);
	assert.realNumber('degrees');
	clearContext();
	return src.rad(degrees);
}

function linmap(x, domain, range) {
	setContext("linmap(x, domain, range)", arguments);
	assert.realNumber("x");
	assert.realArray('domain');
	assert.realArray('range');
	if (domain[0] > domain[1]) {
		throw "linmap(x, domain, range): invalid domain"
	}
	if (range[0] > range[1]) {
		throw "linmap(x, domain, range): invalid range"
	}
	clearContext();
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