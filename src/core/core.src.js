// Current debug context
let signature = "Unknown";
let args = {};

function setContext(s, argArray) {
    //Parse signature
    signature = s;
    const parameters = signature
    .split("(")[1]
    .replace(")", "")
    .replace(" ", "")
    .replace("?", "")
    .split(",");
    //Parse arguments
    args = {};
    for (let i = 0; i < parameters.length; i++) {
        args[params[i]] = argArray[i];
    }
}

function clearContext() {
    args = {};
    signature = "Unknown";
}

// Shorter console use
function log() {
    console.log.apply(console, arguments);
}

function warn() {
    console.warn.apply(console, arguments);
}

/*
// Type checking
function isRealNumber() {

}

function isRealArray() {

}

function isString(s) {
    return (typeof s === 'string' || s instanceof String);
}
*/

//Freeze exports
Object.freeze(log);
Object.freeze(setContext);
Object.freeze(clearContext);
Object.freeze(warn);

export {signature, args, setContext, clearContext}
export {log, warn}