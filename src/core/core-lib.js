//Debug functions
//Type-checking
function isNumeric(x) {
	if (x.constructor !== Number) {return false;} //Must be Number type
	if (isFinite(x)) {return true;} //Excludes Infinity and NaN
	return false;
}

//Input checking
function checkNumericInput(params = {}, funcStr = "", rootStr = "") {
	for (const param in params) {
		if (!isNumeric(param[1])) {throw `[${rootStr}] ${funcStr}: ${param[0]} must be numeric.`}
	}
}

function checkIntInput(params = {}, funcStr = "", rootStr = "") {
	for (const param in params) {
		if (!isInteger(param[1])) {throw `[${rootStr}] ${funcStr}: ${param[0]} must be an integer.`}
	}
}

//Output checking
function checkOutputOverflow(output, funcStr = "", rootStr = "") {
	if ((output > Number.MAX_SAFE_INTEGER)||(output < Number.MIN_SAFE_INTEGER)) {console.warn(`[${rootStr}] ${funcStr} large: returned value is approximate.`);}
	if (output === Number.MAX_VALUE) {console.warn(`[${rootStr}] ${funcStr} overflow: returned Number.MAX_VALUE.`);}
}

//Freeze exports
Object.freeze(isNumeric);
Object.freeze(checkNumericInput);
Object.freeze(checkIntInput);
Object.freeze(checkOutputOverflow);

// Export
export {isNumeric, checkNumericInput, checkIntInput, checkOutputOverflow}