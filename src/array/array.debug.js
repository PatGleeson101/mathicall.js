import * as src from "./array.src.js";
import {assert, warn} from "../core/core.lib.js";

function sum(arr) {
	const signature = "sum(arr)";
	assert.realArray(arr, "arr", signature);
	const result = src.sum(arr);
	warn.realOverflow(result, signature);
	return result;
}

function min(arr, sorted) {
	const signature = "min(arr, ?sorted)";
	assert.realArray(arr, "arr", signature);
	assert.bool(sorted, "sorted", signature);
	//assert.sortedMatch(arr, sorted);
	return src.min(arr, sorted);
}

function max(arr, sorted) {
	const signature = "max(arr, ?sorted)";
	assert.realArray(arr, "arr", signature);
	assert.bool(sorted, "sorted", signature);
	return src.max(arr, sorted);
}

function prod(arr) {
	const signature = "prod(arr)";
	assert.realArray(arr, "arr", signature);
	return src.prod(arr);
}

function unique(arr, sorted) {
	const signature = "unique(arr, ?sorted)";
	assert.realArray(arr, "arr", signature);
	assert.bool(sorted, "sorted", signature);
	return src.unique(arr, sorted);
}

function indexOf(arr, value, sorted) {
	const signature = "indexOf(arr, value, ?sorted)";
	assert.bool(sorted, "sorted", signature);
	assert.realArray(arr, "arr", signature);
	assert.ifSorted(arr, sorted, "arr", signature);
	return src.indexOf(arr, value, sorted);
}

// Freeze exports
Object.freeze(sum);
Object.freeze(min);
Object.freeze(max);
Object.freeze(prod);
Object.freeze(unique);
Object.freeze(indexOf);

// Export exports
export {sum, min, max, prod, unique, indexOf}