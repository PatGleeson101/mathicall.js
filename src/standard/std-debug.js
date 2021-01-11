import {checkNumericInput} from "../core/core-lib.js";
import * as extra from "./std-extra.js";

function d_lerp(x, y, r) {
	checkNumericInput({x:x, y:y, r:r}, 'lerp(x, y, r)', 'std.debug');
	return extra.lerp(x, y, r);
}

function d_mod(x, m) {
	checkNumericInput({x:x, m:m}, 'mod(x, m)', 'std.debug');
	return extra.mod(x, m);
}

function d_fract(x) {
	checkNumericInput({x:x}, 'fract(x)', 'std.debug');
	return extra.fract(x);
}

function d_deg(radians) {
	checkNumericInput({radians: radians}, 'deg(radians)', 'std.debug');
	return extra.deg(radians);
}

function d_rad(degrees) {
	checkNumericInput({degrees: degrees}, 'rad(degrees)', 'std.debug');
	return extra.rad(degrees);
}

export {d_lerp as lerp, d_mod as mod, d_fract as fract, d_deg as deg, d_rad as rad}