import * as src from "./integer.src.js";
import {assert, setContext, clearContext, warnif} from "../core/core.lib.js";

function factorial(n) {
	setContext("factorial(n)", arguments);
	assert.integer("n");
	assert.nonNegative("n");
	const result = src.factorial(n);
	warnif.realOverflow(result);
	warnif.intOverflow(result);
	clearContext();
	return result;
}

function choose(n, r) {
	setContext("choose(n, r)", arguments);
	assert.integer("n");
	assert.integer("r");
	const result = src.choose(n, r);
	warnif.realOverflow(result);
	warnif.intOverflow(result);
	clearContext();
	return result;
}

function permute(n, r) {
	setContext("permute(n, r)", arguments);
	assert.integer("n");
	assert.integer("r");
	const result = src.permute(n, r);
	warnif.realOverflow(result);
	warnif.intOverflow(result);
	clearContext();
	return result;
}

function gcd(a, b) {
	setContext("gcd(a, b)", arguments);
	assert.integer("a");
	assert.integer("b");
	clearContext();
	return src.gcd(a, b);
}

function lcm(a, b) {
	setContext("lcm(a, b)", arguments);
	assert.integer("a");
	assert.integer("b");
	clearContext();
	return src.lcm(a, b);
}

function mpow(base, exp, m) {
	setContext("mpow(base, exp, m)", arguments);
	assert.integer("base");
	assert.integer("exp");
	assert.nonNegative("exp");
	assert.integer("m");
	clearContext(0);
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