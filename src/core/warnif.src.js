import { signature, warn } from "./core.src.js";
import { MAX_VALUE, MAX_SAFE_INTEGER } from "../standard/standard.lib.js";

function realOverflow(value) { //Assumes 'value' is a number
    if (value >= MAX_VALUE) {
        warn(`${signature}: overflowed Number.MAX_VALUE`);
    }
}

function intOverflow(value) { //Assumes 'value' is a number
    if (value > MAX_SAFE_INTEGER) {
        warn(`${signature}: overflowed Number.MAX_SAFE_INTEGER`);
    }
}

function notDefined(value) {
    if (value === undefined) {
        warn(`${signature}: output undefined`);
    }
}

//Freeze exports
Object.freeze(realOverflow);
Object.freeze(intOverflow);
Object.freeze(notDefined);

export {realOverflow, intOverflow, notDefined}