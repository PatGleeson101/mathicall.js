var Mathicall = (function (exports) {
    'use strict';

    // Current debug context
    let signature$1 = "Unknown";
    let args = {};

    function setContext$1(s, argArray) {
        //Parse signature
        signature$1 = s;
        const parameters = signature$1
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
        signature$1 = "Unknown";
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
    Object.freeze(setContext$1);
    Object.freeze(clearContext);
    Object.freeze(warn);

    const TYPED_ARRAY_CONSTRUCTORS = [
        Int8Array, Uint8Array, Uint8ClampedArray,
        Int16Array, Uint16Array, Int32Array, Uint32Array,
        Float32Array, Float64Array];

    function realNumber(parameter) {
        const value = args[parameter];
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1}: ${parameter} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1}: ${parameter} cannot be NaN or Infinity.`;
        }
    }

    function realArray(parameter, length) {
        const value = args[parameter];
        if (TYPED_ARRAY_CONSTRUCTORS.includes(value.constructor) || Array.isArray(value)) {
            const len = value.length;
            if (len !== length) {
                throw `${signature$1}: ${parameter} has incorrect length`;
            }
            if (len === 0) {
                warn(`${signature$1}: ${parameter} is empty.`);
            }
            for (let i = 0; i < len; i++) {
    			const x = value[i];
                if (value.constructor !== Number) { //Assert type Number
                    throw `${signature$1}: ${parameter} must an array of Numbers.`;
                }
                if (!isFinite(value)) { //Exclude Infinity and NaN
                    throw `${signature$1}: ${parameter} contains NaN or Infinity.`;
                }
            }
        }
        throw `${signature$1}: ${parameter} must be an Array or TypedArray.`;
    }

    function integer(parameter) {
        const value = args[parameter];
        if (!Number.isInteger(value)) {
            throw `${signature$1}: ${parameter} must be an integer of type Number.`;
        }
    }

    function positive(parameter) {
        const value = args[parameter];
        realNumber(parameter);
        if (value <= 0) {
            throw `${signature$1}: ${parameter} must be positive.`;
        }
    }

    function nonNegative(parameter) {
        const value = args[parameter];
        realNumber(parameter);
        if (value < 0) {
            throw `${signature$1}: ${parameter} must be non-negative.`;
        }
    }

    function rectVector(parameter) {
        realArray(parameter);
    }

    function polarVector(parameter) {
        const value = args[parameter];
        realArray(parameter);
        if (value[0] < 0) {
            console.warn(`${signature$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function bool(parameter) {
        const value = args[parameter];
        if ( (value !== true) && (value !== false) ) {
            throw `${signature$1}: ${parameter} must be a boolean value.`;
        }
    }

    function polarComplex(parameter) {
        const value = args[parameter];
        realArray(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1}: ${parameter} contains additional values which will be ignored.`);
        }
        if (value[0] < 0) {
            console.warn(`${signature$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function rectComplex(parameter) {
        const value = args[parameter];
        realArray(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1}: ${parameter} contains additional values which will be ignored.`);
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
            throw `${signature$1}: ${parameter}.nrows is invalid`;
        }
        if ((!Number.isInteger(value.ncols)) || (value.ncols < 1)) {
            throw `${signature$1}: ${parameter}.ncols is invalid`;
        }
        if (value.nrows * value.ncols !== value.length) {
            throw `${signature$1}: ${parameter}.length does not match ${parameter}.nrows * ${parameter}.ncols`;
        }
        if ( (value.nrows !== nrows) || (value.ncols !== ncols) ) {
            throw `${signature$1}: ${parameter} has incorrect dimensions`;
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

    function realOverflow(value) { //Assumes 'value' is a number
        if (value >= MAX_VALUE) {
            warn(`${signature$1}: overflowed Number.MAX_VALUE`);
        }
    }

    function intOverflow(value) { //Assumes 'value' is a number
        if (value > MAX_SAFE_INTEGER) {
            warn(`${signature$1}: overflowed Number.MAX_SAFE_INTEGER`);
        }
    }

    function notDefined(value) {
        if (value === undefined) {
            warn(`${signature$1}: output undefined`);
        }
    }

    //Freeze exports
    Object.freeze(realOverflow);
    Object.freeze(intOverflow);
    Object.freeze(notDefined);

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
                    throw `${signature$1}: ${sortedLabel} set to true, but ${arrLabel} unsorted`;
                }
            }
        }
    }

    function realNumber$1(label) {
        const value = args[label];
        if (value === undefined) {return;}
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1}: If provided, ${label} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1}: ${label} cannot be NaN or Infinity.`;
        }
    }

    function target(label, length) {
        const value = args[label];
        if (value === undefined) {return;}
        realArray(value);
        if (value.length !== length) {
            throw `${signature$1}: ${label} has incorrect length`
        }
    }

    function bool$1(label) {
        const value = args[label];
        if (value === undefined) {return;}
        if ((value !== true) && (value !== false)) {
            throw `${signature$1}: ${label} must be a boolean`
        }
    }

    function nonNegative$1(label) {
        const value = args[label];
        if (value === undefined) {return;}
        nonNegative(label);
    }

    function nonNegativeInteger(label) {
        const value = args[label];
        if (value === undefined) {return;}
        nonNegative(label);
        integer(label);
    }

    Object.freeze(realNumber$1);
    Object.freeze(sorted);
    Object.freeze(target);
    Object.freeze(bool$1);
    Object.freeze(nonNegativeInteger);
    Object.freeze(nonNegative$1);

    //Math constants
    const E = Math.E;
    const LN2 = Math.LN2;
    const SQRT2 = Math.SQRT2;
    const PI = Math.PI;

    //Number constants
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
    const MAX_VALUE = Number.MAX_VALUE;
    const EPSILON = Number.EPSILON;

    //Functions
    const abs = Math.abs;
    const sign = Math.sign;
    const round = Math.round;
    const trunc = Math.trunc;
    const ceil = Math.ceil;
    const floor = Math.floor;
    const sin = Math.sin;
    const asin = Math.asin;
    const cos = Math.cos;
    const acos = Math.acos;
    const tan = Math.tan;
    const atan = Math.atan;
    const atan2 = Math.atan2;
    const sqrt = Math.sqrt;
    const cbrt = Math.cbrt;
    const hypot = Math.hypot;
    const pow = Math.pow;
    const exp = Math.exp;
    const ln = Math.log;
    const log2 = Math.log2;
    const log10 = Math.log10;
    const max = Math.max;
    const min = Math.min;
    const random = Math.random;

    //Constants
    const RAD_TO_DEG = 180 / PI;
    const DEG_TO_RAD = 1 / RAD_TO_DEG;
    const TWO_PI = 2 * PI;
    const HALF_PI = 0.5 * PI;
    const INV_PI = 1 / PI;

    //Functions
    function lerp(x, y, r) {
    	return x + (y - x) * r;
    }

    function mod$1(x, m) {
    	return ((x%m)+m)%m;
    }

    function fract(x) {
    	return x - trunc(x);
    }

    function deg(radians) {
    	return radians * RAD_TO_DEG;
    }

    function rad(degrees) {
    	return degrees * DEG_TO_RAD;
    }

    function linmap(x, domain, range) {
    	const r0 = range[0];
    	const d0 = domain[0];
    	return r0 + (range[1] - r0) * (x - d0) / (domain[1] - d0);
    }

    // Freeze function exports
    Object.freeze(lerp);
    Object.freeze(mod$1);
    Object.freeze(fract);
    Object.freeze(deg);
    Object.freeze(rad);
    Object.freeze(linmap);

    function lerp$1(x, y, r) {
    	setContext("lerp(x, y, r)", arguments);
    	realNumber("x");
    	realNumber("y");
    	realNumber("r");
    	clearContext();
    	return lerp(x, y, r);
    }

    function mod$2(x, m) {
    	setContext("mod(x, m)", arguments);
    	realNumber("x");
    	realNumber("m");
    	clearContext();
    	return mod$1(x, m);
    }

    function fract$1(x) {
    	setContext("fract(x)", arguments);
    	realNumber("x");
    	clearContext();
    	return fract(x);
    }

    function deg$1(radians) {
    	setContext("deg(radians)", arguments);
    	realNumber("radians");
    	clearContext();
    	return deg(radians);
    }

    function rad$1(degrees) {
    	setContext("rad(degrees)", arguments);
    	realNumber('degrees');
    	clearContext();
    	return rad(degrees);
    }

    function linmap$1(x, domain, range) {
    	setContext("linmap(x, domain, range)", arguments);
    	realNumber("x");
    	realArray('domain');
    	realArray('range');
    	if (domain[0] > domain[1]) {
    		throw "linmap(x, domain, range): invalid domain"
    	}
    	if (range[0] > range[1]) {
    		throw "linmap(x, domain, range): invalid range"
    	}
    	clearContext();
    	return linmap(x, domain, range);
    }

    // Freeze function exports
    Object.freeze(lerp$1);
    Object.freeze(mod$2);
    Object.freeze(fract$1);
    Object.freeze(deg$1);
    Object.freeze(rad$1);
    Object.freeze(linmap$1);

    var extra_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        lerp: lerp$1,
        mod: mod$2,
        fract: fract$1,
        deg: deg$1,
        rad: rad$1,
        linmap: linmap$1
    });

    var standard_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: extra_debug,
        E: E,
        LN2: LN2,
        SQRT2: SQRT2,
        PI: PI,
        MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
        MAX_VALUE: MAX_VALUE,
        EPSILON: EPSILON,
        abs: abs,
        sign: sign,
        round: round,
        trunc: trunc,
        ceil: ceil,
        floor: floor,
        sin: sin,
        asin: asin,
        cos: cos,
        acos: acos,
        tan: tan,
        atan: atan,
        atan2: atan2,
        sqrt: sqrt,
        cbrt: cbrt,
        hypot: hypot,
        pow: pow,
        exp: exp,
        ln: ln,
        log2: log2,
        log10: log10,
        max: max,
        min: min,
        random: random,
        RAD_TO_DEG: RAD_TO_DEG,
        DEG_TO_RAD: DEG_TO_RAD,
        TWO_PI: TWO_PI,
        HALF_PI: HALF_PI,
        INV_PI: INV_PI,
        lerp: lerp,
        mod: mod$1,
        fract: fract,
        deg: deg,
        rad: rad,
        linmap: linmap
    });

    function computeFactorials(n = 170) { //n > 170 overflows JS's Number type
    	if (n < 0) {return [];}
    	const len = n + 1;
    	const result = new Float64Array(len);
    	result[0] = 1;
    	for (let i = 1; i < len; i++) {
    		result[i] = i * result[i-1];
    	}
    	return result;
    }

    function computeBinomials(n = 30) {
    	const len = 0.5 * (n + 1) * (n + 2);
    	const result = new Float64Array(len);
    	let i = -1;
    	for (let k = 0; k <= n; k++) {
    		result[i++] = 1;
    		for (let r = 1; r < k; r++) {
    			result[i] = result[i - k - 1] + result[i - k];
    			i++;
    		}
    		result[i++] = 1;
    	}
    	return result;
    }

    const FACTORIALS = computeFactorials();
    let BINOM_MAX_CACHED_N;
    let BINOMIALS;

    function precomputeBinomials(n) {
    	BINOM_MAX_CACHED_N = n;
    	BINOMIALS = computeBinomials(n);
    }

    precomputeBinomials(30);

    //Combinatorial functions
    function factorial(n) {
    	if (n < 0) {return undefined;}
    	if (n > 170) {return MAX_VALUE;}
    	return FACTORIALS[n];
    }

    function choose(n, r) {
    	if ((r > n)||(n < 0)||(r < 0)) {return 0;} // Quick return 0
    	if (n <= BINOM_MAX_CACHED_N) {return BINOMIALS[0.5 * n * (n + 1) + r];} //Return pre-computed
    	//Not pre-computed
    	const k = min(r, n - r);
    	if (k > 514) {return MAX_VALUE;} //Quick return for known overflow
    	const nMinusK = n - k;
    	let result = 1;
    	let i = 1;
    	while (i <= k) {
    		result *= (nMinusK + i)/(i++);
    	}
    	return result; //Could still have overflown
    }

    function permute(n, r) {
    	if ((r > n) || (n < 0) || (r < 0)) {return 0;}
    	r = n - r;
    	if (r > 170) {return MAX_VALUE;}
    	if (n < 171) {
    		return round(FACTORIALS[n]/FACTORIALS[r]);
    	}
    	let result = 1;
    	if (r < 160) { //Skip multiplication of known values
    		result = round(FACTORIALS[170]/FACTORIALS[r]);
    		r = 170;
    	} 
    	while (r < n) {
    		result *= ++r;
    	}
    	return result;
    }

    //Greatest common divisor
    function gcd(a, b) {
    	//Input & trivial cases
    	a = abs(a);
    	b = abs(b);
    	if (a===0) {return b;}
    	if (b===0) {return a;}
    	//Algorithm
    	if ((a < 4294967296)&&(b < 4294967296)) { //Safe to use bitwise operators
    		let shift = 0;
    		while (((a | b)&1) === 0) { //Remove common factors of 2
    			a = a >>> 1;
    			b = b >>> 1;
    			shift++;
    		}
    		while ((a & 1) === 0) { //Remove extra factors of 2 from a
    			a = a >>> 1;
    		}
    		while (b !== 0) {
    			while ((b & 1) === 0) { //Remove extra factors of 2 from b
    				b = b >>> 1;
    			}
    			if (a > b) { //Swap if a > b
    				const temp = a;
    				a = b;
    				b = temp;
    			}
    			b -= a;
    		}
    		return a << shift;
    	} else { //Input too large to use bitwise operators
    		while (a !== b) {
    			if (a > b) {
    				a -= b;
    			} else {
    				b -= a;
    			}
    		}
    		return a;
    	}
    }

    //Lowest common multiple
    function lcm(a, b) {
    	if ((a === 0)||(b === 0)) {return 0;}
    	return abs((a / gcd(a, b)) * b);
    }

    //Modular exponentiation
    function mpow(base, exp, m) {
    	//base = abs(base);
    	exp = abs(exp);
    	if (m === 1) {
    		return 0;
    	} else {
    		let result = 1;
    		base = base % m;
    		while (exp > 0) {
    			if (exp & 1) {
    				result = (result * base) % m;
    			}
    			exp = exp >> 1;
    			base = (base ** 2) % m;
    		}
    		return result;
    	}
    }

    // Freeze exports
    Object.freeze(computeFactorials);
    Object.freeze(computeBinomials);
    Object.freeze(precomputeBinomials);
    Object.freeze(factorial);
    Object.freeze(choose);
    Object.freeze(permute);
    Object.freeze(gcd);
    Object.freeze(lcm);
    Object.freeze(mpow);

    function factorial$1(n) {
    	setContext$1("factorial(n)", arguments);
    	integer("n");
    	nonNegative("n");
    	const result = factorial(n);
    	realOverflow(result);
    	intOverflow(result);
    	clearContext();
    	return result;
    }

    function choose$1(n, r) {
    	setContext$1("choose(n, r)", arguments);
    	integer("n");
    	integer("r");
    	const result = choose(n, r);
    	realOverflow(result);
    	intOverflow(result);
    	clearContext();
    	return result;
    }

    function permute$1(n, r) {
    	setContext$1("permute(n, r)", arguments);
    	integer("n");
    	integer("r");
    	const result = permute(n, r);
    	realOverflow(result);
    	intOverflow(result);
    	clearContext();
    	return result;
    }

    function gcd$1(a, b) {
    	setContext$1("gcd(a, b)", arguments);
    	integer("a");
    	integer("b");
    	clearContext();
    	return gcd(a, b);
    }

    function lcm$1(a, b) {
    	setContext$1("lcm(a, b)", arguments);
    	integer("a");
    	integer("b");
    	clearContext();
    	return lcm(a, b);
    }

    function mpow$1(base, exp, m) {
    	setContext$1("mpow(base, exp, m)", arguments);
    	integer("base");
    	integer("exp");
    	nonNegative("exp");
    	integer("m");
    	clearContext();
    	return mpow(base, exp, m);
    }

    // Freeze exports
    Object.freeze(factorial$1);
    Object.freeze(choose$1);
    Object.freeze(permute$1);
    Object.freeze(gcd$1);
    Object.freeze(lcm$1);
    Object.freeze(mpow$1);

    var integer_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        factorial: factorial$1,
        choose: choose$1,
        permute: permute$1,
        gcd: gcd$1,
        lcm: lcm$1,
        mpow: mpow$1
    });

    var integer_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: integer_debug,
        computeFactorials: computeFactorials,
        computeBinomials: computeBinomials,
        precomputeBinomials: precomputeBinomials,
        factorial: factorial,
        choose: choose,
        permute: permute,
        gcd: gcd,
        lcm: lcm,
        mpow: mpow
    });

    function Vector(v) {
    	return new Float64Array(v);
    }

    //Dot product
    function dot(vec1, vec2) {
    	let result = 0;
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		result += vec1[i] * vec2[i];
    	}
    	return result;
    }

    function dot2(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function dot3(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }

    function dot4(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
    }

    //Cross product
    function cross3(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    	return target;
    }

    //Addition
    function add(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] + vec2[i];
    	}
    	return target;
    }

    function add2(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	return target;
    }

    function add3(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	return target;
    }

    function add4(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	target[3] = vec1[3] + vec2[3];
    	return target;
    }

    //Subtraction
    function sub(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] - vec2[i];
    	}
    	return target;
    }

    function sub2(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	return target;
    }

    function sub3(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	return target;
    }

    function sub4(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	target[3] = vec1[3] - vec2[3];
    	return target;
    }

    //Magnitude
    function mag(vec) {
    	return hypot(...vec);
    }

    function mag2(vec) {
    	return hypot(vec[0], vec[1]);
    }

    function mag3(vec) {
    	return hypot(vec[0], vec[1], vec[2]);
    }

    function mag4(vec) {
    	return hypot(vec[0], vec[1], vec[2], vec[3]);
    }

    //Scaling
    function scale(vec, k, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec[i] * k;
    	}
    	return target;
    }

    function scale2(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	return target;
    }

    function scale3(vec, k, target = new Float64Array(3)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	return target;
    }

    function scale4(vec, k, target = new Float64Array(4)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	target[3] = vec[3] * k;
    	return target;
    }

    function normalize(vec, target = undefined) {
    	const m = mag(vec);
    	return (m === 0) ? undefined : scale(vec, 1 / m, target);
    }

    function normalize2(vec, target = undefined) {
    	const m = mag2(vec);
    	return (m === 0) ? undefined : scale2(vec, 1 / m, target);
    }

    function normalize3(vec, target = undefined) {
    	const m = mag3(vec);
    	return (m === 0) ? undefined : scale3(vec, 1 / m, target);
    }

    function normalize4(vec, target = undefined) {
    	const m = mag4(vec);
    	return (m === 0) ? undefined : scale4(vec, 1 / m, target);
    }

    //Angles & rotations
    function angle(vec1, vec2) {
    	const m = mag(vec1) * mag(vec2);
    	return (m === 0) ? undefined : acos(dot(vec1, vec2) / m);
    }

    function angle2(vec1, vec2) {
    	const m = mag2(vec1) * mag2(vec2);
    	return (m === 0) ? undefined : acos(dot2(vec1, vec2) / m);
    }

    function angle3(vec1, vec2) {
    	const m = mag3(vec1) * mag3(vec2);
    	return (m === 0) ? undefined : acos(dot3(vec1, vec2) / m);
    }

    function angle4(vec1, vec2) {
    	const m = mag4(vec1) * mag(vec2);
    	return (m === 0) ? undefined : acos(dot4(vec1, vec2) / m);
    }

    //Other component-wise operations
    function fract$2(vec, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = fract(vec[i]);
    	}
    	return target;
    }

    function fract2(vec, target = new Float64Array(2)) {
    	target[0] = fract(vec[0]);
    	target[1] = fract(vec[1]);
    	return target;
    }

    function fract3(vec, target = new Float64Array(3)) {
    	target[0] = fract(vec[0]);
    	target[1] = fract(vec[1]);
    	target[2] = fract(vec[2]);
    	return target;
    }

    function fract4(vec, target = new Float64Array(4)) {
    	target[0] = fract(vec[0]);
    	target[1] = fract(vec[1]);
    	target[2] = fract(vec[2]);
    	target[3] = fract(vec[3]);
    	return target;
    }

    function toPolar2(vec, target = new Float64Array(2)) {
    	target[0] = mag2(vec);
    	target[1] = atan2(vec[1], vec[0]) + PI;
    	return target;
    }

    // Freeze exports
    Object.freeze(Vector);
    Object.freeze(dot);
    Object.freeze(dot2);
    Object.freeze(dot3);
    Object.freeze(dot4);
    Object.freeze(cross3);
    Object.freeze(add);
    Object.freeze(add2);
    Object.freeze(add3);
    Object.freeze(add4);
    Object.freeze(sub);
    Object.freeze(sub2);
    Object.freeze(sub3);
    Object.freeze(sub4);
    Object.freeze(mag);
    Object.freeze(mag2);
    Object.freeze(mag3);
    Object.freeze(mag4);
    Object.freeze(scale);
    Object.freeze(scale2);
    Object.freeze(scale3);
    Object.freeze(scale4);
    Object.freeze(normalize);
    Object.freeze(normalize2);
    Object.freeze(normalize3);
    Object.freeze(normalize4);
    Object.freeze(angle);
    Object.freeze(angle2);
    Object.freeze(angle3);
    Object.freeze(angle4);
    Object.freeze(fract$2);
    Object.freeze(fract2);
    Object.freeze(fract3);
    Object.freeze(fract4);
    Object.freeze(toPolar2);

    //Dot product
    function dot$1(vec1, vec2) {
    	setContext$1("dot(vec1, vec2)", arguments);
    	realArray("vec1");
    	realArray("vec2", vec1.length);
    	clearContext();
    	return dot(vec1, vec2);
    }

    function dot2$1(vec1, vec2) {
    	setContext$1("dot2(vec1, vec2)", arguments);
    	realArray("vec1", 2);
    	realArray("vec2", 2);
    	clearContext();
    	return dot2(vec1, vec2);
    }

    function dot3$1(vec1, vec2) {
    	setContext$1("dot3(vec1, vec2)", arguments);
    	realArray("vec1", 3);
    	realArray("vec2", 3);
    	clearContext();
    	return dot3(vec1, vec2);
    }

    function dot4$1(vec1, vec2) {
    	setContext$1("dot4(vec1, vec2)", arguments);
    	realArray("vec1", 4);
    	realArray("vec2", 4);
    	clearContext();
    	return dot4(vec1, vec2);
    }

    //Cross product
    function cross3$1(vec1, vec2, target$1) {
    	setContext$1("cross3(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 3);
    	realArray("vec2", 3);
    	target('target', 3);
    	clearContext();
    	return cross3(vec1, vec2, target$1);
    }

    //Addition
    function add$1(vec1, vec2, target$1) {
    	setContext$1("add(vec1, vec2, ?target)", arguments);
    	realArray("vec1");
    	realArray("vec2", vec1.length);
    	target('target', vec1.length);
    	clearContext();
    	return add(vec1, vec2, target$1);
    }

    function add2$1(vec1, vec2, target$1) {
    	setContext$1("add2(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 2);
    	realArray("vec2", 2);
    	target('target', 2);
    	clearContext();
    	return add2(vec1, vec2, target$1);
    }

    function add3$1(vec1, vec2, target$1) {
    	setContext$1("add3(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 3);
    	realArray("vec2", 3);
    	target('target', 3);
    	clearContext();
    	return add3(vec1, vec2, target$1);
    }

    function add4$1(vec1, vec2, target$1) {
    	setContext$1("add4(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 4);
    	realArray("vec2", 4);
    	target('target', 4);
    	clearContext();
    	return add4(vec1, vec2, target$1);
    }

    //Subtraction
    function sub$1(vec1, vec2, target$1) {
    	setContext$1("sub(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 2);
    	realArray("vec2", vec1.length);
    	target('target', vec1.length);
    	clearContext();
    	return sub(vec1, vec2, target$1);
    }

    function sub2$1(vec1, vec2, target$1) {
    	setContext$1("sub2(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 2);
    	realArray("vec2", 2);
    	target('target', 2);
    	clearContext();
    	return sub2(vec1, vec2, target$1);
    }

    function sub3$1(vec1, vec2, target$1) {
    	setContext$1("sub3(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 3);
    	realArray("vec2", 3);
    	target('target', 3);
    	clearContext();
    	return sub3(vec1, vec2, target$1);
    }

    function sub4$1(vec1, vec2, target$1) {
    	setContext$1("sub4(vec1, vec2, ?target)", arguments);
    	realArray("vec1", 4);
    	realArray("vec2", 4);
    	target('target', 4);
    	clearContext();
    	return sub4(vec1, vec2, target$1);
    }

    //Magnitude
    function mag$1(vec) {
    	setContext$1("mag(vec)", arguments);
    	realArray("vec");
    	clearContext();
    	return mag(vec);
    }

    function mag2$1(vec) {
    	setContext$1("mag2(vec)", arguments);
    	realArray("vec", 2);
    	clearContext();
    	return mag2(vec);
    }

    function mag3$1(vec) {
    	setContext$1("mag3(vec)", arguments);
    	realArray("vec", 3);
    	clearContext();
    	return mag3(vec);
    }

    function mag4$1(vec) {
    	setContext$1("mag4(vec)", arguments);
    	realArray("vec", 4);
    	clearContext();
    	return mag4(vec);
    }

    //Scaling
    function scale$1(vec, k, target$1) {
    	setContext$1("scale(vec, k, ?target)", arguments);
    	realArray("vec");
    	realNumber("k");
    	target('target', vec.length);
    	return scale(vec, k, target$1);
    }

    function scale2$1(vec, k, target$1) {
    	setContext$1("scale2(vec, k, ?target)", arguments);
    	realArray("vec", 2);
    	realNumber("k");
    	target('target', 2);
    	return scale2(vec, k, target$1);
    }

    function scale3$1(vec, k, target$1) {
    	setContext$1("scale3(vec, k, ?target)", arguments);
    	realArray("vec", 3);
    	realNumber("k");
    	target('target', 3);
    	return scale3(vec, k, target$1);
    }

    function scale4$1(vec, k, target$1) {
    	setContext$1("scale4(vec, k, ?target)", arguments);
    	realArray("vec", 4);
    	realNumber("k");
    	target('target', 4);
    	return scale4(vec, k, target$1);
    }

    function normalize$1(vec, target$1) { //'target' intentionally defaults to undefined
    	setContext$1("normalize(vec, ?target)", arguments);
    	realArray("vec");
    	target('target', vec.length);
    	return normalize(vec, target$1);
    }

    function normalize2$1(vec, target$1) {
    	setContext$1("normalize2(vec, ?target)", arguments);
    	realArray("vec", 2);
    	target('target', 2);
    	return normalize2(vec, target$1);
    }

    function normalize3$1(vec, target$1) {
    	setContext$1("normalize3(vec, ?target)", arguments);
    	realArray("vec", 3);
    	target('target', 3);
    	return normalize3(vec, target$1);
    }

    function normalize4$1(vec, target$1) {
    	setContext$1("normalize4(vec, ?target)", arguments);
    	realArray("vec", 4);
    	target('target', 4);
    	return normalize4(vec, target$1);
    }

    //Angles & rotations
    function angle$1(vec1, vec2) {
    	setContext$1("angle(vec1, vec2)", arguments);
    	realArray("vec1");
    	realArray("vec2", vec1.length);
    	return angle(vec1, vec2);
    }

    function angle2$1(vec1, vec2) {
    	setContext$1("angle2(vec1, vec2)", arguments);
    	realArray("vec1", 2);
    	realArray("vec2", 2);
    	return angle2(vec1, vec2);
    }

    function angle3$1(vec1, vec2) {
    	setContext$1("angle3(vec1, vec2)", arguments);
    	realArray("vec1", 3);
    	realArray("vec2", 3);
    	return angle3(vec1, vec2);
    }

    function angle4$1(vec1, vec2) {
    	setContext$1("angle4(vec1, vec2)", arguments);
    	realArray("vec1", 4);
    	realArray("vec2", 4);
    	return angle4(vec1, vec2);
    }

    //Other component-wise operations
    function fract$3(vec, target$1) {
    	setContext$1("fract(vec, ?target)", arguments);
    	realArray("vec");
    	target("target", vec.length);
    	return fract$2(vec, target$1);
    }

    function fract2$1(vec, target$1) {
    	setContext$1("fract2(vec, ?target)", arguments);
    	realArray("vec", 2);
    	target("target", 2);
    	return fract2(vec, target$1);
    }

    function fract3$1(vec, target$1) {
    	setContext$1("fract3(vec, ?target)", arguments);
    	realArray("vec", 3);
    	target("target", 3);
    	return fract3(vec, target$1);
    }

    function fract4$1(vec, target$1) {
    	setContext$1("fract4(vec, ?target)", arguments);
    	realArray("vec", 4);
    	target("target", 4);
    	return fract4(vec, target$1);
    }

    function toPolar2$1(vec, target$1) {
    	setContext$1("polar2(vec, ?target)", arguments);
    	realArray("vec", 2);
    	target("target", 2);
    	return toPolar2(vec, target$1);
    }

    // Freeze exports
    Object.freeze(dot$1);
    Object.freeze(dot2$1);
    Object.freeze(dot3$1);
    Object.freeze(dot4$1);
    Object.freeze(cross3$1);
    Object.freeze(add$1);
    Object.freeze(add2$1);
    Object.freeze(add3$1);
    Object.freeze(add4$1);
    Object.freeze(sub$1);
    Object.freeze(sub2$1);
    Object.freeze(sub3$1);
    Object.freeze(sub4$1);
    Object.freeze(mag$1);
    Object.freeze(mag2$1);
    Object.freeze(mag3$1);
    Object.freeze(mag4$1);
    Object.freeze(scale$1);
    Object.freeze(scale2$1);
    Object.freeze(scale3$1);
    Object.freeze(scale4$1);
    Object.freeze(normalize$1);
    Object.freeze(normalize2$1);
    Object.freeze(normalize3$1);
    Object.freeze(normalize4$1);
    Object.freeze(angle$1);
    Object.freeze(angle2$1);
    Object.freeze(angle3$1);
    Object.freeze(angle4$1);
    Object.freeze(fract$3);
    Object.freeze(fract2$1);
    Object.freeze(fract3$1);
    Object.freeze(fract4$1);
    Object.freeze(toPolar2$1);

    var rect_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dot: dot$1,
        dot2: dot2$1,
        dot3: dot3$1,
        dot4: dot4$1,
        cross3: cross3$1,
        add: add$1,
        add2: add2$1,
        add3: add3$1,
        add4: add4$1,
        sub: sub$1,
        sub2: sub2$1,
        sub3: sub3$1,
        sub4: sub4$1,
        mag: mag$1,
        mag2: mag2$1,
        mag3: mag3$1,
        mag4: mag4$1,
        scale: scale$1,
        scale2: scale2$1,
        scale3: scale3$1,
        scale4: scale4$1,
        normalize: normalize$1,
        normalize2: normalize2$1,
        normalize3: normalize3$1,
        normalize4: normalize4$1,
        angle: angle$1,
        angle2: angle2$1,
        angle3: angle3$1,
        angle4: angle4$1,
        fract: fract$3,
        fract2: fract2$1,
        fract3: fract3$1,
        fract4: fract4$1,
        toPolar2: toPolar2$1
    });

    var rect_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: rect_debug,
        Vector: Vector,
        dot: dot,
        dot2: dot2,
        dot3: dot3,
        dot4: dot4,
        cross3: cross3,
        add: add,
        add2: add2,
        add3: add3,
        add4: add4,
        sub: sub,
        sub2: sub2,
        sub3: sub3,
        sub4: sub4,
        mag: mag,
        mag2: mag2,
        mag3: mag3,
        mag4: mag4,
        scale: scale,
        scale2: scale2,
        scale3: scale3,
        scale4: scale4,
        normalize: normalize,
        normalize2: normalize2,
        normalize3: normalize3,
        normalize4: normalize4,
        angle: angle,
        angle2: angle2,
        angle3: angle3,
        angle4: angle4,
        fract: fract$2,
        fract2: fract2,
        fract3: fract3,
        fract4: fract4,
        toPolar2: toPolar2
    });

    function simplify2(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = mod$1(vec[1] + PI, TWO_PI);
    	} else if (r > 0) {
    		target[0] = r;
    		target[1] = mod$1(vec[1], TWO_PI);
    	} else {
    		target[0] = 0;
    		target[1] = 0;
    	}
    	return target;
    }

    function dot2$2(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos(vec1[1] - vec2[1]);
    }

    function mag$2(vec) {
    	return vec[0];
    }

    function scale2$2(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1];
    	return simplify2(target, target);
    }

    function normalize2$2(vec, target = new Float64Array(2)) {
    	if (vec[0] === 0) {return undefined;}
    	target[0] = 1;
    	target[1] = vec[1];
    	return target;
    }

    function toRect2(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	const theta = vec[1];
    	target[0] = r * cos(theta);
    	target[1] = r * sin(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(simplify2);
    Object.freeze(dot2$2);
    Object.freeze(mag$2);
    Object.freeze(scale2$2);
    Object.freeze(normalize2$2);
    Object.freeze(toRect2);

    var polar_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        simplify2: simplify2,
        dot2: dot2$2,
        mag: mag$2,
        scale2: scale2$2,
        normalize2: normalize2$2,
        toRect2: toRect2
    });

    //Default form is rectangular

    var vector_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        rect: rect_lib,
        polar: polar_lib,
        debug: rect_debug,
        Vector: Vector,
        dot: dot,
        dot2: dot2,
        dot3: dot3,
        dot4: dot4,
        cross3: cross3,
        add: add,
        add2: add2,
        add3: add3,
        add4: add4,
        sub: sub,
        sub2: sub2,
        sub3: sub3,
        sub4: sub4,
        mag: mag,
        mag2: mag2,
        mag3: mag3,
        mag4: mag4,
        scale: scale,
        scale2: scale2,
        scale3: scale3,
        scale4: scale4,
        normalize: normalize,
        normalize2: normalize2,
        normalize3: normalize3,
        normalize4: normalize4,
        angle: angle,
        angle2: angle2,
        angle3: angle3,
        angle4: angle4,
        fract: fract$2,
        fract2: fract2,
        fract3: fract3,
        fract4: fract4,
        toPolar2: toPolar2
    });

    const MAX_LINEAR_SEARCH_LENGTH = 64; //Yet to be optimised

    function sum(arr) {
    	const len = arr.length;
    	let result = 0;
    	for (let i = 0; i < len; i++) {
    		result += arr[i];
    	}
    	return result;
    }

    function min$1(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return min(arr[0], arr[len-1]);
    	}
    	let result = arr[0]; //Defaults to undefined if array is empty
    	let element = 0;
    	for (let i = 1; i < len; i++) {
    		element = arr[i];
    		if (element < result) {
    			result = element;
    		}
    	}
    	return result;
    }

    function max$1(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return max(arr[0], arr[len-1]);
    	}
    	let result = arr[0]; //Defaults to undefined if array is empty
    	let element = 0;
    	for (let i = 1; i < len; i++) {
    		element = arr[i];
    		if (element > result) {
    			result = element;
    		}
    	}
    	return result;
    }

    function imax(arr, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (sorted) {
    		return (arr[0] >= arr[len-1]) ? 0 : len - 1; //>= is important; ensures first occurrence returned
    	}
    	let result = 0;
    	let maxValue = arr[0] - 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value > maxValue) {
    			maxValue = value;
    			result = i;
    		}
    	}
    	return result;
    }

    function imin(arr, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (sorted) {
    		return (arr[0] <= arr[len-1]) ? 0 : len - 1;
    	}
    	let result = 0;
    	let minValue = arr[0] + 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value < minValue) {
    			minValue = value;
    			result = i;
    		}
    	}
    	return result;
    }

    function prod(arr) {
    	const len = arr.length;
    	let result = 1; //By convention for empty array
    	for (let i = 1; i < len; i++) {
    		result *= arr[i];
    	}
    	return result;
    }

    function unique(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) { //Sorted
    		const uniqueElements = new Float64Array(len); //In future, reduce wasted memory by allocating in blocks
    		let uniqueCount = 0;
    		let previous = 0;
    		let current = arr[0];
    		let i = 0;
    		while (i < len) {
    			uniqueElements[uniqueCount++] = current;
    			previous = current;
    			while (current === previous) {
    				current = arr[i++];
    			}
    		}
    		return uniqueElements.slice(0, uniqueCount);
    	} else { //Unsorted
    		const uniqueElements = {};
    		let value = 0;
    		for (let i = 0; i < len; i++) {
    			value = arr[i];
    			uniqueElements[value] = value;
    		}
    		return new Float64Array(Object.values(uniqueElements));
    	}
    }

    function indexOf(arr, value, sorted = false) {
    	const len = arr.length;
    	if ((!sorted)||(len <= MAX_LINEAR_SEARCH_LENGTH)) { //Unsorted or small length
    		for (let i = 0; i < len; i++) {
    			if (arr[i] === value) {return i;} //Return first instance (if contained)
    		}
    	} else { //Sorted & sufficiently long; use binary search
    		//Get bounds
    		let lowerBound = 0;
    		let upperBound = len - 1;
    		let startValue = arr[lowerBound];
    		let endValue = arr[upperBound];
    		let currentIndex = 0;
    		let currentValue = 0;
    		//Find (at most) one occurrence
    		if (startValue > endValue) { //Descending order
    			if ((startValue < value)||(endValue > value)) {return -1;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
    				currentIndex = floor(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue > value) {
    					lowerBound = currentIndex;
    				} else {
    					upperBound = currentIndex;
    				}
    			}
    		} else { //Ascending order
    			if ((startValue > value)||(endValue < value)) {return -1;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
    				currentIndex = floor(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue < value) {
    					lowerBound = currentIndex;
    				} else {
    					upperBound = currentIndex;
    				}
    			}
    		}
    		//Linear search for first occurrence once region becomes small enough
    		while (lowerBound <= upperBound) { 
    			if (arr[lowerBound] === value) {return lowerBound;}
    			lowerBound++;
    		}
    	}
    	return -1; //Not contained
    }

    function union(arr1, arr2, sorted = false) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if ( (!sorted) || (len1 + len2 < MAX_LINEAR_SEARCH_LENGTH) ) { //Arrays unsorted or short
    		const unionElements = {};
    		let value = 0;
    		for (let i = 0; i < len1; i++) {
    			value = arr1[i];
    			unionElements[value] = value;
    		}
    		for (let i = 0; i < len2; i++) {
    			value = arr2[i];
    			unionElements[value] = value;
    		}
    		return new Float64Array(Object.values(unionElements));
    	} else { //Sorted and sufficiently long
    		const result = [];
    		let i = 0;
    		let j = 0;
    		let val1 = 0;
    		let val2 = 0;
    		let prev_val1 = NaN;
    		let prev_val2 = NaN;
    		while ( (i < len1) && (j < len2) ) {
    			val1 = arr1[i];
    			val2 = arr2[j];
    			if (val1 < val2) {
    				if (val1 !== prev_val1) {
    					result.push(val1);
    					prev_val1 = val1;
    				}
    				i++;
    			} else if (val1 > val2) {
    				if (val2 !== prev_val2) {
    					result.push(val2);
    					prev_val2 = val2;
    				}
    				j++;
    			} else { //broken
    				if (val1 !== prev_val1) {
    					result.push(val1);
    				}
    				i++;
    				j++;
    			}
    			//Catch rest of larger array
    			while (i < len1) {
    				result.push(arr1[i++]);
    			}
    			while (j < len2) {
    				result.push(arr2[j++]);
    			}
    			return new Float64Array(result);
    		}
    	}
    }

    function areEqual(arr1, arr2) { //TODO: permit tolerance
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if (len1 !== len2) {return false;}
    	for (let i = 0; i < len1; i++) {
    		if (arr1[i] !== arr2[i]) {return false;}
    	}
    	return true;
    }

    function sortUint8(arr, target = new Uint8Array(arr.length)) { //Radix sort
    	const buckets = new Uint32Array(256);
    	const len = arr.length;
    	for (let i = 0; i < len; i++) { //Count occurrences
    		buckets[arr[i]] += 1;
    	}
    	let j = 0;
    	for (let i = 0; i < 256; i++) {
    		const count = buckets[i];
    		for (let k = 0; k < count; k++) {
    			target[j++] = i;
    		}
    	}
    	return target;
    }

    function count(arr, value, sorted = false) {
    	const len = arr.length;
    	let result = 0;
    	if ((!sorted)||(arr.length <= MAX_LINEAR_SEARCH_LENGTH)) { //Unsorted or short array
    		for (let i = 0; i < len; i++) {
    			if (arr[i] === value) {result += 1;}
    		}
    	} else { //Sorted and sufficiently long
    		//Get bounds
    		let lowerBound = 0;
    		let upperBound = len - 1;
    		let startValue = arr[lowerBound];
    		let endValue = arr[upperBound];
    		let currentIndex = 0;
    		let currentValue = 0;
    		let pivot = undefined;
    		//Find one occurrence (not necessarily first)
    		if (startValue > endValue) { //Descending order
    			if ((startValue < value)||(endValue > value)) {return 0;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
    				currentIndex = floor(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue > value) {
    					lowerBound = currentIndex + 1;
    				} else if (currentValue < value) {
    					upperBound = currentIndex - 1;
    				} else { //Found an instance
    					pivot = currentIndex;
    					break;
    				}
    			}
    		} else { //Ascending order
    			if ((startValue > value)||(endValue < value)) {return 0;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
    				currentIndex = floor(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue < value) {
    					lowerBound = currentIndex + 1;
    				} else if (currentValue > value) {
    					upperBound = currentIndex - 1;
    				} else { //Found an instance
    					pivot = currentIndex;
    					break;
    				}
    			}
    		}
    		if (pivot !== undefined) { //Could also check whether upperBound - lowerBound still > MAX_LINEAR_SEARCH_LENGTH
    			//Initial search ended because a pivot was found. Split binary search to find first and last occurrence.
    			//FIRST OCCURRENCE
    			let upperBoundFirst = pivot;
    			while (upperBoundFirst - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
    				currentIndex = floor(0.5 * (lowerBound + upperBoundFirst));
    				currentValue = arr[currentIndex];
    				if (currentValue !== value) {
    					lowerBound = currentIndex;
    				} else {
    					upperBoundFirst = currentIndex;
    				}
    			}
    			// Linear search for first occurrence once region becomes small enough
    			while (lowerBound <= upperBoundFirst) { 
    				if (arr[lowerBound] === value) {break;}
    				lowerBound++;
    			}
    			//LAST OCCURRENCE
    			let lowerBoundLast = pivot;
    			while (upperBound - lowerBoundLast > MAX_LINEAR_SEARCH_LENGTH) {
    				currentIndex = floor(0.5 * (lowerBoundLast + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue !== value) {
    					upperBound = currentIndex;
    				} else {
    					lowerBoundLast = currentIndex;
    				}
    			}
    			// Linear search for first occurrence once region becomes small enough
    			while (upperBound >= lowerBoundLast) { 
    				if (arr[upperBound] === value) {break;}
    				upperBound--;
    			}
    			//Set result
    			result = upperBound - lowerBound + 1;
    		} else {
    			//Initial search ended because bounds got too close together
    			for (let i = lowerBound; i <= upperBound; i++) {
    				if (arr[i] === value) {result += 1;}
    			}
    		}
    	}
    	return result;
    }

    // Freeze exports
    Object.freeze(sum);
    Object.freeze(min$1);
    Object.freeze(max$1);
    Object.freeze(prod);
    Object.freeze(unique);
    Object.freeze(indexOf);
    Object.freeze(union);
    Object.freeze(areEqual);
    Object.freeze(sortUint8);
    Object.freeze(imin);
    Object.freeze(imax);
    Object.freeze(count);

    function zeros(nrows, ncols) {
    	const result = new Float64Array(nrows * ncols);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function constant(nrows, ncols, value) {
    	const result = new Float64Array(nrows * ncols);
    	result.fill(value);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function identity(n) {
    	const len = n * n;
    	const inc = n + 1;
    	const result = new Float64Array(len);
    	for (let i = 0; i < len; i += inc) {
    		result[i] = 1;
    	}
    	result.nrows = n;
    	result.ncols = n;
    	return result;
    }

    function flatten(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
    	const rows = mat2d.length;
    	const cols = mat2d[0].length;
    	for (let i = 0; i < rows; i++) {
    		for (let j = 0; j < cols; j++) {
    			target[i * rows + j] = mat2d[i][j];
    		}
    	}
    	target.nrows = rows;
    	target.ncols = cols;
    	return target;
    }

    //Scaling
    function scale$2(mat, k, target = new Float64Array(mat.length)) {
    	const len = mat.length;
    	for (let i = 0; i < len; i++) {
    		target[i] = mat[i] * k;
    	}
    	target.nrows = mat.nrows;
    	target.ncols = mat.ncols;
    	return target;
    }

    //Transpose
    function transpose2x2(mat, target = new Float64Array(4)) {
    	//Main diagonal
    	target[0] = mat[0];
    	target[3] = mat[3];
    	//Other entries
    	const cached = mat[1];
    	target[1] = mat[2];
    	target[2] = cached;
    	target.nrows = 2;
    	target.ncols = 2;
    	return target;
    }

    function transpose3x3(mat, target = new Float64Array(9)) {
    	//Main diagonal
    	target[0] = mat[0];
    	target[4] = mat[4];
    	target[8] = mat[8];
    	//Other entries
    	let cached = mat[1];
    	target[1] = mat[3];
    	target[3] = cached;
    	cached = mat[2];
    	target[2] = mat[6];
    	target[6] = cached;
    	cached = mat[5];
    	target[5] = mat[7];
    	target[7] = cached;
    	target.nrows = 3;
    	target.ncols = 3;
    	return target;
    }

    function transpose4x4(mat, target = new Float64Array(16)) {
    	//Main diagonal
    	target[0] = mat[0];
    	target[5] = mat[5];
    	target[10] = mat[10];
    	target[15] = mat[15];
    	//Other entries
    	let cached = mat[1];
    	target[1] = mat[4];
    	target[4] = cached;
    	cached = mat[2];
    	target[2] = mat[8];
    	target[8] = cached;
    	cached = mat[3];
    	target[3] = mat[12];
    	target[12] = cached;
    	cached = mat[6];
    	target[6] = mat[9];
    	target[9] = cached;
    	cached = mat[7];
    	target[7] = mat[13];
    	target[13] = cached;
    	cached = mat[11];
    	target[11] = mat[14];
    	target[14] = cached;
    	target.nrows = 4;
    	target.ncols = 4;
    	return target;
    }

    //Matrix multiplication
    function mult(mat1, mat2) { //consider adding target parameter
    	const r1 = mat1.nrows;
    	const c1 = mat1.ncols;
    	const c2 = mat2.ncols;
    	const target = new Float64Array(r1 * c2);
    	target.nrows = r1;
    	target.ncols = c2;
    	let value = 0;
    	let x = 0;
    	let y = 0;
    	for (let i = 0; i < r1; i++) {
    		for (let j = 0; j < c2; j += 1) {
    			value = 0;
    			x = c1 * i;
    			y = j;
    			for (let k = 0; k < c1; k += 1) {
    				value += mat1[x] * mat2[y];
    				x += 1;
    				y += c2;
    			}
    			target[i * c2 + j] = value;
    		}
    	}
    	return target;
    }

    //Size
    function size(mat) {
    	return [mat.nrows, mat.ncols];
    }

    //Addition
    function add$2(mat1, mat2, target = new Float64Array(mat1.nrows * mat1.ncols)) {
    	const result = add(mat1, mat2, target);
    	result.nrows = mat1.nrows;
    	result.ncols = mat1.ncols;
    	return result;
    }

    //Subtraction
    function sub$2(mat1, mat2, target = new Float64Array(mat1.nrows * mat1.ncols)) {
    	const result = sub(mat1, mat2, target);
    	result.nrows = mat1.nrows;
    	result.ncols = mat1.ncols;
    	return result;
    }

    //Determinant
    function det2x2(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
    }

    function det3x3(mat) {
    	const {a11, a12, a13, a21, a22, a23, a31, a32, a33} = mat;
    	return a11 * (a33 * a22 - a23 * a32)
    		 + a12 * (a31 * a23 - a21 * a33)
    		 + a13 * (a32 * a21 - a22 * a31);
    }

    //Inverse
    function inverse2x2(mat, target = new Float64Array(4)) {
    	const a00 = mat[0];
    	const a01 = mat[1];
    	const a10 = mat[2];
    	const a11 = mat[3];
    	const detM = a00 * a11 - a01 * a10;
    	if (detM === 0) {return undefined;}
    	const coefficient = 1 / detM;
    	target[0] = a11 * coefficient;
    	target[3] = a00 * coefficient;
    	target[1] = -a01 * coefficient;
    	target[2] = -a10 * coefficient;
    	target.nrows = 2;
    	target.ncols = 2;
    	return target;
    }

    //Matrix-vector multiplication
    function vmult(vec, mat) { //Premultiply by vector (assumed row-vector)
    	const ncols = mat.ncols;
    	const dimension = vec.length;
    	if (dimension !== mat.nrows) {return undefined;}
    	const target = new Float64Array(ncols);
    	let matIndex = 0;
    	for (let i = 0; i < dimension; i++) {
    		vi = vec[i];
    		for (let j = 0; j < ncols; j++) {
    			target[j] += vi * mat[matIndex++];
    		}
    	}
    	return target; //Result is a vector, not a matrix
    }

    function vmult2x2(vec, mat) {
    	const target = new Float64Array(2);
    	const v0 = vec[0];
    	const v1 = vec[1];
    	target[0] = v0 * mat[0] + v1 * mat[2];
    	target[0] = v0 * mat[1] + v1 * mat[3];
    	return target;
    }

    function multv(mat, vec) {
    	const ncols = mat.ncols;
    	const len = mat.length;
    	if (vec.length !== ncols) {return undefined;}
    	const target = new Float64Array(ncols);
    	for (let j = 0; j < ncols; j++) {
    		vj = vec[j];
    		let k = 0;
    		for (let index = j; index < len; index += ncols) {
    			target[k++] += vj * mat[index];
    		}
    	}
    	return target;
    }

    function areEqual$1(mat1, mat2) {
    	return (mat1.nrows === mat2.nrows) && (mat1.ncols === mat2.ncols) && areEqual(mat1, mat2);
    }

    // Freeze exports
    Object.freeze(zeros);
    Object.freeze(constant);
    Object.freeze(identity);
    Object.freeze(flatten);
    Object.freeze(scale$2);
    Object.freeze(transpose2x2);
    Object.freeze(transpose3x3);
    Object.freeze(transpose4x4);
    Object.freeze(mult);
    Object.freeze(add$2);
    Object.freeze(sub$2);
    Object.freeze(size);
    Object.freeze(det2x2);
    Object.freeze(det3x3);
    Object.freeze(inverse2x2);
    Object.freeze(vmult);
    Object.freeze(vmult2x2);
    Object.freeze(multv);
    Object.freeze(areEqual$1);

    function zeros$1(m, n) {
        setContext$1("zeros(m, n)", arguments);
        positiveInteger("m");
        positiveInteger("n");
        clearContext();
        return zeros(m, n);
    }

    function constant$1(m, n, value) {
    	setContext$1("constant(m, n, value)", arguments);
        positiveInteger("m");
        positiveInteger("n");
        realNumber("value");
        clearContext();
        return constant(m, n, value);
    }

    function identity$1(m) {
    	setContext$1("identity(m)", arguments);
        positiveInteger("m");
        clearContext();
        return identity(m);
    }

    //TODO: debug for 'flatten

    //Scaling
    function scale$3(mat, k, target$1) {
    	setContext$1("scale(mat, k, target)", arguments);
        flatMatrix("mat");
        realNumber("k");
        target('target', mat.length);
        clearContext();
        return scale$2(mat, k, target$1);
    }

    //Transpose
    function transpose2x2$1(mat, target$1) {
        setContext$1("transpose2x2(mat, target)", arguments);
    	flatMatrix("mat", 2, 2);
        target('target', mat.length);
        clearContext();
        return transpose2x2(mat, target$1);
    }

    function transpose3x3$1(mat, target$1) {
    	setContext$1("transpose3x3(mat, target)", arguments);
    	flatMatrix("mat", 3, 3);
        target('target', mat.length);
        clearContext();
        return transpose3x3(mat, target$1);
    }

    function transpose4x4$1(mat, target$1) {
    	setContext$1("transpose4x4(mat, target)", arguments);
    	flatMatrix("mat", [4, 4] );
        target('target', mat.length);
        clearContext();
        return transpose4x4(mat, target$1);
    }

    //Matrix multiplication
    function mult$1(mat1, mat2) {
    	setContext$1("mult(mat1, mat2)", arguments);
    	flatMatrix("mat1");
    	flatMatrix("mat2", mat1.ncols);
        clearContext();
        return mult(mat1, mat2);
    }

    //Size
    function size$1(mat) {
    	setContext$1("size(mat)", arguments);
    	flatMatrix("mat");
        clearContext();
    	return size(mat);
    }

    //Determinant
    function det2x2$1(mat) {
    	setContext$1("det2x2(mat)", arguments);
    	flatMatrix("mat", 2, 2);
    	clearContext();
    	return det2x2(mat);
    }

    //Inverse
    function inverse2x2$1(mat, target$1) {
    	setContext$1("inverse2(mat, target)", arguments);
    	flatMatrix("mat", 2, 2);
    	target('target', 4);
        clearContext();
    	return inverse2x2(mat, target$1);
    }

    // Freeze exports
    Object.freeze(zeros$1);
    Object.freeze(constant$1);
    Object.freeze(identity$1);
    //Object.freeze(flatten);
    Object.freeze(scale$3);
    Object.freeze(transpose2x2$1);
    Object.freeze(transpose3x3$1);
    Object.freeze(transpose4x4$1);
    Object.freeze(mult$1);
    Object.freeze(size$1);
    Object.freeze(det2x2$1);
    Object.freeze(inverse2x2$1);
    //export {flatten}

    var matrix_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        zeros: zeros$1,
        constant: constant$1,
        identity: identity$1,
        scale: scale$3,
        transpose2x2: transpose2x2$1,
        transpose3x3: transpose3x3$1,
        transpose4x4: transpose4x4$1,
        mult: mult$1,
        size: size$1,
        det2x2: det2x2$1,
        inverse2x2: inverse2x2$1
    });

    var matrix_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: matrix_debug,
        zeros: zeros,
        constant: constant,
        identity: identity,
        flatten: flatten,
        scale: scale$2,
        transpose2x2: transpose2x2,
        transpose3x3: transpose3x3,
        transpose4x4: transpose4x4,
        mult: mult,
        size: size,
        det2x2: det2x2,
        inverse2x2: inverse2x2,
        vmult: vmult,
        vmult2x2: vmult2x2,
        multv: multv,
        areEqual: areEqual$1
    });

    function real(z) {
    	return z[0];
    }

    function imag(z) {
    	return z[1];
    }

    function arg(z) {
    	return atan2(z[1], z[0]);
    }

    function abs$1(z) {
    	return hypot(z[0], z[1]);
    }

    function conj(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function negate(z, target = new Float64Array(2)) {
    	target[0] = -z[0];
    	target[1] = -z[1];
    	return target;
    }

    function add$3(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$3(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] - z2[0];
    	target[1] = z1[1] - z2[1];
    	return target;
    }

    function mult$2(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	target[0] = re1 * re2 - im1 * im2;
    	target[1] = re1 * im2 + re2 * im1;
    	return target;
    }

    function scale$4(z, k, target = new Float64Array(2)) {
    	target[0] = z[0] * k;
    	target[1] = z[1] * k;
    	return target;
    }

    function div(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	const mag2Squared = re2 * re2 + im2 * im2;
    	if (mag2Squared === 0) {return undefined;}
    	const scaleFactor = 1 / mag2Squared;
    	target[0] = (re1 * re2 + im1 * im2) * scaleFactor;
    	target[1] = (- re1 * im2 - re2 * im1) * scaleFactor;
    	return target;
    }

    function inverse(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const magSquared = re * re + im * im;
    	if (magSquared === 0) {return undefined;}
    	const scaleFactor = 1 / magSquared;
    	target[0] = re * scaleFactor;
    	target[1] = -im * scaleFactor;
    	return target;
    }

    function toPolar(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const r = hypot(re, im);
    	target[0] = r;
    	target[1] = atan2(im, re);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj);
    Object.freeze(real);
    Object.freeze(imag);
    Object.freeze(arg);
    Object.freeze(abs$1);
    Object.freeze(add$3);
    Object.freeze(sub$3);
    Object.freeze(mult$2);
    Object.freeze(scale$4);
    Object.freeze(div);
    Object.freeze(inverse);
    Object.freeze(toPolar);
    Object.freeze(negate);

    function conj$1(z, target$1) {
        setContext("conj(z, ?target)", arguments);
    	rectComplex("z");
        target('target', 2);
        clearContext();
        return conj(z, target$1);
    }

    function real$1(z) {
    	setContext("real(z)", arguments);
    	rectComplex("z");
        clearContext();
        return real(z);
    }

    function imag$1(z) {
    	setContext("imag(z)", arguments);
    	rectComplex("z");
        clearContext();
        return imag(z);
    }

    function arg$1(z) {
    	setContext("arg(z)", arguments);
    	rectComplex("z");
        clearContext();
        return arg(z);
    }

    function abs$2(z) {
    	setContext("abs(z)", arguments);
    	rectComplex("z");
        clearContext();
        return abs$1(z);
    }

    function add$4(z1, z2, target$1) {
    	setContext("add(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        clearContext();
        return add$3(z1, z2, target$1);
    }

    function sub$4(z1, z2, target$1) {
    	setContext("sub(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        clearContext();
        return sub$3(z1, z2, target$1);
    }

    function mult$3(z1, z2, target$1) {
    	setContext("mult(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        clearContext();
        return mult$2(z1, z2, target$1);
    }

    function scale$5(z, k, target$1) {
    	setContext("scale(z, k, ?target)", arguments);
    	rectComplex("z");
        realNumber("k");
        target('target', 2);
        clearContext();
        return scale$4(z, k, target$1);
    }

    function div$1(z1, z2, target$1) {
    	setContext("div(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        const result = div(z1, z2, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    function inverse$1(z, target$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex("z");
        target('target', 2);
        const result = inverse(z, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    function toPolar$1(z, target$1) {
    	setContext("toPolar(z, ?target)", arguments);
    	rectComplex("z");
        target('target', 2);
        const result = toPolar(z, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    // Freeze exports
    Object.freeze(conj$1);
    Object.freeze(real$1);
    Object.freeze(imag$1);
    Object.freeze(arg$1);
    Object.freeze(abs$2);
    Object.freeze(add$4);
    Object.freeze(sub$4);
    Object.freeze(mult$3);
    Object.freeze(scale$5);
    Object.freeze(div$1);
    Object.freeze(inverse$1);
    Object.freeze(toPolar$1);

    var rect_debug$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        conj: conj$1,
        real: real$1,
        imag: imag$1,
        arg: arg$1,
        abs: abs$2,
        add: add$4,
        sub: sub$4,
        mult: mult$3,
        scale: scale$5,
        div: div$1,
        inverse: inverse$1,
        toPolar: toPolar$1
    });

    var rect_lib$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: rect_debug$1,
        conj: conj,
        real: real,
        imag: imag,
        arg: arg,
        abs: abs$1,
        add: add$3,
        sub: sub$3,
        mult: mult$2,
        scale: scale$4,
        div: div,
        inverse: inverse,
        toPolar: toPolar,
        negate: negate
    });

    function toArg(angle) { //Not to be exported
    	angle = angle%TWO_PI;
    	if (angle > PI) {return angle - TWO_PI;}
    	if (angle < -PI) {return angle + TWO_PI;}
    	return angle;
    }

    function conj$2(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function real$2(z) {
    	return z[0] * cos(z[1]);
    }

    function imag$2(z) {
    	return z[0] * sin(z[1]);
    }

    function arg$2(z) {
    	return toArg(z[1]);
    }

    function abs$3(z) {
    	return abs(z[0]);
    }

    function scale$6(z, k, target = new Float64Array(2)) {
    	const r = z[0] * k;
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = toArg(theta);
    	}
    	return target;
    }

    function mult$4(z1, z2, target = new Float64Array(2)) {
    	const r = z1[0] * z2[0];
    	const theta = z1[1] + z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = toArg(theta);
    	}
    	return target;
    }

    function div$2(z1, z2, target = new Float64Array(2)) {
    	const r2 = z2[0];
    	if (r2 === 0) {return undefined;}
    	const r = z1[0] / r2;
    	const theta = z1[1] - z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = toArg(theta);
    	}
    	return target;
    }

    function pow$1(z, n, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = pow(-r, n);
    		target[1] = toArg(n * (theta + PI));
    	} else {
    		target[0] = pow(r, n);
    		target[1] = toArg(n * theta);
    	}
    	return target;
    }

    function inverse$2(z, target = new Float64Array(2)) {
    	const r = z[0];
    	if (r === 0) {return undefined;}
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -1/r;
    		target[1] = toArg(-theta - PI);
    	} else {
    		target[0] = 1/r;
    		target[1] = toArg(-theta);
    	}
    	return target;
    }

    function toRect(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	target[0] = r * cos(theta);
    	target[1] = r * sin(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$2);
    Object.freeze(real$2);
    Object.freeze(imag$2);
    Object.freeze(arg$2);
    Object.freeze(abs$3);
    Object.freeze(scale$6);
    Object.freeze(mult$4);
    Object.freeze(div$2);
    Object.freeze(pow$1);
    Object.freeze(inverse$2);
    Object.freeze(toRect);

    function conj$3(z, target$1) {
        setContext$1("conj(z, ?target)", arguments);
        target('target', 2);
        polarComplex("z");
        clearContext();
        return conj$2(z, target$1);
    }

    function real$3(z) {
        setContext$1("real(z)", arguments);
        polarComplex("z");
        clearContext();
    	return real$2(z);
    }

    function imag$3(z) {
        setContext$1("imag(z)", arguments);
        polarComplex("z");
        clearContext();
    	return imag$2(z);
    }

    function arg$3(z) {
        setContext$1("arg(z)", arguments);
        polarComplex("z");
        clearContext();
    	return arg$2(z);
    }

    function abs$4(z) {
        setContext$1("abs(z)", arguments);
        polarComplex("z");
        clearContext();
    	return abs$3(z);
    }

    function scale$7(z, k, target$1) {
        setContext$1("scale(z, k, ?target)", arguments);
    	polarComplex("z");
        realNumber("k");
        target('target', 2);
        clearContext();
        return scale$6(z, k, target$1);
    }

    function mult$5(z1, z2, target$1) {
    	setContext$1("mult(z1, z2, ?target)", arguments);
    	polarComplex("z1");
        polarComplex("z2");
        target('target', 2);
        return mult$4(z1, z2, target$1);
    }

    function div$3(z1, z2, target$1) {
    	setContext$1("div(z1, z2, ?target)", arguments);
    	polarComplex("z1");
        polarComplex("z2");
        target('target', 2);
        const result = div$2(z1, z2, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    function pow$2(z, n, target$1) {
    	setContext$1("pow(z, n, ?target)", arguments);
        polarComplex("z");
        realNumber("n");
        target('target', 2);
        clearContext();
        return pow$1(z, n, target$1);
    }

    function inverse$3(z, target$1) {
    	setContext$1("inverse(z, ?target)", arguments);
        polarComplex("z");
        target('target', 2);
        clearContext();
        return inverse$2(z, target$1);
    }

    function toRect$1(z, target$1) {
    	setContext$1("toRect(z, ?target)", arguments);
        polarComplex("z");
        target('target', 2);
        clearContext();
        return toRect(z, target$1);
    }

    // Freeze exports
    Object.freeze(conj$3);
    Object.freeze(real$3);
    Object.freeze(imag$3);
    Object.freeze(arg$3);
    Object.freeze(abs$4);
    Object.freeze(scale$7);
    Object.freeze(mult$5);
    Object.freeze(div$3);
    Object.freeze(pow$2);
    Object.freeze(inverse$3);
    Object.freeze(toRect$1);

    var polar_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        conj: conj$3,
        real: real$3,
        imag: imag$3,
        arg: arg$3,
        abs: abs$4,
        scale: scale$7,
        mult: mult$5,
        div: div$3,
        pow: pow$2,
        inverse: inverse$3,
        toRect: toRect$1
    });

    var polar_lib$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: polar_debug,
        conj: conj$2,
        real: real$2,
        imag: imag$2,
        arg: arg$2,
        abs: abs$3,
        scale: scale$6,
        mult: mult$4,
        div: div$2,
        pow: pow$1,
        inverse: inverse$2,
        toRect: toRect
    });

    var complex_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        rect: rect_lib$1,
        polar: polar_lib$1,
        debug: rect_debug$1,
        conj: conj,
        real: real,
        imag: imag,
        arg: arg,
        abs: abs$1,
        add: add$3,
        sub: sub$3,
        mult: mult$2,
        scale: scale$4,
        div: div,
        inverse: inverse,
        toPolar: toPolar,
        negate: negate
    });

    function sum$1(arr) {
    	setContext$1("sum(arr)", arguments);
    	realArray("arr");
    	const result = sum(arr);
    	realOverflow(result);
    	clearContext();
    	return result;
    }

    function min$2(arr, sorted$1) {
    	setContext$1("min(arr, ?sorted)", arguments);
    	realArray("arr");
    	bool$1("sorted");
    	sorted("arr", "sorted");
    	clearContext();
    	return min$1(arr, sorted$1);
    }

    function max$2(arr, sorted$1) {
    	setContext$1("max(arr, ?sorted)", arguments);
    	realArray("arr");
    	bool$1("sorted");
    	sorted("arr", "sorted");
    	clearContext();
    	return max$1(arr, sorted$1);
    }

    function prod$1(arr) {
    	setContext$1("prod(arr)", arguments);
    	realArray('arr');
    	clearContext();
    	return prod(arr);
    }

    function unique$1(arr, sorted$1) {
    	setContext$1("unique(arr, ?sorted)", arguments);
    	realArray('arr');
    	bool$1('sorted');
    	sorted('arr', 'sorted');
    	clearContext();
    	return unique(arr, sorted$1);
    }

    function indexOf$1(arr, value, sorted$1) {
    	setContext$1("indexOf(arr, value, ?sorted)", arguments);
    	realArray('arr');
    	realNumber('value');
    	bool$1('sorted');
    	sorted('arr', 'sorted');
    	clearContext();
    	return indexOf(arr, value, sorted$1);
    }

    function union$1(arr1, arr2, sorted$1) {
    	setContext$1("union(arr1, arr2, ?sorted)", arguments);
    	realArray('arr1');
    	realArray('arr2');
    	bool$1('sorted');
    	sorted('arr1', 'sorted');
    	sorted('arr2', 'sorted'); // May have ensure sorted same way as arr1
    	clearContext();
    	return union(arr1, arr2, sorted$1);
    }

    function areEqual$2(arr1, arr2) {
    	setContext$1("isEqual(arr1, arr2)", arguments);
    	realArray('arr1');
    	realArray('arr2');
    	clearContext();
    	return areEqual(arr1, arr2);
    }

    function sortUint8$1(arr, target$1) {
    	setContext$1('sortUint8(arr, ?target)', arguments);
    	if (arr.constructor !== Uint8Array) {
    		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
    	}
    	target('target', arr.length);
    	clearContext();
    	return sortUint8(arr, target$1);
    }

    function count$1(arr, value, sorted$1) {
    	setContext$1("count(arr, value, ?sorted)", arguments);
    	realArray('arr');
    	realNumber('value');
    	bool$1('sorted');
    	sorted('arr', 'sorted');
    	clearContext();
    	return count(arr, value, sorted$1);
    }

    // Freeze exports
    Object.freeze(sum$1);
    Object.freeze(min$2);
    Object.freeze(max$2);
    Object.freeze(prod$1);
    Object.freeze(unique$1);
    Object.freeze(indexOf$1);
    Object.freeze(union$1);
    Object.freeze(areEqual$2);
    Object.freeze(sortUint8$1);
    Object.freeze(count$1);

    var array_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sum: sum$1,
        min: min$2,
        max: max$2,
        prod: prod$1,
        unique: unique$1,
        indexOf: indexOf$1,
        areEqual: areEqual$2
    });

    var array_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: array_debug,
        sum: sum,
        min: min$1,
        max: max$1,
        prod: prod,
        unique: unique,
        indexOf: indexOf,
        union: union,
        areEqual: areEqual,
        sortUint8: sortUint8,
        imin: imin,
        imax: imax,
        count: count
    });

    var statistics_debug = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    //Constants
    // Ratio-of-uniforms
    const RU_SCALE_CONSTANT = sqrt(2 / E);
    // Park-Miller
    const MCG_A = 48271;
    const MCG_M = 2147483647;
    const MCG_M_PLUS_1 = MCG_M + 1;
    const MAX_MCG_SKIP = 700; //Yet to be optimised

    //Unseeded random number generation
    // Continuous uniform distribution
    function unif(a = 0, b = 1, count = undefined) { //a>b or b>a
    	if (count === undefined) { //Return single value
    		return a + (b - a) * random();
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = a + (b - a) * random();
    		}
    		return result;
    	}
    }

    // Uniform integer distribution
    function int(a, b, count = undefined) { //assumes b > a
    	const A = ceil(a);
    	const B = floor(b) + 1;
    	const r = B - A;
    	if (count === undefined) { //Return single value
    		return floor(A + random() * r);
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = floor(A + r * random());
    		}
    		return result;
    	}
    }

    // Normal distribution
    function norm(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
    	if (count === undefined) { //Return single value
    		while (true) {
    			const u1 = random();
    			const v2 = random();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp(-0.5 * x * x)) {
    				return mean + x * sd;
    			}
    		}
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		let i = 0;
    		while (i < count) {
    			const u1 = random();
    			const v2 = random();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp(-0.5 * x * x)) {
    				result[i++] = mean + x * sd;
    			}
    		}
    		return result;
    	}
    }

    // Exponential distribution
    function exp$1(lambda = 1, count = undefined) {
    	if (count === undefined) { //Return single value
    		return -ln(random()) / lambda;
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = -ln(random()) / lambda;
    		}
    		return result;
    	}
    }

    //Seeded random number generators

    // (Uniform) Multiplicative congruential generator
    function MCG(a = 0, b = 1, seed = int(1, 4294967295)) {
    	let scaleFactor, state, i; //Declare variables
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = floor(abs(s)); //TODO: use hash instead of just floor(abs())
    			state = seed;
    			i = 0;
    		}
    		return seed; //Return current seed (whether updated or not)
    	};
    	const _range = function(r = a, s = b) {
    		//Set new range
    		a = r;
    		b = s;
    		scaleFactor = (b - a) / MCG_M_PLUS_1;
    		return [a, b];
    	};
    	//Initialise variables
    	_seed(seed);
    	_range(a, b);

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			state = (state * MCG_A) % MCG_M;
    			return a + state * scaleFactor;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				state = (state * MCG_A) % MCG_M;
    				result[i] = a + state * scaleFactor;
    			}
    			return result;
    		}
    	};

    	//Function
    	const goto = function(index) {
    		//Starting state
    		index = mod(index, MCG_M + 1);
    		if (index < i) {
    			i = 0;
    			state = seed;
    		}
    		//Skip to desired index
    		let skip = index - i;
    		if (skip < MAX_MCG_SKIP) { //Faster to iterate (small skip)
    			for (let j = 0; j < skip; j++) {
    				state = mod(state * MCG_A, MCG_M);
    			}
    		} else { //Faster to use fast modular exponentiation (large skip)
    			let aiMod = 1;
    			while (skip > 0) {
    				if (skip%2 === 1) {
    					aiMod = (aiMod*MCG_A) % MCG_M;
    				} //Otherwise, result remains constant
    				skip = skip >> 1;
    				aiMod = (aiMod**2) % MCG_M;
    			}
    			state = (aiMod * state) % MCG_M;
    		}
    		//Update index
    		i = index;
    		//Return state mapped to (0,1)
    		return state / (MCG_M + 1);
    	};

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	generator.goto = Object.freeze(goto); //Experimental
    	return Object.freeze(generator);
    }


    //Xorshift
    function Xorshift32(a = 0, b = 1, seed = int(1, 4294967295)) {
    	const state = new Uint32Array(1);
    	let scaleFactor;
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = trunc(s) || 1; //TODO: use hash, not just trunc(s)
    			state[0] = seed;
    		}
    		return seed; //Return current seed (whether updated or not)
    	};
    	const _range = function(r = a, s = b) {
    		//Set new range
    		a = r;
    		b = s;
    		scaleFactor = (b - a) / 4294967296;
    		return [a, b];
    	};

    	_seed(seed);
    	_range(a, b);

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			state[0] ^= state[0] << 13;
    			state[0] ^= state[0] << 17;
    			state[0] ^= state[0] << 5;
    			return state[0] * scaleFactor;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				state[0] ^= state[0] << 13;
    				state[0] ^= state[0] << 17;
    				state[0] ^= state[0] << 5;
    				result[i] = state[0] * scaleFactor;
    			}
    			return result;
    		}
    	};

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	return Object.freeze(generator);
    }

    function RU(mean = 0, sd = 1, seed = int(1, 4294967295)) { //Ratio of uniforms
    	const urand = Xorshift32(0, 1, seed); //TODO: hash seed
    	
    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			while (true) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp(-0.5 * x * x)) {
    					return mean + x * sd;
    				}
    			}
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			let i = 0;
    			while (i < count) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp(-0.5 * x * x)) {
    					result[i++] = mean + x * sd;
    				}
    			}
    			return result;
    		}
    	};

    	const _mean = function(u = mean) {
    		mean = u;
    		return mean;
    	};

    	const _sd = function(s = sd) {
    		sd = s;
    		return sd;
    	};

    	generator.seed = urand.seed; //TODO: hash seed
    	generator.mean = Object.freeze(_mean);
    	generator.sd = Object.freeze(_sd);

    	return Object.freeze(generator);
    }

    const Unif = Xorshift32;
    const Norm = RU;

    const Int = function(a, b, seed = int(1, 4294967295)) {
    	const urand = Xorshift32(ceil(a), floor(b) + 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return floor(urand());
    		} else { //Return array of values
    			const result = urand(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = floor(result[i]);
    			}
    			return result;
    		}
    	};

    	const _range = function(r = a, s = b) {
    		a = r;
    		b = s;
    		urand.range(ceil(a), floor(b) + 1);
    		return [a, b];
    	};

    	generator.seed = urand.seed; //TODO: hash seed
    	generator.range = Object.freeze(_range);

    	return Object.freeze(generator);
    };

    // Exponential
    function Exp(lambda = 1, seed = int(1, 4294967295)) {
    	const urand = Xorshift32(0, 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return -ln(urand()) / lambda;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = -ln(urand()) / lambda;
    			}
    			return result;
    		}
    	};

    	const _lambda = function(l = lambda) {
    		lambda = l;
    		return lambda;
    	};

    	generator.seed = urand.seed;
    	generator.lambda = Object.freeze(_lambda);

    	return Object.freeze(generator);
    }

    // Freeze exports
    Object.freeze(unif);
    Object.freeze(int);
    Object.freeze(norm);
    Object.freeze(exp$1);

    Object.freeze(MCG);
    Object.freeze(Xorshift32);
    Object.freeze(RU);

    Object.freeze(Unif);
    Object.freeze(Int);
    Object.freeze(Norm);
    Object.freeze(Exp);

    function sum$2(arr, freq = undefined) {
    	const count = arr.length;
    	let sum = 0;
    	if (freq === undefined) {
    		for (let i = 0; i < count; i++) {
    			sum += arr[i];
    		}
    	} else {
    		for (let i = 0; i < count; i++) {
    			sum += arr[i] * freq[i];
    		}
    	}
    	return sum;
    }

    function mean(arr, freq = undefined) { //In future must add option to prevent overflow by breaking array down
    	const count = arr.length;
    	if (freq === undefined) {
    		return sum$2(arr)/count;
    	} else {
    		let sum = 0;
    		let size = 0;
    		let f = 0;
    		for (let i = 0; i < count; i++) {
    			f = freq[i];
    			sum += arr[i] * f;
    			size += f;
    		}
    		return sum/size;
    	}
    }

    function variance(arr, freq = undefined, sample = true) { //Can be made much more efficient in future
    	const len = arr.length;
    	let result = 0;
    	const mu = mean(arr, freq);
    	let n = len;
    	if (freq === undefined) { //No frequency data
    		for (let i = 0; i < len; i++) {
    			const deviation = arr[i] - mu;
    			result += deviation * deviation;
    		}
    	} else { //Use frequency data
    		n = 0;
    		for (let i = 0; i < len; i++) {
    			const f = freq[i];
    			n += f;
    			const deviation = arr[i] - u;
    			result += f * deviation * deviation;
    		}
    	}
    	if (sample && (n > 1)) {n -= 1;}
    	return result / n;
    }

    function sdev(arr, freq = undefined, sample = true) {
    	return sqrt(variance(arr, freq, sample));
    }

    function cov(xarr, yarr, sample = true) {
    	meanX = mean(xarr);
    	meanY = mean(yarr);
    	const n = xarr.length;
    	let result = 0;
    	for (let i = 0; i < n; i++) {
    		result += (xarr[i] - meanX) * (yarr[i] - meanY);
    	}
    	if (sample && (n > 1)) {n -= 1;}
    	return result / n;
    }

    function cor(xarr, yarr, sample = true) { //Could be significantly optimised
    	if (xarr.length === 0) {return undefined;}
    	const covariance = cov(xarr, yarr, sample);
    	return covariance / (sdev(xarr) * sdev(yarr));
    }

    function modes(arr, freq = undefined, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (freq === undefined) {
    		[arr, freq] = toFreq(arr, sorted);
    	}
    	modes = {};
    	maxValue = arr[0] - 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value > maxValue) {
    			maxValue = value;
    			modes = {};
    			modes[value] = true;
    		} else if (value === maxValue) {
    			modes[value] = true;
    		}
    	}
    	return new Float64Array(modes.keys());
    }

    function toFreq(arr, sorted = false) { //TODO: make use of 'sorted' parameter
    	const len = arr.length;
    	freqeuencies = {}; //Warning: using Object.keys() might not give stable output order
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		const current = frequencies[value];
    		if (current === undefined) {
    			frequencies[value] = 1;
    		} else {
    			frequencies[value] = current + 1;
    		}
    	}
    	const valueArray = new Float64Array(frequencies.keys());
    	const valueCount = valueArray.length;
    	const freqArray = new Float64Array(valueCount);
    	for (let i = 0; i < valueCount; i++) {
    		freqArray[i] = frequencies[valueArray[i]];
    	}
    	return [valueArray, freqArray];
    }

    function freq(arr, value, sorted = false) {
    	return count(arr, value, sorted);
    }

    function unifPdf(x, a, b) {
    	if ((x < a)||(x > b)) {return 0;}
    	return 1 / (a - b);
    }

    function unifCdf(x, a, b) {
    	if (x < a){return 0;}
    	if (x > b){return 1;}
    	return (x - a) / (b - a);
    }

    function unifInvCdf(p, a, b) {
    	return a + p * (a - b);
    }

    function expPdf(x, lambda) {
    	return lambda * exp(-lambda * x);
    }
    function expCdf(x, lambda) {
    	return 1 - exp(-lambda * x);
    }
    function expInvCdf(p, lambda) {
    	return -ln(1 - p) / lambda;
    }

    Object.freeze(sum$2);
    Object.freeze(mean);
    Object.freeze(variance);
    Object.freeze(sdev);
    Object.freeze(cov);
    Object.freeze(cor);
    Object.freeze(modes);
    Object.freeze(freq);
    Object.freeze(toFreq);

    Object.freeze(unifPdf);
    Object.freeze(unifCdf);
    Object.freeze(unifInvCdf);
    Object.freeze(expPdf);
    Object.freeze(expCdf);
    Object.freeze(expInvCdf);

    var statistics_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: statistics_debug,
        sum: sum$2,
        mean: mean,
        variance: variance,
        sdev: sdev,
        cov: cov,
        cor: cor,
        get modes () { return modes; },
        freq: freq,
        toFreq: toFreq,
        unifPdf: unifPdf,
        unifCdf: unifCdf,
        unifInvCdf: unifInvCdf,
        expPdf: expPdf,
        expCdf: expCdf,
        expInvCdf: expInvCdf
    });

    function frac(num, tolerance = num * EPSILON * 10) { //Farey rational approximation algorithm
    	const wholePart = floor(num);
    	const fractionalPart = num - wholePart;
    	let leftNumerator = 0;
    	let leftDenominator = 1;
    	let rightNumerator = 1;
    	let rightDenominator = 1;
    	let numerator = leftNumerator;
    	let denominator = leftDenominator;
    	let currentValue = numerator / denominator;
    	while (abs(currentValue - fractionalPart) > tolerance) {
    		if (fractionalPart > currentValue) {
    			leftNumerator = numerator;
    			leftDenominator = denominator;
    			numerator += rightNumerator;
    			denominator += rightDenominator;
    		} else {
    			rightNumerator = numerator;
    			rightDenominator = denominator;
    			numerator += leftNumerator;
    			denominator += leftDenominator;
    		}
    		currentValue = numerator / denominator;
    	}
    	const result = new Int32Array(2);
    	result[0] = numerator + denominator * wholePart;
    	result[1] = denominator;
    	return result;
    }

    const epsilon = Math.cbrt(EPSILON);
    function derivative(f, x) {
    	const x0 = x * (1 + epsilon);
    	const x1 = x * (1 - epsilon);
    	const dx = x1 - x0;
    	return (f(x1) - f(x0)) / dx;
    }

    //Freeze exports
    Object.freeze(frac);
    Object.freeze(derivative);

    var numerical_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        frac: frac,
        derivative: derivative
    });

    //Uniform mapping
    function Float1to1(seed = int(1, MAX_SAFE_INTEGER)) { //Scalar -> scalar
    	//Seed checking
    	seed = mod$1(seed * 10.23, 4096000);
    	//Function
    	const rng = function(x) {
    		x = fract(x * 0.1031);
    		x *= x + seed;
    		x *= x + x;
    		return fract(x);
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    function Float2to1(seed = int(1, MAX_SAFE_INTEGER)) { //2D vector -> scalar
    	//Seed checking
    	seed = mod$1(seed * 10.23, MAX_SAFE_INTEGER);
    	//Function
    	const rng = function(vec) {
    		const pX = fract(vec[0] * 0.1031);
    		const pY = fract(vec[1] * 0.1031);
    		const offset = dot3([pX, pY, pX], [pY + seed, pX + seed, pX + seed]);
    		return fract((pX + pY + 2 * offset) * (pX + offset));
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    // Freeze exports
    Object.freeze(Float1to1);
    Object.freeze(Float2to1);

    //1D Perlin noise
    function fade(t) {
    	return t * t * t * ((t * (6 * t - 15)) + 10);
    }

    function dfdt(t) {
    	return t * t * (30 + t * (30 * t + 60));
    }

    function Perlin1D(range = [0, 1], seed = int(1, Number.MAX_SAFE_INTEGER)) {
    	const grad = Float1to1(seed);
    	//Natural amplitude of 1D Perlin noise is 0.5
    	const rmin = range[0];
    	const avg = 0.5 * (rmin + range[1]);
    	const amp = avg - rmin;
    	const scaleFactor = 2 * amp;

    	//Function
    	const perlin = function(x) { //Just value
    		const x0 = floor(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return avg + lerp(c0, c1, fade(u)) * scaleFactor;
    	};
    	//Make seed public
    	perlin.seed = seed;
    	//Derivative
    	const deriv = function(x) { //Just derivative
    		const x0 = floor(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return (c1 - c0) * dfdt(u) * scaleFactor;
    	};
    	perlin.deriv = Object.freeze(deriv);
    	//Gridded data
    	const grid = function(xmin, count, step) {
    		const minCell = floor(xmin);
    		const maxCell = floor(xmin + count * step);
    		const cellCount = maxCell - minCell;
    		const result = new Float64Array(count);
    		const xmax = xmin + count * step;
    		const floatError = step * 0.0001;
    		let locX = xmin - minCell;
    		let index = 0;
    		let g0 = 0;
    		let d0 = 0;
    		let g1 = grad(minCell);
    		let d1 = step * g1;
    		for (let i = 0; i < cellCount; i++) {
    			g0 = g1;
    			d0 = d1;
    			g1 = grad(i+1);
    			d1 = g1 * step;
    			c0 = locX * g0;
    			c1 = (locX - 1) * g1;

    			const maxLocX = (i === cellCount-1) ? xmax - maxCellX + floatError : 1 + floatError;
    			while (locX < maxLocX) {
    				result[index++] = lerp(c0, c1, fade(locX));
    				c0 += d0;
    				c1 += d1;
    			}
    			locX -= 1;
    		}
    		return result;
    	};

    	//Add grid to perlin object
    	perlin.grid = Object.freeze(grid);
    	//Return frozen object
    	return Object.freeze(perlin);
    }

    // Freeze exports
    Object.freeze(Perlin1D);

    function smootherstep(t) {
        return t * t * t * ((t * (6 * t - 15)) + 10);
    }

    const p2lerp = function(c00, c01, c10, c11, locX, locY) {
        const wgtX = smootherstep(locX); //Weighted x
        const wgtY = smootherstep(locY); //Weighted y
        const c0 = lerp(c00, c01, wgtY);
        const c1 = lerp(c10, c11, wgtY);
        return lerp(c0, c1, wgtX); //Return value
    };

    function Perlin2D(range = [0, 1], seed = int(1, 1000)) {
        const rand = Float2to1(seed);

        function grad2(x, y) {
            const theta = 2 * PI * rand([x, y]);
            return [cos(theta), sin(theta)];
        }

        const rmin = range[0];
        const rsize = (range[1] - rmin)/2;
        const ravg = rmin + rsize;
        const scaleFactor = rsize / (0.5 * sqrt(2));

        const perlin = function(x, y) {
            //Cell coordinates
            const x0 = floor(x);
            const y0 = floor(y);
            const x1 = x0 + 1;
            const y1 = y0 + 1;
            //Local coordinates
            const locX = x - x0;
            const locY = y - y0;
            //Gradient vectors
            const g00 = grad2(x0, y0);
            const g01 = grad2(x0, y1);
            const g10 = grad2(x1, y0);
            const g11 = grad2(x1, y1);
            //Vertex contributions
            const c00 = dot2(g00, [locX, locY]);
            const c01 = dot2(g01, [locX, locY - 1]);
            const c10 = dot2(g10, [locX - 1, locY]);
            const c11 = dot2(g11, [locX - 1, locY - 1]);

            const p = p2lerp(c00, c01, c10, c11, locX, locY);
            return ravg + p * scaleFactor;
        };

        const deriv = function(x, y) {
            //Cell coordinates
            const x0 = floor(x);
            const y0 = floor(y);
            const x1 = x0 + 1;
            const y1 = y0 + 1;
            //Local coordinates
            const locX = x - x0;
            const locY = y - y0;
            //Gradient vectors
            const g00 = grad2(x0, y0);
            const g01 = grad2(x0, y1);
            const g10 = grad2(x1, y0);
            const g11 = grad2(x1, y1);
            //Vertex contributions
            const c00 = dot2(g00, [locX, locY]);
            const c01 = dot2(g01, [locX, locY - 1]);
            const c10 = dot2(g10, [locX - 1, locY]);
            const c11 = dot2(g11, [locX - 1, locY - 1]);

            const wgtY = smootherstep(locY); //Weighted y
            const c0 = lerp(c00, c01, wgtY);
            const c1 = lerp(c10, c11, wgtY);
            const delWX = 30 * locX * locX * (locX * (locX - 2) + 1);
            const delWY = 30 * locY * locY * (locY * (locY - 2) + 1);
            const delC0 = add2(add2(g00, scale2(sub2(g10, g00), delWX)), [delWX * (c10 - c00), 0]);
            const delC1 = add2(add2(g01, scale2(sub2(g11, g01), delWX)), [delWX * (c11 - c01), 0]);
            let deriv = add2(add2(delC0, scale2(sub2(delC1, delC0), delWY)), [0, delWY * (c1 - c0)]);
            deriv = scale2(deriv, scaleFactor);
            return deriv;
        };

        const fbm = function(x, y, octaves = 5, lacunarity = 1.5, persistence = 0.7) {
            let output = 0;
            let amp = 1;
            let rng = 1;
            const offset = 0.3;
            while (octaves--) {
                output += amp * perlin(x, y);
                rng += amp;
                //Increment
                amp *= persistence;
                x = x * lacunarity + offset;
                y = y * lacunarity + offset;
            }
            output /= rng;
            return output;
        };

        const grid = function(xMin, yMin, xCount, yCount, xStep, yStep) {
            //yStep defaults to xStep
            yStep = (yStep == undefined) ? xStep : yStep;
            const xFloatError = xStep * 0.00001;
            const yFloatError = yStep * 0.00001;
            //Bounds
            const xMax = xMin + (xCount - 1) * xStep;
            const yMax = yMin + (yCount - 1) * yStep;
            const minCellX = floor(xMin);
            const minCellY = floor(yMin);
            const maxCellX = ceil(xMax) - 1;
            const maxCellY = ceil(yMax) - 1;
            const yCellCount = 1 + maxCellY - minCellY;
            const xCellCount = 1 + maxCellX - minCellX;
            //Output array
            let output = new Float32Array(xCount * yCount);
            //Variables without initial values
            let gradX, gradY; 
            let locX, locY, maxLocX, maxLocY;
            let cellX, cellY;
            let c00, c01, c10, c11;
            let g00, g01, g10, g11;
            let c00Seed, c01Seed, c10Seed, c11Seed;
            let tempCol;
            let i, j0, j1;
            let index;
            //Variables requiring initial values
            let indexSeed = 0;
            let locXSeed = xMin - minCellX;
            let locYSeed = yMin - minCellY;
            let leftCol = Array(yCellCount+1);
            let rightCol = Array(yCellCount+1);
            for (j0 = 0; j0 <= yCellCount; j0++) {
                [gradX, gradY] = grad2(minCellX, minCellY + j0); //Generate gradient
                rightCol[j0] = [gradX, gradY, gradX * xStep, gradY * yStep]; //Gradient and increment data
            }
            //Main loop
            cellX = minCellX;
            locX = locXSeed;
            for (i = 0; i < xCellCount; i++) {
                //Initialise variables
                indexSeed = round( (cellX + locX - xMin) / xStep);
                cellY = minCellY;
                locY = locYSeed;
                maxLocX = (i === xCellCount-1) ? xMax - maxCellX + xFloatError : 1 + xFloatError;
                //Switch gradient columns
                tempCol = leftCol;
                leftCol = rightCol;
                rightCol = tempCol;
                //Generate first new element of rightCol
                [gradX, gradY] = grad2(cellX, cellY);
                rightCol[0] = [gradX, gradY, gradX * xStep, gradY * yStep];
                
                for (j0 = 0; j0 < yCellCount; j0++) {
                    //Initialise locY & locY limit
                    j1 = j0 + 1;
                    locX = locXSeed;
                    maxLocY = (j1 === yCellCount) ? yMax - maxCellY + yFloatError : 1 + yFloatError;
                    //Initialise gradients
                    g00 = leftCol[j0];
                    g01 = leftCol[j1];
                    g10 = rightCol[j0];
                    [gradX, gradY] = grad2(cellX, cellY + j1);
                    g11 = [gradX, gradY, gradX * xStep, gradY * yStep];
                    rightCol[j1] = g11;
                    //Initialise contributions
                    c00Seed = dot2([locX, locY], g00); //Last two elements of g00 aren't included
                    c01Seed = dot2([locX, locY - 1], g01);
                    c10Seed = dot2([locX - 1, locY], g10);                c11Seed = dot2([locX - 1, locY - 1], g11);
                    while (locY <= maxLocY) {
                        //Initialise row
                        index = indexSeed;
                        locX = locXSeed;
                        c00 = c00Seed;
                        c01 = c01Seed;
                        c10 = c10Seed;
                        c11 = c11Seed;
                        while (locX <= maxLocX) {
                            output[index++] = ravg + scaleFactor * p2lerp(c00, c01, c10, c11, locX, locY);
                            //Increment
                            locX += xStep;
                            c00 += g00[2];
                            c01 += g01[2];
                            c10 += g10[2];
                            c11 += g11[2];
                        }
                        //Increment
                        locY += yStep;
                        indexSeed += xCount;
                        c00Seed += g00[3];
                        c01Seed += g01[3];
                        c10Seed += g10[3];
                        c11Seed += g11[3];
                    }
                    //Increment
                    cellY++;
                    locY--;
                }
                //Increment
                locXSeed = --locX;
                cellX++;
            }
            //Return output
            output.nrows = yCount;
            output.ncols = xCount;
            return output;
        };

        perlin.deriv = Object.freeze(deriv);
        perlin.grid = Object.freeze(grid);
        perlin.fbm = Object.freeze(fbm);
        perlin.seed = seed;
        perlin.dimension = 2;

        return perlin;
    }

    function unif$1(a, b, count) {
    	setContext$1("unif(?a, ?b, ?count)", arguments);
    	realNumber$1('a');
    	realNumber$1('b');
    	nonNegativeInteger('count');
    	clearContext();
    	return unif(a, b, count);
    }

    function int$1(a, b, count) {
    	setContext$1("int(a, b, ?count)", arguments);
    	realNumber$1('a');
    	realNumber$1('b');
    	nonNegativeInteger('count');
    	clearContext();
    	return int(a, b, count);
    }

    function norm$1(mean, sd, count) {
    	setContext$1("norm(?mean, ?sd, ?count)", arguments);
    	realNumber$1("mean");
    	realNumber$1("sd");
    	nonNegative$1("sd");
    	nonNegativeInteger('count');
    	clearContext();
    	return norm(mean, sd, count);
    }

    function exp$2(lambda, count) {
    	setContext$1("exp(?lambda, ?count)", arguments);
    	realNumber$1("lambda");
    	nonNegativeInteger('count');
    	clearContext();
    	return exp$1(lambda, count);
    }

    function MCG$1(a, b, seed) {
    	setContext$1("MCG(?a, ?b, ?seed)", arguments);
    	realNumber(a, "a", signature);
    	realNumber(b, "b", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return MCG(a, b, seed);
    }

    function Xorshift32$1(a = 0, b = 1, seed = int(1, 4294967295)) {
    	setContext$1("Xorshift32(?a, ?b, ?seed)", arguments);
    	realNumber(a, "a", signature);
    	realNumber(b, "b", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return Xorshift32(a, b, seed);
    }

    function RU$1(mean = 0, sd = 1, seed = int(1, 4294967295)) { //Ratio of uniforms
    	setContext$1("RU(?mean, ?sd, ?seed)", arguments);
    	realNumber(mean, "mean", signature);
    	realNumber(sd, "sd", signature);
    	//Current implementation technically permits sd < 0, but we disallow it here
    	nonNegative(sd, "sd", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return RU(mean, sd, seed);
    }

    const Unif$1 = Xorshift32$1; //TODO: will have incorrect signature
    const Norm$1 = RU$1; //TODO: will have incorrect signature

    const Int$1 = function(a, b, seed = int(1, 4294967295)) {
    	setContext$1("Int(a, b, ?seed)", arguments);
    	realNumber(a, "a", signature); //Don't have to be integers
    	realNumber(b, "b", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return Int(a, b, seed);
    };

    // Exponential
    function Exp$1(lambda = 1, seed = int$1(1, 4294967295)) {

    }

    // Freeze exports
    Object.freeze(unif$1);
    Object.freeze(int$1);
    Object.freeze(norm$1);
    Object.freeze(exp$2);

    Object.freeze(MCG$1);
    Object.freeze(Xorshift32$1);
    Object.freeze(RU$1);

    Object.freeze(Unif$1);
    Object.freeze(Int$1);
    Object.freeze(Norm$1);
    Object.freeze(Exp$1);

    //Following debug files not implemented
    //export * from "./perlin1d.debug.js";
    //export * from "./perlin2d.debug.js";
    //export * from "./map.debug.js";

    var random_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        unif: unif$1,
        int: int$1,
        norm: norm$1,
        exp: exp$2,
        MCG: MCG$1,
        Xorshift32: Xorshift32$1,
        RU: RU$1,
        Unif: Unif$1,
        Int: Int$1,
        Norm: Norm$1,
        Exp: Exp$1
    });

    var random_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: random_debug,
        unif: unif,
        int: int,
        norm: norm,
        exp: exp$1,
        MCG: MCG,
        Xorshift32: Xorshift32,
        RU: RU,
        Unif: Unif,
        Int: Int,
        Norm: Norm,
        Exp: Exp,
        Float1to1: Float1to1,
        Float2to1: Float2to1,
        Perlin1D: Perlin1D,
        Perlin2D: Perlin2D
    });

    const VERSION = "dev-1.0.0";

    exports.VERSION = VERSION;
    exports.array = array_lib;
    exports.complex = complex_lib;
    exports.integer = integer_lib;
    exports.matrix = matrix_lib;
    exports.numerical = numerical_lib;
    exports.random = random_lib;
    exports.standard = standard_lib;
    exports.statistics = statistics_lib;
    exports.vector = vector_lib;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
