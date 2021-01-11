import {PI, trunc} from "./std-inbuilt.js";

//Constants
export const RAD_TO_DEG = 180 / PI;
export const DEG_TO_RAD = 1 / RAD_TO_DEG;
export const TWO_PI = 2 * PI;
export const HALF_PI = 0.5 * PI;
export const INV_PI = 1 / PI;

//Functions
export function lerp(x, y, r) {
	return x + (y - x) * r;
}

export function mod(x, m) {
	return ((x%m)+m)%m;
}

export function fract(x) {
	return x - trunc(x);
}

export function deg(radians) {
	return radians * RAD_TO_DEG;
}

export function rad(degrees) {
	return degrees * DEG_TO_RAD;
}