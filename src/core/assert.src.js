const TYPED_ARRAY_CONSTRUCTORS = [
    Int8Array, Uint8Array, Uint8ClampedArray,
    Int16Array, Uint16Array, Int32Array, Uint32Array,
    Float32Array, Float64Array];

function realNumber(value, label, signature) {
    if (value.constructor !== Number) { //Assert type Number
        throw `${signature}: ${label} must be of type Number.`;
    }
	if (!isFinite(value)) { //Exclude Infinity and NaN
        throw `${signature}: ${label} cannot be NaN or Infinity.`;
    }
}

function realArray(value, label, signature) {
    if (TYPED_ARRAY_CONSTRUCTORS.includes(value.constructor)) {return;}
    if (Array.isArray(value)) {
        const len = value.length;
        if (len === 0) {
            console.warn(`${signature}: ${label} is empty.`);
        }
        for (let i = 0; i < len; i++) {
			const x = value[i];
            if (value.constructor !== Number) { //Assert type Number
                throw `${signature}: ${label} must an array of Numbers.`;
            }
            if (!isFinite(value)) { //Exclude Infinity and NaN
                throw `${signature}: ${label} contains NaN or Infinity.`;
            }
        }
    }
    throw `${signature}: ${label} must be an Array or TypedArray.`;
}

function integer(value, label, signature) {
    if (!Number.isInteger(value)) {
        throw `${signature}: ${label} must be an integer of type Number.`;
    }
}

function positive(value, label, signature) {
    realNumber(value, label, signature);
    if (value <= 0) {
        throw `${signature}: ${label} must be positive.`;
    }
}

function nonNegative(value, label, signature) {
    realNumber(value, label, signature);
    if (value < 0) {
        throw `${signature}: ${label} must be non-negative.`;
    }
}

function rectVector(value, label, signature) {
    realArray(value, label, signature);
}

function polarVector(value, label, signature) {
    realArray(value, label, signature);
    if (value[0] < 0) {
        console.warn(`${signature}: ${label} expressed with negative magnitude.`);
    }
}

function bool(value, label, signature) {
    if ( (value !== true) && (value !== false) ) {
        throw `${signature}: ${label} must be a boolean value.`;
    }
}

function ifSorted(arr, sorted, label, signature) {
    if (sorted) {
        const len = arr.length;
        if (arr[len-1] > arr[0]) { //Ascending
            for (let i = 1; i < len; i++) {
                if (arr[i] < arr[i-1]) {
                    throw `${signature}: sorted set to true but ${label} is unsorted`;
                }
            }
        } else { //Descending
            for (let i = 1; i < len; i++) {
                if (arr[i] > arr[i-1]) {
                    throw `${signature}: sorted set to true but ${label} is unsorted`;
                }
            }
        }
    }
}

function polarComplex(value, label, signature) {
    realArray(value, label, signature);
    const len = value.length;
    if (len < 2) {
        throw `${signature}: ${label} must have two components.`;
    }
    if (len > 2) {
        console.warn(`${signature}: ${label} contains additional values which will be ignored.`);
    }
    if (value[0] < 0) {
        console.warn(`${signature}: ${label} expressed with negative magnitude.`);
    }
}

function rectComplex(value, label, signature) {
    realArray(value, label, signature);
    const len = value.length;
    if (len < 2) {
        throw `${signature}: ${label} must have two components.`;
    }
    if (len > 2) {
        console.warn(`${signature}: ${label} contains additional values which will be ignored.`);
    }
}

function positiveInteger(value, label, signature) {
    integer(value, label, signature);
    positive(value, label, signature);
}

function flatMatrix(value, label, signature) {
    realArray(value, label, signature);
    positiveInteger(value.rows, `${label}.rows`, signature);
    positiveInteger(value.cols, `${label}.cols`, signature);
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
Object.freeze(ifSorted);
Object.freeze(polarComplex);
Object.freeze(rectComplex);
Object.freeze(flatMatrix);
Object.freeze(positiveInteger);

// Export
export {realNumber, realArray, integer, positive, rectVector, polarVector, bool, ifSorted}
export {polarComplex, rectComplex, nonNegative, flatMatrix, positiveInteger}