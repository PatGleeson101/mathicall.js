import { signature, args, warn } from "./core.src.js";

const TYPED_ARRAY_CONSTRUCTORS = [
    Int8Array, Uint8Array, Uint8ClampedArray,
    Int16Array, Uint16Array, Int32Array, Uint32Array,
    Float32Array, Float64Array];

function realNumber(parameter) {
    const value = args[parameter];
    if (value.constructor !== Number) { //Assert type Number
        throw `${signature}: ${parameter} must be of type Number.`;
    }
	if (!isFinite(value)) { //Exclude Infinity and NaN
        throw `${signature}: ${parameter} cannot be NaN or Infinity.`;
    }
}

function realArray(parameter, length) {
    const value = args[parameter];
    if (TYPED_ARRAY_CONSTRUCTORS.includes(value.constructor) || Array.isArray(value)) {
        const len = value.length;
        if (len !== length) {
            throw `${signature}: ${parameter} has incorrect length`;
        }
        if (len === 0) {
            warn(`${signature}: ${parameter} is empty.`);
        }
        for (let i = 0; i < len; i++) {
			const x = value[i];
            if (value.constructor !== Number) { //Assert type Number
                throw `${signature}: ${parameter} must an array of Numbers.`;
            }
            if (!isFinite(value)) { //Exclude Infinity and NaN
                throw `${signature}: ${parameter} contains NaN or Infinity.`;
            }
        }
    }
    throw `${signature}: ${parameter} must be an Array or TypedArray.`;
}

function integer(parameter) {
    const value = args[parameter];
    if (!Number.isInteger(value)) {
        throw `${signature}: ${parameter} must be an integer of type Number.`;
    }
}

function positive(parameter) {
    const value = args[parameter];
    realNumber(parameter);
    if (value <= 0) {
        throw `${signature}: ${parameter} must be positive.`;
    }
}

function nonNegative(parameter) {
    const value = args[parameter];
    realNumber(parameter);
    if (value < 0) {
        throw `${signature}: ${parameter} must be non-negative.`;
    }
}

function rectVector(parameter) {
    realArray(parameter);
}

function polarVector(parameter) {
    const value = args[parameter];
    realArray(parameter);
    if (value[0] < 0) {
        console.warn(`${signature}: ${parameter} expressed with negative magnitude.`);
    }
}

function bool(parameter) {
    const value = args[parameter];
    if ( (value !== true) && (value !== false) ) {
        throw `${signature}: ${parameter} must be a boolean value.`;
    }
}

function polarComplex(parameter) {
    const value = args[parameter];
    realArray(parameter);
    const len = value.length;
    if (len < 2) {
        throw `${signature}: ${parameter} must have two components.`;
    }
    if (len > 2) {
        console.warn(`${signature}: ${parameter} contains additional values which will be ignored.`);
    }
    if (value[0] < 0) {
        console.warn(`${signature}: ${parameter} expressed with negative magnitude.`);
    }
}

function rectComplex(parameter) {
    const value = args[parameter];
    realArray(parameter);
    const len = value.length;
    if (len < 2) {
        throw `${signature}: ${parameter} must have two components.`;
    }
    if (len > 2) {
        console.warn(`${signature}: ${parameter} contains additional values which will be ignored.`);
    }
}

function positiveInteger(parameter) {
    integer(parameter);
    positive(parameter);
}

function flatMatrix(parameter, nrows, ncols) {
    realArray(parameter);
    const value = args[parameter];
    if ( (!Number.isInteger(value.nrows)) || (value.nrows < 1) ) {
        throw `${signature}: ${parameter}.nrows is invalid`;
    }
    if ((!Number.isInteger(value.ncols)) || (value.ncols < 1)) {
        throw `${signature}: ${parameter}.ncols is invalid`;
    }
    if (value.nrows * value.ncols !== value.length) {
        throw `${signature}: ${parameter}.length does not match ${parameter}.nrows * ${parameter}.ncols`;
    }
    if ( (value.nrows !== nrows) || (value.ncols !== ncols) ) {
        throw `${signature}: ${parameter} has incorrect dimensions`;
    }
}

//Freeze exports
Object.freeze(realNumber);
Object.freeze(realArray);
Object.freeze(integer);
Object.freeze(positive);
Object.freeze(nonNegative);
Object.freeze(rectVector);
Object.freeze(polarVector);
Object.freeze(bool);
Object.freeze(polarComplex);
Object.freeze(rectComplex);
Object.freeze(flatMatrix);
Object.freeze(positiveInteger);

// Export
export {realNumber, realArray, integer, positive, rectVector, polarVector, bool}
export {polarComplex, rectComplex, nonNegative, flatMatrix, positiveInteger}