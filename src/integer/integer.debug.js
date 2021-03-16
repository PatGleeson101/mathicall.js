import * as src from "./integer.src.js";
import {assert, warn} from "../core/core.lib.js";

function factorial(n) {
	const signature = "factorial(n)";
	assert.integer(n, "n", signature);
	assert.nonNegative(n, "n", signature);
	const result = src.factorial(n);
	warn.realOverflow(result, signature);
	warn.intOverflow(result, signature);
	return result;
}

function choose(n, r) {
	const signature = "choose(n, r)";
	assert.integer(n, "n", signature);
	assert.integer(r, "r", signature);
	const result = src.choose(n, r);
	warn.realOverflow(result, signature);
	warn.intOverflow(result, signature);
	return result;
}

function permute(n, r) {
	const signature = "permute(n, r)";
	assert.integer(n, "n", signature);
	assert.integer(r, "r", signature);
	const result = src.permute(n, r);
	warn.realOverflow(result, signature);
	warn.intOverflow(result, signature);
	return result;
}

function gcd(a, b) {
	const signature = "gcd(a, b)";
	assert.integer(a, "a", signature);
	assert.integer(b, "b", signature);
	return src.gcd(a, b);
}

function lcm(a, b) {
	const signature = "lcm(a, b)";
	assert.integer(a, "a", signature);
	assert.integer(b, "b", signature);
	return src.lcm(a, b);
}

function mpow(base, exp, m) {
	const signature = "mpow(base, exp, m)";
	assert.integer(base, "base", signature);
	assert.integer(exp, "exp", signature);
	assert.nonNegative(exp, "exp", signature);
	assert.integer(m, "m", signature);
	return src.mpow(base, exp, m);
}

// Freeze exports
Object.freeze(factorial);
Object.freeze(choose);
Object.freeze(permute);
Object.freeze(gcd);
Object.freeze(lcm);
Object.freeze(mpow);

// Export
export {factorial, choose, permute, gcd, lcm, mpow}