import { random, floor } from "../standard/inbuilt.js";

function sample(arr, count) { //TODO: specify parameter 'replace = true'
    const n = arr.length;
    const result = new Float64Array(count);
    for (let i = 0; i < count; i++) {
        result[i] = arr[floor( random() * n )];
    }
    return result;
}

Object.freeze(sample);

export {sample}