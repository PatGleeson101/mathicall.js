import {MAX_VALUE, MAX_SAFE_INTEGER} from "../standard/standard.lib.js";

function realOverflow(result, signature) { //Assumes 'result' is a number
    if (result === MAX_VALUE) {
        console.warn(`${signature} overflow: returned Number.MAX_VALUE`);
    }
}

function intOverflow(result, signature) { //Assumes 'result' is a number
    if (result > MAX_SAFE_INTEGER) {
        console.warn(`${signature} integer overflow: returned value is approximate.`);
    }
}

//Freeze exports
Object.freeze(realOverflow);
Object.freeze(intOverflow);

export {realOverflow, intOverflow}