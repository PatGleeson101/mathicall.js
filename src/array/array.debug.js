import * as src from "./array.src.js";
import { assert, warnif, setContext, clearContext, optional } from "../core/core.lib.js";

function sum(arr) {
	setContext("sum(arr)", arguments);
	assert.realArray("arr");
	const result = src.sum(arr);
	warnif.realOverflow(result);
	clearContext();
	return result;
}

function min(arr, sorted) {
	setContext("min(arr, ?sorted)", arguments);
	assert.realArray("arr");
	optional.bool("sorted");
	optional.sorted("arr", "sorted");
	clearContext();
	return src.min(arr, sorted);
}

function max(arr, sorted) {
	setContext("max(arr, ?sorted)", arguments);
	assert.realArray("arr");
	optional.bool("sorted");
	optional.sorted("arr", "sorted");
	clearContext();
	return src.max(arr, sorted);
}

function prod(arr) {
	setContext("prod(arr)", arguments);
	assert.realArray('arr');
	clearContext();
	return src.prod(arr);
}

function unique(arr, sorted) {
	setContext("unique(arr, ?sorted)", arguments);
	assert.realArray('arr');
	optional.bool('sorted');
	optional.sorted('arr', 'sorted');
	clearContext();
	return src.unique(arr, sorted);
}

function indexOf(arr, value, sorted) {
	setContext("indexOf(arr, value, ?sorted)", arguments);
	assert.realArray('arr');
	assert.realNumber('value');
	optional.bool('sorted');
	optional.sorted('arr', 'sorted');
	clearContext();
	return src.indexOf(arr, value, sorted);
}

function union(arr1, arr2, sorted) {
	setContext("union(arr1, arr2, ?sorted)", arguments);
	assert.realArray('arr1');
	assert.realArray('arr2');
	optional.bool('sorted');
	optional.sorted('arr1', 'sorted');
	optional.sorted('arr2', 'sorted'); // May have ensure sorted same way as arr1
	clearContext();
	return src.union(arr1, arr2, sorted);
}

function areEqual(arr1, arr2) {
	setContext("isEqual(arr1, arr2)", arguments);
	assert.realArray('arr1');
	assert.realArray('arr2');
	clearContext();
	return src.areEqual(arr1, arr2);
}

function sortUint8(arr, target) {
	setContext('sortUint8(arr, ?target)', arguments);
	if (arr.constructor !== Uint8Array) {
		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
	}
	optional.target('target', arr.length);
	clearContext();
	return src.sortUint8(arr, target);
}

function count(arr, value, sorted) {
	setContext("count(arr, value, ?sorted)", arguments);
	assert.realArray('arr');
	assert.realNumber('value');
	optional.bool('sorted');
	optional.sorted('arr', 'sorted');
	clearContext();
	return src.count(arr, value, sorted);
}

// Freeze exports
Object.freeze(sum);
Object.freeze(min);
Object.freeze(max);
Object.freeze(prod);
Object.freeze(unique);
Object.freeze(indexOf);
Object.freeze(union);
Object.freeze(areEqual);
Object.freeze(sortUint8);
Object.freeze(count);

// Export exports
export {sum, min, max, prod, unique, indexOf, areEqual}