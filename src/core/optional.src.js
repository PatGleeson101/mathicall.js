import { signature, args } from "./core.src.js";
import * as assert from "./assert.src.js";

function sorted(arrLabel, sortedLabel) {
    const arr = args[arrLabel];
    const sorted = args[sortedLabel];
    const len = arr.length;
    if (len === 0) {return;}
    if (sorted === true) {
        sgn = Math.sign(arr[len - 1] - arr[0]);
        for (let i = 1; i < len; i++) {
            const s = Math.sign(arr[i] - arr[i-1]);
            if ( (s !== 0) && (s !== sgn)) {
                throw `${signature}: ${sortedLabel} set to true, but ${arrLabel} unsorted`;
            }
        }
    }
}

function realNumber(label) {
    const value = args[label];
    if (value === undefined) {return;}
    if (value.constructor !== Number) { //Assert type Number
        throw `${signature}: If provided, ${label} must be of type Number.`;
    }
	if (!isFinite(value)) { //Exclude Infinity and NaN
        throw `${signature}: ${label} cannot be NaN or Infinity.`;
    }
}

function target(label, length) {
    const value = args[label];
    if (value === undefined) {return;}
    assert.realArray(value);
    if (value.length !== length) {
        throw `${signature}: ${label} has incorrect length`
    }
}

function bool(label) {
    const value = args[label];
    if (value === undefined) {return;}
    if ((value !== true) && (value !== false)) {
        throw `${signature}: ${label} must be a boolean`
    }
}

function nonNegative(label) {
    const value = args[label];
    if (value === undefined) {return;}
    assert.nonNegative(label);
}

function nonNegativeInteger(label) {
    const value = args[label];
    if (value === undefined) {return;}
    assert.nonNegative(label);
    assert.integer(label);
}

Object.freeze(realNumber);
Object.freeze(sorted);
Object.freeze(target);
Object.freeze(bool);
Object.freeze(nonNegativeInteger);
Object.freeze(nonNegative);

export {realNumber, sorted, target, bool, nonNegativeInteger, nonNegative}