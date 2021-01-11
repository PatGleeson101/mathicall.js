import {factorial, choose, permute, gcd, lcm, mpow} from "./int-src.js";
import {checkIntInput, checkOutputOverflow} from "../core/core-lib.js";

function d_factorial(n) {
	checkIntInput({n: n}, "factorial(n)", "int.debug");
	const result = factorial(n);
	checkOutputOverflow(result, "factorial(n)", "int.debug");
	return result;
}

function d_choose(n, r) {
	checkIntInput({n: n, r: r}, "choose(n, r)", "int.debug");
	const result = choose(n, r);
	checkOutputOverflow(result, "choose(n, r)", "int.debug")
	return result;
}

function d_permute(n, r) {
	checkIntInput({n: n, r: r}, "permute(n, r)", "int.debug");
	const result = permute(n, r);
	checkOutputOverflow(result, "permute(n, r)", "int.debug")
	return result;
}

function d_gcd(a, b) {
	checkIntInput({a: a, b: b}, "gcd(a, b)", "int.debug");
	return gcd(a, b);
}

function d_lcm(a, b) {
	checkIntInput({a: a, b: b}, "lcm(a, b)", "int.debug");
	return lcm(a, b);
}

function d_mpow(base, exp, m) { //Unsure whether to reject negative input
	checkIntInput({base: base, exp: exp, m: m}, "mpow(base, exp, m)", "int.debug");
	return mpow(base, exp, m);
}

export {d_factorial as factorial, d_choose as choose, d_permute as permute}
export {d_gcd as gcd, d_lcm as lcm, d_mpow as mpow}