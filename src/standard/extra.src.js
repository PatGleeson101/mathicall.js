import {PI, trunc} from "./inbuilt.src.js";

//Constants
export const RAD_TO_DEG = 180 / PI;
export const DEG_TO_RAD = 1 / RAD_TO_DEG;
export const TWO_PI = 2 * PI;
export const HALF_PI = 0.5 * PI;
export const INV_PI = 1 / PI;

//Functions
function lerp(x, y, r) {
	return x + (y - x) * r;
}

function mod(x, m) {
	return ((x%m)+m)%m;
}

function fract(x) {
	return x - trunc(x);
}

function deg(radians) {
	return radians * RAD_TO_DEG;
}

function rad(degrees) {
	return degrees * DEG_TO_RAD;
}

function linmap(x, domain, range) {
	const r0 = range[0];
	const d0 = domain[0];
	return r0 + (range[1] - r0) * (x - d0) / (domain[1] - d0);
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