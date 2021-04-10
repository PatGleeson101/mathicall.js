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

    function mod(x, m) {
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
    Object.freeze(mod);
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

    function mod$1(x, m) {
    	setContext("mod(x, m)", arguments);
    	realNumber("x");
    	realNumber("m");
    	clearContext();
    	return mod(x, m);
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
    Object.freeze(mod$1);
    Object.freeze(fract$1);
    Object.freeze(deg$1);
    Object.freeze(rad$1);
    Object.freeze(linmap$1);

    var extra_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        lerp: lerp$1,
        mod: mod$1,
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
        mod: mod,
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
    function scale$1(vec, k, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec[i] * k;
    	}
    	return target;
    }

    function scale2$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	return target;
    }

    function scale3$1(vec, k, target = new Float64Array(3)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	return target;
    }

    function scale4$1(vec, k, target = new Float64Array(4)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	target[3] = vec[3] * k;
    	return target;
    }

    function normalize(vec, target) { //'target' intentionally defaults to undefined
    	return scale$1(vec, 1 / mag(vec), target);
    }

    function normalize2(vec, target) {
    	return scale2$1(vec, 1 / mag2(vec), target);
    }

    function normalize3(vec, target) {
    	return scale3$1(vec, 1 / mag3(vec), target);
    }

    function normalize4(vec, target) {
    	return scale4$1(vec, 1 / mag4(vec), target);
    }

    //Angles & rotations
    function angle(vec1, vec2) {
    	return acos(dot(vec1, vec2) / (mag(vec1) * mag(vec2)));
    }

    function angle2(vec1, vec2) {
    	return acos(dot2(vec1, vec2) / (mag2(vec1) * mag2(vec2)));
    }

    function angle3(vec1, vec2) {
    	return acos(dot3(vec1, vec2) / (mag3(vec1) * mag3(vec2)));
    }

    function angle4(vec1, vec2) {
    	return acos(dot4(vec1, vec2) / (mag4(vec1) * mag4(vec2)));
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
    Object.freeze(scale$1);
    Object.freeze(scale2$1);
    Object.freeze(scale3$1);
    Object.freeze(scale4$1);
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
    function scale$2(vec, k, target$1) {
    	setContext$1("scale(vec, k, ?target)", arguments);
    	realArray("vec");
    	realNumber("k");
    	target('target', vec.length);
    	return scale$1(vec, k, target$1);
    }

    function scale2$2(vec, k, target$1) {
    	setContext$1("scale2(vec, k, ?target)", arguments);
    	realArray("vec", 2);
    	realNumber("k");
    	target('target', 2);
    	return scale2$1(vec, k, target$1);
    }

    function scale3$2(vec, k, target$1) {
    	setContext$1("scale3(vec, k, ?target)", arguments);
    	realArray("vec", 3);
    	realNumber("k");
    	target('target', 3);
    	return scale3$1(vec, k, target$1);
    }

    function scale4$2(vec, k, target$1) {
    	setContext$1("scale4(vec, k, ?target)", arguments);
    	realArray("vec", 4);
    	realNumber("k");
    	target('target', 4);
    	return scale4$1(vec, k, target$1);
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
    Object.freeze(scale$2);
    Object.freeze(scale2$2);
    Object.freeze(scale3$2);
    Object.freeze(scale4$2);
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
        scale: scale$2,
        scale2: scale2$2,
        scale3: scale3$2,
        scale4: scale4$2,
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
        scale: scale$1,
        scale2: scale2$1,
        scale3: scale3$1,
        scale4: scale4$1,
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

    function dot2$2(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos(vec1[1] - vec2[1]);
    }

    function mag$2(vec) {
    	return abs(vec[0]);
    }

    function scale2$3(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = mod(vec[1], TWO_PI);
    	return target;
    }

    function normalize2$2(vec, target = new Float64Array(2)) {
    	if (vec[0] === 0) {
    		return undefined;
    	}
    	target[0] = 1;
    	target[1] = mod(vec[1], TWO_PI);
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
    Object.freeze(dot2$2);
    Object.freeze(mag$2);
    Object.freeze(scale2$3);
    Object.freeze(normalize2$2);
    Object.freeze(toRect2);

    var polar_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dot2: dot2$2,
        mag: mag$2,
        scale2: scale2$3,
        normalize2: normalize2$2,
        toRect2: toRect2
    });

    var vector_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        rect: rect_lib,
        polar: polar_lib
    });

    // Current debug context
    let signature$1$1 = "Unknown";
    let args$1 = {};

    function setContext$1$1(s, argArray) {
        //Parse signature
        signature$1$1 = s;
        const parameters = signature$1$1
        .split("(")[1]
        .replace(")", "")
        .replace(" ", "")
        .replace("?", "")
        .split(",");
        //Parse arguments
        args$1 = {};
        for (let i = 0; i < parameters.length; i++) {
            args$1[params[i]] = argArray[i];
        }
    }

    function clearContext$1() {
        args$1 = {};
        signature$1$1 = "Unknown";
    }

    // Shorter console use
    function log$1() {
        console.log.apply(console, arguments);
    }

    function warn$1() {
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
    Object.freeze(log$1);
    Object.freeze(setContext$1$1);
    Object.freeze(clearContext$1);
    Object.freeze(warn$1);

    const TYPED_ARRAY_CONSTRUCTORS$1 = [
        Int8Array, Uint8Array, Uint8ClampedArray,
        Int16Array, Uint16Array, Int32Array, Uint32Array,
        Float32Array, Float64Array];

    function realNumber$2(parameter) {
        const value = args$1[parameter];
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1}: ${parameter} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1}: ${parameter} cannot be NaN or Infinity.`;
        }
    }

    function realArray$1(parameter, length) {
        const value = args$1[parameter];
        if (TYPED_ARRAY_CONSTRUCTORS$1.includes(value.constructor) || Array.isArray(value)) {
            const len = value.length;
            if (len !== length) {
                throw `${signature$1$1}: ${parameter} has incorrect length`;
            }
            if (len === 0) {
                warn$1(`${signature$1$1}: ${parameter} is empty.`);
            }
            for (let i = 0; i < len; i++) {
    			const x = value[i];
                if (value.constructor !== Number) { //Assert type Number
                    throw `${signature$1$1}: ${parameter} must an array of Numbers.`;
                }
                if (!isFinite(value)) { //Exclude Infinity and NaN
                    throw `${signature$1$1}: ${parameter} contains NaN or Infinity.`;
                }
            }
        }
        throw `${signature$1$1}: ${parameter} must be an Array or TypedArray.`;
    }

    function integer$1(parameter) {
        const value = args$1[parameter];
        if (!Number.isInteger(value)) {
            throw `${signature$1$1}: ${parameter} must be an integer of type Number.`;
        }
    }

    function positive$1(parameter) {
        const value = args$1[parameter];
        realNumber$2(parameter);
        if (value <= 0) {
            throw `${signature$1$1}: ${parameter} must be positive.`;
        }
    }

    function nonNegative$2(parameter) {
        const value = args$1[parameter];
        realNumber$2(parameter);
        if (value < 0) {
            throw `${signature$1$1}: ${parameter} must be non-negative.`;
        }
    }

    function rectVector$1(parameter) {
        realArray$1(parameter);
    }

    function polarVector$1(parameter) {
        const value = args$1[parameter];
        realArray$1(parameter);
        if (value[0] < 0) {
            console.warn(`${signature$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function bool$2(parameter) {
        const value = args$1[parameter];
        if ( (value !== true) && (value !== false) ) {
            throw `${signature$1$1}: ${parameter} must be a boolean value.`;
        }
    }

    function polarComplex$1(parameter) {
        const value = args$1[parameter];
        realArray$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
        if (value[0] < 0) {
            console.warn(`${signature$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function rectComplex$1(parameter) {
        const value = args$1[parameter];
        realArray$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
    }

    function positiveInteger$1(parameter) {
        integer$1(parameter);
        positive$1(parameter);
    }

    function flatMatrix$1(parameter, nrows, ncols) {
        realArray$1(parameter);
        const value = args$1[parameter];
        if ( (!Number.isInteger(value.nrows)) || (value.nrows < 1) ) {
            throw `${signature$1$1}: ${parameter}.nrows is invalid`;
        }
        if ((!Number.isInteger(value.ncols)) || (value.ncols < 1)) {
            throw `${signature$1$1}: ${parameter}.ncols is invalid`;
        }
        if (value.nrows * value.ncols !== value.length) {
            throw `${signature$1$1}: ${parameter}.length does not match ${parameter}.nrows * ${parameter}.ncols`;
        }
        if ( (value.nrows !== nrows) || (value.ncols !== ncols) ) {
            throw `${signature$1$1}: ${parameter} has incorrect dimensions`;
        }
    }

    //Freeze exports
    Object.freeze(realNumber$2);
    Object.freeze(realArray$1);
    Object.freeze(integer$1);
    Object.freeze(positive$1);
    Object.freeze(nonNegative$2);
    Object.freeze(rectVector$1);
    Object.freeze(polarVector$1);
    Object.freeze(bool$2);
    Object.freeze(polarComplex$1);
    Object.freeze(rectComplex$1);
    Object.freeze(flatMatrix$1);
    Object.freeze(positiveInteger$1);

    function realOverflow$1(value) { //Assumes 'value' is a number
        if (value >= MAX_VALUE$1) {
            warn$1(`${signature$1$1}: overflowed Number.MAX_VALUE`);
        }
    }

    function intOverflow$1(value) { //Assumes 'value' is a number
        if (value > MAX_SAFE_INTEGER$1) {
            warn$1(`${signature$1$1}: overflowed Number.MAX_SAFE_INTEGER`);
        }
    }

    function notDefined$1(value) {
        if (value === undefined) {
            warn$1(`${signature$1$1}: output undefined`);
        }
    }

    //Freeze exports
    Object.freeze(realOverflow$1);
    Object.freeze(intOverflow$1);
    Object.freeze(notDefined$1);

    function sorted$1(arrLabel, sortedLabel) {
        const arr = args$1[arrLabel];
        const sorted = args$1[sortedLabel];
        const len = arr.length;
        if (len === 0) {return;}
        if (sorted === true) {
            sgn = Math.sign(arr[len - 1] - arr[0]);
            for (let i = 1; i < len; i++) {
                const s = Math.sign(arr[i] - arr[i-1]);
                if ( (s !== 0) && (s !== sgn)) {
                    throw `${signature$1$1}: ${sortedLabel} set to true, but ${arrLabel} unsorted`;
                }
            }
        }
    }

    function realNumber$1$1(label) {
        const value = args$1[label];
        if (value === undefined) {return;}
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1}: If provided, ${label} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1}: ${label} cannot be NaN or Infinity.`;
        }
    }

    function target$1(label, length) {
        const value = args$1[label];
        if (value === undefined) {return;}
        realArray$1(value);
        if (value.length !== length) {
            throw `${signature$1$1}: ${label} has incorrect length`
        }
    }

    function bool$1$1(label) {
        const value = args$1[label];
        if (value === undefined) {return;}
        if ((value !== true) && (value !== false)) {
            throw `${signature$1$1}: ${label} must be a boolean`
        }
    }

    function nonNegativeInteger$1(label) {
        if (value === undefined) {return;}
        nonNegative$2(label);
        integer$1(label);
    }

    Object.freeze(realNumber$1$1);
    Object.freeze(sorted$1);
    Object.freeze(target$1);
    Object.freeze(bool$1$1);
    Object.freeze(nonNegativeInteger$1);

    //Math constants
    const E$1 = Math.E;
    const PI$1 = Math.PI;

    //Number constants
    const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER;
    const MAX_VALUE$1 = Number.MAX_VALUE;
    const EPSILON$1 = Number.EPSILON;

    //Functions
    const abs$1 = Math.abs;
    const round$1 = Math.round;
    const trunc$1 = Math.trunc;
    const ceil$1 = Math.ceil;
    const floor$1 = Math.floor;
    const sin$1 = Math.sin;
    const cos$1 = Math.cos;
    const acos$1 = Math.acos;
    const atan2$1 = Math.atan2;
    const sqrt$1 = Math.sqrt;
    const hypot$1 = Math.hypot;
    const pow$1 = Math.pow;
    const exp$1 = Math.exp;
    const ln$1 = Math.log;
    const max$1 = Math.max;
    const min$1 = Math.min;
    const random$1 = Math.random;

    //Constants
    const RAD_TO_DEG$1 = 180 / PI$1;
    const DEG_TO_RAD$1 = 1 / RAD_TO_DEG$1;
    const TWO_PI$1 = 2 * PI$1;

    //Functions
    function lerp$2(x, y, r) {
    	return x + (y - x) * r;
    }

    function mod$2(x, m) {
    	return ((x%m)+m)%m;
    }

    function fract$4(x) {
    	return x - trunc$1(x);
    }

    function deg$2(radians) {
    	return radians * RAD_TO_DEG$1;
    }

    function rad$2(degrees) {
    	return degrees * DEG_TO_RAD$1;
    }

    function linmap$2(x, domain, range) {
    	const r0 = range[0];
    	const d0 = domain[0];
    	return r0 + (range[1] - r0) * (x - d0) / (domain[1] - d0);
    }

    // Freeze function exports
    Object.freeze(lerp$2);
    Object.freeze(mod$2);
    Object.freeze(fract$4);
    Object.freeze(deg$2);
    Object.freeze(rad$2);
    Object.freeze(linmap$2);

    function lerp$1$1(x, y, r) {
    	setContext("lerp(x, y, r)", arguments);
    	realNumber$2("x");
    	realNumber$2("y");
    	realNumber$2("r");
    	clearContext$1();
    	return lerp$2(x, y, r);
    }

    function mod$1$1(x, m) {
    	setContext("mod(x, m)", arguments);
    	realNumber$2("x");
    	realNumber$2("m");
    	clearContext$1();
    	return mod$2(x, m);
    }

    function fract$1$1(x) {
    	setContext("fract(x)", arguments);
    	realNumber$2("x");
    	clearContext$1();
    	return fract$4(x);
    }

    function deg$1$1(radians) {
    	setContext("deg(radians)", arguments);
    	realNumber$2("radians");
    	clearContext$1();
    	return deg$2(radians);
    }

    function rad$1$1(degrees) {
    	setContext("rad(degrees)", arguments);
    	realNumber$2('degrees');
    	clearContext$1();
    	return rad$2(degrees);
    }

    function linmap$1$1(x, domain, range) {
    	setContext("linmap(x, domain, range)", arguments);
    	realNumber$2("x");
    	realArray$1('domain');
    	realArray$1('range');
    	if (domain[0] > domain[1]) {
    		throw "linmap(x, domain, range): invalid domain"
    	}
    	if (range[0] > range[1]) {
    		throw "linmap(x, domain, range): invalid range"
    	}
    	clearContext$1();
    	return linmap$2(x, domain, range);
    }

    // Freeze function exports
    Object.freeze(lerp$1$1);
    Object.freeze(mod$1$1);
    Object.freeze(fract$1$1);
    Object.freeze(deg$1$1);
    Object.freeze(rad$1$1);
    Object.freeze(linmap$1$1);

    function computeFactorials$1(n = 170) { //n > 170 overflows JS's Number type
    	if (n < 0) {return [];}
    	const len = n + 1;
    	const result = new Float64Array(len);
    	result[0] = 1;
    	for (let i = 1; i < len; i++) {
    		result[i] = i * result[i-1];
    	}
    	return result;
    }

    function computeBinomials$1(n = 30) {
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

    const FACTORIALS$1 = computeFactorials$1();
    let BINOM_MAX_CACHED_N$1;
    let BINOMIALS$1;

    function precomputeBinomials$1(n) {
    	BINOM_MAX_CACHED_N$1 = n;
    	BINOMIALS$1 = computeBinomials$1(n);
    }

    precomputeBinomials$1(30);

    //Combinatorial functions
    function factorial$2(n) {
    	if (n < 0) {return undefined;}
    	if (n > 170) {return MAX_VALUE$1;}
    	return FACTORIALS$1[n];
    }

    function choose$2(n, r) {
    	if ((r > n)||(n < 0)||(r < 0)) {return 0;} // Quick return 0
    	if (n <= BINOM_MAX_CACHED_N$1) {return BINOMIALS$1[0.5 * n * (n + 1) + r];} //Return pre-computed
    	//Not pre-computed
    	const k = min$1(r, n - r);
    	if (k > 514) {return MAX_VALUE$1;} //Quick return for known overflow
    	const nMinusK = n - k;
    	let result = 1;
    	let i = 1;
    	while (i <= k) {
    		result *= (nMinusK + i)/(i++);
    	}
    	return result; //Could still have overflown
    }

    function permute$2(n, r) {
    	if ((r > n) || (n < 0) || (r < 0)) {return 0;}
    	r = n - r;
    	if (r > 170) {return MAX_VALUE$1;}
    	if (n < 171) {
    		return round$1(FACTORIALS$1[n]/FACTORIALS$1[r]);
    	}
    	let result = 1;
    	if (r < 160) { //Skip multiplication of known values
    		result = round$1(FACTORIALS$1[170]/FACTORIALS$1[r]);
    		r = 170;
    	} 
    	while (r < n) {
    		result *= ++r;
    	}
    	return result;
    }

    //Greatest common divisor
    function gcd$2(a, b) {
    	//Input & trivial cases
    	a = abs$1(a);
    	b = abs$1(b);
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
    function lcm$2(a, b) {
    	if ((a === 0)||(b === 0)) {return 0;}
    	return abs$1((a / gcd$2(a, b)) * b);
    }

    //Modular exponentiation
    function mpow$2(base, exp, m) {
    	//base = abs(base);
    	exp = abs$1(exp);
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
    Object.freeze(computeFactorials$1);
    Object.freeze(computeBinomials$1);
    Object.freeze(precomputeBinomials$1);
    Object.freeze(factorial$2);
    Object.freeze(choose$2);
    Object.freeze(permute$2);
    Object.freeze(gcd$2);
    Object.freeze(lcm$2);
    Object.freeze(mpow$2);

    function factorial$1$1(n) {
    	setContext$1$1("factorial(n)", arguments);
    	integer$1("n");
    	nonNegative$2("n");
    	const result = factorial$2(n);
    	realOverflow$1(result);
    	intOverflow$1(result);
    	clearContext$1();
    	return result;
    }

    function choose$1$1(n, r) {
    	setContext$1$1("choose(n, r)", arguments);
    	integer$1("n");
    	integer$1("r");
    	const result = choose$2(n, r);
    	realOverflow$1(result);
    	intOverflow$1(result);
    	clearContext$1();
    	return result;
    }

    function permute$1$1(n, r) {
    	setContext$1$1("permute(n, r)", arguments);
    	integer$1("n");
    	integer$1("r");
    	const result = permute$2(n, r);
    	realOverflow$1(result);
    	intOverflow$1(result);
    	clearContext$1();
    	return result;
    }

    function gcd$1$1(a, b) {
    	setContext$1$1("gcd(a, b)", arguments);
    	integer$1("a");
    	integer$1("b");
    	clearContext$1();
    	return gcd$2(a, b);
    }

    function lcm$1$1(a, b) {
    	setContext$1$1("lcm(a, b)", arguments);
    	integer$1("a");
    	integer$1("b");
    	clearContext$1();
    	return lcm$2(a, b);
    }

    function mpow$1$1(base, exp, m) {
    	setContext$1$1("mpow(base, exp, m)", arguments);
    	integer$1("base");
    	integer$1("exp");
    	nonNegative$2("exp");
    	integer$1("m");
    	clearContext$1();
    	return mpow$2(base, exp, m);
    }

    // Freeze exports
    Object.freeze(factorial$1$1);
    Object.freeze(choose$1$1);
    Object.freeze(permute$1$1);
    Object.freeze(gcd$1$1);
    Object.freeze(lcm$1$1);
    Object.freeze(mpow$1$1);

    //Dot product
    function dot$2(vec1, vec2) {
    	let result = 0;
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		result += vec1[i] * vec2[i];
    	}
    	return result;
    }

    function dot2$3(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function dot3$2(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }

    function dot4$2(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
    }

    //Cross product
    function cross3$2(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    	return target;
    }

    //Addition
    function add$2(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] + vec2[i];
    	}
    	return target;
    }

    function add2$2(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	return target;
    }

    function add3$2(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	return target;
    }

    function add4$2(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	target[3] = vec1[3] + vec2[3];
    	return target;
    }

    //Subtraction
    function sub$2(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] - vec2[i];
    	}
    	return target;
    }

    function sub2$2(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	return target;
    }

    function sub3$2(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	return target;
    }

    function sub4$2(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	target[3] = vec1[3] - vec2[3];
    	return target;
    }

    //Magnitude
    function mag$3(vec) {
    	return hypot$1(...vec);
    }

    function mag2$2(vec) {
    	return hypot$1(vec[0], vec[1]);
    }

    function mag3$2(vec) {
    	return hypot$1(vec[0], vec[1], vec[2]);
    }

    function mag4$2(vec) {
    	return hypot$1(vec[0], vec[1], vec[2], vec[3]);
    }

    //Scaling
    function scale$1$1(vec, k, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec[i] * k;
    	}
    	return target;
    }

    function scale2$1$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	return target;
    }

    function scale3$1$1(vec, k, target = new Float64Array(3)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	return target;
    }

    function scale4$1$1(vec, k, target = new Float64Array(4)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	target[3] = vec[3] * k;
    	return target;
    }

    function normalize$2(vec, target) { //'target' intentionally defaults to undefined
    	return scale$1$1(vec, 1 / mag$3(vec), target);
    }

    function normalize2$3(vec, target) {
    	return scale2$1$1(vec, 1 / mag2$2(vec), target);
    }

    function normalize3$2(vec, target) {
    	return scale3$1$1(vec, 1 / mag3$2(vec), target);
    }

    function normalize4$2(vec, target) {
    	return scale4$1$1(vec, 1 / mag4$2(vec), target);
    }

    //Angles & rotations
    function angle$2(vec1, vec2) {
    	return acos$1(dot$2(vec1, vec2) / (mag$3(vec1) * mag$3(vec2)));
    }

    function angle2$2(vec1, vec2) {
    	return acos$1(dot2$3(vec1, vec2) / (mag2$2(vec1) * mag2$2(vec2)));
    }

    function angle3$2(vec1, vec2) {
    	return acos$1(dot3$2(vec1, vec2) / (mag3$2(vec1) * mag3$2(vec2)));
    }

    function angle4$2(vec1, vec2) {
    	return acos$1(dot4$2(vec1, vec2) / (mag4$2(vec1) * mag4$2(vec2)));
    }

    //Other component-wise operations
    function fract$2$1(vec, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = fract$4(vec[i]);
    	}
    	return target;
    }

    function fract2$2(vec, target = new Float64Array(2)) {
    	target[0] = fract$4(vec[0]);
    	target[1] = fract$4(vec[1]);
    	return target;
    }

    function fract3$2(vec, target = new Float64Array(3)) {
    	target[0] = fract$4(vec[0]);
    	target[1] = fract$4(vec[1]);
    	target[2] = fract$4(vec[2]);
    	return target;
    }

    function fract4$2(vec, target = new Float64Array(4)) {
    	target[0] = fract$4(vec[0]);
    	target[1] = fract$4(vec[1]);
    	target[2] = fract$4(vec[2]);
    	target[3] = fract$4(vec[3]);
    	return target;
    }

    function toPolar2$2(vec, target = new Float64Array(2)) {
    	target[0] = mag2$2(vec);
    	target[1] = atan2$1(vec[1], vec[0]) + PI$1;
    	return target;
    }

    // Freeze exports
    Object.freeze(dot$2);
    Object.freeze(dot2$3);
    Object.freeze(dot3$2);
    Object.freeze(dot4$2);
    Object.freeze(cross3$2);
    Object.freeze(add$2);
    Object.freeze(add2$2);
    Object.freeze(add3$2);
    Object.freeze(add4$2);
    Object.freeze(sub$2);
    Object.freeze(sub2$2);
    Object.freeze(sub3$2);
    Object.freeze(sub4$2);
    Object.freeze(mag$3);
    Object.freeze(mag2$2);
    Object.freeze(mag3$2);
    Object.freeze(mag4$2);
    Object.freeze(scale$1$1);
    Object.freeze(scale2$1$1);
    Object.freeze(scale3$1$1);
    Object.freeze(scale4$1$1);
    Object.freeze(normalize$2);
    Object.freeze(normalize2$3);
    Object.freeze(normalize3$2);
    Object.freeze(normalize4$2);
    Object.freeze(angle$2);
    Object.freeze(angle2$2);
    Object.freeze(angle3$2);
    Object.freeze(angle4$2);
    Object.freeze(fract$2$1);
    Object.freeze(fract2$2);
    Object.freeze(fract3$2);
    Object.freeze(fract4$2);
    Object.freeze(toPolar2$2);

    //Dot product
    function dot$1$1(vec1, vec2) {
    	setContext$1$1("dot(vec1, vec2)", arguments);
    	realArray$1("vec1");
    	realArray$1("vec2", vec1.length);
    	clearContext$1();
    	return dot$2(vec1, vec2);
    }

    function dot2$1$1(vec1, vec2) {
    	setContext$1$1("dot2(vec1, vec2)", arguments);
    	realArray$1("vec1", 2);
    	realArray$1("vec2", 2);
    	clearContext$1();
    	return dot2$3(vec1, vec2);
    }

    function dot3$1$1(vec1, vec2) {
    	setContext$1$1("dot3(vec1, vec2)", arguments);
    	realArray$1("vec1", 3);
    	realArray$1("vec2", 3);
    	clearContext$1();
    	return dot3$2(vec1, vec2);
    }

    function dot4$1$1(vec1, vec2) {
    	setContext$1$1("dot4(vec1, vec2)", arguments);
    	realArray$1("vec1", 4);
    	realArray$1("vec2", 4);
    	clearContext$1();
    	return dot4$2(vec1, vec2);
    }

    //Cross product
    function cross3$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("cross3(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 3);
    	realArray$1("vec2", 3);
    	target$1('target', 3);
    	clearContext$1();
    	return cross3$2(vec1, vec2, target$1$1);
    }

    //Addition
    function add$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("add(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1");
    	realArray$1("vec2", vec1.length);
    	target$1('target', vec1.length);
    	clearContext$1();
    	return add$2(vec1, vec2, target$1$1);
    }

    function add2$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("add2(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 2);
    	realArray$1("vec2", 2);
    	target$1('target', 2);
    	clearContext$1();
    	return add2$2(vec1, vec2, target$1$1);
    }

    function add3$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("add3(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 3);
    	realArray$1("vec2", 3);
    	target$1('target', 3);
    	clearContext$1();
    	return add3$2(vec1, vec2, target$1$1);
    }

    function add4$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("add4(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 4);
    	realArray$1("vec2", 4);
    	target$1('target', 4);
    	clearContext$1();
    	return add4$2(vec1, vec2, target$1$1);
    }

    //Subtraction
    function sub$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("sub(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 2);
    	realArray$1("vec2", vec1.length);
    	target$1('target', vec1.length);
    	clearContext$1();
    	return sub$2(vec1, vec2, target$1$1);
    }

    function sub2$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("sub2(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 2);
    	realArray$1("vec2", 2);
    	target$1('target', 2);
    	clearContext$1();
    	return sub2$2(vec1, vec2, target$1$1);
    }

    function sub3$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("sub3(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 3);
    	realArray$1("vec2", 3);
    	target$1('target', 3);
    	clearContext$1();
    	return sub3$2(vec1, vec2, target$1$1);
    }

    function sub4$1$1(vec1, vec2, target$1$1) {
    	setContext$1$1("sub4(vec1, vec2, ?target)", arguments);
    	realArray$1("vec1", 4);
    	realArray$1("vec2", 4);
    	target$1('target', 4);
    	clearContext$1();
    	return sub4$2(vec1, vec2, target$1$1);
    }

    //Magnitude
    function mag$1$1(vec) {
    	setContext$1$1("mag(vec)", arguments);
    	realArray$1("vec");
    	clearContext$1();
    	return mag$3(vec);
    }

    function mag2$1$1(vec) {
    	setContext$1$1("mag2(vec)", arguments);
    	realArray$1("vec", 2);
    	clearContext$1();
    	return mag2$2(vec);
    }

    function mag3$1$1(vec) {
    	setContext$1$1("mag3(vec)", arguments);
    	realArray$1("vec", 3);
    	clearContext$1();
    	return mag3$2(vec);
    }

    function mag4$1$1(vec) {
    	setContext$1$1("mag4(vec)", arguments);
    	realArray$1("vec", 4);
    	clearContext$1();
    	return mag4$2(vec);
    }

    //Scaling
    function scale$2$1(vec, k, target$1$1) {
    	setContext$1$1("scale(vec, k, ?target)", arguments);
    	realArray$1("vec");
    	realNumber$2("k");
    	target$1('target', vec.length);
    	return scale$1$1(vec, k, target$1$1);
    }

    function scale2$2$1(vec, k, target$1$1) {
    	setContext$1$1("scale2(vec, k, ?target)", arguments);
    	realArray$1("vec", 2);
    	realNumber$2("k");
    	target$1('target', 2);
    	return scale2$1$1(vec, k, target$1$1);
    }

    function scale3$2$1(vec, k, target$1$1) {
    	setContext$1$1("scale3(vec, k, ?target)", arguments);
    	realArray$1("vec", 3);
    	realNumber$2("k");
    	target$1('target', 3);
    	return scale3$1$1(vec, k, target$1$1);
    }

    function scale4$2$1(vec, k, target$1$1) {
    	setContext$1$1("scale4(vec, k, ?target)", arguments);
    	realArray$1("vec", 4);
    	realNumber$2("k");
    	target$1('target', 4);
    	return scale4$1$1(vec, k, target$1$1);
    }

    function normalize$1$1(vec, target$1$1) { //'target' intentionally defaults to undefined
    	setContext$1$1("normalize(vec, ?target)", arguments);
    	realArray$1("vec");
    	target$1('target', vec.length);
    	return normalize$2(vec, target$1$1);
    }

    function normalize2$1$1(vec, target$1$1) {
    	setContext$1$1("normalize2(vec, ?target)", arguments);
    	realArray$1("vec", 2);
    	target$1('target', 2);
    	return normalize2$3(vec, target$1$1);
    }

    function normalize3$1$1(vec, target$1$1) {
    	setContext$1$1("normalize3(vec, ?target)", arguments);
    	realArray$1("vec", 3);
    	target$1('target', 3);
    	return normalize3$2(vec, target$1$1);
    }

    function normalize4$1$1(vec, target$1$1) {
    	setContext$1$1("normalize4(vec, ?target)", arguments);
    	realArray$1("vec", 4);
    	target$1('target', 4);
    	return normalize4$2(vec, target$1$1);
    }

    //Angles & rotations
    function angle$1$1(vec1, vec2) {
    	setContext$1$1("angle(vec1, vec2)", arguments);
    	realArray$1("vec1");
    	realArray$1("vec2", vec1.length);
    	return angle$2(vec1, vec2);
    }

    function angle2$1$1(vec1, vec2) {
    	setContext$1$1("angle2(vec1, vec2)", arguments);
    	realArray$1("vec1", 2);
    	realArray$1("vec2", 2);
    	return angle2$2(vec1, vec2);
    }

    function angle3$1$1(vec1, vec2) {
    	setContext$1$1("angle3(vec1, vec2)", arguments);
    	realArray$1("vec1", 3);
    	realArray$1("vec2", 3);
    	return angle3$2(vec1, vec2);
    }

    function angle4$1$1(vec1, vec2) {
    	setContext$1$1("angle4(vec1, vec2)", arguments);
    	realArray$1("vec1", 4);
    	realArray$1("vec2", 4);
    	return angle4$2(vec1, vec2);
    }

    //Other component-wise operations
    function fract$3$1(vec, target$1$1) {
    	setContext$1$1("fract(vec, ?target)", arguments);
    	realArray$1("vec");
    	target$1("target", vec.length);
    	return fract$2$1(vec, target$1$1);
    }

    function fract2$1$1(vec, target$1$1) {
    	setContext$1$1("fract2(vec, ?target)", arguments);
    	realArray$1("vec", 2);
    	target$1("target", 2);
    	return fract2$2(vec, target$1$1);
    }

    function fract3$1$1(vec, target$1$1) {
    	setContext$1$1("fract3(vec, ?target)", arguments);
    	realArray$1("vec", 3);
    	target$1("target", 3);
    	return fract3$2(vec, target$1$1);
    }

    function fract4$1$1(vec, target$1$1) {
    	setContext$1$1("fract4(vec, ?target)", arguments);
    	realArray$1("vec", 4);
    	target$1("target", 4);
    	return fract4$2(vec, target$1$1);
    }

    function toPolar2$1$1(vec, target$1$1) {
    	setContext$1$1("polar2(vec, ?target)", arguments);
    	realArray$1("vec", 2);
    	target$1("target", 2);
    	return toPolar2$2(vec, target$1$1);
    }

    // Freeze exports
    Object.freeze(dot$1$1);
    Object.freeze(dot2$1$1);
    Object.freeze(dot3$1$1);
    Object.freeze(dot4$1$1);
    Object.freeze(cross3$1$1);
    Object.freeze(add$1$1);
    Object.freeze(add2$1$1);
    Object.freeze(add3$1$1);
    Object.freeze(add4$1$1);
    Object.freeze(sub$1$1);
    Object.freeze(sub2$1$1);
    Object.freeze(sub3$1$1);
    Object.freeze(sub4$1$1);
    Object.freeze(mag$1$1);
    Object.freeze(mag2$1$1);
    Object.freeze(mag3$1$1);
    Object.freeze(mag4$1$1);
    Object.freeze(scale$2$1);
    Object.freeze(scale2$2$1);
    Object.freeze(scale3$2$1);
    Object.freeze(scale4$2$1);
    Object.freeze(normalize$1$1);
    Object.freeze(normalize2$1$1);
    Object.freeze(normalize3$1$1);
    Object.freeze(normalize4$1$1);
    Object.freeze(angle$1$1);
    Object.freeze(angle2$1$1);
    Object.freeze(angle3$1$1);
    Object.freeze(angle4$1$1);
    Object.freeze(fract$3$1);
    Object.freeze(fract2$1$1);
    Object.freeze(fract3$1$1);
    Object.freeze(fract4$1$1);
    Object.freeze(toPolar2$1$1);

    function dot2$2$1(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos$1(vec1[1] - vec2[1]);
    }

    function mag$2$1(vec) {
    	return abs$1(vec[0]);
    }

    function scale2$3$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = mod$2(vec[1], TWO_PI$1);
    	return target;
    }

    function normalize2$2$1(vec, target = new Float64Array(2)) {
    	if (vec[0] === 0) {
    		return undefined;
    	}
    	target[0] = 1;
    	target[1] = mod$2(vec[1], TWO_PI$1);
    	return target;
    }

    function toRect2$1(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	const theta = vec[1];
    	target[0] = r * cos$1(theta);
    	target[1] = r * sin$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(dot2$2$1);
    Object.freeze(mag$2$1);
    Object.freeze(scale2$3$1);
    Object.freeze(normalize2$2$1);
    Object.freeze(toRect2$1);

    // Current debug context
    let signature$1$1$1 = "Unknown";
    let args$1$1 = {};

    function setContext$1$1$1(s, argArray) {
        //Parse signature
        signature$1$1$1 = s;
        const parameters = signature$1$1$1
        .split("(")[1]
        .replace(")", "")
        .replace(" ", "")
        .replace("?", "")
        .split(",");
        //Parse arguments
        args$1$1 = {};
        for (let i = 0; i < parameters.length; i++) {
            args$1$1[params[i]] = argArray[i];
        }
    }

    function clearContext$1$1() {
        args$1$1 = {};
        signature$1$1$1 = "Unknown";
    }

    // Shorter console use
    function log$1$1() {
        console.log.apply(console, arguments);
    }

    function warn$1$1() {
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
    Object.freeze(log$1$1);
    Object.freeze(setContext$1$1$1);
    Object.freeze(clearContext$1$1);
    Object.freeze(warn$1$1);

    const TYPED_ARRAY_CONSTRUCTORS$1$1 = [
        Int8Array, Uint8Array, Uint8ClampedArray,
        Int16Array, Uint16Array, Int32Array, Uint32Array,
        Float32Array, Float64Array];

    function realNumber$2$1(parameter) {
        const value = args$1$1[parameter];
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1$1}: ${parameter} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1$1}: ${parameter} cannot be NaN or Infinity.`;
        }
    }

    function realArray$1$1(parameter, length) {
        const value = args$1$1[parameter];
        if (TYPED_ARRAY_CONSTRUCTORS$1$1.includes(value.constructor) || Array.isArray(value)) {
            const len = value.length;
            if (len !== length) {
                throw `${signature$1$1$1}: ${parameter} has incorrect length`;
            }
            if (len === 0) {
                warn$1$1(`${signature$1$1$1}: ${parameter} is empty.`);
            }
            for (let i = 0; i < len; i++) {
    			const x = value[i];
                if (value.constructor !== Number) { //Assert type Number
                    throw `${signature$1$1$1}: ${parameter} must an array of Numbers.`;
                }
                if (!isFinite(value)) { //Exclude Infinity and NaN
                    throw `${signature$1$1$1}: ${parameter} contains NaN or Infinity.`;
                }
            }
        }
        throw `${signature$1$1$1}: ${parameter} must be an Array or TypedArray.`;
    }

    function integer$1$1(parameter) {
        const value = args$1$1[parameter];
        if (!Number.isInteger(value)) {
            throw `${signature$1$1$1}: ${parameter} must be an integer of type Number.`;
        }
    }

    function positive$1$1(parameter) {
        const value = args$1$1[parameter];
        realNumber$2$1(parameter);
        if (value <= 0) {
            throw `${signature$1$1$1}: ${parameter} must be positive.`;
        }
    }

    function nonNegative$1$1(parameter) {
        const value = args$1$1[parameter];
        realNumber$2$1(parameter);
        if (value < 0) {
            throw `${signature$1$1$1}: ${parameter} must be non-negative.`;
        }
    }

    function rectVector$1$1(parameter) {
        realArray$1$1(parameter);
    }

    function polarVector$1$1(parameter) {
        const value = args$1$1[parameter];
        realArray$1$1(parameter);
        if (value[0] < 0) {
            console.warn(`${signature$1$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function bool$2$1(parameter) {
        const value = args$1$1[parameter];
        if ( (value !== true) && (value !== false) ) {
            throw `${signature$1$1$1}: ${parameter} must be a boolean value.`;
        }
    }

    function polarComplex$1$1(parameter) {
        const value = args$1$1[parameter];
        realArray$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
        if (value[0] < 0) {
            console.warn(`${signature$1$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function rectComplex$1$1(parameter) {
        const value = args$1$1[parameter];
        realArray$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
    }

    function positiveInteger$1$1(parameter) {
        integer$1$1(parameter);
        positive$1$1(parameter);
    }

    function flatMatrix$1$1(parameter, nrows, ncols) {
        realArray$1$1(parameter);
        const value = args$1$1[parameter];
        if ( (!Number.isInteger(value.nrows)) || (value.nrows < 1) ) {
            throw `${signature$1$1$1}: ${parameter}.nrows is invalid`;
        }
        if ((!Number.isInteger(value.ncols)) || (value.ncols < 1)) {
            throw `${signature$1$1$1}: ${parameter}.ncols is invalid`;
        }
        if (value.nrows * value.ncols !== value.length) {
            throw `${signature$1$1$1}: ${parameter}.length does not match ${parameter}.nrows * ${parameter}.ncols`;
        }
        if ( (value.nrows !== nrows) || (value.ncols !== ncols) ) {
            throw `${signature$1$1$1}: ${parameter} has incorrect dimensions`;
        }
    }

    //Freeze exports
    Object.freeze(realNumber$2$1);
    Object.freeze(realArray$1$1);
    Object.freeze(integer$1$1);
    Object.freeze(positive$1$1);
    Object.freeze(nonNegative$1$1);
    Object.freeze(rectVector$1$1);
    Object.freeze(polarVector$1$1);
    Object.freeze(bool$2$1);
    Object.freeze(polarComplex$1$1);
    Object.freeze(rectComplex$1$1);
    Object.freeze(flatMatrix$1$1);
    Object.freeze(positiveInteger$1$1);

    function realOverflow$1$1(value) { //Assumes 'value' is a number
        if (value >= MAX_VALUE$1$1) {
            warn$1$1(`${signature$1$1$1}: overflowed Number.MAX_VALUE`);
        }
    }

    function intOverflow$1$1(value) { //Assumes 'value' is a number
        if (value > MAX_SAFE_INTEGER$1$1) {
            warn$1$1(`${signature$1$1$1}: overflowed Number.MAX_SAFE_INTEGER`);
        }
    }

    function notDefined$1$1(value) {
        if (value === undefined) {
            warn$1$1(`${signature$1$1$1}: output undefined`);
        }
    }

    //Freeze exports
    Object.freeze(realOverflow$1$1);
    Object.freeze(intOverflow$1$1);
    Object.freeze(notDefined$1$1);

    function sorted$1$1(arrLabel, sortedLabel) {
        const arr = args$1$1[arrLabel];
        const sorted = args$1$1[sortedLabel];
        const len = arr.length;
        if (len === 0) {return;}
        if (sorted === true) {
            sgn = Math.sign(arr[len - 1] - arr[0]);
            for (let i = 1; i < len; i++) {
                const s = Math.sign(arr[i] - arr[i-1]);
                if ( (s !== 0) && (s !== sgn)) {
                    throw `${signature$1$1$1}: ${sortedLabel} set to true, but ${arrLabel} unsorted`;
                }
            }
        }
    }

    function realNumber$1$1$1(label) {
        const value = args$1$1[label];
        if (value === undefined) {return;}
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1$1}: If provided, ${label} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1$1}: ${label} cannot be NaN or Infinity.`;
        }
    }

    function target$1$1(label, length) {
        const value = args$1$1[label];
        if (value === undefined) {return;}
        realArray$1$1(value);
        if (value.length !== length) {
            throw `${signature$1$1$1}: ${label} has incorrect length`
        }
    }

    function bool$1$1$1(label) {
        const value = args$1$1[label];
        if (value === undefined) {return;}
        if ((value !== true) && (value !== false)) {
            throw `${signature$1$1$1}: ${label} must be a boolean`
        }
    }

    Object.freeze(realNumber$1$1$1);
    Object.freeze(sorted$1$1);
    Object.freeze(target$1$1);
    Object.freeze(bool$1$1$1);

    //Math constants
    const E$1$1 = Math.E;
    const PI$1$1 = Math.PI;

    //Number constants
    const MAX_SAFE_INTEGER$1$1 = Number.MAX_SAFE_INTEGER;
    const MAX_VALUE$1$1 = Number.MAX_VALUE;
    const EPSILON$1$1 = Number.EPSILON;

    //Functions
    const abs$1$1 = Math.abs;
    const round$1$1 = Math.round;
    const trunc$1$1 = Math.trunc;
    const ceil$1$1 = Math.ceil;
    const floor$1$1 = Math.floor;
    const sin$1$1 = Math.sin;
    const cos$1$1 = Math.cos;
    const acos$1$1 = Math.acos;
    const atan2$1$1 = Math.atan2;
    const sqrt$1$1 = Math.sqrt;
    const hypot$1$1 = Math.hypot;
    const pow$1$1 = Math.pow;
    const exp$1$1 = Math.exp;
    const ln$1$1 = Math.log;
    const max$1$1 = Math.max;
    const min$1$1 = Math.min;
    const random$1$1 = Math.random;

    //Constants
    const RAD_TO_DEG$1$1 = 180 / PI$1$1;
    const DEG_TO_RAD$1$1 = 1 / RAD_TO_DEG$1$1;
    const TWO_PI$1$1 = 2 * PI$1$1;

    //Functions
    function lerp$2$1(x, y, r) {
    	return x + (y - x) * r;
    }

    function mod$2$1(x, m) {
    	return ((x%m)+m)%m;
    }

    function fract$4$1(x) {
    	return x - trunc$1$1(x);
    }

    function deg$2$1(radians) {
    	return radians * RAD_TO_DEG$1$1;
    }

    function rad$2$1(degrees) {
    	return degrees * DEG_TO_RAD$1$1;
    }

    function linmap$2$1(x, domain, range) {
    	const r0 = range[0];
    	const d0 = domain[0];
    	return r0 + (range[1] - r0) * (x - d0) / (domain[1] - d0);
    }

    // Freeze function exports
    Object.freeze(lerp$2$1);
    Object.freeze(mod$2$1);
    Object.freeze(fract$4$1);
    Object.freeze(deg$2$1);
    Object.freeze(rad$2$1);
    Object.freeze(linmap$2$1);

    function lerp$1$1$1(x, y, r) {
    	setContext("lerp(x, y, r)", arguments);
    	realNumber$2$1("x");
    	realNumber$2$1("y");
    	realNumber$2$1("r");
    	clearContext$1$1();
    	return lerp$2$1(x, y, r);
    }

    function mod$1$1$1(x, m) {
    	setContext("mod(x, m)", arguments);
    	realNumber$2$1("x");
    	realNumber$2$1("m");
    	clearContext$1$1();
    	return mod$2$1(x, m);
    }

    function fract$1$1$1(x) {
    	setContext("fract(x)", arguments);
    	realNumber$2$1("x");
    	clearContext$1$1();
    	return fract$4$1(x);
    }

    function deg$1$1$1(radians) {
    	setContext("deg(radians)", arguments);
    	realNumber$2$1("radians");
    	clearContext$1$1();
    	return deg$2$1(radians);
    }

    function rad$1$1$1(degrees) {
    	setContext("rad(degrees)", arguments);
    	realNumber$2$1('degrees');
    	clearContext$1$1();
    	return rad$2$1(degrees);
    }

    function linmap$1$1$1(x, domain, range) {
    	setContext("linmap(x, domain, range)", arguments);
    	realNumber$2$1("x");
    	realArray$1$1('domain');
    	realArray$1$1('range');
    	if (domain[0] > domain[1]) {
    		throw "linmap(x, domain, range): invalid domain"
    	}
    	if (range[0] > range[1]) {
    		throw "linmap(x, domain, range): invalid range"
    	}
    	clearContext$1$1();
    	return linmap$2$1(x, domain, range);
    }

    // Freeze function exports
    Object.freeze(lerp$1$1$1);
    Object.freeze(mod$1$1$1);
    Object.freeze(fract$1$1$1);
    Object.freeze(deg$1$1$1);
    Object.freeze(rad$1$1$1);
    Object.freeze(linmap$1$1$1);

    function computeFactorials$1$1(n = 170) { //n > 170 overflows JS's Number type
    	if (n < 0) {return [];}
    	const len = n + 1;
    	const result = new Float64Array(len);
    	result[0] = 1;
    	for (let i = 1; i < len; i++) {
    		result[i] = i * result[i-1];
    	}
    	return result;
    }

    function computeBinomials$1$1(n = 30) {
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

    const FACTORIALS$1$1 = computeFactorials$1$1();
    let BINOM_MAX_CACHED_N$1$1;
    let BINOMIALS$1$1;

    function precomputeBinomials$1$1(n) {
    	BINOM_MAX_CACHED_N$1$1 = n;
    	BINOMIALS$1$1 = computeBinomials$1$1(n);
    }

    precomputeBinomials$1$1(30);

    //Combinatorial functions
    function factorial$2$1(n) {
    	if (n < 0) {return undefined;}
    	if (n > 170) {return MAX_VALUE$1$1;}
    	return FACTORIALS$1$1[n];
    }

    function choose$2$1(n, r) {
    	if ((r > n)||(n < 0)||(r < 0)) {return 0;} // Quick return 0
    	if (n <= BINOM_MAX_CACHED_N$1$1) {return BINOMIALS$1$1[0.5 * n * (n + 1) + r];} //Return pre-computed
    	//Not pre-computed
    	const k = min$1$1(r, n - r);
    	if (k > 514) {return MAX_VALUE$1$1;} //Quick return for known overflow
    	const nMinusK = n - k;
    	let result = 1;
    	let i = 1;
    	while (i <= k) {
    		result *= (nMinusK + i)/(i++);
    	}
    	return result; //Could still have overflown
    }

    function permute$2$1(n, r) {
    	if ((r > n) || (n < 0) || (r < 0)) {return 0;}
    	r = n - r;
    	if (r > 170) {return MAX_VALUE$1$1;}
    	if (n < 171) {
    		return round$1$1(FACTORIALS$1$1[n]/FACTORIALS$1$1[r]);
    	}
    	let result = 1;
    	if (r < 160) { //Skip multiplication of known values
    		result = round$1$1(FACTORIALS$1$1[170]/FACTORIALS$1$1[r]);
    		r = 170;
    	} 
    	while (r < n) {
    		result *= ++r;
    	}
    	return result;
    }

    //Greatest common divisor
    function gcd$2$1(a, b) {
    	//Input & trivial cases
    	a = abs$1$1(a);
    	b = abs$1$1(b);
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
    function lcm$2$1(a, b) {
    	if ((a === 0)||(b === 0)) {return 0;}
    	return abs$1$1((a / gcd$2$1(a, b)) * b);
    }

    //Modular exponentiation
    function mpow$2$1(base, exp, m) {
    	//base = abs(base);
    	exp = abs$1$1(exp);
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
    Object.freeze(computeFactorials$1$1);
    Object.freeze(computeBinomials$1$1);
    Object.freeze(precomputeBinomials$1$1);
    Object.freeze(factorial$2$1);
    Object.freeze(choose$2$1);
    Object.freeze(permute$2$1);
    Object.freeze(gcd$2$1);
    Object.freeze(lcm$2$1);
    Object.freeze(mpow$2$1);

    function factorial$1$1$1(n) {
    	setContext$1$1$1("factorial(n)", arguments);
    	integer$1$1("n");
    	nonNegative$1$1("n");
    	const result = factorial$2$1(n);
    	realOverflow$1$1(result);
    	intOverflow$1$1(result);
    	clearContext$1$1();
    	return result;
    }

    function choose$1$1$1(n, r) {
    	setContext$1$1$1("choose(n, r)", arguments);
    	integer$1$1("n");
    	integer$1$1("r");
    	const result = choose$2$1(n, r);
    	realOverflow$1$1(result);
    	intOverflow$1$1(result);
    	clearContext$1$1();
    	return result;
    }

    function permute$1$1$1(n, r) {
    	setContext$1$1$1("permute(n, r)", arguments);
    	integer$1$1("n");
    	integer$1$1("r");
    	const result = permute$2$1(n, r);
    	realOverflow$1$1(result);
    	intOverflow$1$1(result);
    	clearContext$1$1();
    	return result;
    }

    function gcd$1$1$1(a, b) {
    	setContext$1$1$1("gcd(a, b)", arguments);
    	integer$1$1("a");
    	integer$1$1("b");
    	clearContext$1$1();
    	return gcd$2$1(a, b);
    }

    function lcm$1$1$1(a, b) {
    	setContext$1$1$1("lcm(a, b)", arguments);
    	integer$1$1("a");
    	integer$1$1("b");
    	clearContext$1$1();
    	return lcm$2$1(a, b);
    }

    function mpow$1$1$1(base, exp, m) {
    	setContext$1$1$1("mpow(base, exp, m)", arguments);
    	integer$1$1("base");
    	integer$1$1("exp");
    	nonNegative$1$1("exp");
    	integer$1$1("m");
    	clearContext$1$1();
    	return mpow$2$1(base, exp, m);
    }

    // Freeze exports
    Object.freeze(factorial$1$1$1);
    Object.freeze(choose$1$1$1);
    Object.freeze(permute$1$1$1);
    Object.freeze(gcd$1$1$1);
    Object.freeze(lcm$1$1$1);
    Object.freeze(mpow$1$1$1);

    //Dot product
    function dot$2$1(vec1, vec2) {
    	let result = 0;
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		result += vec1[i] * vec2[i];
    	}
    	return result;
    }

    function dot2$3$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function dot3$2$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }

    function dot4$2$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
    }

    //Cross product
    function cross3$2$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    	return target;
    }

    //Addition
    function add$2$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] + vec2[i];
    	}
    	return target;
    }

    function add2$2$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	return target;
    }

    function add3$2$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	return target;
    }

    function add4$2$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	target[3] = vec1[3] + vec2[3];
    	return target;
    }

    //Subtraction
    function sub$2$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] - vec2[i];
    	}
    	return target;
    }

    function sub2$2$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	return target;
    }

    function sub3$2$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	return target;
    }

    function sub4$2$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	target[3] = vec1[3] - vec2[3];
    	return target;
    }

    //Magnitude
    function mag$3$1(vec) {
    	return hypot$1$1(...vec);
    }

    function mag2$2$1(vec) {
    	return hypot$1$1(vec[0], vec[1]);
    }

    function mag3$2$1(vec) {
    	return hypot$1$1(vec[0], vec[1], vec[2]);
    }

    function mag4$2$1(vec) {
    	return hypot$1$1(vec[0], vec[1], vec[2], vec[3]);
    }

    //Scaling
    function scale$1$1$1(vec, k, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec[i] * k;
    	}
    	return target;
    }

    function scale2$1$1$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	return target;
    }

    function scale3$1$1$1(vec, k, target = new Float64Array(3)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	return target;
    }

    function scale4$1$1$1(vec, k, target = new Float64Array(4)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	target[3] = vec[3] * k;
    	return target;
    }

    function normalize$2$1(vec, target) { //'target' intentionally defaults to undefined
    	return scale$1$1$1(vec, 1 / mag$3$1(vec), target);
    }

    function normalize2$3$1(vec, target) {
    	return scale2$1$1$1(vec, 1 / mag2$2$1(vec), target);
    }

    function normalize3$2$1(vec, target) {
    	return scale3$1$1$1(vec, 1 / mag3$2$1(vec), target);
    }

    function normalize4$2$1(vec, target) {
    	return scale4$1$1$1(vec, 1 / mag4$2$1(vec), target);
    }

    //Angles & rotations
    function angle$2$1(vec1, vec2) {
    	return acos$1$1(dot$2$1(vec1, vec2) / (mag$3$1(vec1) * mag$3$1(vec2)));
    }

    function angle2$2$1(vec1, vec2) {
    	return acos$1$1(dot2$3$1(vec1, vec2) / (mag2$2$1(vec1) * mag2$2$1(vec2)));
    }

    function angle3$2$1(vec1, vec2) {
    	return acos$1$1(dot3$2$1(vec1, vec2) / (mag3$2$1(vec1) * mag3$2$1(vec2)));
    }

    function angle4$2$1(vec1, vec2) {
    	return acos$1$1(dot4$2$1(vec1, vec2) / (mag4$2$1(vec1) * mag4$2$1(vec2)));
    }

    //Other component-wise operations
    function fract$2$1$1(vec, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = fract$4$1(vec[i]);
    	}
    	return target;
    }

    function fract2$2$1(vec, target = new Float64Array(2)) {
    	target[0] = fract$4$1(vec[0]);
    	target[1] = fract$4$1(vec[1]);
    	return target;
    }

    function fract3$2$1(vec, target = new Float64Array(3)) {
    	target[0] = fract$4$1(vec[0]);
    	target[1] = fract$4$1(vec[1]);
    	target[2] = fract$4$1(vec[2]);
    	return target;
    }

    function fract4$2$1(vec, target = new Float64Array(4)) {
    	target[0] = fract$4$1(vec[0]);
    	target[1] = fract$4$1(vec[1]);
    	target[2] = fract$4$1(vec[2]);
    	target[3] = fract$4$1(vec[3]);
    	return target;
    }

    function toPolar2$2$1(vec, target = new Float64Array(2)) {
    	target[0] = mag2$2$1(vec);
    	target[1] = atan2$1$1(vec[1], vec[0]) + PI$1$1;
    	return target;
    }

    // Freeze exports
    Object.freeze(dot$2$1);
    Object.freeze(dot2$3$1);
    Object.freeze(dot3$2$1);
    Object.freeze(dot4$2$1);
    Object.freeze(cross3$2$1);
    Object.freeze(add$2$1);
    Object.freeze(add2$2$1);
    Object.freeze(add3$2$1);
    Object.freeze(add4$2$1);
    Object.freeze(sub$2$1);
    Object.freeze(sub2$2$1);
    Object.freeze(sub3$2$1);
    Object.freeze(sub4$2$1);
    Object.freeze(mag$3$1);
    Object.freeze(mag2$2$1);
    Object.freeze(mag3$2$1);
    Object.freeze(mag4$2$1);
    Object.freeze(scale$1$1$1);
    Object.freeze(scale2$1$1$1);
    Object.freeze(scale3$1$1$1);
    Object.freeze(scale4$1$1$1);
    Object.freeze(normalize$2$1);
    Object.freeze(normalize2$3$1);
    Object.freeze(normalize3$2$1);
    Object.freeze(normalize4$2$1);
    Object.freeze(angle$2$1);
    Object.freeze(angle2$2$1);
    Object.freeze(angle3$2$1);
    Object.freeze(angle4$2$1);
    Object.freeze(fract$2$1$1);
    Object.freeze(fract2$2$1);
    Object.freeze(fract3$2$1);
    Object.freeze(fract4$2$1);
    Object.freeze(toPolar2$2$1);

    //Dot product
    function dot$1$1$1(vec1, vec2) {
    	setContext$1$1$1("dot(vec1, vec2)", arguments);
    	realArray$1$1("vec1");
    	realArray$1$1("vec2", vec1.length);
    	clearContext$1$1();
    	return dot$2$1(vec1, vec2);
    }

    function dot2$1$1$1(vec1, vec2) {
    	setContext$1$1$1("dot2(vec1, vec2)", arguments);
    	realArray$1$1("vec1", 2);
    	realArray$1$1("vec2", 2);
    	clearContext$1$1();
    	return dot2$3$1(vec1, vec2);
    }

    function dot3$1$1$1(vec1, vec2) {
    	setContext$1$1$1("dot3(vec1, vec2)", arguments);
    	realArray$1$1("vec1", 3);
    	realArray$1$1("vec2", 3);
    	clearContext$1$1();
    	return dot3$2$1(vec1, vec2);
    }

    function dot4$1$1$1(vec1, vec2) {
    	setContext$1$1$1("dot4(vec1, vec2)", arguments);
    	realArray$1$1("vec1", 4);
    	realArray$1$1("vec2", 4);
    	clearContext$1$1();
    	return dot4$2$1(vec1, vec2);
    }

    //Cross product
    function cross3$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("cross3(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 3);
    	realArray$1$1("vec2", 3);
    	target$1$1('target', 3);
    	clearContext$1$1();
    	return cross3$2$1(vec1, vec2, target$1$1$1);
    }

    //Addition
    function add$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("add(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1");
    	realArray$1$1("vec2", vec1.length);
    	target$1$1('target', vec1.length);
    	clearContext$1$1();
    	return add$2$1(vec1, vec2, target$1$1$1);
    }

    function add2$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("add2(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 2);
    	realArray$1$1("vec2", 2);
    	target$1$1('target', 2);
    	clearContext$1$1();
    	return add2$2$1(vec1, vec2, target$1$1$1);
    }

    function add3$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("add3(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 3);
    	realArray$1$1("vec2", 3);
    	target$1$1('target', 3);
    	clearContext$1$1();
    	return add3$2$1(vec1, vec2, target$1$1$1);
    }

    function add4$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("add4(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 4);
    	realArray$1$1("vec2", 4);
    	target$1$1('target', 4);
    	clearContext$1$1();
    	return add4$2$1(vec1, vec2, target$1$1$1);
    }

    //Subtraction
    function sub$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("sub(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 2);
    	realArray$1$1("vec2", vec1.length);
    	target$1$1('target', vec1.length);
    	clearContext$1$1();
    	return sub$2$1(vec1, vec2, target$1$1$1);
    }

    function sub2$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("sub2(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 2);
    	realArray$1$1("vec2", 2);
    	target$1$1('target', 2);
    	clearContext$1$1();
    	return sub2$2$1(vec1, vec2, target$1$1$1);
    }

    function sub3$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("sub3(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 3);
    	realArray$1$1("vec2", 3);
    	target$1$1('target', 3);
    	clearContext$1$1();
    	return sub3$2$1(vec1, vec2, target$1$1$1);
    }

    function sub4$1$1$1(vec1, vec2, target$1$1$1) {
    	setContext$1$1$1("sub4(vec1, vec2, ?target)", arguments);
    	realArray$1$1("vec1", 4);
    	realArray$1$1("vec2", 4);
    	target$1$1('target', 4);
    	clearContext$1$1();
    	return sub4$2$1(vec1, vec2, target$1$1$1);
    }

    //Magnitude
    function mag$1$1$1(vec) {
    	setContext$1$1$1("mag(vec)", arguments);
    	realArray$1$1("vec");
    	clearContext$1$1();
    	return mag$3$1(vec);
    }

    function mag2$1$1$1(vec) {
    	setContext$1$1$1("mag2(vec)", arguments);
    	realArray$1$1("vec", 2);
    	clearContext$1$1();
    	return mag2$2$1(vec);
    }

    function mag3$1$1$1(vec) {
    	setContext$1$1$1("mag3(vec)", arguments);
    	realArray$1$1("vec", 3);
    	clearContext$1$1();
    	return mag3$2$1(vec);
    }

    function mag4$1$1$1(vec) {
    	setContext$1$1$1("mag4(vec)", arguments);
    	realArray$1$1("vec", 4);
    	clearContext$1$1();
    	return mag4$2$1(vec);
    }

    //Scaling
    function scale$2$1$1(vec, k, target$1$1$1) {
    	setContext$1$1$1("scale(vec, k, ?target)", arguments);
    	realArray$1$1("vec");
    	realNumber$2$1("k");
    	target$1$1('target', vec.length);
    	return scale$1$1$1(vec, k, target$1$1$1);
    }

    function scale2$2$1$1(vec, k, target$1$1$1) {
    	setContext$1$1$1("scale2(vec, k, ?target)", arguments);
    	realArray$1$1("vec", 2);
    	realNumber$2$1("k");
    	target$1$1('target', 2);
    	return scale2$1$1$1(vec, k, target$1$1$1);
    }

    function scale3$2$1$1(vec, k, target$1$1$1) {
    	setContext$1$1$1("scale3(vec, k, ?target)", arguments);
    	realArray$1$1("vec", 3);
    	realNumber$2$1("k");
    	target$1$1('target', 3);
    	return scale3$1$1$1(vec, k, target$1$1$1);
    }

    function scale4$2$1$1(vec, k, target$1$1$1) {
    	setContext$1$1$1("scale4(vec, k, ?target)", arguments);
    	realArray$1$1("vec", 4);
    	realNumber$2$1("k");
    	target$1$1('target', 4);
    	return scale4$1$1$1(vec, k, target$1$1$1);
    }

    function normalize$1$1$1(vec, target$1$1$1) { //'target' intentionally defaults to undefined
    	setContext$1$1$1("normalize(vec, ?target)", arguments);
    	realArray$1$1("vec");
    	target$1$1('target', vec.length);
    	return normalize$2$1(vec, target$1$1$1);
    }

    function normalize2$1$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("normalize2(vec, ?target)", arguments);
    	realArray$1$1("vec", 2);
    	target$1$1('target', 2);
    	return normalize2$3$1(vec, target$1$1$1);
    }

    function normalize3$1$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("normalize3(vec, ?target)", arguments);
    	realArray$1$1("vec", 3);
    	target$1$1('target', 3);
    	return normalize3$2$1(vec, target$1$1$1);
    }

    function normalize4$1$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("normalize4(vec, ?target)", arguments);
    	realArray$1$1("vec", 4);
    	target$1$1('target', 4);
    	return normalize4$2$1(vec, target$1$1$1);
    }

    //Angles & rotations
    function angle$1$1$1(vec1, vec2) {
    	setContext$1$1$1("angle(vec1, vec2)", arguments);
    	realArray$1$1("vec1");
    	realArray$1$1("vec2", vec1.length);
    	return angle$2$1(vec1, vec2);
    }

    function angle2$1$1$1(vec1, vec2) {
    	setContext$1$1$1("angle2(vec1, vec2)", arguments);
    	realArray$1$1("vec1", 2);
    	realArray$1$1("vec2", 2);
    	return angle2$2$1(vec1, vec2);
    }

    function angle3$1$1$1(vec1, vec2) {
    	setContext$1$1$1("angle3(vec1, vec2)", arguments);
    	realArray$1$1("vec1", 3);
    	realArray$1$1("vec2", 3);
    	return angle3$2$1(vec1, vec2);
    }

    function angle4$1$1$1(vec1, vec2) {
    	setContext$1$1$1("angle4(vec1, vec2)", arguments);
    	realArray$1$1("vec1", 4);
    	realArray$1$1("vec2", 4);
    	return angle4$2$1(vec1, vec2);
    }

    //Other component-wise operations
    function fract$3$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("fract(vec, ?target)", arguments);
    	realArray$1$1("vec");
    	target$1$1("target", vec.length);
    	return fract$2$1$1(vec, target$1$1$1);
    }

    function fract2$1$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("fract2(vec, ?target)", arguments);
    	realArray$1$1("vec", 2);
    	target$1$1("target", 2);
    	return fract2$2$1(vec, target$1$1$1);
    }

    function fract3$1$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("fract3(vec, ?target)", arguments);
    	realArray$1$1("vec", 3);
    	target$1$1("target", 3);
    	return fract3$2$1(vec, target$1$1$1);
    }

    function fract4$1$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("fract4(vec, ?target)", arguments);
    	realArray$1$1("vec", 4);
    	target$1$1("target", 4);
    	return fract4$2$1(vec, target$1$1$1);
    }

    function toPolar2$1$1$1(vec, target$1$1$1) {
    	setContext$1$1$1("polar2(vec, ?target)", arguments);
    	realArray$1$1("vec", 2);
    	target$1$1("target", 2);
    	return toPolar2$2$1(vec, target$1$1$1);
    }

    // Freeze exports
    Object.freeze(dot$1$1$1);
    Object.freeze(dot2$1$1$1);
    Object.freeze(dot3$1$1$1);
    Object.freeze(dot4$1$1$1);
    Object.freeze(cross3$1$1$1);
    Object.freeze(add$1$1$1);
    Object.freeze(add2$1$1$1);
    Object.freeze(add3$1$1$1);
    Object.freeze(add4$1$1$1);
    Object.freeze(sub$1$1$1);
    Object.freeze(sub2$1$1$1);
    Object.freeze(sub3$1$1$1);
    Object.freeze(sub4$1$1$1);
    Object.freeze(mag$1$1$1);
    Object.freeze(mag2$1$1$1);
    Object.freeze(mag3$1$1$1);
    Object.freeze(mag4$1$1$1);
    Object.freeze(scale$2$1$1);
    Object.freeze(scale2$2$1$1);
    Object.freeze(scale3$2$1$1);
    Object.freeze(scale4$2$1$1);
    Object.freeze(normalize$1$1$1);
    Object.freeze(normalize2$1$1$1);
    Object.freeze(normalize3$1$1$1);
    Object.freeze(normalize4$1$1$1);
    Object.freeze(angle$1$1$1);
    Object.freeze(angle2$1$1$1);
    Object.freeze(angle3$1$1$1);
    Object.freeze(angle4$1$1$1);
    Object.freeze(fract$3$1$1);
    Object.freeze(fract2$1$1$1);
    Object.freeze(fract3$1$1$1);
    Object.freeze(fract4$1$1$1);
    Object.freeze(toPolar2$1$1$1);

    function dot2$2$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos$1$1(vec1[1] - vec2[1]);
    }

    function mag$2$1$1(vec) {
    	return abs$1$1(vec[0]);
    }

    function scale2$3$1$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = mod$2$1(vec[1], TWO_PI$1$1);
    	return target;
    }

    function normalize2$2$1$1(vec, target = new Float64Array(2)) {
    	if (vec[0] === 0) {
    		return undefined;
    	}
    	target[0] = 1;
    	target[1] = mod$2$1(vec[1], TWO_PI$1$1);
    	return target;
    }

    function toRect2$1$1(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	const theta = vec[1];
    	target[0] = r * cos$1$1(theta);
    	target[1] = r * sin$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(dot2$2$1$1);
    Object.freeze(mag$2$1$1);
    Object.freeze(scale2$3$1$1);
    Object.freeze(normalize2$2$1$1);
    Object.freeze(toRect2$1$1);

    // Current debug context
    let signature$1$1$1$1 = "Unknown";
    let args$1$1$1 = {};

    function setContext$1$1$1$1(s, argArray) {
        //Parse signature
        signature$1$1$1$1 = s;
        const parameters = signature$1$1$1$1
        .split("(")[1]
        .replace(")", "")
        .replace(" ", "")
        .replace("?", "")
        .split(",");
        //Parse arguments
        args$1$1$1 = {};
        for (let i = 0; i < parameters.length; i++) {
            args$1$1$1[params[i]] = argArray[i];
        }
    }

    function clearContext$1$1$1() {
        args$1$1$1 = {};
        signature$1$1$1$1 = "Unknown";
    }

    // Shorter console use
    function log$1$1$1() {
        console.log.apply(console, arguments);
    }

    function warn$1$1$1() {
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
    Object.freeze(log$1$1$1);
    Object.freeze(setContext$1$1$1$1);
    Object.freeze(clearContext$1$1$1);
    Object.freeze(warn$1$1$1);

    const TYPED_ARRAY_CONSTRUCTORS$1$1$1 = [
        Int8Array, Uint8Array, Uint8ClampedArray,
        Int16Array, Uint16Array, Int32Array, Uint32Array,
        Float32Array, Float64Array];

    function realNumber$2$1$1(parameter) {
        const value = args$1$1$1[parameter];
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1$1$1}: ${parameter} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1$1$1}: ${parameter} cannot be NaN or Infinity.`;
        }
    }

    function realArray$1$1$1(parameter, length) {
        const value = args$1$1$1[parameter];
        if (TYPED_ARRAY_CONSTRUCTORS$1$1$1.includes(value.constructor) || Array.isArray(value)) {
            const len = value.length;
            if (len !== length) {
                throw `${signature$1$1$1$1}: ${parameter} has incorrect length`;
            }
            if (len === 0) {
                warn$1$1$1(`${signature$1$1$1$1}: ${parameter} is empty.`);
            }
            for (let i = 0; i < len; i++) {
    			const x = value[i];
                if (value.constructor !== Number) { //Assert type Number
                    throw `${signature$1$1$1$1}: ${parameter} must an array of Numbers.`;
                }
                if (!isFinite(value)) { //Exclude Infinity and NaN
                    throw `${signature$1$1$1$1}: ${parameter} contains NaN or Infinity.`;
                }
            }
        }
        throw `${signature$1$1$1$1}: ${parameter} must be an Array or TypedArray.`;
    }

    function integer$1$1$1(parameter) {
        const value = args$1$1$1[parameter];
        if (!Number.isInteger(value)) {
            throw `${signature$1$1$1$1}: ${parameter} must be an integer of type Number.`;
        }
    }

    function positive$1$1$1(parameter) {
        const value = args$1$1$1[parameter];
        realNumber$2$1$1(parameter);
        if (value <= 0) {
            throw `${signature$1$1$1$1}: ${parameter} must be positive.`;
        }
    }

    function nonNegative$1$1$1(parameter) {
        const value = args$1$1$1[parameter];
        realNumber$2$1$1(parameter);
        if (value < 0) {
            throw `${signature$1$1$1$1}: ${parameter} must be non-negative.`;
        }
    }

    function rectVector$1$1$1(parameter) {
        realArray$1$1$1(parameter);
    }

    function polarVector$1$1$1(parameter) {
        const value = args$1$1$1[parameter];
        realArray$1$1$1(parameter);
        if (value[0] < 0) {
            console.warn(`${signature$1$1$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function bool$2$1$1(parameter) {
        const value = args$1$1$1[parameter];
        if ( (value !== true) && (value !== false) ) {
            throw `${signature$1$1$1$1}: ${parameter} must be a boolean value.`;
        }
    }

    function polarComplex$1$1$1(parameter) {
        const value = args$1$1$1[parameter];
        realArray$1$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
        if (value[0] < 0) {
            console.warn(`${signature$1$1$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function rectComplex$1$1$1(parameter) {
        const value = args$1$1$1[parameter];
        realArray$1$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
    }

    function positiveInteger$1$1$1(parameter) {
        integer$1$1$1(parameter);
        positive$1$1$1(parameter);
    }

    function flatMatrix$1$1$1(parameter, nrows, ncols) {
        realArray$1$1$1(parameter);
        const value = args$1$1$1[parameter];
        if ( (!Number.isInteger(value.nrows)) || (value.nrows < 1) ) {
            throw `${signature$1$1$1$1}: ${parameter}.nrows is invalid`;
        }
        if ((!Number.isInteger(value.ncols)) || (value.ncols < 1)) {
            throw `${signature$1$1$1$1}: ${parameter}.ncols is invalid`;
        }
        if (value.nrows * value.ncols !== value.length) {
            throw `${signature$1$1$1$1}: ${parameter}.length does not match ${parameter}.nrows * ${parameter}.ncols`;
        }
        if ( (value.nrows !== nrows) || (value.ncols !== ncols) ) {
            throw `${signature$1$1$1$1}: ${parameter} has incorrect dimensions`;
        }
    }

    //Freeze exports
    Object.freeze(realNumber$2$1$1);
    Object.freeze(realArray$1$1$1);
    Object.freeze(integer$1$1$1);
    Object.freeze(positive$1$1$1);
    Object.freeze(nonNegative$1$1$1);
    Object.freeze(rectVector$1$1$1);
    Object.freeze(polarVector$1$1$1);
    Object.freeze(bool$2$1$1);
    Object.freeze(polarComplex$1$1$1);
    Object.freeze(rectComplex$1$1$1);
    Object.freeze(flatMatrix$1$1$1);
    Object.freeze(positiveInteger$1$1$1);

    function realOverflow$1$1$1(value) { //Assumes 'value' is a number
        if (value >= MAX_VALUE$1$1$1) {
            warn$1$1$1(`${signature$1$1$1$1}: overflowed Number.MAX_VALUE`);
        }
    }

    function intOverflow$1$1$1(value) { //Assumes 'value' is a number
        if (value > MAX_SAFE_INTEGER$1$1$1) {
            warn$1$1$1(`${signature$1$1$1$1}: overflowed Number.MAX_SAFE_INTEGER`);
        }
    }

    function notDefined$1$1$1(value) {
        if (value === undefined) {
            warn$1$1$1(`${signature$1$1$1$1}: output undefined`);
        }
    }

    //Freeze exports
    Object.freeze(realOverflow$1$1$1);
    Object.freeze(intOverflow$1$1$1);
    Object.freeze(notDefined$1$1$1);

    function sorted$1$1$1(arrLabel, sortedLabel) {
        const arr = args$1$1$1[arrLabel];
        const sorted = args$1$1$1[sortedLabel];
        const len = arr.length;
        if (len === 0) {return;}
        if (sorted === true) {
            sgn = Math.sign(arr[len - 1] - arr[0]);
            for (let i = 1; i < len; i++) {
                const s = Math.sign(arr[i] - arr[i-1]);
                if ( (s !== 0) && (s !== sgn)) {
                    throw `${signature$1$1$1$1}: ${sortedLabel} set to true, but ${arrLabel} unsorted`;
                }
            }
        }
    }

    function realNumber$1$1$1$1(label) {
        const value = args$1$1$1[label];
        if (value === undefined) {return;}
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1$1$1}: If provided, ${label} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1$1$1}: ${label} cannot be NaN or Infinity.`;
        }
    }

    function target$1$1$1(label, length) {
        const value = args$1$1$1[label];
        if (value === undefined) {return;}
        realArray$1$1$1(value);
        if (value.length !== length) {
            throw `${signature$1$1$1$1}: ${label} has incorrect length`
        }
    }

    function bool$1$1$1$1(label) {
        const value = args$1$1$1[label];
        if (value === undefined) {return;}
        if ((value !== true) && (value !== false)) {
            throw `${signature$1$1$1$1}: ${label} must be a boolean`
        }
    }

    Object.freeze(realNumber$1$1$1$1);
    Object.freeze(sorted$1$1$1);
    Object.freeze(target$1$1$1);
    Object.freeze(bool$1$1$1$1);

    //Math constants
    const E$1$1$1 = Math.E;
    const PI$1$1$1 = Math.PI;

    //Number constants
    const MAX_SAFE_INTEGER$1$1$1 = Number.MAX_SAFE_INTEGER;
    const MAX_VALUE$1$1$1 = Number.MAX_VALUE;
    const EPSILON$1$1$1 = Number.EPSILON;

    //Functions
    const abs$1$1$1 = Math.abs;
    const round$1$1$1 = Math.round;
    const trunc$1$1$1 = Math.trunc;
    const ceil$1$1$1 = Math.ceil;
    const floor$1$1$1 = Math.floor;
    const sin$1$1$1 = Math.sin;
    const cos$1$1$1 = Math.cos;
    const acos$1$1$1 = Math.acos;
    const atan2$1$1$1 = Math.atan2;
    const sqrt$1$1$1 = Math.sqrt;
    const hypot$1$1$1 = Math.hypot;
    const pow$1$1$1 = Math.pow;
    const exp$1$1$1 = Math.exp;
    const ln$1$1$1 = Math.log;
    const max$1$1$1 = Math.max;
    const min$1$1$1 = Math.min;
    const random$1$1$1 = Math.random;

    //Constants
    const RAD_TO_DEG$1$1$1 = 180 / PI$1$1$1;
    const DEG_TO_RAD$1$1$1 = 1 / RAD_TO_DEG$1$1$1;
    const TWO_PI$1$1$1 = 2 * PI$1$1$1;

    //Functions
    function lerp$2$1$1(x, y, r) {
    	return x + (y - x) * r;
    }

    function mod$2$1$1(x, m) {
    	return ((x%m)+m)%m;
    }

    function fract$4$1$1(x) {
    	return x - trunc$1$1$1(x);
    }

    function deg$2$1$1(radians) {
    	return radians * RAD_TO_DEG$1$1$1;
    }

    function rad$2$1$1(degrees) {
    	return degrees * DEG_TO_RAD$1$1$1;
    }

    function linmap$2$1$1(x, domain, range) {
    	const r0 = range[0];
    	const d0 = domain[0];
    	return r0 + (range[1] - r0) * (x - d0) / (domain[1] - d0);
    }

    // Freeze function exports
    Object.freeze(lerp$2$1$1);
    Object.freeze(mod$2$1$1);
    Object.freeze(fract$4$1$1);
    Object.freeze(deg$2$1$1);
    Object.freeze(rad$2$1$1);
    Object.freeze(linmap$2$1$1);

    function lerp$1$1$1$1(x, y, r) {
    	setContext("lerp(x, y, r)", arguments);
    	realNumber$2$1$1("x");
    	realNumber$2$1$1("y");
    	realNumber$2$1$1("r");
    	clearContext$1$1$1();
    	return lerp$2$1$1(x, y, r);
    }

    function mod$1$1$1$1(x, m) {
    	setContext("mod(x, m)", arguments);
    	realNumber$2$1$1("x");
    	realNumber$2$1$1("m");
    	clearContext$1$1$1();
    	return mod$2$1$1(x, m);
    }

    function fract$1$1$1$1(x) {
    	setContext("fract(x)", arguments);
    	realNumber$2$1$1("x");
    	clearContext$1$1$1();
    	return fract$4$1$1(x);
    }

    function deg$1$1$1$1(radians) {
    	setContext("deg(radians)", arguments);
    	realNumber$2$1$1("radians");
    	clearContext$1$1$1();
    	return deg$2$1$1(radians);
    }

    function rad$1$1$1$1(degrees) {
    	setContext("rad(degrees)", arguments);
    	realNumber$2$1$1('degrees');
    	clearContext$1$1$1();
    	return rad$2$1$1(degrees);
    }

    function linmap$1$1$1$1(x, domain, range) {
    	setContext("linmap(x, domain, range)", arguments);
    	realNumber$2$1$1("x");
    	realArray$1$1$1('domain');
    	realArray$1$1$1('range');
    	if (domain[0] > domain[1]) {
    		throw "linmap(x, domain, range): invalid domain"
    	}
    	if (range[0] > range[1]) {
    		throw "linmap(x, domain, range): invalid range"
    	}
    	clearContext$1$1$1();
    	return linmap$2$1$1(x, domain, range);
    }

    // Freeze function exports
    Object.freeze(lerp$1$1$1$1);
    Object.freeze(mod$1$1$1$1);
    Object.freeze(fract$1$1$1$1);
    Object.freeze(deg$1$1$1$1);
    Object.freeze(rad$1$1$1$1);
    Object.freeze(linmap$1$1$1$1);

    function computeFactorials$1$1$1(n = 170) { //n > 170 overflows JS's Number type
    	if (n < 0) {return [];}
    	const len = n + 1;
    	const result = new Float64Array(len);
    	result[0] = 1;
    	for (let i = 1; i < len; i++) {
    		result[i] = i * result[i-1];
    	}
    	return result;
    }

    function computeBinomials$1$1$1(n = 30) {
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

    const FACTORIALS$1$1$1 = computeFactorials$1$1$1();
    let BINOM_MAX_CACHED_N$1$1$1;
    let BINOMIALS$1$1$1;

    function precomputeBinomials$1$1$1(n) {
    	BINOM_MAX_CACHED_N$1$1$1 = n;
    	BINOMIALS$1$1$1 = computeBinomials$1$1$1(n);
    }

    precomputeBinomials$1$1$1(30);

    //Combinatorial functions
    function factorial$2$1$1(n) {
    	if (n < 0) {return undefined;}
    	if (n > 170) {return MAX_VALUE$1$1$1;}
    	return FACTORIALS$1$1$1[n];
    }

    function choose$2$1$1(n, r) {
    	if ((r > n)||(n < 0)||(r < 0)) {return 0;} // Quick return 0
    	if (n <= BINOM_MAX_CACHED_N$1$1$1) {return BINOMIALS$1$1$1[0.5 * n * (n + 1) + r];} //Return pre-computed
    	//Not pre-computed
    	const k = min$1$1$1(r, n - r);
    	if (k > 514) {return MAX_VALUE$1$1$1;} //Quick return for known overflow
    	const nMinusK = n - k;
    	let result = 1;
    	let i = 1;
    	while (i <= k) {
    		result *= (nMinusK + i)/(i++);
    	}
    	return result; //Could still have overflown
    }

    function permute$2$1$1(n, r) {
    	if ((r > n) || (n < 0) || (r < 0)) {return 0;}
    	r = n - r;
    	if (r > 170) {return MAX_VALUE$1$1$1;}
    	if (n < 171) {
    		return round$1$1$1(FACTORIALS$1$1$1[n]/FACTORIALS$1$1$1[r]);
    	}
    	let result = 1;
    	if (r < 160) { //Skip multiplication of known values
    		result = round$1$1$1(FACTORIALS$1$1$1[170]/FACTORIALS$1$1$1[r]);
    		r = 170;
    	} 
    	while (r < n) {
    		result *= ++r;
    	}
    	return result;
    }

    //Greatest common divisor
    function gcd$2$1$1(a, b) {
    	//Input & trivial cases
    	a = abs$1$1$1(a);
    	b = abs$1$1$1(b);
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
    function lcm$2$1$1(a, b) {
    	if ((a === 0)||(b === 0)) {return 0;}
    	return abs$1$1$1((a / gcd$2$1$1(a, b)) * b);
    }

    //Modular exponentiation
    function mpow$2$1$1(base, exp, m) {
    	//base = abs(base);
    	exp = abs$1$1$1(exp);
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
    Object.freeze(computeFactorials$1$1$1);
    Object.freeze(computeBinomials$1$1$1);
    Object.freeze(precomputeBinomials$1$1$1);
    Object.freeze(factorial$2$1$1);
    Object.freeze(choose$2$1$1);
    Object.freeze(permute$2$1$1);
    Object.freeze(gcd$2$1$1);
    Object.freeze(lcm$2$1$1);
    Object.freeze(mpow$2$1$1);

    function factorial$1$1$1$1(n) {
    	setContext$1$1$1$1("factorial(n)", arguments);
    	integer$1$1$1("n");
    	nonNegative$1$1$1("n");
    	const result = factorial$2$1$1(n);
    	realOverflow$1$1$1(result);
    	intOverflow$1$1$1(result);
    	clearContext$1$1$1();
    	return result;
    }

    function choose$1$1$1$1(n, r) {
    	setContext$1$1$1$1("choose(n, r)", arguments);
    	integer$1$1$1("n");
    	integer$1$1$1("r");
    	const result = choose$2$1$1(n, r);
    	realOverflow$1$1$1(result);
    	intOverflow$1$1$1(result);
    	clearContext$1$1$1();
    	return result;
    }

    function permute$1$1$1$1(n, r) {
    	setContext$1$1$1$1("permute(n, r)", arguments);
    	integer$1$1$1("n");
    	integer$1$1$1("r");
    	const result = permute$2$1$1(n, r);
    	realOverflow$1$1$1(result);
    	intOverflow$1$1$1(result);
    	clearContext$1$1$1();
    	return result;
    }

    function gcd$1$1$1$1(a, b) {
    	setContext$1$1$1$1("gcd(a, b)", arguments);
    	integer$1$1$1("a");
    	integer$1$1$1("b");
    	clearContext$1$1$1();
    	return gcd$2$1$1(a, b);
    }

    function lcm$1$1$1$1(a, b) {
    	setContext$1$1$1$1("lcm(a, b)", arguments);
    	integer$1$1$1("a");
    	integer$1$1$1("b");
    	clearContext$1$1$1();
    	return lcm$2$1$1(a, b);
    }

    function mpow$1$1$1$1(base, exp, m) {
    	setContext$1$1$1$1("mpow(base, exp, m)", arguments);
    	integer$1$1$1("base");
    	integer$1$1$1("exp");
    	nonNegative$1$1$1("exp");
    	integer$1$1$1("m");
    	clearContext$1$1$1();
    	return mpow$2$1$1(base, exp, m);
    }

    // Freeze exports
    Object.freeze(factorial$1$1$1$1);
    Object.freeze(choose$1$1$1$1);
    Object.freeze(permute$1$1$1$1);
    Object.freeze(gcd$1$1$1$1);
    Object.freeze(lcm$1$1$1$1);
    Object.freeze(mpow$1$1$1$1);

    //Dot product
    function dot$2$1$1(vec1, vec2) {
    	let result = 0;
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		result += vec1[i] * vec2[i];
    	}
    	return result;
    }

    function dot2$3$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function dot3$2$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }

    function dot4$2$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
    }

    //Cross product
    function cross3$2$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    	return target;
    }

    //Addition
    function add$2$1$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] + vec2[i];
    	}
    	return target;
    }

    function add2$2$1$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	return target;
    }

    function add3$2$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	return target;
    }

    function add4$2$1$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	target[3] = vec1[3] + vec2[3];
    	return target;
    }

    //Subtraction
    function sub$2$1$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] - vec2[i];
    	}
    	return target;
    }

    function sub2$2$1$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	return target;
    }

    function sub3$2$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	return target;
    }

    function sub4$2$1$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	target[3] = vec1[3] - vec2[3];
    	return target;
    }

    //Magnitude
    function mag$3$1$1(vec) {
    	return hypot$1$1$1(...vec);
    }

    function mag2$2$1$1(vec) {
    	return hypot$1$1$1(vec[0], vec[1]);
    }

    function mag3$2$1$1(vec) {
    	return hypot$1$1$1(vec[0], vec[1], vec[2]);
    }

    function mag4$2$1$1(vec) {
    	return hypot$1$1$1(vec[0], vec[1], vec[2], vec[3]);
    }

    //Scaling
    function scale$1$1$1$1(vec, k, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec[i] * k;
    	}
    	return target;
    }

    function scale2$1$1$1$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	return target;
    }

    function scale3$1$1$1$1(vec, k, target = new Float64Array(3)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	return target;
    }

    function scale4$1$1$1$1(vec, k, target = new Float64Array(4)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	target[3] = vec[3] * k;
    	return target;
    }

    function normalize$2$1$1(vec, target) { //'target' intentionally defaults to undefined
    	return scale$1$1$1$1(vec, 1 / mag$3$1$1(vec), target);
    }

    function normalize2$3$1$1(vec, target) {
    	return scale2$1$1$1$1(vec, 1 / mag2$2$1$1(vec), target);
    }

    function normalize3$2$1$1(vec, target) {
    	return scale3$1$1$1$1(vec, 1 / mag3$2$1$1(vec), target);
    }

    function normalize4$2$1$1(vec, target) {
    	return scale4$1$1$1$1(vec, 1 / mag4$2$1$1(vec), target);
    }

    //Angles & rotations
    function angle$2$1$1(vec1, vec2) {
    	return acos$1$1$1(dot$2$1$1(vec1, vec2) / (mag$3$1$1(vec1) * mag$3$1$1(vec2)));
    }

    function angle2$2$1$1(vec1, vec2) {
    	return acos$1$1$1(dot2$3$1$1(vec1, vec2) / (mag2$2$1$1(vec1) * mag2$2$1$1(vec2)));
    }

    function angle3$2$1$1(vec1, vec2) {
    	return acos$1$1$1(dot3$2$1$1(vec1, vec2) / (mag3$2$1$1(vec1) * mag3$2$1$1(vec2)));
    }

    function angle4$2$1$1(vec1, vec2) {
    	return acos$1$1$1(dot4$2$1$1(vec1, vec2) / (mag4$2$1$1(vec1) * mag4$2$1$1(vec2)));
    }

    //Other component-wise operations
    function fract$2$1$1$1(vec, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = fract$4$1$1(vec[i]);
    	}
    	return target;
    }

    function fract2$2$1$1(vec, target = new Float64Array(2)) {
    	target[0] = fract$4$1$1(vec[0]);
    	target[1] = fract$4$1$1(vec[1]);
    	return target;
    }

    function fract3$2$1$1(vec, target = new Float64Array(3)) {
    	target[0] = fract$4$1$1(vec[0]);
    	target[1] = fract$4$1$1(vec[1]);
    	target[2] = fract$4$1$1(vec[2]);
    	return target;
    }

    function fract4$2$1$1(vec, target = new Float64Array(4)) {
    	target[0] = fract$4$1$1(vec[0]);
    	target[1] = fract$4$1$1(vec[1]);
    	target[2] = fract$4$1$1(vec[2]);
    	target[3] = fract$4$1$1(vec[3]);
    	return target;
    }

    function toPolar2$2$1$1(vec, target = new Float64Array(2)) {
    	target[0] = mag2$2$1$1(vec);
    	target[1] = atan2$1$1$1(vec[1], vec[0]) + PI$1$1$1;
    	return target;
    }

    // Freeze exports
    Object.freeze(dot$2$1$1);
    Object.freeze(dot2$3$1$1);
    Object.freeze(dot3$2$1$1);
    Object.freeze(dot4$2$1$1);
    Object.freeze(cross3$2$1$1);
    Object.freeze(add$2$1$1);
    Object.freeze(add2$2$1$1);
    Object.freeze(add3$2$1$1);
    Object.freeze(add4$2$1$1);
    Object.freeze(sub$2$1$1);
    Object.freeze(sub2$2$1$1);
    Object.freeze(sub3$2$1$1);
    Object.freeze(sub4$2$1$1);
    Object.freeze(mag$3$1$1);
    Object.freeze(mag2$2$1$1);
    Object.freeze(mag3$2$1$1);
    Object.freeze(mag4$2$1$1);
    Object.freeze(scale$1$1$1$1);
    Object.freeze(scale2$1$1$1$1);
    Object.freeze(scale3$1$1$1$1);
    Object.freeze(scale4$1$1$1$1);
    Object.freeze(normalize$2$1$1);
    Object.freeze(normalize2$3$1$1);
    Object.freeze(normalize3$2$1$1);
    Object.freeze(normalize4$2$1$1);
    Object.freeze(angle$2$1$1);
    Object.freeze(angle2$2$1$1);
    Object.freeze(angle3$2$1$1);
    Object.freeze(angle4$2$1$1);
    Object.freeze(fract$2$1$1$1);
    Object.freeze(fract2$2$1$1);
    Object.freeze(fract3$2$1$1);
    Object.freeze(fract4$2$1$1);
    Object.freeze(toPolar2$2$1$1);

    //Dot product
    function dot$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("dot(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1");
    	realArray$1$1$1("vec2", vec1.length);
    	clearContext$1$1$1();
    	return dot$2$1$1(vec1, vec2);
    }

    function dot2$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("dot2(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1", 2);
    	realArray$1$1$1("vec2", 2);
    	clearContext$1$1$1();
    	return dot2$3$1$1(vec1, vec2);
    }

    function dot3$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("dot3(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1", 3);
    	realArray$1$1$1("vec2", 3);
    	clearContext$1$1$1();
    	return dot3$2$1$1(vec1, vec2);
    }

    function dot4$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("dot4(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1", 4);
    	realArray$1$1$1("vec2", 4);
    	clearContext$1$1$1();
    	return dot4$2$1$1(vec1, vec2);
    }

    //Cross product
    function cross3$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("cross3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 3);
    	realArray$1$1$1("vec2", 3);
    	target$1$1$1('target', 3);
    	clearContext$1$1$1();
    	return cross3$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    //Addition
    function add$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("add(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1");
    	realArray$1$1$1("vec2", vec1.length);
    	target$1$1$1('target', vec1.length);
    	clearContext$1$1$1();
    	return add$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    function add2$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("add2(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 2);
    	realArray$1$1$1("vec2", 2);
    	target$1$1$1('target', 2);
    	clearContext$1$1$1();
    	return add2$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    function add3$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("add3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 3);
    	realArray$1$1$1("vec2", 3);
    	target$1$1$1('target', 3);
    	clearContext$1$1$1();
    	return add3$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    function add4$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("add4(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 4);
    	realArray$1$1$1("vec2", 4);
    	target$1$1$1('target', 4);
    	clearContext$1$1$1();
    	return add4$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    //Subtraction
    function sub$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("sub(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 2);
    	realArray$1$1$1("vec2", vec1.length);
    	target$1$1$1('target', vec1.length);
    	clearContext$1$1$1();
    	return sub$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    function sub2$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("sub2(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 2);
    	realArray$1$1$1("vec2", 2);
    	target$1$1$1('target', 2);
    	clearContext$1$1$1();
    	return sub2$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    function sub3$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("sub3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 3);
    	realArray$1$1$1("vec2", 3);
    	target$1$1$1('target', 3);
    	clearContext$1$1$1();
    	return sub3$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    function sub4$1$1$1$1(vec1, vec2, target$1$1$1$1) {
    	setContext$1$1$1$1("sub4(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1("vec1", 4);
    	realArray$1$1$1("vec2", 4);
    	target$1$1$1('target', 4);
    	clearContext$1$1$1();
    	return sub4$2$1$1(vec1, vec2, target$1$1$1$1);
    }

    //Magnitude
    function mag$1$1$1$1(vec) {
    	setContext$1$1$1$1("mag(vec)", arguments);
    	realArray$1$1$1("vec");
    	clearContext$1$1$1();
    	return mag$3$1$1(vec);
    }

    function mag2$1$1$1$1(vec) {
    	setContext$1$1$1$1("mag2(vec)", arguments);
    	realArray$1$1$1("vec", 2);
    	clearContext$1$1$1();
    	return mag2$2$1$1(vec);
    }

    function mag3$1$1$1$1(vec) {
    	setContext$1$1$1$1("mag3(vec)", arguments);
    	realArray$1$1$1("vec", 3);
    	clearContext$1$1$1();
    	return mag3$2$1$1(vec);
    }

    function mag4$1$1$1$1(vec) {
    	setContext$1$1$1$1("mag4(vec)", arguments);
    	realArray$1$1$1("vec", 4);
    	clearContext$1$1$1();
    	return mag4$2$1$1(vec);
    }

    //Scaling
    function scale$2$1$1$1(vec, k, target$1$1$1$1) {
    	setContext$1$1$1$1("scale(vec, k, ?target)", arguments);
    	realArray$1$1$1("vec");
    	realNumber$2$1$1("k");
    	target$1$1$1('target', vec.length);
    	return scale$1$1$1$1(vec, k, target$1$1$1$1);
    }

    function scale2$2$1$1$1(vec, k, target$1$1$1$1) {
    	setContext$1$1$1$1("scale2(vec, k, ?target)", arguments);
    	realArray$1$1$1("vec", 2);
    	realNumber$2$1$1("k");
    	target$1$1$1('target', 2);
    	return scale2$1$1$1$1(vec, k, target$1$1$1$1);
    }

    function scale3$2$1$1$1(vec, k, target$1$1$1$1) {
    	setContext$1$1$1$1("scale3(vec, k, ?target)", arguments);
    	realArray$1$1$1("vec", 3);
    	realNumber$2$1$1("k");
    	target$1$1$1('target', 3);
    	return scale3$1$1$1$1(vec, k, target$1$1$1$1);
    }

    function scale4$2$1$1$1(vec, k, target$1$1$1$1) {
    	setContext$1$1$1$1("scale4(vec, k, ?target)", arguments);
    	realArray$1$1$1("vec", 4);
    	realNumber$2$1$1("k");
    	target$1$1$1('target', 4);
    	return scale4$1$1$1$1(vec, k, target$1$1$1$1);
    }

    function normalize$1$1$1$1(vec, target$1$1$1$1) { //'target' intentionally defaults to undefined
    	setContext$1$1$1$1("normalize(vec, ?target)", arguments);
    	realArray$1$1$1("vec");
    	target$1$1$1('target', vec.length);
    	return normalize$2$1$1(vec, target$1$1$1$1);
    }

    function normalize2$1$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("normalize2(vec, ?target)", arguments);
    	realArray$1$1$1("vec", 2);
    	target$1$1$1('target', 2);
    	return normalize2$3$1$1(vec, target$1$1$1$1);
    }

    function normalize3$1$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("normalize3(vec, ?target)", arguments);
    	realArray$1$1$1("vec", 3);
    	target$1$1$1('target', 3);
    	return normalize3$2$1$1(vec, target$1$1$1$1);
    }

    function normalize4$1$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("normalize4(vec, ?target)", arguments);
    	realArray$1$1$1("vec", 4);
    	target$1$1$1('target', 4);
    	return normalize4$2$1$1(vec, target$1$1$1$1);
    }

    //Angles & rotations
    function angle$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("angle(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1");
    	realArray$1$1$1("vec2", vec1.length);
    	return angle$2$1$1(vec1, vec2);
    }

    function angle2$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("angle2(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1", 2);
    	realArray$1$1$1("vec2", 2);
    	return angle2$2$1$1(vec1, vec2);
    }

    function angle3$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("angle3(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1", 3);
    	realArray$1$1$1("vec2", 3);
    	return angle3$2$1$1(vec1, vec2);
    }

    function angle4$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1("angle4(vec1, vec2)", arguments);
    	realArray$1$1$1("vec1", 4);
    	realArray$1$1$1("vec2", 4);
    	return angle4$2$1$1(vec1, vec2);
    }

    //Other component-wise operations
    function fract$3$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("fract(vec, ?target)", arguments);
    	realArray$1$1$1("vec");
    	target$1$1$1("target", vec.length);
    	return fract$2$1$1$1(vec, target$1$1$1$1);
    }

    function fract2$1$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("fract2(vec, ?target)", arguments);
    	realArray$1$1$1("vec", 2);
    	target$1$1$1("target", 2);
    	return fract2$2$1$1(vec, target$1$1$1$1);
    }

    function fract3$1$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("fract3(vec, ?target)", arguments);
    	realArray$1$1$1("vec", 3);
    	target$1$1$1("target", 3);
    	return fract3$2$1$1(vec, target$1$1$1$1);
    }

    function fract4$1$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("fract4(vec, ?target)", arguments);
    	realArray$1$1$1("vec", 4);
    	target$1$1$1("target", 4);
    	return fract4$2$1$1(vec, target$1$1$1$1);
    }

    function toPolar2$1$1$1$1(vec, target$1$1$1$1) {
    	setContext$1$1$1$1("polar2(vec, ?target)", arguments);
    	realArray$1$1$1("vec", 2);
    	target$1$1$1("target", 2);
    	return toPolar2$2$1$1(vec, target$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(dot$1$1$1$1);
    Object.freeze(dot2$1$1$1$1);
    Object.freeze(dot3$1$1$1$1);
    Object.freeze(dot4$1$1$1$1);
    Object.freeze(cross3$1$1$1$1);
    Object.freeze(add$1$1$1$1);
    Object.freeze(add2$1$1$1$1);
    Object.freeze(add3$1$1$1$1);
    Object.freeze(add4$1$1$1$1);
    Object.freeze(sub$1$1$1$1);
    Object.freeze(sub2$1$1$1$1);
    Object.freeze(sub3$1$1$1$1);
    Object.freeze(sub4$1$1$1$1);
    Object.freeze(mag$1$1$1$1);
    Object.freeze(mag2$1$1$1$1);
    Object.freeze(mag3$1$1$1$1);
    Object.freeze(mag4$1$1$1$1);
    Object.freeze(scale$2$1$1$1);
    Object.freeze(scale2$2$1$1$1);
    Object.freeze(scale3$2$1$1$1);
    Object.freeze(scale4$2$1$1$1);
    Object.freeze(normalize$1$1$1$1);
    Object.freeze(normalize2$1$1$1$1);
    Object.freeze(normalize3$1$1$1$1);
    Object.freeze(normalize4$1$1$1$1);
    Object.freeze(angle$1$1$1$1);
    Object.freeze(angle2$1$1$1$1);
    Object.freeze(angle3$1$1$1$1);
    Object.freeze(angle4$1$1$1$1);
    Object.freeze(fract$3$1$1$1);
    Object.freeze(fract2$1$1$1$1);
    Object.freeze(fract3$1$1$1$1);
    Object.freeze(fract4$1$1$1$1);
    Object.freeze(toPolar2$1$1$1$1);

    function dot2$2$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos$1$1$1(vec1[1] - vec2[1]);
    }

    function mag$2$1$1$1(vec) {
    	return abs$1$1$1(vec[0]);
    }

    function scale2$3$1$1$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = mod$2$1$1(vec[1], TWO_PI$1$1$1);
    	return target;
    }

    function normalize2$2$1$1$1(vec, target = new Float64Array(2)) {
    	if (vec[0] === 0) {
    		return undefined;
    	}
    	target[0] = 1;
    	target[1] = mod$2$1$1(vec[1], TWO_PI$1$1$1);
    	return target;
    }

    function toRect2$1$1$1(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	const theta = vec[1];
    	target[0] = r * cos$1$1$1(theta);
    	target[1] = r * sin$1$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(dot2$2$1$1$1);
    Object.freeze(mag$2$1$1$1);
    Object.freeze(scale2$3$1$1$1);
    Object.freeze(normalize2$2$1$1$1);
    Object.freeze(toRect2$1$1$1);

    // Current debug context
    let signature$2 = "Unknown";
    let args$1$1$1$1 = {};

    function setContext$1$1$1$1$1(s, argArray) {
        //Parse signature
        signature$2 = s;
        const parameters = signature$2
        .split("(")[1]
        .replace(")", "")
        .replace(" ", "")
        .replace("?", "")
        .split(",");
        //Parse arguments
        args$1$1$1$1 = {};
        for (let i = 0; i < parameters.length; i++) {
            args$1$1$1$1[params[i]] = argArray[i];
        }
    }

    function clearContext$1$1$1$1() {
        args$1$1$1$1 = {};
        signature$2 = "Unknown";
    }

    // Shorter console use
    function log$1$1$1$1() {
        console.log.apply(console, arguments);
    }

    function warn$1$1$1$1() {
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
    Object.freeze(log$1$1$1$1);
    Object.freeze(setContext$1$1$1$1$1);
    Object.freeze(clearContext$1$1$1$1);
    Object.freeze(warn$1$1$1$1);

    const TYPED_ARRAY_CONSTRUCTORS$1$1$1$1 = [
        Int8Array, Uint8Array, Uint8ClampedArray,
        Int16Array, Uint16Array, Int32Array, Uint32Array,
        Float32Array, Float64Array];

    function realNumber$2$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$2}: ${parameter} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$2}: ${parameter} cannot be NaN or Infinity.`;
        }
    }

    function realArray$1$1$1$1(parameter, length) {
        const value = args$1$1$1$1[parameter];
        if (TYPED_ARRAY_CONSTRUCTORS$1$1$1$1.includes(value.constructor) || Array.isArray(value)) {
            const len = value.length;
            if (len !== length) {
                throw `${signature$2}: ${parameter} has incorrect length`;
            }
            if (len === 0) {
                warn$1$1$1$1(`${signature$2}: ${parameter} is empty.`);
            }
            for (let i = 0; i < len; i++) {
    			const x = value[i];
                if (value.constructor !== Number) { //Assert type Number
                    throw `${signature$2}: ${parameter} must an array of Numbers.`;
                }
                if (!isFinite(value)) { //Exclude Infinity and NaN
                    throw `${signature$2}: ${parameter} contains NaN or Infinity.`;
                }
            }
        }
        throw `${signature$2}: ${parameter} must be an Array or TypedArray.`;
    }

    function integer$1$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        if (!Number.isInteger(value)) {
            throw `${signature$2}: ${parameter} must be an integer of type Number.`;
        }
    }

    function positive$1$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        realNumber$2$1$1$1(parameter);
        if (value <= 0) {
            throw `${signature$2}: ${parameter} must be positive.`;
        }
    }

    function nonNegative$1$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        realNumber$2$1$1$1(parameter);
        if (value < 0) {
            throw `${signature$2}: ${parameter} must be non-negative.`;
        }
    }

    function rectVector$1$1$1$1(parameter) {
        realArray$1$1$1$1(parameter);
    }

    function polarVector$1$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        realArray$1$1$1$1(parameter);
        if (value[0] < 0) {
            console.warn(`${signature$2}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function bool$2$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        if ( (value !== true) && (value !== false) ) {
            throw `${signature$2}: ${parameter} must be a boolean value.`;
        }
    }

    function polarComplex$1$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        realArray$1$1$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$2}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$2}: ${parameter} contains additional values which will be ignored.`);
        }
        if (value[0] < 0) {
            console.warn(`${signature$2}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function rectComplex$1$1$1$1(parameter) {
        const value = args$1$1$1$1[parameter];
        realArray$1$1$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$2}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$2}: ${parameter} contains additional values which will be ignored.`);
        }
    }

    function positiveInteger$1$1$1$1(parameter) {
        integer$1$1$1$1(parameter);
        positive$1$1$1$1(parameter);
    }

    function flatMatrix$1$1$1$1(parameter, nrows, ncols) {
        realArray$1$1$1$1(parameter);
        const value = args$1$1$1$1[parameter];
        if ( (!Number.isInteger(value.nrows)) || (value.nrows < 1) ) {
            throw `${signature$2}: ${parameter}.nrows is invalid`;
        }
        if ((!Number.isInteger(value.ncols)) || (value.ncols < 1)) {
            throw `${signature$2}: ${parameter}.ncols is invalid`;
        }
        if (value.nrows * value.ncols !== value.length) {
            throw `${signature$2}: ${parameter}.length does not match ${parameter}.nrows * ${parameter}.ncols`;
        }
        if ( (value.nrows !== nrows) || (value.ncols !== ncols) ) {
            throw `${signature$2}: ${parameter} has incorrect dimensions`;
        }
    }

    //Freeze exports
    Object.freeze(realNumber$2$1$1$1);
    Object.freeze(realArray$1$1$1$1);
    Object.freeze(integer$1$1$1$1);
    Object.freeze(positive$1$1$1$1);
    Object.freeze(nonNegative$1$1$1$1);
    Object.freeze(rectVector$1$1$1$1);
    Object.freeze(polarVector$1$1$1$1);
    Object.freeze(bool$2$1$1$1);
    Object.freeze(polarComplex$1$1$1$1);
    Object.freeze(rectComplex$1$1$1$1);
    Object.freeze(flatMatrix$1$1$1$1);
    Object.freeze(positiveInteger$1$1$1$1);

    function realOverflow$1$1$1$1(value) { //Assumes 'value' is a number
        if (value >= MAX_VALUE$1$1$1$1) {
            warn$1$1$1$1(`${signature$2}: overflowed Number.MAX_VALUE`);
        }
    }

    function intOverflow$1$1$1$1(value) { //Assumes 'value' is a number
        if (value > MAX_SAFE_INTEGER$1$1$1$1) {
            warn$1$1$1$1(`${signature$2}: overflowed Number.MAX_SAFE_INTEGER`);
        }
    }

    function notDefined$1$1$1$1(value) {
        if (value === undefined) {
            warn$1$1$1$1(`${signature$2}: output undefined`);
        }
    }

    //Freeze exports
    Object.freeze(realOverflow$1$1$1$1);
    Object.freeze(intOverflow$1$1$1$1);
    Object.freeze(notDefined$1$1$1$1);

    function sorted$1$1$1$1(arrLabel, sortedLabel) {
        const arr = args$1$1$1$1[arrLabel];
        const sorted = args$1$1$1$1[sortedLabel];
        const len = arr.length;
        if (len === 0) {return;}
        if (sorted === true) {
            sgn = Math.sign(arr[len - 1] - arr[0]);
            for (let i = 1; i < len; i++) {
                const s = Math.sign(arr[i] - arr[i-1]);
                if ( (s !== 0) && (s !== sgn)) {
                    throw `${signature$2}: ${sortedLabel} set to true, but ${arrLabel} unsorted`;
                }
            }
        }
    }

    function realNumber$1$1$1$1$1(label) {
        const value = args$1$1$1$1[label];
        if (value === undefined) {return;}
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$2}: If provided, ${label} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$2}: ${label} cannot be NaN or Infinity.`;
        }
    }

    function target$1$1$1$1(label, length) {
        const value = args$1$1$1$1[label];
        if (value === undefined) {return;}
        realArray$1$1$1$1(value);
        if (value.length !== length) {
            throw `${signature$2}: ${label} has incorrect length`
        }
    }

    function bool$1$1$1$1$1(label) {
        const value = args$1$1$1$1[label];
        if (value === undefined) {return;}
        if ((value !== true) && (value !== false)) {
            throw `${signature$2}: ${label} must be a boolean`
        }
    }

    Object.freeze(realNumber$1$1$1$1$1);
    Object.freeze(sorted$1$1$1$1);
    Object.freeze(target$1$1$1$1);
    Object.freeze(bool$1$1$1$1$1);

    //Math constants
    const E$1$1$1$1 = Math.E;
    const PI$1$1$1$1 = Math.PI;

    //Number constants
    const MAX_SAFE_INTEGER$1$1$1$1 = Number.MAX_SAFE_INTEGER;
    const MAX_VALUE$1$1$1$1 = Number.MAX_VALUE;
    const EPSILON$1$1$1$1 = Number.EPSILON;

    //Functions
    const abs$1$1$1$1 = Math.abs;
    const round$1$1$1$1 = Math.round;
    const trunc$1$1$1$1 = Math.trunc;
    const ceil$1$1$1$1 = Math.ceil;
    const floor$1$1$1$1 = Math.floor;
    const sin$1$1$1$1 = Math.sin;
    const cos$1$1$1$1 = Math.cos;
    const acos$1$1$1$1 = Math.acos;
    const atan2$1$1$1$1 = Math.atan2;
    const sqrt$1$1$1$1 = Math.sqrt;
    const hypot$1$1$1$1 = Math.hypot;
    const pow$1$1$1$1 = Math.pow;
    const exp$1$1$1$1 = Math.exp;
    const ln$1$1$1$1 = Math.log;
    const max$1$1$1$1 = Math.max;
    const min$1$1$1$1 = Math.min;
    const random$1$1$1$1 = Math.random;

    //Constants
    const RAD_TO_DEG$1$1$1$1 = 180 / PI$1$1$1$1;
    const DEG_TO_RAD$1$1$1$1 = 1 / RAD_TO_DEG$1$1$1$1;
    const TWO_PI$1$1$1$1 = 2 * PI$1$1$1$1;

    //Functions
    function lerp$2$1$1$1(x, y, r) {
    	return x + (y - x) * r;
    }

    function mod$2$1$1$1(x, m) {
    	return ((x%m)+m)%m;
    }

    function fract$4$1$1$1(x) {
    	return x - trunc$1$1$1$1(x);
    }

    function deg$2$1$1$1(radians) {
    	return radians * RAD_TO_DEG$1$1$1$1;
    }

    function rad$2$1$1$1(degrees) {
    	return degrees * DEG_TO_RAD$1$1$1$1;
    }

    function linmap$2$1$1$1(x, domain, range) {
    	const r0 = range[0];
    	const d0 = domain[0];
    	return r0 + (range[1] - r0) * (x - d0) / (domain[1] - d0);
    }

    // Freeze function exports
    Object.freeze(lerp$2$1$1$1);
    Object.freeze(mod$2$1$1$1);
    Object.freeze(fract$4$1$1$1);
    Object.freeze(deg$2$1$1$1);
    Object.freeze(rad$2$1$1$1);
    Object.freeze(linmap$2$1$1$1);

    function lerp$1$1$1$1$1(x, y, r) {
    	setContext("lerp(x, y, r)", arguments);
    	realNumber$2$1$1$1("x");
    	realNumber$2$1$1$1("y");
    	realNumber$2$1$1$1("r");
    	clearContext$1$1$1$1();
    	return lerp$2$1$1$1(x, y, r);
    }

    function mod$1$1$1$1$1(x, m) {
    	setContext("mod(x, m)", arguments);
    	realNumber$2$1$1$1("x");
    	realNumber$2$1$1$1("m");
    	clearContext$1$1$1$1();
    	return mod$2$1$1$1(x, m);
    }

    function fract$1$1$1$1$1(x) {
    	setContext("fract(x)", arguments);
    	realNumber$2$1$1$1("x");
    	clearContext$1$1$1$1();
    	return fract$4$1$1$1(x);
    }

    function deg$1$1$1$1$1(radians) {
    	setContext("deg(radians)", arguments);
    	realNumber$2$1$1$1("radians");
    	clearContext$1$1$1$1();
    	return deg$2$1$1$1(radians);
    }

    function rad$1$1$1$1$1(degrees) {
    	setContext("rad(degrees)", arguments);
    	realNumber$2$1$1$1('degrees');
    	clearContext$1$1$1$1();
    	return rad$2$1$1$1(degrees);
    }

    function linmap$1$1$1$1$1(x, domain, range) {
    	setContext("linmap(x, domain, range)", arguments);
    	realNumber$2$1$1$1("x");
    	realArray$1$1$1$1('domain');
    	realArray$1$1$1$1('range');
    	if (domain[0] > domain[1]) {
    		throw "linmap(x, domain, range): invalid domain"
    	}
    	if (range[0] > range[1]) {
    		throw "linmap(x, domain, range): invalid range"
    	}
    	clearContext$1$1$1$1();
    	return linmap$2$1$1$1(x, domain, range);
    }

    // Freeze function exports
    Object.freeze(lerp$1$1$1$1$1);
    Object.freeze(mod$1$1$1$1$1);
    Object.freeze(fract$1$1$1$1$1);
    Object.freeze(deg$1$1$1$1$1);
    Object.freeze(rad$1$1$1$1$1);
    Object.freeze(linmap$1$1$1$1$1);

    function computeFactorials$1$1$1$1(n = 170) { //n > 170 overflows JS's Number type
    	if (n < 0) {return [];}
    	const len = n + 1;
    	const result = new Float64Array(len);
    	result[0] = 1;
    	for (let i = 1; i < len; i++) {
    		result[i] = i * result[i-1];
    	}
    	return result;
    }

    function computeBinomials$1$1$1$1(n = 30) {
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

    const FACTORIALS$1$1$1$1 = computeFactorials$1$1$1$1();
    let BINOM_MAX_CACHED_N$1$1$1$1;
    let BINOMIALS$1$1$1$1;

    function precomputeBinomials$1$1$1$1(n) {
    	BINOM_MAX_CACHED_N$1$1$1$1 = n;
    	BINOMIALS$1$1$1$1 = computeBinomials$1$1$1$1(n);
    }

    precomputeBinomials$1$1$1$1(30);

    //Combinatorial functions
    function factorial$2$1$1$1(n) {
    	if (n < 0) {return undefined;}
    	if (n > 170) {return MAX_VALUE$1$1$1$1;}
    	return FACTORIALS$1$1$1$1[n];
    }

    function choose$2$1$1$1(n, r) {
    	if ((r > n)||(n < 0)||(r < 0)) {return 0;} // Quick return 0
    	if (n <= BINOM_MAX_CACHED_N$1$1$1$1) {return BINOMIALS$1$1$1$1[0.5 * n * (n + 1) + r];} //Return pre-computed
    	//Not pre-computed
    	const k = min$1$1$1$1(r, n - r);
    	if (k > 514) {return MAX_VALUE$1$1$1$1;} //Quick return for known overflow
    	const nMinusK = n - k;
    	let result = 1;
    	let i = 1;
    	while (i <= k) {
    		result *= (nMinusK + i)/(i++);
    	}
    	return result; //Could still have overflown
    }

    function permute$2$1$1$1(n, r) {
    	if ((r > n) || (n < 0) || (r < 0)) {return 0;}
    	r = n - r;
    	if (r > 170) {return MAX_VALUE$1$1$1$1;}
    	if (n < 171) {
    		return round$1$1$1$1(FACTORIALS$1$1$1$1[n]/FACTORIALS$1$1$1$1[r]);
    	}
    	let result = 1;
    	if (r < 160) { //Skip multiplication of known values
    		result = round$1$1$1$1(FACTORIALS$1$1$1$1[170]/FACTORIALS$1$1$1$1[r]);
    		r = 170;
    	} 
    	while (r < n) {
    		result *= ++r;
    	}
    	return result;
    }

    //Greatest common divisor
    function gcd$2$1$1$1(a, b) {
    	//Input & trivial cases
    	a = abs$1$1$1$1(a);
    	b = abs$1$1$1$1(b);
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
    function lcm$2$1$1$1(a, b) {
    	if ((a === 0)||(b === 0)) {return 0;}
    	return abs$1$1$1$1((a / gcd$2$1$1$1(a, b)) * b);
    }

    //Modular exponentiation
    function mpow$2$1$1$1(base, exp, m) {
    	//base = abs(base);
    	exp = abs$1$1$1$1(exp);
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
    Object.freeze(computeFactorials$1$1$1$1);
    Object.freeze(computeBinomials$1$1$1$1);
    Object.freeze(precomputeBinomials$1$1$1$1);
    Object.freeze(factorial$2$1$1$1);
    Object.freeze(choose$2$1$1$1);
    Object.freeze(permute$2$1$1$1);
    Object.freeze(gcd$2$1$1$1);
    Object.freeze(lcm$2$1$1$1);
    Object.freeze(mpow$2$1$1$1);

    function factorial$1$1$1$1$1(n) {
    	setContext$1$1$1$1$1("factorial(n)", arguments);
    	integer$1$1$1$1("n");
    	nonNegative$1$1$1$1("n");
    	const result = factorial$2$1$1$1(n);
    	realOverflow$1$1$1$1(result);
    	intOverflow$1$1$1$1(result);
    	clearContext$1$1$1$1();
    	return result;
    }

    function choose$1$1$1$1$1(n, r) {
    	setContext$1$1$1$1$1("choose(n, r)", arguments);
    	integer$1$1$1$1("n");
    	integer$1$1$1$1("r");
    	const result = choose$2$1$1$1(n, r);
    	realOverflow$1$1$1$1(result);
    	intOverflow$1$1$1$1(result);
    	clearContext$1$1$1$1();
    	return result;
    }

    function permute$1$1$1$1$1(n, r) {
    	setContext$1$1$1$1$1("permute(n, r)", arguments);
    	integer$1$1$1$1("n");
    	integer$1$1$1$1("r");
    	const result = permute$2$1$1$1(n, r);
    	realOverflow$1$1$1$1(result);
    	intOverflow$1$1$1$1(result);
    	clearContext$1$1$1$1();
    	return result;
    }

    function gcd$1$1$1$1$1(a, b) {
    	setContext$1$1$1$1$1("gcd(a, b)", arguments);
    	integer$1$1$1$1("a");
    	integer$1$1$1$1("b");
    	clearContext$1$1$1$1();
    	return gcd$2$1$1$1(a, b);
    }

    function lcm$1$1$1$1$1(a, b) {
    	setContext$1$1$1$1$1("lcm(a, b)", arguments);
    	integer$1$1$1$1("a");
    	integer$1$1$1$1("b");
    	clearContext$1$1$1$1();
    	return lcm$2$1$1$1(a, b);
    }

    function mpow$1$1$1$1$1(base, exp, m) {
    	setContext$1$1$1$1$1("mpow(base, exp, m)", arguments);
    	integer$1$1$1$1("base");
    	integer$1$1$1$1("exp");
    	nonNegative$1$1$1$1("exp");
    	integer$1$1$1$1("m");
    	clearContext$1$1$1$1();
    	return mpow$2$1$1$1(base, exp, m);
    }

    // Freeze exports
    Object.freeze(factorial$1$1$1$1$1);
    Object.freeze(choose$1$1$1$1$1);
    Object.freeze(permute$1$1$1$1$1);
    Object.freeze(gcd$1$1$1$1$1);
    Object.freeze(lcm$1$1$1$1$1);
    Object.freeze(mpow$1$1$1$1$1);

    //Dot product
    function dot$2$1$1$1(vec1, vec2) {
    	let result = 0;
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		result += vec1[i] * vec2[i];
    	}
    	return result;
    }

    function dot2$3$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function dot3$2$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }

    function dot4$2$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
    }

    //Cross product
    function cross3$2$1$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    	return target;
    }

    //Addition
    function add$2$1$1$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] + vec2[i];
    	}
    	return target;
    }

    function add2$2$1$1$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	return target;
    }

    function add3$2$1$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	return target;
    }

    function add4$2$1$1$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	target[3] = vec1[3] + vec2[3];
    	return target;
    }

    //Subtraction
    function sub$2$1$1$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] - vec2[i];
    	}
    	return target;
    }

    function sub2$2$1$1$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	return target;
    }

    function sub3$2$1$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	return target;
    }

    function sub4$2$1$1$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	target[3] = vec1[3] - vec2[3];
    	return target;
    }

    //Magnitude
    function mag$3$1$1$1(vec) {
    	return hypot$1$1$1$1(...vec);
    }

    function mag2$2$1$1$1(vec) {
    	return hypot$1$1$1$1(vec[0], vec[1]);
    }

    function mag3$2$1$1$1(vec) {
    	return hypot$1$1$1$1(vec[0], vec[1], vec[2]);
    }

    function mag4$2$1$1$1(vec) {
    	return hypot$1$1$1$1(vec[0], vec[1], vec[2], vec[3]);
    }

    //Scaling
    function scale$1$1$1$1$1(vec, k, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec[i] * k;
    	}
    	return target;
    }

    function scale2$1$1$1$1$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	return target;
    }

    function scale3$1$1$1$1$1(vec, k, target = new Float64Array(3)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	return target;
    }

    function scale4$1$1$1$1$1(vec, k, target = new Float64Array(4)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	target[3] = vec[3] * k;
    	return target;
    }

    function normalize$2$1$1$1(vec, target) { //'target' intentionally defaults to undefined
    	return scale$1$1$1$1$1(vec, 1 / mag$3$1$1$1(vec), target);
    }

    function normalize2$3$1$1$1(vec, target) {
    	return scale2$1$1$1$1$1(vec, 1 / mag2$2$1$1$1(vec), target);
    }

    function normalize3$2$1$1$1(vec, target) {
    	return scale3$1$1$1$1$1(vec, 1 / mag3$2$1$1$1(vec), target);
    }

    function normalize4$2$1$1$1(vec, target) {
    	return scale4$1$1$1$1$1(vec, 1 / mag4$2$1$1$1(vec), target);
    }

    //Angles & rotations
    function angle$2$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1(dot$2$1$1$1(vec1, vec2) / (mag$3$1$1$1(vec1) * mag$3$1$1$1(vec2)));
    }

    function angle2$2$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1(dot2$3$1$1$1(vec1, vec2) / (mag2$2$1$1$1(vec1) * mag2$2$1$1$1(vec2)));
    }

    function angle3$2$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1(dot3$2$1$1$1(vec1, vec2) / (mag3$2$1$1$1(vec1) * mag3$2$1$1$1(vec2)));
    }

    function angle4$2$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1(dot4$2$1$1$1(vec1, vec2) / (mag4$2$1$1$1(vec1) * mag4$2$1$1$1(vec2)));
    }

    //Other component-wise operations
    function fract$2$1$1$1$1(vec, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = fract$4$1$1$1(vec[i]);
    	}
    	return target;
    }

    function fract2$2$1$1$1(vec, target = new Float64Array(2)) {
    	target[0] = fract$4$1$1$1(vec[0]);
    	target[1] = fract$4$1$1$1(vec[1]);
    	return target;
    }

    function fract3$2$1$1$1(vec, target = new Float64Array(3)) {
    	target[0] = fract$4$1$1$1(vec[0]);
    	target[1] = fract$4$1$1$1(vec[1]);
    	target[2] = fract$4$1$1$1(vec[2]);
    	return target;
    }

    function fract4$2$1$1$1(vec, target = new Float64Array(4)) {
    	target[0] = fract$4$1$1$1(vec[0]);
    	target[1] = fract$4$1$1$1(vec[1]);
    	target[2] = fract$4$1$1$1(vec[2]);
    	target[3] = fract$4$1$1$1(vec[3]);
    	return target;
    }

    function toPolar2$2$1$1$1(vec, target = new Float64Array(2)) {
    	target[0] = mag2$2$1$1$1(vec);
    	target[1] = atan2$1$1$1$1(vec[1], vec[0]) + PI$1$1$1$1;
    	return target;
    }

    // Freeze exports
    Object.freeze(dot$2$1$1$1);
    Object.freeze(dot2$3$1$1$1);
    Object.freeze(dot3$2$1$1$1);
    Object.freeze(dot4$2$1$1$1);
    Object.freeze(cross3$2$1$1$1);
    Object.freeze(add$2$1$1$1);
    Object.freeze(add2$2$1$1$1);
    Object.freeze(add3$2$1$1$1);
    Object.freeze(add4$2$1$1$1);
    Object.freeze(sub$2$1$1$1);
    Object.freeze(sub2$2$1$1$1);
    Object.freeze(sub3$2$1$1$1);
    Object.freeze(sub4$2$1$1$1);
    Object.freeze(mag$3$1$1$1);
    Object.freeze(mag2$2$1$1$1);
    Object.freeze(mag3$2$1$1$1);
    Object.freeze(mag4$2$1$1$1);
    Object.freeze(scale$1$1$1$1$1);
    Object.freeze(scale2$1$1$1$1$1);
    Object.freeze(scale3$1$1$1$1$1);
    Object.freeze(scale4$1$1$1$1$1);
    Object.freeze(normalize$2$1$1$1);
    Object.freeze(normalize2$3$1$1$1);
    Object.freeze(normalize3$2$1$1$1);
    Object.freeze(normalize4$2$1$1$1);
    Object.freeze(angle$2$1$1$1);
    Object.freeze(angle2$2$1$1$1);
    Object.freeze(angle3$2$1$1$1);
    Object.freeze(angle4$2$1$1$1);
    Object.freeze(fract$2$1$1$1$1);
    Object.freeze(fract2$2$1$1$1);
    Object.freeze(fract3$2$1$1$1);
    Object.freeze(fract4$2$1$1$1);
    Object.freeze(toPolar2$2$1$1$1);

    //Dot product
    function dot$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("dot(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1");
    	realArray$1$1$1$1("vec2", vec1.length);
    	clearContext$1$1$1$1();
    	return dot$2$1$1$1(vec1, vec2);
    }

    function dot2$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("dot2(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1("vec2", 2);
    	clearContext$1$1$1$1();
    	return dot2$3$1$1$1(vec1, vec2);
    }

    function dot3$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("dot3(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1("vec2", 3);
    	clearContext$1$1$1$1();
    	return dot3$2$1$1$1(vec1, vec2);
    }

    function dot4$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("dot4(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1("vec2", 4);
    	clearContext$1$1$1$1();
    	return dot4$2$1$1$1(vec1, vec2);
    }

    //Cross product
    function cross3$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("cross3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1("vec2", 3);
    	target$1$1$1$1('target', 3);
    	clearContext$1$1$1$1();
    	return cross3$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    //Addition
    function add$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("add(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1");
    	realArray$1$1$1$1("vec2", vec1.length);
    	target$1$1$1$1('target', vec1.length);
    	clearContext$1$1$1$1();
    	return add$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    function add2$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("add2(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1("vec2", 2);
    	target$1$1$1$1('target', 2);
    	clearContext$1$1$1$1();
    	return add2$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    function add3$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("add3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1("vec2", 3);
    	target$1$1$1$1('target', 3);
    	clearContext$1$1$1$1();
    	return add3$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    function add4$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("add4(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1("vec2", 4);
    	target$1$1$1$1('target', 4);
    	clearContext$1$1$1$1();
    	return add4$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    //Subtraction
    function sub$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("sub(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1("vec2", vec1.length);
    	target$1$1$1$1('target', vec1.length);
    	clearContext$1$1$1$1();
    	return sub$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    function sub2$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("sub2(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1("vec2", 2);
    	target$1$1$1$1('target', 2);
    	clearContext$1$1$1$1();
    	return sub2$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    function sub3$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("sub3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1("vec2", 3);
    	target$1$1$1$1('target', 3);
    	clearContext$1$1$1$1();
    	return sub3$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    function sub4$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("sub4(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1("vec2", 4);
    	target$1$1$1$1('target', 4);
    	clearContext$1$1$1$1();
    	return sub4$2$1$1$1(vec1, vec2, target$1$1$1$1$1);
    }

    //Magnitude
    function mag$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1("mag(vec)", arguments);
    	realArray$1$1$1$1("vec");
    	clearContext$1$1$1$1();
    	return mag$3$1$1$1(vec);
    }

    function mag2$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1("mag2(vec)", arguments);
    	realArray$1$1$1$1("vec", 2);
    	clearContext$1$1$1$1();
    	return mag2$2$1$1$1(vec);
    }

    function mag3$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1("mag3(vec)", arguments);
    	realArray$1$1$1$1("vec", 3);
    	clearContext$1$1$1$1();
    	return mag3$2$1$1$1(vec);
    }

    function mag4$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1("mag4(vec)", arguments);
    	realArray$1$1$1$1("vec", 4);
    	clearContext$1$1$1$1();
    	return mag4$2$1$1$1(vec);
    }

    //Scaling
    function scale$2$1$1$1$1(vec, k, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("scale(vec, k, ?target)", arguments);
    	realArray$1$1$1$1("vec");
    	realNumber$2$1$1$1("k");
    	target$1$1$1$1('target', vec.length);
    	return scale$1$1$1$1$1(vec, k, target$1$1$1$1$1);
    }

    function scale2$2$1$1$1$1(vec, k, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("scale2(vec, k, ?target)", arguments);
    	realArray$1$1$1$1("vec", 2);
    	realNumber$2$1$1$1("k");
    	target$1$1$1$1('target', 2);
    	return scale2$1$1$1$1$1(vec, k, target$1$1$1$1$1);
    }

    function scale3$2$1$1$1$1(vec, k, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("scale3(vec, k, ?target)", arguments);
    	realArray$1$1$1$1("vec", 3);
    	realNumber$2$1$1$1("k");
    	target$1$1$1$1('target', 3);
    	return scale3$1$1$1$1$1(vec, k, target$1$1$1$1$1);
    }

    function scale4$2$1$1$1$1(vec, k, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("scale4(vec, k, ?target)", arguments);
    	realArray$1$1$1$1("vec", 4);
    	realNumber$2$1$1$1("k");
    	target$1$1$1$1('target', 4);
    	return scale4$1$1$1$1$1(vec, k, target$1$1$1$1$1);
    }

    function normalize$1$1$1$1$1(vec, target$1$1$1$1$1) { //'target' intentionally defaults to undefined
    	setContext$1$1$1$1$1("normalize(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec");
    	target$1$1$1$1('target', vec.length);
    	return normalize$2$1$1$1(vec, target$1$1$1$1$1);
    }

    function normalize2$1$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("normalize2(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec", 2);
    	target$1$1$1$1('target', 2);
    	return normalize2$3$1$1$1(vec, target$1$1$1$1$1);
    }

    function normalize3$1$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("normalize3(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec", 3);
    	target$1$1$1$1('target', 3);
    	return normalize3$2$1$1$1(vec, target$1$1$1$1$1);
    }

    function normalize4$1$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("normalize4(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec", 4);
    	target$1$1$1$1('target', 4);
    	return normalize4$2$1$1$1(vec, target$1$1$1$1$1);
    }

    //Angles & rotations
    function angle$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("angle(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1");
    	realArray$1$1$1$1("vec2", vec1.length);
    	return angle$2$1$1$1(vec1, vec2);
    }

    function angle2$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("angle2(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1("vec2", 2);
    	return angle2$2$1$1$1(vec1, vec2);
    }

    function angle3$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("angle3(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1("vec2", 3);
    	return angle3$2$1$1$1(vec1, vec2);
    }

    function angle4$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1("angle4(vec1, vec2)", arguments);
    	realArray$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1("vec2", 4);
    	return angle4$2$1$1$1(vec1, vec2);
    }

    //Other component-wise operations
    function fract$3$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("fract(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec");
    	target$1$1$1$1("target", vec.length);
    	return fract$2$1$1$1$1(vec, target$1$1$1$1$1);
    }

    function fract2$1$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("fract2(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec", 2);
    	target$1$1$1$1("target", 2);
    	return fract2$2$1$1$1(vec, target$1$1$1$1$1);
    }

    function fract3$1$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("fract3(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec", 3);
    	target$1$1$1$1("target", 3);
    	return fract3$2$1$1$1(vec, target$1$1$1$1$1);
    }

    function fract4$1$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("fract4(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec", 4);
    	target$1$1$1$1("target", 4);
    	return fract4$2$1$1$1(vec, target$1$1$1$1$1);
    }

    function toPolar2$1$1$1$1$1(vec, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("polar2(vec, ?target)", arguments);
    	realArray$1$1$1$1("vec", 2);
    	target$1$1$1$1("target", 2);
    	return toPolar2$2$1$1$1(vec, target$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(dot$1$1$1$1$1);
    Object.freeze(dot2$1$1$1$1$1);
    Object.freeze(dot3$1$1$1$1$1);
    Object.freeze(dot4$1$1$1$1$1);
    Object.freeze(cross3$1$1$1$1$1);
    Object.freeze(add$1$1$1$1$1);
    Object.freeze(add2$1$1$1$1$1);
    Object.freeze(add3$1$1$1$1$1);
    Object.freeze(add4$1$1$1$1$1);
    Object.freeze(sub$1$1$1$1$1);
    Object.freeze(sub2$1$1$1$1$1);
    Object.freeze(sub3$1$1$1$1$1);
    Object.freeze(sub4$1$1$1$1$1);
    Object.freeze(mag$1$1$1$1$1);
    Object.freeze(mag2$1$1$1$1$1);
    Object.freeze(mag3$1$1$1$1$1);
    Object.freeze(mag4$1$1$1$1$1);
    Object.freeze(scale$2$1$1$1$1);
    Object.freeze(scale2$2$1$1$1$1);
    Object.freeze(scale3$2$1$1$1$1);
    Object.freeze(scale4$2$1$1$1$1);
    Object.freeze(normalize$1$1$1$1$1);
    Object.freeze(normalize2$1$1$1$1$1);
    Object.freeze(normalize3$1$1$1$1$1);
    Object.freeze(normalize4$1$1$1$1$1);
    Object.freeze(angle$1$1$1$1$1);
    Object.freeze(angle2$1$1$1$1$1);
    Object.freeze(angle3$1$1$1$1$1);
    Object.freeze(angle4$1$1$1$1$1);
    Object.freeze(fract$3$1$1$1$1);
    Object.freeze(fract2$1$1$1$1$1);
    Object.freeze(fract3$1$1$1$1$1);
    Object.freeze(fract4$1$1$1$1$1);
    Object.freeze(toPolar2$1$1$1$1$1);

    function dot2$2$1$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos$1$1$1$1(vec1[1] - vec2[1]);
    }

    function mag$2$1$1$1$1(vec) {
    	return abs$1$1$1$1(vec[0]);
    }

    function scale2$3$1$1$1$1(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = mod$2$1$1$1(vec[1], TWO_PI$1$1$1$1);
    	return target;
    }

    function normalize2$2$1$1$1$1(vec, target = new Float64Array(2)) {
    	if (vec[0] === 0) {
    		return undefined;
    	}
    	target[0] = 1;
    	target[1] = mod$2$1$1$1(vec[1], TWO_PI$1$1$1$1);
    	return target;
    }

    function toRect2$1$1$1$1(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	const theta = vec[1];
    	target[0] = r * cos$1$1$1$1(theta);
    	target[1] = r * sin$1$1$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(dot2$2$1$1$1$1);
    Object.freeze(mag$2$1$1$1$1);
    Object.freeze(scale2$3$1$1$1$1);
    Object.freeze(normalize2$2$1$1$1$1);
    Object.freeze(toRect2$1$1$1$1);

    // Current debug context
    let signature$1$1$1$1$1 = "Unknown";
    let args$1$1$1$1$1 = {};

    function setContext$1$1$1$1$1$1(s, argArray) {
        //Parse signature
        signature$1$1$1$1$1 = s;
        const parameters = signature$1$1$1$1$1
        .split("(")[1]
        .replace(")", "")
        .replace(" ", "")
        .replace("?", "")
        .split(",");
        //Parse arguments
        args$1$1$1$1$1 = {};
        for (let i = 0; i < parameters.length; i++) {
            args$1$1$1$1$1[params[i]] = argArray[i];
        }
    }

    function clearContext$1$1$1$1$1() {
        args$1$1$1$1$1 = {};
        signature$1$1$1$1$1 = "Unknown";
    }

    // Shorter console use
    function log$1$1$1$1$1() {
        console.log.apply(console, arguments);
    }

    function warn$1$1$1$1$1() {
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
    Object.freeze(log$1$1$1$1$1);
    Object.freeze(setContext$1$1$1$1$1$1);
    Object.freeze(clearContext$1$1$1$1$1);
    Object.freeze(warn$1$1$1$1$1);

    const TYPED_ARRAY_CONSTRUCTORS$1$1$1$1$1 = [
        Int8Array, Uint8Array, Uint8ClampedArray,
        Int16Array, Uint16Array, Int32Array, Uint32Array,
        Float32Array, Float64Array];

    function realNumber$2$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1$1$1$1}: ${parameter} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1$1$1$1}: ${parameter} cannot be NaN or Infinity.`;
        }
    }

    function realArray$1$1$1$1$1(parameter, length) {
        const value = args$1$1$1$1$1[parameter];
        if (TYPED_ARRAY_CONSTRUCTORS$1$1$1$1$1.includes(value.constructor) || Array.isArray(value)) {
            const len = value.length;
            if (len !== length) {
                throw `${signature$1$1$1$1$1}: ${parameter} has incorrect length`;
            }
            if (len === 0) {
                warn$1$1$1$1$1(`${signature$1$1$1$1$1}: ${parameter} is empty.`);
            }
            for (let i = 0; i < len; i++) {
    			const x = value[i];
                if (value.constructor !== Number) { //Assert type Number
                    throw `${signature$1$1$1$1$1}: ${parameter} must an array of Numbers.`;
                }
                if (!isFinite(value)) { //Exclude Infinity and NaN
                    throw `${signature$1$1$1$1$1}: ${parameter} contains NaN or Infinity.`;
                }
            }
        }
        throw `${signature$1$1$1$1$1}: ${parameter} must be an Array or TypedArray.`;
    }

    function integer$1$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        if (!Number.isInteger(value)) {
            throw `${signature$1$1$1$1$1}: ${parameter} must be an integer of type Number.`;
        }
    }

    function positive$1$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        realNumber$2$1$1$1$1(parameter);
        if (value <= 0) {
            throw `${signature$1$1$1$1$1}: ${parameter} must be positive.`;
        }
    }

    function nonNegative$1$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        realNumber$2$1$1$1$1(parameter);
        if (value < 0) {
            throw `${signature$1$1$1$1$1}: ${parameter} must be non-negative.`;
        }
    }

    function rectVector$1$1$1$1$1(parameter) {
        realArray$1$1$1$1$1(parameter);
    }

    function polarVector$1$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        realArray$1$1$1$1$1(parameter);
        if (value[0] < 0) {
            console.warn(`${signature$1$1$1$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function bool$2$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        if ( (value !== true) && (value !== false) ) {
            throw `${signature$1$1$1$1$1}: ${parameter} must be a boolean value.`;
        }
    }

    function polarComplex$1$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        realArray$1$1$1$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1$1$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1$1$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
        if (value[0] < 0) {
            console.warn(`${signature$1$1$1$1$1}: ${parameter} expressed with negative magnitude.`);
        }
    }

    function rectComplex$1$1$1$1$1(parameter) {
        const value = args$1$1$1$1$1[parameter];
        realArray$1$1$1$1$1(parameter);
        const len = value.length;
        if (len < 2) {
            throw `${signature$1$1$1$1$1}: ${parameter} must have two components.`;
        }
        if (len > 2) {
            console.warn(`${signature$1$1$1$1$1}: ${parameter} contains additional values which will be ignored.`);
        }
    }

    function positiveInteger$1$1$1$1$1(parameter) {
        integer$1$1$1$1$1(parameter);
        positive$1$1$1$1$1(parameter);
    }

    function flatMatrix$1$1$1$1$1(parameter, nrows, ncols) {
        realArray$1$1$1$1$1(parameter);
        const value = args$1$1$1$1$1[parameter];
        if ( (!Number.isInteger(value.nrows)) || (value.nrows < 1) ) {
            throw `${signature$1$1$1$1$1}: ${parameter}.nrows is invalid`;
        }
        if ((!Number.isInteger(value.ncols)) || (value.ncols < 1)) {
            throw `${signature$1$1$1$1$1}: ${parameter}.ncols is invalid`;
        }
        if (value.nrows * value.ncols !== value.length) {
            throw `${signature$1$1$1$1$1}: ${parameter}.length does not match ${parameter}.nrows * ${parameter}.ncols`;
        }
        if ( (value.nrows !== nrows) || (value.ncols !== ncols) ) {
            throw `${signature$1$1$1$1$1}: ${parameter} has incorrect dimensions`;
        }
    }

    //Freeze exports
    Object.freeze(realNumber$2$1$1$1$1);
    Object.freeze(realArray$1$1$1$1$1);
    Object.freeze(integer$1$1$1$1$1);
    Object.freeze(positive$1$1$1$1$1);
    Object.freeze(nonNegative$1$1$1$1$1);
    Object.freeze(rectVector$1$1$1$1$1);
    Object.freeze(polarVector$1$1$1$1$1);
    Object.freeze(bool$2$1$1$1$1);
    Object.freeze(polarComplex$1$1$1$1$1);
    Object.freeze(rectComplex$1$1$1$1$1);
    Object.freeze(flatMatrix$1$1$1$1$1);
    Object.freeze(positiveInteger$1$1$1$1$1);

    function realOverflow$1$1$1$1$1(value) { //Assumes 'value' is a number
        if (value >= MAX_VALUE$1$1$1$1$1) {
            warn$1$1$1$1$1(`${signature$1$1$1$1$1}: overflowed Number.MAX_VALUE`);
        }
    }

    function intOverflow$1$1$1$1$1(value) { //Assumes 'value' is a number
        if (value > MAX_SAFE_INTEGER$1$1$1$1$1) {
            warn$1$1$1$1$1(`${signature$1$1$1$1$1}: overflowed Number.MAX_SAFE_INTEGER`);
        }
    }

    function notDefined$1$1$1$1$1(value) {
        if (value === undefined) {
            warn$1$1$1$1$1(`${signature$1$1$1$1$1}: output undefined`);
        }
    }

    //Freeze exports
    Object.freeze(realOverflow$1$1$1$1$1);
    Object.freeze(intOverflow$1$1$1$1$1);
    Object.freeze(notDefined$1$1$1$1$1);

    function sorted$1$1$1$1$1(arrLabel, sortedLabel) {
        const arr = args$1$1$1$1$1[arrLabel];
        const sorted = args$1$1$1$1$1[sortedLabel];
        const len = arr.length;
        if (len === 0) {return;}
        if (sorted === true) {
            sgn = Math.sign(arr[len - 1] - arr[0]);
            for (let i = 1; i < len; i++) {
                const s = Math.sign(arr[i] - arr[i-1]);
                if ( (s !== 0) && (s !== sgn)) {
                    throw `${signature$1$1$1$1$1}: ${sortedLabel} set to true, but ${arrLabel} unsorted`;
                }
            }
        }
    }

    function realNumber$1$1$1$1$1$1(label) {
        const value = args$1$1$1$1$1[label];
        if (value === undefined) {return;}
        if (value.constructor !== Number) { //Assert type Number
            throw `${signature$1$1$1$1$1}: If provided, ${label} must be of type Number.`;
        }
    	if (!isFinite(value)) { //Exclude Infinity and NaN
            throw `${signature$1$1$1$1$1}: ${label} cannot be NaN or Infinity.`;
        }
    }

    function target$1$1$1$1$1(label, length) {
        const value = args$1$1$1$1$1[label];
        if (value === undefined) {return;}
        realArray$1$1$1$1$1(value);
        if (value.length !== length) {
            throw `${signature$1$1$1$1$1}: ${label} has incorrect length`
        }
    }

    function bool$1$1$1$1$1$1(label) {
        const value = args$1$1$1$1$1[label];
        if (value === undefined) {return;}
        if ((value !== true) && (value !== false)) {
            throw `${signature$1$1$1$1$1}: ${label} must be a boolean`
        }
    }

    Object.freeze(realNumber$1$1$1$1$1$1);
    Object.freeze(sorted$1$1$1$1$1);
    Object.freeze(target$1$1$1$1$1);
    Object.freeze(bool$1$1$1$1$1$1);

    //Math constants
    const E$1$1$1$1$1 = Math.E;
    const PI$1$1$1$1$1 = Math.PI;

    //Number constants
    const MAX_SAFE_INTEGER$1$1$1$1$1 = Number.MAX_SAFE_INTEGER;
    const MAX_VALUE$1$1$1$1$1 = Number.MAX_VALUE;
    const EPSILON$1$1$1$1$1 = Number.EPSILON;

    //Functions
    const abs$1$1$1$1$1 = Math.abs;
    const round$1$1$1$1$1 = Math.round;
    const trunc$1$1$1$1$1 = Math.trunc;
    const ceil$1$1$1$1$1 = Math.ceil;
    const floor$1$1$1$1$1 = Math.floor;
    const sin$1$1$1$1$1 = Math.sin;
    const cos$1$1$1$1$1 = Math.cos;
    const acos$1$1$1$1$1 = Math.acos;
    const atan2$1$1$1$1$1 = Math.atan2;
    const sqrt$1$1$1$1$1 = Math.sqrt;
    const hypot$1$1$1$1$1 = Math.hypot;
    const pow$1$1$1$1$1 = Math.pow;
    const exp$1$1$1$1$1 = Math.exp;
    const ln$1$1$1$1$1 = Math.log;
    const max$1$1$1$1$1 = Math.max;
    const min$1$1$1$1$1 = Math.min;
    const random$1$1$1$1$1 = Math.random;

    //Constants
    const RAD_TO_DEG$1$1$1$1$1 = 180 / PI$1$1$1$1$1;
    const DEG_TO_RAD$1$1$1$1$1 = 1 / RAD_TO_DEG$1$1$1$1$1;
    const TWO_PI$1$1$1$1$1 = 2 * PI$1$1$1$1$1;

    //Functions
    function lerp$2$1$1$1$1(x, y, r) {
    	return x + (y - x) * r;
    }

    function mod$2$1$1$1$1(x, m) {
    	return ((x%m)+m)%m;
    }

    function fract$4$1$1$1$1(x) {
    	return x - trunc$1$1$1$1$1(x);
    }

    function deg$2$1$1$1$1(radians) {
    	return radians * RAD_TO_DEG$1$1$1$1$1;
    }

    function rad$2$1$1$1$1(degrees) {
    	return degrees * DEG_TO_RAD$1$1$1$1$1;
    }

    function linmap$2$1$1$1$1(x, domain, range) {
    	const r0 = range[0];
    	const d0 = domain[0];
    	return r0 + (range[1] - r0) * (x - d0) / (domain[1] - d0);
    }

    // Freeze function exports
    Object.freeze(lerp$2$1$1$1$1);
    Object.freeze(mod$2$1$1$1$1);
    Object.freeze(fract$4$1$1$1$1);
    Object.freeze(deg$2$1$1$1$1);
    Object.freeze(rad$2$1$1$1$1);
    Object.freeze(linmap$2$1$1$1$1);

    function lerp$1$1$1$1$1$1(x, y, r) {
    	setContext("lerp(x, y, r)", arguments);
    	realNumber$2$1$1$1$1("x");
    	realNumber$2$1$1$1$1("y");
    	realNumber$2$1$1$1$1("r");
    	clearContext$1$1$1$1$1();
    	return lerp$2$1$1$1$1(x, y, r);
    }

    function mod$1$1$1$1$1$1(x, m) {
    	setContext("mod(x, m)", arguments);
    	realNumber$2$1$1$1$1("x");
    	realNumber$2$1$1$1$1("m");
    	clearContext$1$1$1$1$1();
    	return mod$2$1$1$1$1(x, m);
    }

    function fract$1$1$1$1$1$1(x) {
    	setContext("fract(x)", arguments);
    	realNumber$2$1$1$1$1("x");
    	clearContext$1$1$1$1$1();
    	return fract$4$1$1$1$1(x);
    }

    function deg$1$1$1$1$1$1(radians) {
    	setContext("deg(radians)", arguments);
    	realNumber$2$1$1$1$1("radians");
    	clearContext$1$1$1$1$1();
    	return deg$2$1$1$1$1(radians);
    }

    function rad$1$1$1$1$1$1(degrees) {
    	setContext("rad(degrees)", arguments);
    	realNumber$2$1$1$1$1('degrees');
    	clearContext$1$1$1$1$1();
    	return rad$2$1$1$1$1(degrees);
    }

    function linmap$1$1$1$1$1$1(x, domain, range) {
    	setContext("linmap(x, domain, range)", arguments);
    	realNumber$2$1$1$1$1("x");
    	realArray$1$1$1$1$1('domain');
    	realArray$1$1$1$1$1('range');
    	if (domain[0] > domain[1]) {
    		throw "linmap(x, domain, range): invalid domain"
    	}
    	if (range[0] > range[1]) {
    		throw "linmap(x, domain, range): invalid range"
    	}
    	clearContext$1$1$1$1$1();
    	return linmap$2$1$1$1$1(x, domain, range);
    }

    // Freeze function exports
    Object.freeze(lerp$1$1$1$1$1$1);
    Object.freeze(mod$1$1$1$1$1$1);
    Object.freeze(fract$1$1$1$1$1$1);
    Object.freeze(deg$1$1$1$1$1$1);
    Object.freeze(rad$1$1$1$1$1$1);
    Object.freeze(linmap$1$1$1$1$1$1);

    function computeFactorials$1$1$1$1$1(n = 170) { //n > 170 overflows JS's Number type
    	if (n < 0) {return [];}
    	const len = n + 1;
    	const result = new Float64Array(len);
    	result[0] = 1;
    	for (let i = 1; i < len; i++) {
    		result[i] = i * result[i-1];
    	}
    	return result;
    }

    function computeBinomials$1$1$1$1$1(n = 30) {
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

    const FACTORIALS$1$1$1$1$1 = computeFactorials$1$1$1$1$1();
    let BINOM_MAX_CACHED_N$1$1$1$1$1;
    let BINOMIALS$1$1$1$1$1;

    function precomputeBinomials$1$1$1$1$1(n) {
    	BINOM_MAX_CACHED_N$1$1$1$1$1 = n;
    	BINOMIALS$1$1$1$1$1 = computeBinomials$1$1$1$1$1(n);
    }

    precomputeBinomials$1$1$1$1$1(30);

    //Combinatorial functions
    function factorial$2$1$1$1$1(n) {
    	if (n < 0) {return undefined;}
    	if (n > 170) {return MAX_VALUE$1$1$1$1$1;}
    	return FACTORIALS$1$1$1$1$1[n];
    }

    function choose$2$1$1$1$1(n, r) {
    	if ((r > n)||(n < 0)||(r < 0)) {return 0;} // Quick return 0
    	if (n <= BINOM_MAX_CACHED_N$1$1$1$1$1) {return BINOMIALS$1$1$1$1$1[0.5 * n * (n + 1) + r];} //Return pre-computed
    	//Not pre-computed
    	const k = min$1$1$1$1$1(r, n - r);
    	if (k > 514) {return MAX_VALUE$1$1$1$1$1;} //Quick return for known overflow
    	const nMinusK = n - k;
    	let result = 1;
    	let i = 1;
    	while (i <= k) {
    		result *= (nMinusK + i)/(i++);
    	}
    	return result; //Could still have overflown
    }

    function permute$2$1$1$1$1(n, r) {
    	if ((r > n) || (n < 0) || (r < 0)) {return 0;}
    	if (r > 170) {return MAX_VALUE$1$1$1$1$1;}
    	r = n - r;
    	if (n < 171) {
    		return round$1$1$1$1$1(FACTORIALS$1$1$1$1$1[n]/FACTORIALS$1$1$1$1$1[r]);
    	}
    	let result = 1;
    	if (r < 160) { //Skip multiplication of known values
    		result = round$1$1$1$1$1(FACTORIALS$1$1$1$1$1[170]/FACTORIALS$1$1$1$1$1[r]);
    		r = 170;
    	} 
    	while (r < n) {
    		result *= ++r;
    	}
    	return result;
    }

    //Greatest common divisor
    function gcd$2$1$1$1$1(a, b) {
    	//Input & trivial cases
    	a = abs$1$1$1$1$1(a);
    	b = abs$1$1$1$1$1(b);
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
    function lcm$2$1$1$1$1(a, b) {
    	if ((a === 0)||(b === 0)) {return 0;}
    	return abs$1$1$1$1$1((a / gcd$2$1$1$1$1(a, b)) * b);
    }

    //Modular exponentiation
    function mpow$2$1$1$1$1(base, exp, m) {
    	//base = abs(base);
    	exp = abs$1$1$1$1$1(exp);
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
    Object.freeze(computeFactorials$1$1$1$1$1);
    Object.freeze(computeBinomials$1$1$1$1$1);
    Object.freeze(precomputeBinomials$1$1$1$1$1);
    Object.freeze(factorial$2$1$1$1$1);
    Object.freeze(choose$2$1$1$1$1);
    Object.freeze(permute$2$1$1$1$1);
    Object.freeze(gcd$2$1$1$1$1);
    Object.freeze(lcm$2$1$1$1$1);
    Object.freeze(mpow$2$1$1$1$1);

    function factorial$1$1$1$1$1$1(n) {
    	setContext$1$1$1$1$1$1("factorial(n)", arguments);
    	integer$1$1$1$1$1("n");
    	nonNegative$1$1$1$1$1("n");
    	const result = factorial$2$1$1$1$1(n);
    	realOverflow$1$1$1$1$1(result);
    	intOverflow$1$1$1$1$1(result);
    	clearContext$1$1$1$1$1();
    	return result;
    }

    function choose$1$1$1$1$1$1(n, r) {
    	setContext$1$1$1$1$1$1("choose(n, r)", arguments);
    	integer$1$1$1$1$1("n");
    	integer$1$1$1$1$1("r");
    	const result = choose$2$1$1$1$1(n, r);
    	realOverflow$1$1$1$1$1(result);
    	intOverflow$1$1$1$1$1(result);
    	clearContext$1$1$1$1$1();
    	return result;
    }

    function permute$1$1$1$1$1$1(n, r) {
    	setContext$1$1$1$1$1$1("permute(n, r)", arguments);
    	integer$1$1$1$1$1("n");
    	integer$1$1$1$1$1("r");
    	const result = permute$2$1$1$1$1(n, r);
    	realOverflow$1$1$1$1$1(result);
    	intOverflow$1$1$1$1$1(result);
    	clearContext$1$1$1$1$1();
    	return result;
    }

    function gcd$1$1$1$1$1$1(a, b) {
    	setContext$1$1$1$1$1$1("gcd(a, b)", arguments);
    	integer$1$1$1$1$1("a");
    	integer$1$1$1$1$1("b");
    	clearContext$1$1$1$1$1();
    	return gcd$2$1$1$1$1(a, b);
    }

    function lcm$1$1$1$1$1$1(a, b) {
    	setContext$1$1$1$1$1$1("lcm(a, b)", arguments);
    	integer$1$1$1$1$1("a");
    	integer$1$1$1$1$1("b");
    	clearContext$1$1$1$1$1();
    	return lcm$2$1$1$1$1(a, b);
    }

    function mpow$1$1$1$1$1$1(base, exp, m) {
    	setContext$1$1$1$1$1$1("mpow(base, exp, m)", arguments);
    	integer$1$1$1$1$1("base");
    	integer$1$1$1$1$1("exp");
    	nonNegative$1$1$1$1$1("exp");
    	integer$1$1$1$1$1("m");
    	clearContext$1$1$1$1$1();
    	return mpow$2$1$1$1$1(base, exp, m);
    }

    // Freeze exports
    Object.freeze(factorial$1$1$1$1$1$1);
    Object.freeze(choose$1$1$1$1$1$1);
    Object.freeze(permute$1$1$1$1$1$1);
    Object.freeze(gcd$1$1$1$1$1$1);
    Object.freeze(lcm$1$1$1$1$1$1);
    Object.freeze(mpow$1$1$1$1$1$1);

    //Dot product
    function dot$2$1$1$1$1(vec1, vec2) {
    	let result = 0;
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		result += vec1[i] * vec2[i];
    	}
    	return result;
    }

    function dot2$3$1$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function dot3$2$1$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }

    function dot4$2$1$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2] + vec1[3] * vec2[3];
    }

    //Cross product
    function cross3$2$1$1$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    	target[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    	target[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    	return target;
    }

    //Addition
    function add$2$1$1$1$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] + vec2[i];
    	}
    	return target;
    }

    function add2$2$1$1$1$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	return target;
    }

    function add3$2$1$1$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	return target;
    }

    function add4$2$1$1$1$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] + vec2[0];
    	target[1] = vec1[1] + vec2[1];
    	target[2] = vec1[2] + vec2[2];
    	target[3] = vec1[3] + vec2[3];
    	return target;
    }

    //Subtraction
    function sub$2$1$1$1$1(vec1, vec2, target = new Float64Array(vec1.length)) {
    	const dimension = vec1.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec1[i] - vec2[i];
    	}
    	return target;
    }

    function sub2$2$1$1$1$1(vec1, vec2, target = new Float64Array(2)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	return target;
    }

    function sub3$2$1$1$1$1(vec1, vec2, target = new Float64Array(3)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	return target;
    }

    function sub4$2$1$1$1$1(vec1, vec2, target = new Float64Array(4)) {
    	target[0] = vec1[0] - vec2[0];
    	target[1] = vec1[1] - vec2[1];
    	target[2] = vec1[2] - vec2[2];
    	target[3] = vec1[3] - vec2[3];
    	return target;
    }

    //Magnitude
    function mag$3$1$1$1$1(vec) {
    	return hypot$1$1$1$1$1(...vec);
    }

    function mag2$2$1$1$1$1(vec) {
    	return hypot$1$1$1$1$1(vec[0], vec[1]);
    }

    function mag3$2$1$1$1$1(vec) {
    	return hypot$1$1$1$1$1(vec[0], vec[1], vec[2]);
    }

    function mag4$2$1$1$1$1(vec) {
    	return hypot$1$1$1$1$1(vec[0], vec[1], vec[2], vec[3]);
    }

    //Scaling
    function smult(vec, k, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = vec[i] * k;
    	}
    	return target;
    }

    function smult2(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	return target;
    }

    function smult3(vec, k, target = new Float64Array(3)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	return target;
    }

    function smult4(vec, k, target = new Float64Array(4)) {
    	target[0] = vec[0] * k;
    	target[1] = vec[1] * k;
    	target[2] = vec[2] * k;
    	target[3] = vec[3] * k;
    	return target;
    }

    function normalize$2$1$1$1$1(vec, target) { //'target' intentionally defaults to undefined
    	return scale(vec, 1 / mag$3$1$1$1$1(vec), target);
    }

    function normalize2$3$1$1$1$1(vec, target) {
    	return scale2(vec, 1 / mag2$2$1$1$1$1(vec), target);
    }

    function normalize3$2$1$1$1$1(vec, target) {
    	return scale3(vec, 1 / mag3$2$1$1$1$1(vec), target);
    }

    function normalize4$2$1$1$1$1(vec, target) {
    	return scale4(vec, 1 / mag4$2$1$1$1$1(vec), target);
    }

    //Angles & rotations
    function angle$2$1$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1$1(dot$2$1$1$1$1(vec1, vec2) / (mag$3$1$1$1$1(vec1) * mag$3$1$1$1$1(vec2)));
    }

    function angle2$2$1$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1$1(dot2$3$1$1$1$1(vec1, vec2) / (mag2$2$1$1$1$1(vec1) * mag2$2$1$1$1$1(vec2)));
    }

    function angle3$2$1$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1$1(dot3$2$1$1$1$1(vec1, vec2) / (mag3$2$1$1$1$1(vec1) * mag3$2$1$1$1$1(vec2)));
    }

    function angle4$2$1$1$1$1(vec1, vec2) {
    	return acos$1$1$1$1$1(dot4$2$1$1$1$1(vec1, vec2) / (mag4$2$1$1$1$1(vec1) * mag4$2$1$1$1$1(vec2)));
    }

    //Other component-wise operations
    function fract$2$1$1$1$1$1(vec, target = new Float64Array(vec.length)) {
    	const dimension = vec.length;
    	for (let i = 0; i < dimension; i++) {
    		target[i] = fract$4$1$1$1$1(vec[i]);
    	}
    	return target;
    }

    function fract2$2$1$1$1$1(vec, target = new Float64Array(2)) {
    	target[0] = fract$4$1$1$1$1(vec[0]);
    	target[1] = fract$4$1$1$1$1(vec[1]);
    	return target;
    }

    function fract3$2$1$1$1$1(vec, target = new Float64Array(3)) {
    	target[0] = fract$4$1$1$1$1(vec[0]);
    	target[1] = fract$4$1$1$1$1(vec[1]);
    	target[2] = fract$4$1$1$1$1(vec[2]);
    	return target;
    }

    function fract4$2$1$1$1$1(vec, target = new Float64Array(4)) {
    	target[0] = fract$4$1$1$1$1(vec[0]);
    	target[1] = fract$4$1$1$1$1(vec[1]);
    	target[2] = fract$4$1$1$1$1(vec[2]);
    	target[3] = fract$4$1$1$1$1(vec[3]);
    	return target;
    }

    function polar2(vec, target = new Float64Array(2)) {
    	target[0] = mag2$2$1$1$1$1(vec);
    	target[1] = atan2$1$1$1$1$1(vec[1], vec[0]) + PI$1$1$1$1$1;
    	return target;
    }

    // Freeze exports
    Object.freeze(dot$2$1$1$1$1);
    Object.freeze(dot2$3$1$1$1$1);
    Object.freeze(dot3$2$1$1$1$1);
    Object.freeze(dot4$2$1$1$1$1);
    Object.freeze(cross3$2$1$1$1$1);
    Object.freeze(add$2$1$1$1$1);
    Object.freeze(add2$2$1$1$1$1);
    Object.freeze(add3$2$1$1$1$1);
    Object.freeze(add4$2$1$1$1$1);
    Object.freeze(sub$2$1$1$1$1);
    Object.freeze(sub2$2$1$1$1$1);
    Object.freeze(sub3$2$1$1$1$1);
    Object.freeze(sub4$2$1$1$1$1);
    Object.freeze(mag$3$1$1$1$1);
    Object.freeze(mag2$2$1$1$1$1);
    Object.freeze(mag3$2$1$1$1$1);
    Object.freeze(mag4$2$1$1$1$1);
    Object.freeze(smult);
    Object.freeze(smult2);
    Object.freeze(smult3);
    Object.freeze(smult4);
    Object.freeze(normalize$2$1$1$1$1);
    Object.freeze(normalize2$3$1$1$1$1);
    Object.freeze(normalize3$2$1$1$1$1);
    Object.freeze(normalize4$2$1$1$1$1);
    Object.freeze(angle$2$1$1$1$1);
    Object.freeze(angle2$2$1$1$1$1);
    Object.freeze(angle3$2$1$1$1$1);
    Object.freeze(angle4$2$1$1$1$1);
    Object.freeze(fract$2$1$1$1$1$1);
    Object.freeze(fract2$2$1$1$1$1);
    Object.freeze(fract3$2$1$1$1$1);
    Object.freeze(fract4$2$1$1$1$1);
    Object.freeze(polar2);

    //Dot product
    function dot$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("dot(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1");
    	realArray$1$1$1$1$1("vec2", vec1.length);
    	clearContext$1$1$1$1$1();
    	return dot$2$1$1$1$1(vec1, vec2);
    }

    function dot2$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("dot2(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1$1("vec2", 2);
    	clearContext$1$1$1$1$1();
    	return dot2$3$1$1$1$1(vec1, vec2);
    }

    function dot3$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("dot3(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1$1("vec2", 3);
    	clearContext$1$1$1$1$1();
    	return dot3$2$1$1$1$1(vec1, vec2);
    }

    function dot4$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("dot4(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1$1("vec2", 4);
    	clearContext$1$1$1$1$1();
    	return dot4$2$1$1$1$1(vec1, vec2);
    }

    //Cross product
    function cross3$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("cross3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1$1("vec2", 3);
    	target$1$1$1$1$1('target', 3);
    	clearContext$1$1$1$1$1();
    	return cross3$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    //Addition
    function add$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("add(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1");
    	realArray$1$1$1$1$1("vec2", vec1.length);
    	target$1$1$1$1$1('target', vec1.length);
    	clearContext$1$1$1$1$1();
    	return add$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    function add2$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("add2(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1$1("vec2", 2);
    	target$1$1$1$1$1('target', 2);
    	clearContext$1$1$1$1$1();
    	return add2$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    function add3$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("add3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1$1("vec2", 3);
    	target$1$1$1$1$1('target', 3);
    	clearContext$1$1$1$1$1();
    	return add3$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    function add4$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("add4(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1$1("vec2", 4);
    	target$1$1$1$1$1('target', 4);
    	clearContext$1$1$1$1$1();
    	return add4$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    //Subtraction
    function sub$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("sub(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1$1("vec2", vec1.length);
    	target$1$1$1$1$1('target', vec1.length);
    	clearContext$1$1$1$1$1();
    	return sub$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    function sub2$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("sub2(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1$1("vec2", 2);
    	target$1$1$1$1$1('target', 2);
    	clearContext$1$1$1$1$1();
    	return sub2$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    function sub3$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("sub3(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1$1("vec2", 3);
    	target$1$1$1$1$1('target', 3);
    	clearContext$1$1$1$1$1();
    	return sub3$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    function sub4$1$1$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("sub4(vec1, vec2, ?target)", arguments);
    	realArray$1$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1$1("vec2", 4);
    	target$1$1$1$1$1('target', 4);
    	clearContext$1$1$1$1$1();
    	return sub4$2$1$1$1$1(vec1, vec2, target$1$1$1$1$1$1);
    }

    //Magnitude
    function mag$1$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1$1("mag(vec)", arguments);
    	realArray$1$1$1$1$1("vec");
    	clearContext$1$1$1$1$1();
    	return mag$3$1$1$1$1(vec);
    }

    function mag2$1$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1$1("mag2(vec)", arguments);
    	realArray$1$1$1$1$1("vec", 2);
    	clearContext$1$1$1$1$1();
    	return mag2$2$1$1$1$1(vec);
    }

    function mag3$1$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1$1("mag3(vec)", arguments);
    	realArray$1$1$1$1$1("vec", 3);
    	clearContext$1$1$1$1$1();
    	return mag3$2$1$1$1$1(vec);
    }

    function mag4$1$1$1$1$1$1(vec) {
    	setContext$1$1$1$1$1$1("mag4(vec)", arguments);
    	realArray$1$1$1$1$1("vec", 4);
    	clearContext$1$1$1$1$1();
    	return mag4$2$1$1$1$1(vec);
    }

    //Scaling
    function smult$1(vec, k, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("smult(vec, k, ?target)", arguments);
    	realArray$1$1$1$1$1("vec");
    	realNumber$2$1$1$1$1("k");
    	target$1$1$1$1$1('target', vec.length);
    	return smult(vec, k, target$1$1$1$1$1$1);
    }

    function smult2$1(vec, k, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("smult2(vec, k, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 2);
    	realNumber$2$1$1$1$1("k");
    	target$1$1$1$1$1('target', 2);
    	return smult2(vec, k, target$1$1$1$1$1$1);
    }

    function smult3$1(vec, k, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("smult3(vec, k, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 3);
    	realNumber$2$1$1$1$1("k");
    	target$1$1$1$1$1('target', 3);
    	return smult3(vec, k, target$1$1$1$1$1$1);
    }

    function smult4$1(vec, k, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("smult4(vec, k, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 4);
    	realNumber$2$1$1$1$1("k");
    	target$1$1$1$1$1('target', 4);
    	return smult4(vec, k, target$1$1$1$1$1$1);
    }

    function normalize$1$1$1$1$1$1(vec, target$1$1$1$1$1$1) { //'target' intentionally defaults to undefined
    	setContext$1$1$1$1$1$1("normalize(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec");
    	target$1$1$1$1$1('target', vec.length);
    	return normalize$2$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    function normalize2$1$1$1$1$1$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("normalize2(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 2);
    	target$1$1$1$1$1('target', 2);
    	return normalize2$3$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    function normalize3$1$1$1$1$1$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("normalize3(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 3);
    	target$1$1$1$1$1('target', 3);
    	return normalize3$2$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    function normalize4$1$1$1$1$1$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("normalize4(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 4);
    	target$1$1$1$1$1('target', 4);
    	return normalize4$2$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    //Angles & rotations
    function angle$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("angle(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1");
    	realArray$1$1$1$1$1("vec2", vec1.length);
    	return angle$2$1$1$1$1(vec1, vec2);
    }

    function angle2$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("angle2(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1", 2);
    	realArray$1$1$1$1$1("vec2", 2);
    	return angle2$2$1$1$1$1(vec1, vec2);
    }

    function angle3$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("angle3(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1", 3);
    	realArray$1$1$1$1$1("vec2", 3);
    	return angle3$2$1$1$1$1(vec1, vec2);
    }

    function angle4$1$1$1$1$1$1(vec1, vec2) {
    	setContext$1$1$1$1$1$1("angle4(vec1, vec2)", arguments);
    	realArray$1$1$1$1$1("vec1", 4);
    	realArray$1$1$1$1$1("vec2", 4);
    	return angle4$2$1$1$1$1(vec1, vec2);
    }

    //Other component-wise operations
    function fract$3$1$1$1$1$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("fract(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec");
    	target$1$1$1$1$1("target", vec.length);
    	return fract$2$1$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    function fract2$1$1$1$1$1$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("fract2(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 2);
    	target$1$1$1$1$1("target", 2);
    	return fract2$2$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    function fract3$1$1$1$1$1$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("fract3(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 3);
    	target$1$1$1$1$1("target", 3);
    	return fract3$2$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    function fract4$1$1$1$1$1$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("fract4(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 4);
    	target$1$1$1$1$1("target", 4);
    	return fract4$2$1$1$1$1(vec, target$1$1$1$1$1$1);
    }

    function polar2$1(vec, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("polar2(vec, ?target)", arguments);
    	realArray$1$1$1$1$1("vec", 2);
    	target$1$1$1$1$1("target", 2);
    	return polar2(vec, target$1$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(dot$1$1$1$1$1$1);
    Object.freeze(dot2$1$1$1$1$1$1);
    Object.freeze(dot3$1$1$1$1$1$1);
    Object.freeze(dot4$1$1$1$1$1$1);
    Object.freeze(cross3$1$1$1$1$1$1);
    Object.freeze(add$1$1$1$1$1$1);
    Object.freeze(add2$1$1$1$1$1$1);
    Object.freeze(add3$1$1$1$1$1$1);
    Object.freeze(add4$1$1$1$1$1$1);
    Object.freeze(sub$1$1$1$1$1$1);
    Object.freeze(sub2$1$1$1$1$1$1);
    Object.freeze(sub3$1$1$1$1$1$1);
    Object.freeze(sub4$1$1$1$1$1$1);
    Object.freeze(mag$1$1$1$1$1$1);
    Object.freeze(mag2$1$1$1$1$1$1);
    Object.freeze(mag3$1$1$1$1$1$1);
    Object.freeze(mag4$1$1$1$1$1$1);
    Object.freeze(smult$1);
    Object.freeze(smult2$1);
    Object.freeze(smult3$1);
    Object.freeze(smult4$1);
    Object.freeze(normalize$1$1$1$1$1$1);
    Object.freeze(normalize2$1$1$1$1$1$1);
    Object.freeze(normalize3$1$1$1$1$1$1);
    Object.freeze(normalize4$1$1$1$1$1$1);
    Object.freeze(angle$1$1$1$1$1$1);
    Object.freeze(angle2$1$1$1$1$1$1);
    Object.freeze(angle3$1$1$1$1$1$1);
    Object.freeze(angle4$1$1$1$1$1$1);
    Object.freeze(fract$3$1$1$1$1$1);
    Object.freeze(fract2$1$1$1$1$1$1);
    Object.freeze(fract3$1$1$1$1$1$1);
    Object.freeze(fract4$1$1$1$1$1$1);
    Object.freeze(polar2$1);

    function dot2$2$1$1$1$1$1(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos$1$1$1$1$1(vec1[1] - vec2[1]);
    }

    function mag$2$1$1$1$1$1(vec) {
    	return abs$1$1$1$1$1(vec[0]);
    }

    function smult2$2(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = mod$2$1$1$1$1(vec[1], TWO_PI$1$1$1$1$1);
    	return target;
    }

    function normalize2$2$1$1$1$1$1(vec, target = new Float64Array(2)) {
    	if (vec[0] === 0) {
    		return undefined;
    	}
    	target[0] = 1;
    	target[1] = mod$2$1$1$1$1(vec[1], TWO_PI$1$1$1$1$1);
    	return target;
    }

    function rect2(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	const theta = vec[1];
    	target[0] = r * cos$1$1$1$1$1(theta);
    	target[1] = r * sin$1$1$1$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(dot2$2$1$1$1$1$1);
    Object.freeze(mag$2$1$1$1$1$1);
    Object.freeze(smult2$2);
    Object.freeze(normalize2$2$1$1$1$1$1);
    Object.freeze(rect2);

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
    function smult$2(mat, k, target = new Float64Array(mat.length)) {
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
    function mmult(mat1, mat2) { //consider adding target parameter
    	const r1 = mat1.nrows;
    	const c1 = mat1.ncols;
    	const r2 = mat2.nrows;
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

    //Determinant
    function det2x2(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
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
    	const nrows = mat.nrows;
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

    // Freeze exports
    Object.freeze(zeros);
    Object.freeze(constant);
    Object.freeze(identity);
    Object.freeze(flatten);
    Object.freeze(smult$2);
    Object.freeze(transpose2x2);
    Object.freeze(transpose3x3);
    Object.freeze(transpose4x4);
    Object.freeze(mmult);
    Object.freeze(size);
    Object.freeze(det2x2);
    Object.freeze(inverse2x2);
    Object.freeze(vmult);
    Object.freeze(vmult2x2);
    Object.freeze(multv);

    function zeros$1(m, n) {
        setContext$1$1$1$1$1$1("zeros(m, n)", arguments);
        positiveInteger$1$1$1$1$1("m");
        positiveInteger$1$1$1$1$1("n");
        clearContext$1$1$1$1$1();
        return zeros(m, n);
    }

    function constant$1(m, n, value) {
    	setContext$1$1$1$1$1$1("constant(m, n, value)", arguments);
        positiveInteger$1$1$1$1$1("m");
        positiveInteger$1$1$1$1$1("n");
        realNumber$2$1$1$1$1("value");
        clearContext$1$1$1$1$1();
        return constant(m, n, value);
    }

    function identity$1(m) {
    	setContext$1$1$1$1$1$1("identity(m)", arguments);
        positiveInteger$1$1$1$1$1("m");
        clearContext$1$1$1$1$1();
        return identity(m);
    }

    /*
    function flatten(mat2d, target) { //Flattens 2D array into 1D array
    	setContext("flatten(mat2d, ?target)", arguments);
        //assert that mat2d is valid 2d unflattened matrix
        //assert target
        return src.flatten(mat2d, target);
    }*/

    //Scaling
    function smult$3(mat, k, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("smult(mat, k, target)", arguments);
        flatMatrix$1$1$1$1$1("mat");
        realNumber$2$1$1$1$1("k");
        target$1$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1$1();
        return smult$2(mat, k, target$1$1$1$1$1$1);
    }

    //Transpose
    function transpose2x2$1(mat, target$1$1$1$1$1$1) {
        setContext$1$1$1$1$1$1("transpose2x2(mat, target)", arguments);
    	flatMatrix$1$1$1$1$1("mat", 2, 2);
        target$1$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1$1();
        return transpose2x2(mat, target$1$1$1$1$1$1);
    }

    function transpose3x3$1(mat, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("transpose3x3(mat, target)", arguments);
    	flatMatrix$1$1$1$1$1("mat", 3, 3);
        target$1$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1$1();
        return transpose3x3(mat, target$1$1$1$1$1$1);
    }

    function transpose4x4$1(mat, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("transpose4x4(mat, target)", arguments);
    	flatMatrix$1$1$1$1$1("mat", [4, 4] );
        target$1$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1$1();
        return transpose4x4(mat, target$1$1$1$1$1$1);
    }

    //Matrix multiplication
    function mmult$1(mat1, mat2) {
    	setContext$1$1$1$1$1$1("mmult(mat1, mat2)", arguments);
    	flatMatrix$1$1$1$1$1("mat1");
    	flatMatrix$1$1$1$1$1("mat2", mat1.ncols);
        clearContext$1$1$1$1$1();
        return mmult(mat1, mat2);
    }

    //Size
    function size$1(mat) {
    	setContext$1$1$1$1$1$1("size(mat)", arguments);
    	flatMatrix$1$1$1$1$1("mat");
        clearContext$1$1$1$1$1();
    	return size(mat);
    }

    //Determinant
    function det2x2$1(mat) {
    	setContext$1$1$1$1$1$1("det2x2(mat)", arguments);
    	flatMatrix$1$1$1$1$1("mat", 2, 2);
    	clearContext$1$1$1$1$1();
    	return det2x2(mat);
    }

    //Inverse
    function inverse2x2$1(mat, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("inverse2(mat, target)", arguments);
    	flatMatrix$1$1$1$1$1("mat", 2, 2);
    	target$1$1$1$1$1('target', 4);
        clearContext$1$1$1$1$1();
    	return inverse2x2(mat, target$1$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(zeros$1);
    Object.freeze(constant$1);
    Object.freeze(identity$1);
    //Object.freeze(flatten);
    Object.freeze(smult$3);
    Object.freeze(transpose2x2$1);
    Object.freeze(transpose3x3$1);
    Object.freeze(transpose4x4$1);
    Object.freeze(mmult$1);
    Object.freeze(size$1);
    Object.freeze(det2x2$1);
    Object.freeze(inverse2x2$1);

    function conj(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function real(z) {
    	return z[0];
    }

    function imag(z) {
    	return z[1];
    }

    function arg(z) {
    	return atan2$1$1$1$1$1(z[1], z[0]);
    }

    function abs$1$1$1$1$1$1(z) {
    	return hypot$1$1$1$1$1(z[0], z[1]);
    }

    function add$2$1$1$1$1$1(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$2$1$1$1$1$1(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] - z2[0];
    	target[1] = z1[1] - z2[1];
    	return target;
    }

    function cmult(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	target[0] = re1 * re2 - im1 * im2;
    	target[1] = re1 * im2 - re2 * im1;
    	return target;
    }

    function smult$4(z, k, target = new Float64Array(2)) {
    	target[0] = z[0] * k;
    	target[1] = z[1] * k;
    	return target;
    }

    function div(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (- re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function inverse(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (-re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function polar(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const r = hypot$1$1$1$1$1(re, im);
    	target[0] = r;
    	target[1] = atan2$1$1$1$1$1(im, re);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj);
    Object.freeze(real);
    Object.freeze(imag);
    Object.freeze(arg);
    Object.freeze(abs$1$1$1$1$1$1);
    Object.freeze(add$2$1$1$1$1$1);
    Object.freeze(sub$2$1$1$1$1$1);
    Object.freeze(cmult);
    Object.freeze(smult$4);
    Object.freeze(div);
    Object.freeze(inverse);
    Object.freeze(polar);

    function conj$1(z, target$1$1$1$1$1$1) {
        setContext("conj(z, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return conj(z, target$1$1$1$1$1$1);
    }

    function real$1(z) {
    	setContext("real(z)", arguments);
    	rectComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
        return real(z);
    }

    function imag$1(z) {
    	setContext("imag(z)", arguments);
    	rectComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
        return imag(z);
    }

    function arg$1(z) {
    	setContext("arg(z)", arguments);
    	rectComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
        return arg(z);
    }

    function abs$2(z) {
    	setContext("abs(z)", arguments);
    	rectComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
        return abs$1$1$1$1$1$1(z);
    }

    function add$3(z1, z2, target$1$1$1$1$1$1) {
    	setContext("add(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z1");
        rectComplex$1$1$1$1$1("z2");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return add$2$1$1$1$1$1(z1, z2, target$1$1$1$1$1$1);
    }

    function sub$3(z1, z2, target$1$1$1$1$1$1) {
    	setContext("sub(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z1");
        rectComplex$1$1$1$1$1("z2");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return sub$2$1$1$1$1$1(z1, z2, target$1$1$1$1$1$1);
    }

    function cmult$1(z1, z2, target$1$1$1$1$1$1) {
    	setContext("cmult(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z1");
        rectComplex$1$1$1$1$1("z2");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return cmult(z1, z2, target$1$1$1$1$1$1);
    }

    function smult$5(z, k, target$1$1$1$1$1$1) {
    	setContext("smult(z, k, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z");
        realNumber$2$1$1$1$1("k");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return smult$4(z, k, target$1$1$1$1$1$1);
    }

    function div$1(z1, z2, target$1$1$1$1$1$1) {
    	setContext("div(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z1");
        rectComplex$1$1$1$1$1("z2");
        target$1$1$1$1$1('target', 2);
        const result = div(z1, z2, target$1$1$1$1$1$1);
        notDefined$1$1$1$1$1(result);
        clearContext$1$1$1$1$1();
        return result;
    }

    function inverse$1(z, target$1$1$1$1$1$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z");
        target$1$1$1$1$1('target', 2);
        const result = inverse(z, target$1$1$1$1$1$1);
        notDefined$1$1$1$1$1(result);
        clearContext$1$1$1$1$1();
        return result;
    }

    function polar$1(z, target$1$1$1$1$1$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex$1$1$1$1$1("z");
        target$1$1$1$1$1('target', 2);
        const result = polar(z, target$1$1$1$1$1$1);
        notDefined$1$1$1$1$1(result);
        clearContext$1$1$1$1$1();
        return result;
    }

    // Freeze exports
    Object.freeze(conj$1);
    Object.freeze(real$1);
    Object.freeze(imag$1);
    Object.freeze(arg$1);
    Object.freeze(abs$2);
    Object.freeze(add$3);
    Object.freeze(sub$3);
    Object.freeze(cmult$1);
    Object.freeze(smult$5);
    Object.freeze(div$1);
    Object.freeze(inverse$1);
    Object.freeze(polar$1);

    function toArg(angle) { //Not to be exported
    	angle = angle%TWO_PI$1$1$1$1$1;
    	if (angle > PI$1$1$1$1$1) {return angle - TWO_PI$1$1$1$1$1;}
    	if (angle < -PI$1$1$1$1$1) {return angle + TWO_PI$1$1$1$1$1;}
    	return angle;
    }

    function conj$2(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = -toArg(theta + PI$1$1$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = -toArg(theta);
    	}
    	return target;
    }

    function real$2(z) {
    	return z[0] * cos$1$1$1$1$1(z[1]);
    }

    function imag$2(z) {
    	return z[0] * sin$1$1$1$1$1(z[1]);
    }

    function arg$2(z) {
    	return toArg(z[1]);
    }

    function abs$3(z) {
    	return abs$1$1$1$1$1(z[0]);
    }

    function smult$6(z, k, target = new Float64Array(2)) {
    	const r = z[0] * k;
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg(theta + PI$1$1$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg(theta);
    	}
    	return target;
    }

    function cmult$2(z1, z2, target = new Float64Array(2)) {
    	const r = z1[0] * z2[0];
    	const theta = z1[1] + z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg(theta + PI$1$1$1$1$1);
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
    		target[1] = toArg(theta + PI$1$1$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg(theta);
    	}
    	return target;
    }

    function pow$1$1$1$1$1$1(z, n, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = pow$1$1$1$1$1(-r, n);
    		target[1] = toArg(n * (theta + PI$1$1$1$1$1));
    	} else {
    		target[0] = pow$1$1$1$1$1(r, n);
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
    		target[1] = toArg(-theta - PI$1$1$1$1$1);
    	} else {
    		target[0] = 1/r;
    		target[1] = toArg(-theta);
    	}
    	return target;
    }

    function rect(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	target[0] = r * cos$1$1$1$1$1(theta);
    	target[1] = r * sin$1$1$1$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$2);
    Object.freeze(real$2);
    Object.freeze(imag$2);
    Object.freeze(arg$2);
    Object.freeze(abs$3);
    Object.freeze(smult$6);
    Object.freeze(cmult$2);
    Object.freeze(div$2);
    Object.freeze(pow$1$1$1$1$1$1);
    Object.freeze(inverse$2);
    Object.freeze(rect);

    function conj$3(z, target$1$1$1$1$1$1) {
        setContext$1$1$1$1$1$1("conj(z, ?target)", arguments);
        target$1$1$1$1$1('target', 2);
        polarComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
        return conj$2(z, target$1$1$1$1$1$1);
    }

    function real$3(z) {
        setContext$1$1$1$1$1$1("real(z)", arguments);
        polarComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
    	return real$2(z);
    }

    function imag$3(z) {
        setContext$1$1$1$1$1$1("imag(z)", arguments);
        polarComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
    	return imag$2(z);
    }

    function arg$3(z) {
        setContext$1$1$1$1$1$1("arg(z)", arguments);
        polarComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
    	return arg$2(z);
    }

    function abs$4(z) {
        setContext$1$1$1$1$1$1("abs(z)", arguments);
        polarComplex$1$1$1$1$1("z");
        clearContext$1$1$1$1$1();
    	return abs$3(z);
    }

    function smult$7(z, k, target$1$1$1$1$1$1) {
        setContext$1$1$1$1$1$1("smult(z, k, ?target)", arguments);
    	polarComplex$1$1$1$1$1("z");
        realNumber$2$1$1$1$1("k");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return smult$6(z, k, target$1$1$1$1$1$1);
    }

    function cmult$3(z1, z2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("cmult(z1, z2, ?target)", arguments);
    	polarComplex$1$1$1$1$1("z1");
        polarComplex$1$1$1$1$1("z2");
        target$1$1$1$1$1('target', 2);
        return cmult$2(z1, z2, target$1$1$1$1$1$1);
    }

    function div$3(z1, z2, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("div(z1, z2, ?target)", arguments);
    	polarComplex$1$1$1$1$1("z1");
        polarComplex$1$1$1$1$1("z2");
        target$1$1$1$1$1('target', 2);
        const result = div$2(z1, z2, target$1$1$1$1$1$1);
        notDefined$1$1$1$1$1(result);
        clearContext$1$1$1$1$1();
        return result;
    }

    function pow$2(z, n, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("pow(z, n, ?target)", arguments);
        polarComplex$1$1$1$1$1("z");
        realNumber$2$1$1$1$1("n");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return pow$1$1$1$1$1$1(z, n, target$1$1$1$1$1$1);
    }

    function inverse$3(z, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("inverse(z, ?target)", arguments);
        polarComplex$1$1$1$1$1("z");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return inverse$2(z, target$1$1$1$1$1$1);
    }

    function rect$1(z, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("rect(z, ?target)", arguments);
        polarComplex$1$1$1$1$1("z");
        target$1$1$1$1$1('target', 2);
        clearContext$1$1$1$1$1();
        return rect(z, target$1$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(conj$3);
    Object.freeze(real$3);
    Object.freeze(imag$3);
    Object.freeze(arg$3);
    Object.freeze(abs$4);
    Object.freeze(smult$7);
    Object.freeze(cmult$3);
    Object.freeze(div$3);
    Object.freeze(pow$2);
    Object.freeze(inverse$3);
    Object.freeze(rect$1);

    const MAX_LINEAR_SEARCH_LENGTH = 64; //Yet to be optimised

    function sum(arr) {
    	const len = arr.length;
    	let result = 0;
    	for (let i = 0; i < len; i++) {
    		result += arr[i];
    	}
    	return result;
    }

    function min$1$1$1$1$1$1(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return min$1$1$1$1$1(arr[0], arr[len-1]);
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

    function max$1$1$1$1$1$1(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return max$1$1$1$1$1(arr[0], arr[len-1]);
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
    				currentIndex = floor$1$1$1$1$1(0.5 * (lowerBound + upperBound));
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
    				currentIndex = floor$1$1$1$1$1(0.5 * (lowerBound + upperBound));
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

    function isEqual(arr1, arr2) {
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
    				currentIndex = floor$1$1$1$1$1(0.5 * (lowerBound + upperBound));
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
    				currentIndex = floor$1$1$1$1$1(0.5 * (lowerBound + upperBound));
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
    				currentIndex = floor$1$1$1$1$1(0.5 * (lowerBound + upperBoundFirst));
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
    				currentIndex = floor$1$1$1$1$1(0.5 * (lowerBoundLast + upperBound));
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
    Object.freeze(min$1$1$1$1$1$1);
    Object.freeze(max$1$1$1$1$1$1);
    Object.freeze(prod);
    Object.freeze(unique);
    Object.freeze(indexOf);
    Object.freeze(union);
    Object.freeze(isEqual);
    Object.freeze(sortUint8);
    Object.freeze(imin);
    Object.freeze(imax);
    Object.freeze(count);

    function sum$1(arr) {
    	setContext$1$1$1$1$1$1("sum(arr)", arguments);
    	realArray$1$1$1$1$1("arr");
    	const result = sum(arr);
    	realOverflow$1$1$1$1$1(result);
    	clearContext$1$1$1$1$1();
    	return result;
    }

    function min$2(arr, sorted$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("min(arr, ?sorted)", arguments);
    	realArray$1$1$1$1$1("arr");
    	bool$1$1$1$1$1$1("sorted");
    	sorted$1$1$1$1$1("arr", "sorted");
    	clearContext$1$1$1$1$1();
    	return min$1$1$1$1$1$1(arr, sorted$1$1$1$1$1$1);
    }

    function max$2(arr, sorted$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("max(arr, ?sorted)", arguments);
    	realArray$1$1$1$1$1("arr");
    	bool$1$1$1$1$1$1("sorted");
    	sorted$1$1$1$1$1("arr", "sorted");
    	clearContext$1$1$1$1$1();
    	return max$1$1$1$1$1$1(arr, sorted$1$1$1$1$1$1);
    }

    function prod$1(arr) {
    	setContext$1$1$1$1$1$1("prod(arr)", arguments);
    	realArray$1$1$1$1$1('arr');
    	clearContext$1$1$1$1$1();
    	return prod(arr);
    }

    function unique$1(arr, sorted$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("unique(arr, ?sorted)", arguments);
    	realArray$1$1$1$1$1('arr');
    	bool$1$1$1$1$1$1('sorted');
    	sorted$1$1$1$1$1('arr', 'sorted');
    	clearContext$1$1$1$1$1();
    	return unique(arr, sorted$1$1$1$1$1$1);
    }

    function indexOf$1(arr, value, sorted$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("indexOf(arr, value, ?sorted)", arguments);
    	realArray$1$1$1$1$1('arr');
    	realNumber$2$1$1$1$1('value');
    	bool$1$1$1$1$1$1('sorted');
    	sorted$1$1$1$1$1('arr', 'sorted');
    	clearContext$1$1$1$1$1();
    	return indexOf(arr, value, sorted$1$1$1$1$1$1);
    }

    function union$1(arr1, arr2, sorted$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("union(arr1, arr2, ?sorted)", arguments);
    	realArray$1$1$1$1$1('arr1');
    	realArray$1$1$1$1$1('arr2');
    	bool$1$1$1$1$1$1('sorted');
    	sorted$1$1$1$1$1('arr1', 'sorted');
    	sorted$1$1$1$1$1('arr2', 'sorted'); // May have ensure sorted same way as arr1
    	clearContext$1$1$1$1$1();
    	return union(arr1, arr2, sorted$1$1$1$1$1$1);
    }

    function isEqual$1(arr1, arr2) {
    	setContext$1$1$1$1$1$1("isEqual(arr1, arr2)", arguments);
    	realArray$1$1$1$1$1('arr1');
    	realArray$1$1$1$1$1('arr2');
    	clearContext$1$1$1$1$1();
    	return isEqual(arr1, arr2);
    }

    function sortUint8$1(arr, target$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1('sortUint8(arr, ?target)', arguments);
    	if (arr.constructor !== Uint8Array) {
    		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
    	}
    	target$1$1$1$1$1('target', arr.length);
    	clearContext$1$1$1$1$1();
    	return sortUint8(arr, target$1$1$1$1$1$1);
    }

    function count$1(arr, value, sorted$1$1$1$1$1$1) {
    	setContext$1$1$1$1$1$1("count(arr, value, ?sorted)", arguments);
    	realArray$1$1$1$1$1('arr');
    	realNumber$2$1$1$1$1('value');
    	bool$1$1$1$1$1$1('sorted');
    	sorted$1$1$1$1$1('arr', 'sorted');
    	clearContext$1$1$1$1$1();
    	return count(arr, value, sorted$1$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(sum$1);
    Object.freeze(min$2);
    Object.freeze(max$2);
    Object.freeze(prod$1);
    Object.freeze(unique$1);
    Object.freeze(indexOf$1);
    Object.freeze(union$1);
    Object.freeze(isEqual$1);
    Object.freeze(sortUint8$1);
    Object.freeze(count$1);

    var array_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sum: sum$1,
        min: min$2,
        max: max$2,
        prod: prod$1,
        unique: unique$1,
        indexOf: indexOf$1
    });

    var array_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: array_debug,
        sum: sum,
        min: min$1$1$1$1$1$1,
        max: max$1$1$1$1$1$1,
        prod: prod,
        unique: unique,
        indexOf: indexOf,
        union: union,
        isEqual: isEqual,
        sortUint8: sortUint8,
        imin: imin,
        imax: imax,
        count: count
    });

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
    	return sqrt$1$1$1$1$1(variance(arr, freq, sample));
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
    	return lambda * exp$1$1$1$1$1(-lambda * x);
    }
    function expCdf(x, lambda) {
    	return 1 - exp$1$1$1$1$1(-lambda * x);
    }
    function expInvCdf(p, lambda) {
    	return -ln$1$1$1$1$1(1 - p) / lambda;
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

    function frac(num, tolerance = num * EPSILON$1$1$1$1$1) { //Farey rational approximation algorithm
    	const wholePart = floor$1$1$1$1$1(num);
    	const fractionalPart = num - whole;
    	let leftNumerator = 0;
    	let leftDenominator = 1;
    	let rightNumerator = 1;
    	let rightDenominator = 1;
    	let numerator = 1;
    	let denominator = 2;
    	let currentValue = numerator / denominator;
    	while (abs$1$1$1$1$1(currentValue - num) > tolerance) {
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

    function deriv(f, x) {
    	x0 = x * (1 + EPSILON$1$1$1$1$1);
    	x1 = x * (1 - EPSILON$1$1$1$1$1);
    	dx = x1 - x0;
    	return (f(x1) - f(x0)) / dx;
    }

    //Freeze exports
    Object.freeze(frac);
    Object.freeze(deriv);

    //Constants
    // Ratio-of-uniforms
    const RU_SCALE_CONSTANT = sqrt$1$1$1$1$1(2 / E$1$1$1$1$1);
    // Park-Miller
    const MCG_A = 48271;
    const MCG_M = 2147483647;
    const MCG_M_PLUS_1 = MCG_M + 1;

    //Unseeded random number generation
    // Continuous uniform distribution
    function unif(a = 0, b = 1, count = undefined) { //a>b or b>a
    	if (count === undefined) { //Return single value
    		return a + (b - a) * random$1$1$1$1$1();
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = a + (b - a) * random$1$1$1$1$1();
    		}
    		return result;
    	}
    }

    // Uniform integer distribution
    function int(a, b, count = undefined) { //assumes b > a
    	const A = ceil$1$1$1$1$1(a);
    	const B = floor$1$1$1$1$1(b) + 1;
    	const r = B - A;
    	if (count === undefined) { //Return single value
    		return floor$1$1$1$1$1(A + random$1$1$1$1$1() * r);
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = floor$1$1$1$1$1(A + r * random$1$1$1$1$1());
    		}
    		return result;
    	}
    }

    // Normal distribution
    function norm(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
    	if (count === undefined) { //Return single value
    		while (true) {
    			const u1 = random$1$1$1$1$1();
    			const v2 = random$1$1$1$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1$1$1$1(-0.5 * x * x)) {
    				return mean + x * sd;
    			}
    		}
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		let i = 0;
    		while (i < count) {
    			const u1 = random$1$1$1$1$1();
    			const v2 = random$1$1$1$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1$1$1$1(-0.5 * x * x)) {
    				result[i++] = mean + x * sd;
    			}
    		}
    		return result;
    	}
    }

    // Exponential distribution
    function exp$1$1$1$1$1$1(lambda = 1, count = undefined) {
    	if (count === undefined) { //Return single value
    		return -ln$1$1$1$1$1(random$1$1$1$1$1()) / lambda;
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = -ln$1$1$1$1$1(random$1$1$1$1$1()) / lambda;
    		}
    		return result;
    	}
    }

    //Seeded random number generators

    // (Uniform) Multiplicative congruential generator
    function MCG(a = 0, b = 1, seed = int(1, 4294967295)) {
    	let scaleFactor, state; //Declare variables
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = floor$1$1$1$1$1(abs$1$1$1$1$1(s)); //TODO: use hash instead of just floor(abs())
    			state = seed;
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

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	return Object.freeze(generator);
    }

    //Xorshift
    function Xorshift32(a = 0, b = 1, seed = int(1, 4294967295)) {
    	const state = new Uint32Array(1);
    	let scaleFactor;
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = trunc$1$1$1$1$1(s) || 1; //TODO: use hash, not just trunc(s)
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
    				if ( (u1 * u1) <= exp$1$1$1$1$1(-0.5 * x * x)) {
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
    				if ( (u1 * u1) <= exp$1$1$1$1$1(-0.5 * x * x)) {
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
    	const urand = Xorshift32(ceil$1$1$1$1$1(a), floor$1$1$1$1$1(b) + 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return floor$1$1$1$1$1(urand());
    		} else { //Return array of values
    			const result = urand(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = floor$1$1$1$1$1(result[i]);
    			}
    			return result;
    		}
    	};

    	const _range = function(r = a, s = b) {
    		a = r;
    		b = s;
    		urand.range(ceil$1$1$1$1$1(a), floor$1$1$1$1$1(b) + 1);
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
    			return -ln$1$1$1$1$1(urand()) / lambda;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = -ln$1$1$1$1$1(urand()) / lambda;
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
    Object.freeze(exp$1$1$1$1$1$1);

    Object.freeze(MCG);
    Object.freeze(Xorshift32);
    Object.freeze(RU);

    Object.freeze(Unif);
    Object.freeze(Int);
    Object.freeze(Norm);
    Object.freeze(Exp);

    //Uniform mapping
    function Float1to1(seed = int(1, MAX_SAFE_INTEGER$1$1$1$1$1)) { //Scalar -> scalar
    	//Seed checking
    	seed = mod$2$1$1$1$1(seed * 10.23, 4096000);
    	//Function
    	const rng = function(x) {
    		x = fract$4$1$1$1$1(x * 0.1031);
    		x *= x + seed;
    		x *= x + x;
    		return fract$4$1$1$1$1(x);
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    function Float2to1(seed = int(1, MAX_SAFE_INTEGER$1$1$1$1$1)) { //2D vector -> scalar
    	//Seed checking
    	seed = mod$2$1$1$1$1(seed * 10.23, MAX_SAFE_INTEGER$1$1$1$1$1);
    	//Function
    	const rng = function(vec) {
    		const pX = fract$4$1$1$1$1(vec[0] * 0.1031);
    		const pY = fract$4$1$1$1$1(vec[1] * 0.1031);
    		const offset = dot3$2$1$1$1$1([pX, pY, pX], [pY + seed, pX + seed, pX + seed]);
    		return fract$4$1$1$1$1((pX + pY + 2 * offset) * (pX + offset));
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    // Freeze exports
    Object.freeze(Float1to1);
    Object.freeze(Float2to1);

    //Perlin noise
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
    		const x0 = floor$1$1$1$1$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return avg + lerp$2$1$1$1$1(c0, c1, fade(u)) * scaleFactor;
    	};
    	//Make seed public
    	perlin.seed = seed;
    	//Derivative
    	const deriv = function(x) { //Just derivative
    		const x0 = floor$1$1$1$1$1(x);
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
    		const minCell = floor$1$1$1$1$1(xmin);
    		const maxCell = floor$1$1$1$1$1(xmin + count * step);
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
    				result[index++] = lerp$2$1$1$1$1(c0, c1, fade(locX));
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

    const MAX_LINEAR_SEARCH_LENGTH$1 = 64; //Yet to be optimised

    function sum$3(arr) {
    	const len = arr.length;
    	let result = 0;
    	for (let i = 0; i < len; i++) {
    		result += arr[i];
    	}
    	return result;
    }

    function min$3(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return min$1$1$1$1(arr[0], arr[len-1]);
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

    function max$3(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return max$1$1$1$1(arr[0], arr[len-1]);
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

    function imax$1(arr, sorted = false) {
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

    function imin$1(arr, sorted = false) {
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

    function prod$2(arr) {
    	const len = arr.length;
    	let result = 1; //By convention for empty array
    	for (let i = 1; i < len; i++) {
    		result *= arr[i];
    	}
    	return result;
    }

    function unique$2(arr, sorted = false) {
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

    function indexOf$2(arr, value, sorted = false) {
    	const len = arr.length;
    	if ((!sorted)||(len <= MAX_LINEAR_SEARCH_LENGTH$1)) { //Unsorted or small length
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$1) {
    				currentIndex = floor$1$1$1$1(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue > value) {
    					lowerBound = currentIndex;
    				} else {
    					upperBound = currentIndex;
    				}
    			}
    		} else { //Ascending order
    			if ((startValue > value)||(endValue < value)) {return -1;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$1) {
    				currentIndex = floor$1$1$1$1(0.5 * (lowerBound + upperBound));
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

    function union$2(arr1, arr2, sorted = false) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if ( (!sorted) || (len1 + len2 < MAX_LINEAR_SEARCH_LENGTH$1) ) { //Arrays unsorted or short
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

    function isEqual$2(arr1, arr2) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if (len1 !== len2) {return false;}
    	for (let i = 0; i < len1; i++) {
    		if (arr1[i] !== arr2[i]) {return false;}
    	}
    	return true;
    }

    function sortUint8$2(arr, target = new Uint8Array(arr.length)) { //Radix sort
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

    function count$2(arr, value, sorted = false) {
    	const len = arr.length;
    	let result = 0;
    	if ((!sorted)||(arr.length <= MAX_LINEAR_SEARCH_LENGTH$1)) { //Unsorted or short array
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$1) {
    				currentIndex = floor$1$1$1$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$1) {
    				currentIndex = floor$1$1$1$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBoundFirst - lowerBound > MAX_LINEAR_SEARCH_LENGTH$1) {
    				currentIndex = floor$1$1$1$1(0.5 * (lowerBound + upperBoundFirst));
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
    			while (upperBound - lowerBoundLast > MAX_LINEAR_SEARCH_LENGTH$1) {
    				currentIndex = floor$1$1$1$1(0.5 * (lowerBoundLast + upperBound));
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
    Object.freeze(sum$3);
    Object.freeze(min$3);
    Object.freeze(max$3);
    Object.freeze(prod$2);
    Object.freeze(unique$2);
    Object.freeze(indexOf$2);
    Object.freeze(union$2);
    Object.freeze(isEqual$2);
    Object.freeze(sortUint8$2);
    Object.freeze(imin$1);
    Object.freeze(imax$1);
    Object.freeze(count$2);

    function zeros$2(nrows, ncols) {
    	const result = new Float64Array(nrows * ncols);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function constant$2(nrows, ncols, value) {
    	const result = new Float64Array(nrows * ncols);
    	result.fill(value);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function identity$2(n) {
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

    function flatten$1(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
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
    function scale$3(mat, k, target = new Float64Array(mat.length)) {
    	const len = mat.length;
    	for (let i = 0; i < len; i++) {
    		target[i] = mat[i] * k;
    	}
    	target.nrows = mat.nrows;
    	target.ncols = mat.ncols;
    	return target;
    }

    //Transpose
    function transpose2x2$2(mat, target = new Float64Array(4)) {
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

    function transpose3x3$2(mat, target = new Float64Array(9)) {
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

    function transpose4x4$2(mat, target = new Float64Array(16)) {
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
    	const r2 = mat2.nrows;
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
    function size$2(mat) {
    	return [mat.nrows, mat.ncols];
    }

    //Determinant
    function det2x2$2(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
    }

    //Inverse
    function inverse2x2$2(mat, target = new Float64Array(4)) {
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
    function vmult$1(vec, mat) { //Premultiply by vector (assumed row-vector)
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

    function vmult2x2$1(vec, mat) {
    	const target = new Float64Array(2);
    	const v0 = vec[0];
    	const v1 = vec[1];
    	target[0] = v0 * mat[0] + v1 * mat[2];
    	target[0] = v0 * mat[1] + v1 * mat[3];
    	return target;
    }

    function multv$1(mat, vec) {
    	const nrows = mat.nrows;
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

    function isEqual$3(mat1, mat2) {
    	if ( (mat1.nrows !== mat2.nrows) || (mat1.ncols !== mat2.ncols) ) {
    		return false;
    	}
    	return array_lib.isArrayEqual(mat1, mat2);
    }

    // Freeze exports
    Object.freeze(zeros$2);
    Object.freeze(constant$2);
    Object.freeze(identity$2);
    Object.freeze(flatten$1);
    Object.freeze(scale$3);
    Object.freeze(transpose2x2$2);
    Object.freeze(transpose3x3$2);
    Object.freeze(transpose4x4$2);
    Object.freeze(mult);
    Object.freeze(size$2);
    Object.freeze(det2x2$2);
    Object.freeze(inverse2x2$2);
    Object.freeze(vmult$1);
    Object.freeze(vmult2x2$1);
    Object.freeze(multv$1);
    Object.freeze(isEqual$3);

    function zeros$3(m, n) {
        setContext$1$1$1$1$1("zeros(m, n)", arguments);
        positiveInteger$1$1$1$1("m");
        positiveInteger$1$1$1$1("n");
        clearContext$1$1$1$1();
        return zeros$2(m, n);
    }

    function constant$3(m, n, value) {
    	setContext$1$1$1$1$1("constant(m, n, value)", arguments);
        positiveInteger$1$1$1$1("m");
        positiveInteger$1$1$1$1("n");
        realNumber$2$1$1$1("value");
        clearContext$1$1$1$1();
        return constant$2(m, n, value);
    }

    function identity$3(m) {
    	setContext$1$1$1$1$1("identity(m)", arguments);
        positiveInteger$1$1$1$1("m");
        clearContext$1$1$1$1();
        return identity$2(m);
    }

    //TODO: debug for 'flatten

    //Scaling
    function scale$4(mat, k, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("scale(mat, k, target)", arguments);
        flatMatrix$1$1$1$1("mat");
        realNumber$2$1$1$1("k");
        target$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1();
        return scale$3(mat, k, target$1$1$1$1$1);
    }

    //Transpose
    function transpose2x2$3(mat, target$1$1$1$1$1) {
        setContext$1$1$1$1$1("transpose2x2(mat, target)", arguments);
    	flatMatrix$1$1$1$1("mat", 2, 2);
        target$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1();
        return transpose2x2$2(mat, target$1$1$1$1$1);
    }

    function transpose3x3$3(mat, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("transpose3x3(mat, target)", arguments);
    	flatMatrix$1$1$1$1("mat", 3, 3);
        target$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1();
        return transpose3x3$2(mat, target$1$1$1$1$1);
    }

    function transpose4x4$3(mat, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("transpose4x4(mat, target)", arguments);
    	flatMatrix$1$1$1$1("mat", [4, 4] );
        target$1$1$1$1('target', mat.length);
        clearContext$1$1$1$1();
        return transpose4x4$2(mat, target$1$1$1$1$1);
    }

    //Matrix multiplication
    function mult$1(mat1, mat2) {
    	setContext$1$1$1$1$1("mult(mat1, mat2)", arguments);
    	flatMatrix$1$1$1$1("mat1");
    	flatMatrix$1$1$1$1("mat2", mat1.ncols);
        clearContext$1$1$1$1();
        return mult(mat1, mat2);
    }

    //Size
    function size$3(mat) {
    	setContext$1$1$1$1$1("size(mat)", arguments);
    	flatMatrix$1$1$1$1("mat");
        clearContext$1$1$1$1();
    	return size$2(mat);
    }

    //Determinant
    function det2x2$3(mat) {
    	setContext$1$1$1$1$1("det2x2(mat)", arguments);
    	flatMatrix$1$1$1$1("mat", 2, 2);
    	clearContext$1$1$1$1();
    	return det2x2$2(mat);
    }

    //Inverse
    function inverse2x2$3(mat, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("inverse2(mat, target)", arguments);
    	flatMatrix$1$1$1$1("mat", 2, 2);
    	target$1$1$1$1('target', 4);
        clearContext$1$1$1$1();
    	return inverse2x2$2(mat, target$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(zeros$3);
    Object.freeze(constant$3);
    Object.freeze(identity$3);
    //Object.freeze(flatten);
    Object.freeze(scale$4);
    Object.freeze(transpose2x2$3);
    Object.freeze(transpose3x3$3);
    Object.freeze(transpose4x4$3);
    Object.freeze(mult$1);
    Object.freeze(size$3);
    Object.freeze(det2x2$3);
    Object.freeze(inverse2x2$3);

    function conj$4(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function real$4(z) {
    	return z[0];
    }

    function imag$4(z) {
    	return z[1];
    }

    function arg$4(z) {
    	return atan2$1$1$1$1(z[1], z[0]);
    }

    function abs$5(z) {
    	return hypot$1$1$1$1(z[0], z[1]);
    }

    function add$4(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$4(z1, z2, target = new Float64Array(2)) {
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
    	target[1] = re1 * im2 - re2 * im1;
    	return target;
    }

    function scale$5(z, k, target = new Float64Array(2)) {
    	target[0] = z[0] * k;
    	target[1] = z[1] * k;
    	return target;
    }

    function div$4(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (- re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function inverse$4(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (-re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function toPolar(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const r = hypot$1$1$1$1(re, im);
    	target[0] = r;
    	target[1] = atan2$1$1$1$1(im, re);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$4);
    Object.freeze(real$4);
    Object.freeze(imag$4);
    Object.freeze(arg$4);
    Object.freeze(abs$5);
    Object.freeze(add$4);
    Object.freeze(sub$4);
    Object.freeze(mult$2);
    Object.freeze(scale$5);
    Object.freeze(div$4);
    Object.freeze(inverse$4);
    Object.freeze(toPolar);

    function conj$5(z, target$1$1$1$1$1) {
        setContext("conj(z, ?target)", arguments);
    	rectComplex$1$1$1$1("z");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return conj$4(z, target$1$1$1$1$1);
    }

    function real$5(z) {
    	setContext("real(z)", arguments);
    	rectComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
        return real$4(z);
    }

    function imag$5(z) {
    	setContext("imag(z)", arguments);
    	rectComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
        return imag$4(z);
    }

    function arg$5(z) {
    	setContext("arg(z)", arguments);
    	rectComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
        return arg$4(z);
    }

    function abs$6(z) {
    	setContext("abs(z)", arguments);
    	rectComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
        return abs$5(z);
    }

    function add$5(z1, z2, target$1$1$1$1$1) {
    	setContext("add(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1("z1");
        rectComplex$1$1$1$1("z2");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return add$4(z1, z2, target$1$1$1$1$1);
    }

    function sub$5(z1, z2, target$1$1$1$1$1) {
    	setContext("sub(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1("z1");
        rectComplex$1$1$1$1("z2");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return sub$4(z1, z2, target$1$1$1$1$1);
    }

    function mult$3(z1, z2, target$1$1$1$1$1) {
    	setContext("mult(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1("z1");
        rectComplex$1$1$1$1("z2");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return mult$2(z1, z2, target$1$1$1$1$1);
    }

    function scale$6(z, k, target$1$1$1$1$1) {
    	setContext("scale(z, k, ?target)", arguments);
    	rectComplex$1$1$1$1("z");
        realNumber$2$1$1$1("k");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return scale$5(z, k, target$1$1$1$1$1);
    }

    function div$5(z1, z2, target$1$1$1$1$1) {
    	setContext("div(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1$1("z1");
        rectComplex$1$1$1$1("z2");
        target$1$1$1$1('target', 2);
        const result = div$4(z1, z2, target$1$1$1$1$1);
        notDefined$1$1$1$1(result);
        clearContext$1$1$1$1();
        return result;
    }

    function inverse$5(z, target$1$1$1$1$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex$1$1$1$1("z");
        target$1$1$1$1('target', 2);
        const result = inverse$4(z, target$1$1$1$1$1);
        notDefined$1$1$1$1(result);
        clearContext$1$1$1$1();
        return result;
    }

    function polar$2(z, target$1$1$1$1$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex$1$1$1$1("z");
        target$1$1$1$1('target', 2);
        const result = undefined(z, target$1$1$1$1$1);
        notDefined$1$1$1$1(result);
        clearContext$1$1$1$1();
        return result;
    }

    // Freeze exports
    Object.freeze(conj$5);
    Object.freeze(real$5);
    Object.freeze(imag$5);
    Object.freeze(arg$5);
    Object.freeze(abs$6);
    Object.freeze(add$5);
    Object.freeze(sub$5);
    Object.freeze(mult$3);
    Object.freeze(scale$6);
    Object.freeze(div$5);
    Object.freeze(inverse$5);
    Object.freeze(polar$2);

    function toArg$1(angle) { //Not to be exported
    	angle = angle%TWO_PI$1$1$1$1;
    	if (angle > PI$1$1$1$1) {return angle - TWO_PI$1$1$1$1;}
    	if (angle < -PI$1$1$1$1) {return angle + TWO_PI$1$1$1$1;}
    	return angle;
    }

    function conj$6(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = -toArg$1(theta + PI$1$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = -toArg$1(theta);
    	}
    	return target;
    }

    function real$6(z) {
    	return z[0] * cos$1$1$1$1(z[1]);
    }

    function imag$6(z) {
    	return z[0] * sin$1$1$1$1(z[1]);
    }

    function arg$6(z) {
    	return toArg$1(z[1]);
    }

    function abs$7(z) {
    	return abs$1$1$1$1(z[0]);
    }

    function scale$7(z, k, target = new Float64Array(2)) {
    	const r = z[0] * k;
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$1(theta + PI$1$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$1(theta);
    	}
    	return target;
    }

    function mult$4(z1, z2, target = new Float64Array(2)) {
    	const r = z1[0] * z2[0];
    	const theta = z1[1] + z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$1(theta + PI$1$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$1(theta);
    	}
    	return target;
    }

    function div$6(z1, z2, target = new Float64Array(2)) {
    	const r2 = z2[0];
    	if (r2 === 0) {return undefined;}
    	const r = z1[0] / r2;
    	const theta = z1[1] - z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$1(theta + PI$1$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$1(theta);
    	}
    	return target;
    }

    function pow$3(z, n, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = pow$1$1$1$1(-r, n);
    		target[1] = toArg$1(n * (theta + PI$1$1$1$1));
    	} else {
    		target[0] = pow$1$1$1$1(r, n);
    		target[1] = toArg$1(n * theta);
    	}
    	return target;
    }

    function inverse$6(z, target = new Float64Array(2)) {
    	const r = z[0];
    	if (r === 0) {return undefined;}
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -1/r;
    		target[1] = toArg$1(-theta - PI$1$1$1$1);
    	} else {
    		target[0] = 1/r;
    		target[1] = toArg$1(-theta);
    	}
    	return target;
    }

    function toRect(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	target[0] = r * cos$1$1$1$1(theta);
    	target[1] = r * sin$1$1$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$6);
    Object.freeze(real$6);
    Object.freeze(imag$6);
    Object.freeze(arg$6);
    Object.freeze(abs$7);
    Object.freeze(scale$7);
    Object.freeze(mult$4);
    Object.freeze(div$6);
    Object.freeze(pow$3);
    Object.freeze(inverse$6);
    Object.freeze(toRect);

    function conj$7(z, target$1$1$1$1$1) {
        setContext$1$1$1$1$1("conj(z, ?target)", arguments);
        target$1$1$1$1('target', 2);
        polarComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
        return conj$6(z, target$1$1$1$1$1);
    }

    function real$7(z) {
        setContext$1$1$1$1$1("real(z)", arguments);
        polarComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
    	return real$6(z);
    }

    function imag$7(z) {
        setContext$1$1$1$1$1("imag(z)", arguments);
        polarComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
    	return imag$6(z);
    }

    function arg$7(z) {
        setContext$1$1$1$1$1("arg(z)", arguments);
        polarComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
    	return arg$6(z);
    }

    function abs$8(z) {
        setContext$1$1$1$1$1("abs(z)", arguments);
        polarComplex$1$1$1$1("z");
        clearContext$1$1$1$1();
    	return abs$7(z);
    }

    function scale$8(z, k, target$1$1$1$1$1) {
        setContext$1$1$1$1$1("scale(z, k, ?target)", arguments);
    	polarComplex$1$1$1$1("z");
        realNumber$2$1$1$1("k");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return scale$7(z, k, target$1$1$1$1$1);
    }

    function mult$5(z1, z2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("mult(z1, z2, ?target)", arguments);
    	polarComplex$1$1$1$1("z1");
        polarComplex$1$1$1$1("z2");
        target$1$1$1$1('target', 2);
        return mult$4(z1, z2, target$1$1$1$1$1);
    }

    function div$7(z1, z2, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("div(z1, z2, ?target)", arguments);
    	polarComplex$1$1$1$1("z1");
        polarComplex$1$1$1$1("z2");
        target$1$1$1$1('target', 2);
        const result = div$6(z1, z2, target$1$1$1$1$1);
        notDefined$1$1$1$1(result);
        clearContext$1$1$1$1();
        return result;
    }

    function pow$4(z, n, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("pow(z, n, ?target)", arguments);
        polarComplex$1$1$1$1("z");
        realNumber$2$1$1$1("n");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return pow$3(z, n, target$1$1$1$1$1);
    }

    function inverse$7(z, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("inverse(z, ?target)", arguments);
        polarComplex$1$1$1$1("z");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return inverse$6(z, target$1$1$1$1$1);
    }

    function rect$2(z, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1("rect(z, ?target)", arguments);
        polarComplex$1$1$1$1("z");
        target$1$1$1$1('target', 2);
        clearContext$1$1$1$1();
        return undefined(z, target$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(conj$7);
    Object.freeze(real$7);
    Object.freeze(imag$7);
    Object.freeze(arg$7);
    Object.freeze(abs$8);
    Object.freeze(scale$8);
    Object.freeze(mult$5);
    Object.freeze(div$7);
    Object.freeze(pow$4);
    Object.freeze(inverse$7);
    Object.freeze(rect$2);

    function sum$4(arr) {
    	setContext$1$1$1$1$1("sum(arr)", arguments);
    	realArray$1$1$1$1("arr");
    	const result = sum$3(arr);
    	realOverflow$1$1$1$1(result);
    	clearContext$1$1$1$1();
    	return result;
    }

    function min$4(arr, sorted$1$1$1$1$1) {
    	setContext$1$1$1$1$1("min(arr, ?sorted)", arguments);
    	realArray$1$1$1$1("arr");
    	bool$1$1$1$1$1("sorted");
    	sorted$1$1$1$1("arr", "sorted");
    	clearContext$1$1$1$1();
    	return min$3(arr, sorted$1$1$1$1$1);
    }

    function max$4(arr, sorted$1$1$1$1$1) {
    	setContext$1$1$1$1$1("max(arr, ?sorted)", arguments);
    	realArray$1$1$1$1("arr");
    	bool$1$1$1$1$1("sorted");
    	sorted$1$1$1$1("arr", "sorted");
    	clearContext$1$1$1$1();
    	return max$3(arr, sorted$1$1$1$1$1);
    }

    function prod$3(arr) {
    	setContext$1$1$1$1$1("prod(arr)", arguments);
    	realArray$1$1$1$1('arr');
    	clearContext$1$1$1$1();
    	return prod$2(arr);
    }

    function unique$3(arr, sorted$1$1$1$1$1) {
    	setContext$1$1$1$1$1("unique(arr, ?sorted)", arguments);
    	realArray$1$1$1$1('arr');
    	bool$1$1$1$1$1('sorted');
    	sorted$1$1$1$1('arr', 'sorted');
    	clearContext$1$1$1$1();
    	return unique$2(arr, sorted$1$1$1$1$1);
    }

    function indexOf$3(arr, value, sorted$1$1$1$1$1) {
    	setContext$1$1$1$1$1("indexOf(arr, value, ?sorted)", arguments);
    	realArray$1$1$1$1('arr');
    	realNumber$2$1$1$1('value');
    	bool$1$1$1$1$1('sorted');
    	sorted$1$1$1$1('arr', 'sorted');
    	clearContext$1$1$1$1();
    	return indexOf$2(arr, value, sorted$1$1$1$1$1);
    }

    function union$3(arr1, arr2, sorted$1$1$1$1$1) {
    	setContext$1$1$1$1$1("union(arr1, arr2, ?sorted)", arguments);
    	realArray$1$1$1$1('arr1');
    	realArray$1$1$1$1('arr2');
    	bool$1$1$1$1$1('sorted');
    	sorted$1$1$1$1('arr1', 'sorted');
    	sorted$1$1$1$1('arr2', 'sorted'); // May have ensure sorted same way as arr1
    	clearContext$1$1$1$1();
    	return union$2(arr1, arr2, sorted$1$1$1$1$1);
    }

    function isEqual$4(arr1, arr2) {
    	setContext$1$1$1$1$1("isEqual(arr1, arr2)", arguments);
    	realArray$1$1$1$1('arr1');
    	realArray$1$1$1$1('arr2');
    	clearContext$1$1$1$1();
    	return isEqual$2(arr1, arr2);
    }

    function sortUint8$3(arr, target$1$1$1$1$1) {
    	setContext$1$1$1$1$1('sortUint8(arr, ?target)', arguments);
    	if (arr.constructor !== Uint8Array) {
    		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
    	}
    	target$1$1$1$1('target', arr.length);
    	clearContext$1$1$1$1();
    	return sortUint8$2(arr, target$1$1$1$1$1);
    }

    function count$3(arr, value, sorted$1$1$1$1$1) {
    	setContext$1$1$1$1$1("count(arr, value, ?sorted)", arguments);
    	realArray$1$1$1$1('arr');
    	realNumber$2$1$1$1('value');
    	bool$1$1$1$1$1('sorted');
    	sorted$1$1$1$1('arr', 'sorted');
    	clearContext$1$1$1$1();
    	return count$2(arr, value, sorted$1$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(sum$4);
    Object.freeze(min$4);
    Object.freeze(max$4);
    Object.freeze(prod$3);
    Object.freeze(unique$3);
    Object.freeze(indexOf$3);
    Object.freeze(union$3);
    Object.freeze(isEqual$4);
    Object.freeze(sortUint8$3);
    Object.freeze(count$3);

    var array_debug$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sum: sum$4,
        min: min$4,
        max: max$4,
        prod: prod$3,
        unique: unique$3,
        indexOf: indexOf$3
    });

    var array_lib$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: array_debug$1,
        sum: sum$3,
        min: min$3,
        max: max$3,
        prod: prod$2,
        unique: unique$2,
        indexOf: indexOf$2,
        union: union$2,
        isEqual: isEqual$2,
        sortUint8: sortUint8$2,
        imin: imin$1,
        imax: imax$1,
        count: count$2
    });

    function sum$5(arr, freq = undefined) {
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

    function mean$1(arr, freq = undefined) { //In future must add option to prevent overflow by breaking array down
    	const count = arr.length;
    	if (freq === undefined) {
    		return sum$5(arr)/count;
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

    function variance$1(arr, freq = undefined, sample = true) { //Can be made much more efficient in future
    	const len = arr.length;
    	let result = 0;
    	const mu = mean$1(arr, freq);
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

    function sdev$1(arr, freq = undefined, sample = true) {
    	return sqrt$1$1$1$1(variance$1(arr, freq, sample));
    }

    function cov$1(xarr, yarr, sample = true) {
    	meanX = mean$1(xarr);
    	meanY = mean$1(yarr);
    	const n = xarr.length;
    	let result = 0;
    	for (let i = 0; i < n; i++) {
    		result += (xarr[i] - meanX) * (yarr[i] - meanY);
    	}
    	if (sample && (n > 1)) {n -= 1;}
    	return result / n;
    }

    function cor$1(xarr, yarr, sample = true) { //Could be significantly optimised
    	if (xarr.length === 0) {return undefined;}
    	const covariance = cov$1(xarr, yarr, sample);
    	return covariance / (sdev$1(xarr) * sdev$1(yarr));
    }

    function modes$1(arr, freq = undefined, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (freq === undefined) {
    		[arr, freq] = toFreq$1(arr, sorted);
    	}
    	modes$1 = {};
    	maxValue = arr[0] - 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value > maxValue) {
    			maxValue = value;
    			modes$1 = {};
    			modes$1[value] = true;
    		} else if (value === maxValue) {
    			modes$1[value] = true;
    		}
    	}
    	return new Float64Array(modes$1.keys());
    }

    function toFreq$1(arr, sorted = false) { //TODO: make use of 'sorted' parameter
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

    function freq$1(arr, value, sorted = false) {
    	return count$2(arr, value, sorted);
    }

    function unifPdf$1(x, a, b) {
    	if ((x < a)||(x > b)) {return 0;}
    	return 1 / (a - b);
    }

    function unifCdf$1(x, a, b) {
    	if (x < a){return 0;}
    	if (x > b){return 1;}
    	return (x - a) / (b - a);
    }

    function unifInvCdf$1(p, a, b) {
    	return a + p * (a - b);
    }

    function expPdf$1(x, lambda) {
    	return lambda * exp$1$1$1$1(-lambda * x);
    }
    function expCdf$1(x, lambda) {
    	return 1 - exp$1$1$1$1(-lambda * x);
    }
    function expInvCdf$1(p, lambda) {
    	return -ln$1$1$1$1(1 - p) / lambda;
    }

    Object.freeze(sum$5);
    Object.freeze(mean$1);
    Object.freeze(variance$1);
    Object.freeze(sdev$1);
    Object.freeze(cov$1);
    Object.freeze(cor$1);
    Object.freeze(modes$1);
    Object.freeze(freq$1);
    Object.freeze(toFreq$1);

    Object.freeze(unifPdf$1);
    Object.freeze(unifCdf$1);
    Object.freeze(unifInvCdf$1);
    Object.freeze(expPdf$1);
    Object.freeze(expCdf$1);
    Object.freeze(expInvCdf$1);

    function frac$1(num, tolerance = num * EPSILON$1$1$1$1) { //Farey rational approximation algorithm
    	const wholePart = floor$1$1$1$1(num);
    	const fractionalPart = num - whole;
    	let leftNumerator = 0;
    	let leftDenominator = 1;
    	let rightNumerator = 1;
    	let rightDenominator = 1;
    	let numerator = 1;
    	let denominator = 2;
    	let currentValue = numerator / denominator;
    	while (abs$1$1$1$1(currentValue - num) > tolerance) {
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

    function deriv$1(f, x) {
    	x0 = x * (1 + EPSILON$1$1$1$1);
    	x1 = x * (1 - EPSILON$1$1$1$1);
    	dx = x1 - x0;
    	return (f(x1) - f(x0)) / dx;
    }

    //Freeze exports
    Object.freeze(frac$1);
    Object.freeze(deriv$1);

    //Constants
    // Ratio-of-uniforms
    const RU_SCALE_CONSTANT$1 = sqrt$1$1$1$1(2 / E$1$1$1$1);
    // Park-Miller
    const MCG_A$1 = 48271;
    const MCG_M$1 = 2147483647;
    const MCG_M_PLUS_1$1 = MCG_M$1 + 1;

    //Unseeded random number generation
    // Continuous uniform distribution
    function unif$1(a = 0, b = 1, count = undefined) { //a>b or b>a
    	if (count === undefined) { //Return single value
    		return a + (b - a) * random$1$1$1$1();
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = a + (b - a) * random$1$1$1$1();
    		}
    		return result;
    	}
    }

    // Uniform integer distribution
    function int$1(a, b, count = undefined) { //assumes b > a
    	const A = ceil$1$1$1$1(a);
    	const B = floor$1$1$1$1(b) + 1;
    	const r = B - A;
    	if (count === undefined) { //Return single value
    		return floor$1$1$1$1(A + random$1$1$1$1() * r);
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = floor$1$1$1$1(A + r * random$1$1$1$1());
    		}
    		return result;
    	}
    }

    // Normal distribution
    function norm$1(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
    	if (count === undefined) { //Return single value
    		while (true) {
    			const u1 = random$1$1$1$1();
    			const v2 = random$1$1$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$1;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1$1$1(-0.5 * x * x)) {
    				return mean + x * sd;
    			}
    		}
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		let i = 0;
    		while (i < count) {
    			const u1 = random$1$1$1$1();
    			const v2 = random$1$1$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$1;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1$1$1(-0.5 * x * x)) {
    				result[i++] = mean + x * sd;
    			}
    		}
    		return result;
    	}
    }

    // Exponential distribution
    function exp$2(lambda = 1, count = undefined) {
    	if (count === undefined) { //Return single value
    		return -ln$1$1$1$1(random$1$1$1$1()) / lambda;
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = -ln$1$1$1$1(random$1$1$1$1()) / lambda;
    		}
    		return result;
    	}
    }

    //Seeded random number generators

    // (Uniform) Multiplicative congruential generator
    function MCG$1(a = 0, b = 1, seed = int$1(1, 4294967295)) {
    	let scaleFactor, state; //Declare variables
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = floor$1$1$1$1(abs$1$1$1$1(s)); //TODO: use hash instead of just floor(abs())
    			state = seed;
    		}
    		return seed; //Return current seed (whether updated or not)
    	};
    	const _range = function(r = a, s = b) {
    		//Set new range
    		a = r;
    		b = s;
    		scaleFactor = (b - a) / MCG_M_PLUS_1$1;
    		return [a, b];
    	};
    	//Initialise variables
    	_seed(seed);
    	_range(a, b);

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			state = (state * MCG_A$1) % MCG_M$1;
    			return a + state * scaleFactor;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				state = (state * MCG_A$1) % MCG_M$1;
    				result[i] = a + state * scaleFactor;
    			}
    			return result;
    		}
    	};

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	return Object.freeze(generator);
    }

    //Xorshift
    function Xorshift32$1(a = 0, b = 1, seed = int$1(1, 4294967295)) {
    	const state = new Uint32Array(1);
    	let scaleFactor;
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = trunc$1$1$1$1(s) || 1; //TODO: use hash, not just trunc(s)
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

    function RU$1(mean = 0, sd = 1, seed = int$1(1, 4294967295)) { //Ratio of uniforms
    	const urand = Xorshift32$1(0, 1, seed); //TODO: hash seed
    	
    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			while (true) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$1;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1$1$1$1(-0.5 * x * x)) {
    					return mean + x * sd;
    				}
    			}
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			let i = 0;
    			while (i < count) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$1;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1$1$1$1(-0.5 * x * x)) {
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

    const Unif$1 = Xorshift32$1;
    const Norm$1 = RU$1;

    const Int$1 = function(a, b, seed = int$1(1, 4294967295)) {
    	const urand = Xorshift32$1(ceil$1$1$1$1(a), floor$1$1$1$1(b) + 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return floor$1$1$1$1(urand());
    		} else { //Return array of values
    			const result = urand(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = floor$1$1$1$1(result[i]);
    			}
    			return result;
    		}
    	};

    	const _range = function(r = a, s = b) {
    		a = r;
    		b = s;
    		urand.range(ceil$1$1$1$1(a), floor$1$1$1$1(b) + 1);
    		return [a, b];
    	};

    	generator.seed = urand.seed; //TODO: hash seed
    	generator.range = Object.freeze(_range);

    	return Object.freeze(generator);
    };

    // Exponential
    function Exp$1(lambda = 1, seed = int$1(1, 4294967295)) {
    	const urand = Xorshift32$1(0, 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return -ln$1$1$1$1(urand()) / lambda;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = -ln$1$1$1$1(urand()) / lambda;
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

    //Uniform mapping
    function Float1to1$1(seed = int$1(1, MAX_SAFE_INTEGER$1$1$1$1)) { //Scalar -> scalar
    	//Seed checking
    	seed = mod$2$1$1$1(seed * 10.23, 4096000);
    	//Function
    	const rng = function(x) {
    		x = fract$4$1$1$1(x * 0.1031);
    		x *= x + seed;
    		x *= x + x;
    		return fract$4$1$1$1(x);
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    function Float2to1$1(seed = int$1(1, MAX_SAFE_INTEGER$1$1$1$1)) { //2D vector -> scalar
    	//Seed checking
    	seed = mod$2$1$1$1(seed * 10.23, MAX_SAFE_INTEGER$1$1$1$1);
    	//Function
    	const rng = function(vec) {
    		const pX = fract$4$1$1$1(vec[0] * 0.1031);
    		const pY = fract$4$1$1$1(vec[1] * 0.1031);
    		const offset = dot3$2$1$1$1([pX, pY, pX], [pY + seed, pX + seed, pX + seed]);
    		return fract$4$1$1$1((pX + pY + 2 * offset) * (pX + offset));
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    // Freeze exports
    Object.freeze(Float1to1$1);
    Object.freeze(Float2to1$1);

    //1D Perlin noise
    function fade$1(t) {
    	return t * t * t * ((t * (6 * t - 15)) + 10);
    }

    function dfdt$1(t) {
    	return t * t * (30 + t * (30 * t + 60));
    }

    function Perlin1D$1(range = [0, 1], seed = int$1(1, Number.MAX_SAFE_INTEGER)) {
    	const grad = Float1to1$1(seed);
    	//Natural amplitude of 1D Perlin noise is 0.5
    	const rmin = range[0];
    	const avg = 0.5 * (rmin + range[1]);
    	const amp = avg - rmin;
    	const scaleFactor = 2 * amp;

    	//Function
    	const perlin = function(x) { //Just value
    		const x0 = floor$1$1$1$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return avg + lerp$2$1$1$1(c0, c1, fade$1(u)) * scaleFactor;
    	};
    	//Make seed public
    	perlin.seed = seed;
    	//Derivative
    	const deriv = function(x) { //Just derivative
    		const x0 = floor$1$1$1$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return (c1 - c0) * dfdt$1(u) * scaleFactor;
    	};
    	perlin.deriv = Object.freeze(deriv);
    	//Gridded data
    	const grid = function(xmin, count, step) {
    		const minCell = floor$1$1$1$1(xmin);
    		const maxCell = floor$1$1$1$1(xmin + count * step);
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
    				result[index++] = lerp$2$1$1$1(c0, c1, fade$1(locX));
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
    Object.freeze(Perlin1D$1);

    const MAX_LINEAR_SEARCH_LENGTH$2 = 64; //Yet to be optimised

    function sum$6(arr) {
    	const len = arr.length;
    	let result = 0;
    	for (let i = 0; i < len; i++) {
    		result += arr[i];
    	}
    	return result;
    }

    function min$5(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return min$1$1$1(arr[0], arr[len-1]);
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

    function max$5(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return max$1$1$1(arr[0], arr[len-1]);
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

    function imax$2(arr, sorted = false) {
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

    function imin$2(arr, sorted = false) {
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

    function prod$4(arr) {
    	const len = arr.length;
    	let result = 1; //By convention for empty array
    	for (let i = 1; i < len; i++) {
    		result *= arr[i];
    	}
    	return result;
    }

    function unique$4(arr, sorted = false) {
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

    function indexOf$4(arr, value, sorted = false) {
    	const len = arr.length;
    	if ((!sorted)||(len <= MAX_LINEAR_SEARCH_LENGTH$2)) { //Unsorted or small length
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$2) {
    				currentIndex = floor$1$1$1(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue > value) {
    					lowerBound = currentIndex;
    				} else {
    					upperBound = currentIndex;
    				}
    			}
    		} else { //Ascending order
    			if ((startValue > value)||(endValue < value)) {return -1;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$2) {
    				currentIndex = floor$1$1$1(0.5 * (lowerBound + upperBound));
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

    function union$4(arr1, arr2, sorted = false) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if ( (!sorted) || (len1 + len2 < MAX_LINEAR_SEARCH_LENGTH$2) ) { //Arrays unsorted or short
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

    function isEqual$5(arr1, arr2) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if (len1 !== len2) {return false;}
    	for (let i = 0; i < len1; i++) {
    		if (arr1[i] !== arr2[i]) {return false;}
    	}
    	return true;
    }

    function sortUint8$4(arr, target = new Uint8Array(arr.length)) { //Radix sort
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

    function count$4(arr, value, sorted = false) {
    	const len = arr.length;
    	let result = 0;
    	if ((!sorted)||(arr.length <= MAX_LINEAR_SEARCH_LENGTH$2)) { //Unsorted or short array
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$2) {
    				currentIndex = floor$1$1$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$2) {
    				currentIndex = floor$1$1$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBoundFirst - lowerBound > MAX_LINEAR_SEARCH_LENGTH$2) {
    				currentIndex = floor$1$1$1(0.5 * (lowerBound + upperBoundFirst));
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
    			while (upperBound - lowerBoundLast > MAX_LINEAR_SEARCH_LENGTH$2) {
    				currentIndex = floor$1$1$1(0.5 * (lowerBoundLast + upperBound));
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
    Object.freeze(sum$6);
    Object.freeze(min$5);
    Object.freeze(max$5);
    Object.freeze(prod$4);
    Object.freeze(unique$4);
    Object.freeze(indexOf$4);
    Object.freeze(union$4);
    Object.freeze(isEqual$5);
    Object.freeze(sortUint8$4);
    Object.freeze(imin$2);
    Object.freeze(imax$2);
    Object.freeze(count$4);

    function zeros$4(nrows, ncols) {
    	const result = new Float64Array(nrows * ncols);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function constant$4(nrows, ncols, value) {
    	const result = new Float64Array(nrows * ncols);
    	result.fill(value);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function identity$4(n) {
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

    function flatten$2(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
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
    function scale$9(mat, k, target = new Float64Array(mat.length)) {
    	const len = mat.length;
    	for (let i = 0; i < len; i++) {
    		target[i] = mat[i] * k;
    	}
    	target.nrows = mat.nrows;
    	target.ncols = mat.ncols;
    	return target;
    }

    //Transpose
    function transpose2x2$4(mat, target = new Float64Array(4)) {
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

    function transpose3x3$4(mat, target = new Float64Array(9)) {
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

    function transpose4x4$4(mat, target = new Float64Array(16)) {
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
    function mult$6(mat1, mat2) { //consider adding target parameter
    	const r1 = mat1.nrows;
    	const c1 = mat1.ncols;
    	const r2 = mat2.nrows;
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
    function size$4(mat) {
    	return [mat.nrows, mat.ncols];
    }

    //Determinant
    function det2x2$4(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
    }

    //Inverse
    function inverse2x2$4(mat, target = new Float64Array(4)) {
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
    function vmult$2(vec, mat) { //Premultiply by vector (assumed row-vector)
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

    function vmult2x2$2(vec, mat) {
    	const target = new Float64Array(2);
    	const v0 = vec[0];
    	const v1 = vec[1];
    	target[0] = v0 * mat[0] + v1 * mat[2];
    	target[0] = v0 * mat[1] + v1 * mat[3];
    	return target;
    }

    function multv$2(mat, vec) {
    	const nrows = mat.nrows;
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

    function isEqual$6(mat1, mat2) {
    	if ( (mat1.nrows !== mat2.nrows) || (mat1.ncols !== mat2.ncols) ) {
    		return false;
    	}
    	return array_lib$1.isArrayEqual(mat1, mat2);
    }

    // Freeze exports
    Object.freeze(zeros$4);
    Object.freeze(constant$4);
    Object.freeze(identity$4);
    Object.freeze(flatten$2);
    Object.freeze(scale$9);
    Object.freeze(transpose2x2$4);
    Object.freeze(transpose3x3$4);
    Object.freeze(transpose4x4$4);
    Object.freeze(mult$6);
    Object.freeze(size$4);
    Object.freeze(det2x2$4);
    Object.freeze(inverse2x2$4);
    Object.freeze(vmult$2);
    Object.freeze(vmult2x2$2);
    Object.freeze(multv$2);
    Object.freeze(isEqual$6);

    function zeros$5(m, n) {
        setContext$1$1$1$1("zeros(m, n)", arguments);
        positiveInteger$1$1$1("m");
        positiveInteger$1$1$1("n");
        clearContext$1$1$1();
        return zeros$4(m, n);
    }

    function constant$5(m, n, value) {
    	setContext$1$1$1$1("constant(m, n, value)", arguments);
        positiveInteger$1$1$1("m");
        positiveInteger$1$1$1("n");
        realNumber$2$1$1("value");
        clearContext$1$1$1();
        return constant$4(m, n, value);
    }

    function identity$5(m) {
    	setContext$1$1$1$1("identity(m)", arguments);
        positiveInteger$1$1$1("m");
        clearContext$1$1$1();
        return identity$4(m);
    }

    //TODO: debug for 'flatten

    //Scaling
    function scale$a(mat, k, target$1$1$1$1) {
    	setContext$1$1$1$1("scale(mat, k, target)", arguments);
        flatMatrix$1$1$1("mat");
        realNumber$2$1$1("k");
        target$1$1$1('target', mat.length);
        clearContext$1$1$1();
        return scale$9(mat, k, target$1$1$1$1);
    }

    //Transpose
    function transpose2x2$5(mat, target$1$1$1$1) {
        setContext$1$1$1$1("transpose2x2(mat, target)", arguments);
    	flatMatrix$1$1$1("mat", 2, 2);
        target$1$1$1('target', mat.length);
        clearContext$1$1$1();
        return transpose2x2$4(mat, target$1$1$1$1);
    }

    function transpose3x3$5(mat, target$1$1$1$1) {
    	setContext$1$1$1$1("transpose3x3(mat, target)", arguments);
    	flatMatrix$1$1$1("mat", 3, 3);
        target$1$1$1('target', mat.length);
        clearContext$1$1$1();
        return transpose3x3$4(mat, target$1$1$1$1);
    }

    function transpose4x4$5(mat, target$1$1$1$1) {
    	setContext$1$1$1$1("transpose4x4(mat, target)", arguments);
    	flatMatrix$1$1$1("mat", [4, 4] );
        target$1$1$1('target', mat.length);
        clearContext$1$1$1();
        return transpose4x4$4(mat, target$1$1$1$1);
    }

    //Matrix multiplication
    function mult$7(mat1, mat2) {
    	setContext$1$1$1$1("mult(mat1, mat2)", arguments);
    	flatMatrix$1$1$1("mat1");
    	flatMatrix$1$1$1("mat2", mat1.ncols);
        clearContext$1$1$1();
        return mult$6(mat1, mat2);
    }

    //Size
    function size$5(mat) {
    	setContext$1$1$1$1("size(mat)", arguments);
    	flatMatrix$1$1$1("mat");
        clearContext$1$1$1();
    	return size$4(mat);
    }

    //Determinant
    function det2x2$5(mat) {
    	setContext$1$1$1$1("det2x2(mat)", arguments);
    	flatMatrix$1$1$1("mat", 2, 2);
    	clearContext$1$1$1();
    	return det2x2$4(mat);
    }

    //Inverse
    function inverse2x2$5(mat, target$1$1$1$1) {
    	setContext$1$1$1$1("inverse2(mat, target)", arguments);
    	flatMatrix$1$1$1("mat", 2, 2);
    	target$1$1$1('target', 4);
        clearContext$1$1$1();
    	return inverse2x2$4(mat, target$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(zeros$5);
    Object.freeze(constant$5);
    Object.freeze(identity$5);
    //Object.freeze(flatten);
    Object.freeze(scale$a);
    Object.freeze(transpose2x2$5);
    Object.freeze(transpose3x3$5);
    Object.freeze(transpose4x4$5);
    Object.freeze(mult$7);
    Object.freeze(size$5);
    Object.freeze(det2x2$5);
    Object.freeze(inverse2x2$5);

    function conj$8(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function real$8(z) {
    	return z[0];
    }

    function imag$8(z) {
    	return z[1];
    }

    function arg$8(z) {
    	return atan2$1$1$1(z[1], z[0]);
    }

    function abs$9(z) {
    	return hypot$1$1$1(z[0], z[1]);
    }

    function add$6(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$6(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] - z2[0];
    	target[1] = z1[1] - z2[1];
    	return target;
    }

    function mult$8(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	target[0] = re1 * re2 - im1 * im2;
    	target[1] = re1 * im2 - re2 * im1;
    	return target;
    }

    function scale$b(z, k, target = new Float64Array(2)) {
    	target[0] = z[0] * k;
    	target[1] = z[1] * k;
    	return target;
    }

    function div$8(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (- re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function inverse$8(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (-re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function toPolar$1(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const r = hypot$1$1$1(re, im);
    	target[0] = r;
    	target[1] = atan2$1$1$1(im, re);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$8);
    Object.freeze(real$8);
    Object.freeze(imag$8);
    Object.freeze(arg$8);
    Object.freeze(abs$9);
    Object.freeze(add$6);
    Object.freeze(sub$6);
    Object.freeze(mult$8);
    Object.freeze(scale$b);
    Object.freeze(div$8);
    Object.freeze(inverse$8);
    Object.freeze(toPolar$1);

    function conj$9(z, target$1$1$1$1) {
        setContext("conj(z, ?target)", arguments);
    	rectComplex$1$1$1("z");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return conj$8(z, target$1$1$1$1);
    }

    function real$9(z) {
    	setContext("real(z)", arguments);
    	rectComplex$1$1$1("z");
        clearContext$1$1$1();
        return real$8(z);
    }

    function imag$9(z) {
    	setContext("imag(z)", arguments);
    	rectComplex$1$1$1("z");
        clearContext$1$1$1();
        return imag$8(z);
    }

    function arg$9(z) {
    	setContext("arg(z)", arguments);
    	rectComplex$1$1$1("z");
        clearContext$1$1$1();
        return arg$8(z);
    }

    function abs$a(z) {
    	setContext("abs(z)", arguments);
    	rectComplex$1$1$1("z");
        clearContext$1$1$1();
        return abs$9(z);
    }

    function add$7(z1, z2, target$1$1$1$1) {
    	setContext("add(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1("z1");
        rectComplex$1$1$1("z2");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return add$6(z1, z2, target$1$1$1$1);
    }

    function sub$7(z1, z2, target$1$1$1$1) {
    	setContext("sub(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1("z1");
        rectComplex$1$1$1("z2");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return sub$6(z1, z2, target$1$1$1$1);
    }

    function mult$9(z1, z2, target$1$1$1$1) {
    	setContext("mult(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1("z1");
        rectComplex$1$1$1("z2");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return mult$8(z1, z2, target$1$1$1$1);
    }

    function scale$c(z, k, target$1$1$1$1) {
    	setContext("scale(z, k, ?target)", arguments);
    	rectComplex$1$1$1("z");
        realNumber$2$1$1("k");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return scale$b(z, k, target$1$1$1$1);
    }

    function div$9(z1, z2, target$1$1$1$1) {
    	setContext("div(z1, z2, ?target)", arguments);
    	rectComplex$1$1$1("z1");
        rectComplex$1$1$1("z2");
        target$1$1$1('target', 2);
        const result = div$8(z1, z2, target$1$1$1$1);
        notDefined$1$1$1(result);
        clearContext$1$1$1();
        return result;
    }

    function inverse$9(z, target$1$1$1$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex$1$1$1("z");
        target$1$1$1('target', 2);
        const result = inverse$8(z, target$1$1$1$1);
        notDefined$1$1$1(result);
        clearContext$1$1$1();
        return result;
    }

    function toPolar$2(z, target$1$1$1$1) {
    	setContext("toPolar(z, ?target)", arguments);
    	rectComplex$1$1$1("z");
        target$1$1$1('target', 2);
        const result = toPolar$1(z, target$1$1$1$1);
        notDefined$1$1$1(result);
        clearContext$1$1$1();
        return result;
    }

    // Freeze exports
    Object.freeze(conj$9);
    Object.freeze(real$9);
    Object.freeze(imag$9);
    Object.freeze(arg$9);
    Object.freeze(abs$a);
    Object.freeze(add$7);
    Object.freeze(sub$7);
    Object.freeze(mult$9);
    Object.freeze(scale$c);
    Object.freeze(div$9);
    Object.freeze(inverse$9);
    Object.freeze(toPolar$2);

    function toArg$2(angle) { //Not to be exported
    	angle = angle%TWO_PI$1$1$1;
    	if (angle > PI$1$1$1) {return angle - TWO_PI$1$1$1;}
    	if (angle < -PI$1$1$1) {return angle + TWO_PI$1$1$1;}
    	return angle;
    }

    function conj$a(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = -toArg$2(theta + PI$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = -toArg$2(theta);
    	}
    	return target;
    }

    function real$a(z) {
    	return z[0] * cos$1$1$1(z[1]);
    }

    function imag$a(z) {
    	return z[0] * sin$1$1$1(z[1]);
    }

    function arg$a(z) {
    	return toArg$2(z[1]);
    }

    function abs$b(z) {
    	return abs$1$1$1(z[0]);
    }

    function scale$d(z, k, target = new Float64Array(2)) {
    	const r = z[0] * k;
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$2(theta + PI$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$2(theta);
    	}
    	return target;
    }

    function mult$a(z1, z2, target = new Float64Array(2)) {
    	const r = z1[0] * z2[0];
    	const theta = z1[1] + z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$2(theta + PI$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$2(theta);
    	}
    	return target;
    }

    function div$a(z1, z2, target = new Float64Array(2)) {
    	const r2 = z2[0];
    	if (r2 === 0) {return undefined;}
    	const r = z1[0] / r2;
    	const theta = z1[1] - z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$2(theta + PI$1$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$2(theta);
    	}
    	return target;
    }

    function pow$5(z, n, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = pow$1$1$1(-r, n);
    		target[1] = toArg$2(n * (theta + PI$1$1$1));
    	} else {
    		target[0] = pow$1$1$1(r, n);
    		target[1] = toArg$2(n * theta);
    	}
    	return target;
    }

    function inverse$a(z, target = new Float64Array(2)) {
    	const r = z[0];
    	if (r === 0) {return undefined;}
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -1/r;
    		target[1] = toArg$2(-theta - PI$1$1$1);
    	} else {
    		target[0] = 1/r;
    		target[1] = toArg$2(-theta);
    	}
    	return target;
    }

    function toRect$1(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	target[0] = r * cos$1$1$1(theta);
    	target[1] = r * sin$1$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$a);
    Object.freeze(real$a);
    Object.freeze(imag$a);
    Object.freeze(arg$a);
    Object.freeze(abs$b);
    Object.freeze(scale$d);
    Object.freeze(mult$a);
    Object.freeze(div$a);
    Object.freeze(pow$5);
    Object.freeze(inverse$a);
    Object.freeze(toRect$1);

    function conj$b(z, target$1$1$1$1) {
        setContext$1$1$1$1("conj(z, ?target)", arguments);
        target$1$1$1('target', 2);
        polarComplex$1$1$1("z");
        clearContext$1$1$1();
        return conj$a(z, target$1$1$1$1);
    }

    function real$b(z) {
        setContext$1$1$1$1("real(z)", arguments);
        polarComplex$1$1$1("z");
        clearContext$1$1$1();
    	return real$a(z);
    }

    function imag$b(z) {
        setContext$1$1$1$1("imag(z)", arguments);
        polarComplex$1$1$1("z");
        clearContext$1$1$1();
    	return imag$a(z);
    }

    function arg$b(z) {
        setContext$1$1$1$1("arg(z)", arguments);
        polarComplex$1$1$1("z");
        clearContext$1$1$1();
    	return arg$a(z);
    }

    function abs$c(z) {
        setContext$1$1$1$1("abs(z)", arguments);
        polarComplex$1$1$1("z");
        clearContext$1$1$1();
    	return abs$b(z);
    }

    function scale$e(z, k, target$1$1$1$1) {
        setContext$1$1$1$1("scale(z, k, ?target)", arguments);
    	polarComplex$1$1$1("z");
        realNumber$2$1$1("k");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return scale$d(z, k, target$1$1$1$1);
    }

    function mult$b(z1, z2, target$1$1$1$1) {
    	setContext$1$1$1$1("mult(z1, z2, ?target)", arguments);
    	polarComplex$1$1$1("z1");
        polarComplex$1$1$1("z2");
        target$1$1$1('target', 2);
        return mult$a(z1, z2, target$1$1$1$1);
    }

    function div$b(z1, z2, target$1$1$1$1) {
    	setContext$1$1$1$1("div(z1, z2, ?target)", arguments);
    	polarComplex$1$1$1("z1");
        polarComplex$1$1$1("z2");
        target$1$1$1('target', 2);
        const result = div$a(z1, z2, target$1$1$1$1);
        notDefined$1$1$1(result);
        clearContext$1$1$1();
        return result;
    }

    function pow$6(z, n, target$1$1$1$1) {
    	setContext$1$1$1$1("pow(z, n, ?target)", arguments);
        polarComplex$1$1$1("z");
        realNumber$2$1$1("n");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return pow$5(z, n, target$1$1$1$1);
    }

    function inverse$b(z, target$1$1$1$1) {
    	setContext$1$1$1$1("inverse(z, ?target)", arguments);
        polarComplex$1$1$1("z");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return inverse$a(z, target$1$1$1$1);
    }

    function toRect$2(z, target$1$1$1$1) {
    	setContext$1$1$1$1("toRect(z, ?target)", arguments);
        polarComplex$1$1$1("z");
        target$1$1$1('target', 2);
        clearContext$1$1$1();
        return toRect$1(z, target$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(conj$b);
    Object.freeze(real$b);
    Object.freeze(imag$b);
    Object.freeze(arg$b);
    Object.freeze(abs$c);
    Object.freeze(scale$e);
    Object.freeze(mult$b);
    Object.freeze(div$b);
    Object.freeze(pow$6);
    Object.freeze(inverse$b);
    Object.freeze(toRect$2);

    function sum$7(arr) {
    	setContext$1$1$1$1("sum(arr)", arguments);
    	realArray$1$1$1("arr");
    	const result = sum$6(arr);
    	realOverflow$1$1$1(result);
    	clearContext$1$1$1();
    	return result;
    }

    function min$6(arr, sorted$1$1$1$1) {
    	setContext$1$1$1$1("min(arr, ?sorted)", arguments);
    	realArray$1$1$1("arr");
    	bool$1$1$1$1("sorted");
    	sorted$1$1$1("arr", "sorted");
    	clearContext$1$1$1();
    	return min$5(arr, sorted$1$1$1$1);
    }

    function max$6(arr, sorted$1$1$1$1) {
    	setContext$1$1$1$1("max(arr, ?sorted)", arguments);
    	realArray$1$1$1("arr");
    	bool$1$1$1$1("sorted");
    	sorted$1$1$1("arr", "sorted");
    	clearContext$1$1$1();
    	return max$5(arr, sorted$1$1$1$1);
    }

    function prod$5(arr) {
    	setContext$1$1$1$1("prod(arr)", arguments);
    	realArray$1$1$1('arr');
    	clearContext$1$1$1();
    	return prod$4(arr);
    }

    function unique$5(arr, sorted$1$1$1$1) {
    	setContext$1$1$1$1("unique(arr, ?sorted)", arguments);
    	realArray$1$1$1('arr');
    	bool$1$1$1$1('sorted');
    	sorted$1$1$1('arr', 'sorted');
    	clearContext$1$1$1();
    	return unique$4(arr, sorted$1$1$1$1);
    }

    function indexOf$5(arr, value, sorted$1$1$1$1) {
    	setContext$1$1$1$1("indexOf(arr, value, ?sorted)", arguments);
    	realArray$1$1$1('arr');
    	realNumber$2$1$1('value');
    	bool$1$1$1$1('sorted');
    	sorted$1$1$1('arr', 'sorted');
    	clearContext$1$1$1();
    	return indexOf$4(arr, value, sorted$1$1$1$1);
    }

    function union$5(arr1, arr2, sorted$1$1$1$1) {
    	setContext$1$1$1$1("union(arr1, arr2, ?sorted)", arguments);
    	realArray$1$1$1('arr1');
    	realArray$1$1$1('arr2');
    	bool$1$1$1$1('sorted');
    	sorted$1$1$1('arr1', 'sorted');
    	sorted$1$1$1('arr2', 'sorted'); // May have ensure sorted same way as arr1
    	clearContext$1$1$1();
    	return union$4(arr1, arr2, sorted$1$1$1$1);
    }

    function isEqual$7(arr1, arr2) {
    	setContext$1$1$1$1("isEqual(arr1, arr2)", arguments);
    	realArray$1$1$1('arr1');
    	realArray$1$1$1('arr2');
    	clearContext$1$1$1();
    	return isEqual$5(arr1, arr2);
    }

    function sortUint8$5(arr, target$1$1$1$1) {
    	setContext$1$1$1$1('sortUint8(arr, ?target)', arguments);
    	if (arr.constructor !== Uint8Array) {
    		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
    	}
    	target$1$1$1('target', arr.length);
    	clearContext$1$1$1();
    	return sortUint8$4(arr, target$1$1$1$1);
    }

    function count$5(arr, value, sorted$1$1$1$1) {
    	setContext$1$1$1$1("count(arr, value, ?sorted)", arguments);
    	realArray$1$1$1('arr');
    	realNumber$2$1$1('value');
    	bool$1$1$1$1('sorted');
    	sorted$1$1$1('arr', 'sorted');
    	clearContext$1$1$1();
    	return count$4(arr, value, sorted$1$1$1$1);
    }

    // Freeze exports
    Object.freeze(sum$7);
    Object.freeze(min$6);
    Object.freeze(max$6);
    Object.freeze(prod$5);
    Object.freeze(unique$5);
    Object.freeze(indexOf$5);
    Object.freeze(union$5);
    Object.freeze(isEqual$7);
    Object.freeze(sortUint8$5);
    Object.freeze(count$5);

    var array_debug$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sum: sum$7,
        min: min$6,
        max: max$6,
        prod: prod$5,
        unique: unique$5,
        indexOf: indexOf$5
    });

    var array_lib$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: array_debug$2,
        sum: sum$6,
        min: min$5,
        max: max$5,
        prod: prod$4,
        unique: unique$4,
        indexOf: indexOf$4,
        union: union$4,
        isEqual: isEqual$5,
        sortUint8: sortUint8$4,
        imin: imin$2,
        imax: imax$2,
        count: count$4
    });

    function sum$8(arr, freq = undefined) {
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

    function mean$2(arr, freq = undefined) { //In future must add option to prevent overflow by breaking array down
    	const count = arr.length;
    	if (freq === undefined) {
    		return sum$8(arr)/count;
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

    function variance$2(arr, freq = undefined, sample = true) { //Can be made much more efficient in future
    	const len = arr.length;
    	let result = 0;
    	const mu = mean$2(arr, freq);
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

    function sdev$2(arr, freq = undefined, sample = true) {
    	return sqrt$1$1$1(variance$2(arr, freq, sample));
    }

    function cov$2(xarr, yarr, sample = true) {
    	meanX = mean$2(xarr);
    	meanY = mean$2(yarr);
    	const n = xarr.length;
    	let result = 0;
    	for (let i = 0; i < n; i++) {
    		result += (xarr[i] - meanX) * (yarr[i] - meanY);
    	}
    	if (sample && (n > 1)) {n -= 1;}
    	return result / n;
    }

    function cor$2(xarr, yarr, sample = true) { //Could be significantly optimised
    	if (xarr.length === 0) {return undefined;}
    	const covariance = cov$2(xarr, yarr, sample);
    	return covariance / (sdev$2(xarr) * sdev$2(yarr));
    }

    function modes$2(arr, freq = undefined, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (freq === undefined) {
    		[arr, freq] = toFreq$2(arr, sorted);
    	}
    	modes$2 = {};
    	maxValue = arr[0] - 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value > maxValue) {
    			maxValue = value;
    			modes$2 = {};
    			modes$2[value] = true;
    		} else if (value === maxValue) {
    			modes$2[value] = true;
    		}
    	}
    	return new Float64Array(modes$2.keys());
    }

    function toFreq$2(arr, sorted = false) { //TODO: make use of 'sorted' parameter
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

    function freq$2(arr, value, sorted = false) {
    	return count$4(arr, value, sorted);
    }

    function unifPdf$2(x, a, b) {
    	if ((x < a)||(x > b)) {return 0;}
    	return 1 / (a - b);
    }

    function unifCdf$2(x, a, b) {
    	if (x < a){return 0;}
    	if (x > b){return 1;}
    	return (x - a) / (b - a);
    }

    function unifInvCdf$2(p, a, b) {
    	return a + p * (a - b);
    }

    function expPdf$2(x, lambda) {
    	return lambda * exp$1$1$1(-lambda * x);
    }
    function expCdf$2(x, lambda) {
    	return 1 - exp$1$1$1(-lambda * x);
    }
    function expInvCdf$2(p, lambda) {
    	return -ln$1$1$1(1 - p) / lambda;
    }

    Object.freeze(sum$8);
    Object.freeze(mean$2);
    Object.freeze(variance$2);
    Object.freeze(sdev$2);
    Object.freeze(cov$2);
    Object.freeze(cor$2);
    Object.freeze(modes$2);
    Object.freeze(freq$2);
    Object.freeze(toFreq$2);

    Object.freeze(unifPdf$2);
    Object.freeze(unifCdf$2);
    Object.freeze(unifInvCdf$2);
    Object.freeze(expPdf$2);
    Object.freeze(expCdf$2);
    Object.freeze(expInvCdf$2);

    function frac$2(num, tolerance = num * EPSILON$1$1$1) { //Farey rational approximation algorithm
    	const wholePart = floor$1$1$1(num);
    	const fractionalPart = num - whole;
    	let leftNumerator = 0;
    	let leftDenominator = 1;
    	let rightNumerator = 1;
    	let rightDenominator = 1;
    	let numerator = 1;
    	let denominator = 2;
    	let currentValue = numerator / denominator;
    	while (abs$1$1$1(currentValue - num) > tolerance) {
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

    function deriv$2(f, x) {
    	x0 = x * (1 + EPSILON$1$1$1);
    	x1 = x * (1 - EPSILON$1$1$1);
    	dx = x1 - x0;
    	return (f(x1) - f(x0)) / dx;
    }

    //Freeze exports
    Object.freeze(frac$2);
    Object.freeze(deriv$2);

    //Constants
    // Ratio-of-uniforms
    const RU_SCALE_CONSTANT$2 = sqrt$1$1$1(2 / E$1$1$1);
    // Park-Miller
    const MCG_A$2 = 48271;
    const MCG_M$2 = 2147483647;
    const MCG_M_PLUS_1$2 = MCG_M$2 + 1;

    //Unseeded random number generation
    // Continuous uniform distribution
    function unif$2(a = 0, b = 1, count = undefined) { //a>b or b>a
    	if (count === undefined) { //Return single value
    		return a + (b - a) * random$1$1$1();
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = a + (b - a) * random$1$1$1();
    		}
    		return result;
    	}
    }

    // Uniform integer distribution
    function int$2(a, b, count = undefined) { //assumes b > a
    	const A = ceil$1$1$1(a);
    	const B = floor$1$1$1(b) + 1;
    	const r = B - A;
    	if (count === undefined) { //Return single value
    		return floor$1$1$1(A + random$1$1$1() * r);
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = floor$1$1$1(A + r * random$1$1$1());
    		}
    		return result;
    	}
    }

    // Normal distribution
    function norm$2(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
    	if (count === undefined) { //Return single value
    		while (true) {
    			const u1 = random$1$1$1();
    			const v2 = random$1$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$2;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1$1(-0.5 * x * x)) {
    				return mean + x * sd;
    			}
    		}
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		let i = 0;
    		while (i < count) {
    			const u1 = random$1$1$1();
    			const v2 = random$1$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$2;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1$1(-0.5 * x * x)) {
    				result[i++] = mean + x * sd;
    			}
    		}
    		return result;
    	}
    }

    // Exponential distribution
    function exp$3(lambda = 1, count = undefined) {
    	if (count === undefined) { //Return single value
    		return -ln$1$1$1(random$1$1$1()) / lambda;
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = -ln$1$1$1(random$1$1$1()) / lambda;
    		}
    		return result;
    	}
    }

    //Seeded random number generators

    // (Uniform) Multiplicative congruential generator
    function MCG$2(a = 0, b = 1, seed = int$2(1, 4294967295)) {
    	let scaleFactor, state; //Declare variables
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = floor$1$1$1(abs$1$1$1(s)); //TODO: use hash instead of just floor(abs())
    			state = seed;
    		}
    		return seed; //Return current seed (whether updated or not)
    	};
    	const _range = function(r = a, s = b) {
    		//Set new range
    		a = r;
    		b = s;
    		scaleFactor = (b - a) / MCG_M_PLUS_1$2;
    		return [a, b];
    	};
    	//Initialise variables
    	_seed(seed);
    	_range(a, b);

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			state = (state * MCG_A$2) % MCG_M$2;
    			return a + state * scaleFactor;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				state = (state * MCG_A$2) % MCG_M$2;
    				result[i] = a + state * scaleFactor;
    			}
    			return result;
    		}
    	};

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	return Object.freeze(generator);
    }

    //Xorshift
    function Xorshift32$2(a = 0, b = 1, seed = int$2(1, 4294967295)) {
    	const state = new Uint32Array(1);
    	let scaleFactor;
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = trunc$1$1$1(s) || 1; //TODO: use hash, not just trunc(s)
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

    function RU$2(mean = 0, sd = 1, seed = int$2(1, 4294967295)) { //Ratio of uniforms
    	const urand = Xorshift32$2(0, 1, seed); //TODO: hash seed
    	
    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			while (true) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$2;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1$1$1(-0.5 * x * x)) {
    					return mean + x * sd;
    				}
    			}
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			let i = 0;
    			while (i < count) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$2;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1$1$1(-0.5 * x * x)) {
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

    const Unif$2 = Xorshift32$2;
    const Norm$2 = RU$2;

    const Int$2 = function(a, b, seed = int$2(1, 4294967295)) {
    	const urand = Xorshift32$2(ceil$1$1$1(a), floor$1$1$1(b) + 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return floor$1$1$1(urand());
    		} else { //Return array of values
    			const result = urand(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = floor$1$1$1(result[i]);
    			}
    			return result;
    		}
    	};

    	const _range = function(r = a, s = b) {
    		a = r;
    		b = s;
    		urand.range(ceil$1$1$1(a), floor$1$1$1(b) + 1);
    		return [a, b];
    	};

    	generator.seed = urand.seed; //TODO: hash seed
    	generator.range = Object.freeze(_range);

    	return Object.freeze(generator);
    };

    // Exponential
    function Exp$2(lambda = 1, seed = int$2(1, 4294967295)) {
    	const urand = Xorshift32$2(0, 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return -ln$1$1$1(urand()) / lambda;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = -ln$1$1$1(urand()) / lambda;
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
    Object.freeze(unif$2);
    Object.freeze(int$2);
    Object.freeze(norm$2);
    Object.freeze(exp$3);

    Object.freeze(MCG$2);
    Object.freeze(Xorshift32$2);
    Object.freeze(RU$2);

    Object.freeze(Unif$2);
    Object.freeze(Int$2);
    Object.freeze(Norm$2);
    Object.freeze(Exp$2);

    //Uniform mapping
    function Float1to1$2(seed = int$2(1, MAX_SAFE_INTEGER$1$1$1)) { //Scalar -> scalar
    	//Seed checking
    	seed = mod$2$1$1(seed * 10.23, 4096000);
    	//Function
    	const rng = function(x) {
    		x = fract$4$1$1(x * 0.1031);
    		x *= x + seed;
    		x *= x + x;
    		return fract$4$1$1(x);
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    function Float2to1$2(seed = int$2(1, MAX_SAFE_INTEGER$1$1$1)) { //2D vector -> scalar
    	//Seed checking
    	seed = mod$2$1$1(seed * 10.23, MAX_SAFE_INTEGER$1$1$1);
    	//Function
    	const rng = function(vec) {
    		const pX = fract$4$1$1(vec[0] * 0.1031);
    		const pY = fract$4$1$1(vec[1] * 0.1031);
    		const offset = dot3$2$1$1([pX, pY, pX], [pY + seed, pX + seed, pX + seed]);
    		return fract$4$1$1((pX + pY + 2 * offset) * (pX + offset));
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    // Freeze exports
    Object.freeze(Float1to1$2);
    Object.freeze(Float2to1$2);

    //1D Perlin noise
    function fade$2(t) {
    	return t * t * t * ((t * (6 * t - 15)) + 10);
    }

    function dfdt$2(t) {
    	return t * t * (30 + t * (30 * t + 60));
    }

    function Perlin1D$2(range = [0, 1], seed = int$2(1, Number.MAX_SAFE_INTEGER)) {
    	const grad = Float1to1$2(seed);
    	//Natural amplitude of 1D Perlin noise is 0.5
    	const rmin = range[0];
    	const avg = 0.5 * (rmin + range[1]);
    	const amp = avg - rmin;
    	const scaleFactor = 2 * amp;

    	//Function
    	const perlin = function(x) { //Just value
    		const x0 = floor$1$1$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return avg + lerp$2$1$1(c0, c1, fade$2(u)) * scaleFactor;
    	};
    	//Make seed public
    	perlin.seed = seed;
    	//Derivative
    	const deriv = function(x) { //Just derivative
    		const x0 = floor$1$1$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return (c1 - c0) * dfdt$2(u) * scaleFactor;
    	};
    	perlin.deriv = Object.freeze(deriv);
    	//Gridded data
    	const grid = function(xmin, count, step) {
    		const minCell = floor$1$1$1(xmin);
    		const maxCell = floor$1$1$1(xmin + count * step);
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
    				result[index++] = lerp$2$1$1(c0, c1, fade$2(locX));
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
    Object.freeze(Perlin1D$2);

    function unif$3(a, b, count) {
    	setContext$1$1$1$1("unif(?a, ?b, ?count)", arguments);
    	realNumber$1$1$1$1('a');
    	realNumber$1$1$1$1('b');
    	undefined('count');
    	clearContext$1$1$1();
    	return unif$2(a, b, count);
    }

    function int$3(a, b, count) {
    	setContext$1$1$1$1("int(a, b, ?count)", arguments);
    	realNumber$1$1$1$1('a');
    	realNumber$1$1$1$1('b');
    	undefined('count');
    	clearContext$1$1$1();
    	return int$2(a, b, count);
    }

    function norm$3(mean, sd, count) {
    	setContext$1$1$1$1("norm(?mean, ?sd, ?count)", arguments);
    	realNumber$1$1$1$1("mean");
    	realNumber$1$1$1$1("sd");
    	undefined("sd");
    	undefined('count');
    	clearContext$1$1$1();
    	return norm$2(mean, sd, count);
    }

    function exp$4(lambda, count) {
    	setContext$1$1$1$1("exp(?lambda, ?count)", arguments);
    	realNumber$1$1$1$1("lambda");
    	undefined('count');
    	clearContext$1$1$1();
    	return exp$3(lambda, count);
    }

    function MCG$3(a, b, seed) {
    	setContext$1$1$1$1("MCG(?a, ?b, ?seed)", arguments);
    	realNumber$2$1$1(a, "a", signature);
    	realNumber$2$1$1(b, "b", signature);
    	positiveInteger$1$1$1(seed); //Consider allowing 0 in future
    	return MCG$2(a, b, seed);
    }

    function Xorshift32$3(a = 0, b = 1, seed = int$2(1, 4294967295)) {
    	setContext$1$1$1$1("Xorshift32(?a, ?b, ?seed)", arguments);
    	realNumber$2$1$1(a, "a", signature);
    	realNumber$2$1$1(b, "b", signature);
    	positiveInteger$1$1$1(seed); //Consider allowing 0 in future
    	return Xorshift32$2(a, b, seed);
    }

    function RU$3(mean = 0, sd = 1, seed = int$2(1, 4294967295)) { //Ratio of uniforms
    	setContext$1$1$1$1("RU(?mean, ?sd, ?seed)", arguments);
    	realNumber$2$1$1(mean, "mean", signature);
    	realNumber$2$1$1(sd, "sd", signature);
    	//Current implementation technically permits sd < 0, but we disallow it here
    	nonNegative$1$1$1(sd, "sd", signature);
    	positiveInteger$1$1$1(seed); //Consider allowing 0 in future
    	return RU$2(mean, sd, seed);
    }

    const Unif$3 = Xorshift32$3; //TODO: will have incorrect signature
    const Norm$3 = RU$3; //TODO: will have incorrect signature

    const Int$3 = function(a, b, seed = int$2(1, 4294967295)) {
    	setContext$1$1$1$1("Int(a, b, ?seed)", arguments);
    	realNumber$2$1$1(a, "a", signature); //Don't have to be integers
    	realNumber$2$1$1(b, "b", signature);
    	positiveInteger$1$1$1(seed); //Consider allowing 0 in future
    	return Int$2(a, b, seed);
    };

    // Exponential
    function Exp$3(lambda = 1, seed = int$3(1, 4294967295)) {

    }

    // Freeze exports
    Object.freeze(unif$3);
    Object.freeze(int$3);
    Object.freeze(norm$3);
    Object.freeze(exp$4);

    Object.freeze(MCG$3);
    Object.freeze(Xorshift32$3);
    Object.freeze(RU$3);

    Object.freeze(Unif$3);
    Object.freeze(Int$3);
    Object.freeze(Norm$3);
    Object.freeze(Exp$3);

    const MAX_LINEAR_SEARCH_LENGTH$3 = 64; //Yet to be optimised

    function sum$9(arr) {
    	const len = arr.length;
    	let result = 0;
    	for (let i = 0; i < len; i++) {
    		result += arr[i];
    	}
    	return result;
    }

    function min$7(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return min$1$1(arr[0], arr[len-1]);
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

    function max$7(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return max$1$1(arr[0], arr[len-1]);
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

    function imax$3(arr, sorted = false) {
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

    function imin$3(arr, sorted = false) {
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

    function prod$6(arr) {
    	const len = arr.length;
    	let result = 1; //By convention for empty array
    	for (let i = 1; i < len; i++) {
    		result *= arr[i];
    	}
    	return result;
    }

    function unique$6(arr, sorted = false) {
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

    function indexOf$6(arr, value, sorted = false) {
    	const len = arr.length;
    	if ((!sorted)||(len <= MAX_LINEAR_SEARCH_LENGTH$3)) { //Unsorted or small length
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$3) {
    				currentIndex = floor$1$1(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue > value) {
    					lowerBound = currentIndex;
    				} else {
    					upperBound = currentIndex;
    				}
    			}
    		} else { //Ascending order
    			if ((startValue > value)||(endValue < value)) {return -1;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$3) {
    				currentIndex = floor$1$1(0.5 * (lowerBound + upperBound));
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

    function union$6(arr1, arr2, sorted = false) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if ( (!sorted) || (len1 + len2 < MAX_LINEAR_SEARCH_LENGTH$3) ) { //Arrays unsorted or short
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

    function isEqual$8(arr1, arr2) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if (len1 !== len2) {return false;}
    	for (let i = 0; i < len1; i++) {
    		if (arr1[i] !== arr2[i]) {return false;}
    	}
    	return true;
    }

    function sortUint8$6(arr, target = new Uint8Array(arr.length)) { //Radix sort
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

    function count$6(arr, value, sorted = false) {
    	const len = arr.length;
    	let result = 0;
    	if ((!sorted)||(arr.length <= MAX_LINEAR_SEARCH_LENGTH$3)) { //Unsorted or short array
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$3) {
    				currentIndex = floor$1$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$3) {
    				currentIndex = floor$1$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBoundFirst - lowerBound > MAX_LINEAR_SEARCH_LENGTH$3) {
    				currentIndex = floor$1$1(0.5 * (lowerBound + upperBoundFirst));
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
    			while (upperBound - lowerBoundLast > MAX_LINEAR_SEARCH_LENGTH$3) {
    				currentIndex = floor$1$1(0.5 * (lowerBoundLast + upperBound));
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
    Object.freeze(sum$9);
    Object.freeze(min$7);
    Object.freeze(max$7);
    Object.freeze(prod$6);
    Object.freeze(unique$6);
    Object.freeze(indexOf$6);
    Object.freeze(union$6);
    Object.freeze(isEqual$8);
    Object.freeze(sortUint8$6);
    Object.freeze(imin$3);
    Object.freeze(imax$3);
    Object.freeze(count$6);

    function zeros$6(nrows, ncols) {
    	const result = new Float64Array(nrows * ncols);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function constant$6(nrows, ncols, value) {
    	const result = new Float64Array(nrows * ncols);
    	result.fill(value);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function identity$6(n) {
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

    function flatten$3(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
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
    function scale$f(mat, k, target = new Float64Array(mat.length)) {
    	const len = mat.length;
    	for (let i = 0; i < len; i++) {
    		target[i] = mat[i] * k;
    	}
    	target.nrows = mat.nrows;
    	target.ncols = mat.ncols;
    	return target;
    }

    //Transpose
    function transpose2x2$6(mat, target = new Float64Array(4)) {
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

    function transpose3x3$6(mat, target = new Float64Array(9)) {
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

    function transpose4x4$6(mat, target = new Float64Array(16)) {
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
    function mult$c(mat1, mat2) { //consider adding target parameter
    	const r1 = mat1.nrows;
    	const c1 = mat1.ncols;
    	const r2 = mat2.nrows;
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
    function size$6(mat) {
    	return [mat.nrows, mat.ncols];
    }

    //Determinant
    function det2x2$6(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
    }

    //Inverse
    function inverse2x2$6(mat, target = new Float64Array(4)) {
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
    function vmult$3(vec, mat) { //Premultiply by vector (assumed row-vector)
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

    function vmult2x2$3(vec, mat) {
    	const target = new Float64Array(2);
    	const v0 = vec[0];
    	const v1 = vec[1];
    	target[0] = v0 * mat[0] + v1 * mat[2];
    	target[0] = v0 * mat[1] + v1 * mat[3];
    	return target;
    }

    function multv$3(mat, vec) {
    	const nrows = mat.nrows;
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

    function isEqual$9(mat1, mat2) {
    	if ( (mat1.nrows !== mat2.nrows) || (mat1.ncols !== mat2.ncols) ) {
    		return false;
    	}
    	return array_lib$2.isArrayEqual(mat1, mat2);
    }

    // Freeze exports
    Object.freeze(zeros$6);
    Object.freeze(constant$6);
    Object.freeze(identity$6);
    Object.freeze(flatten$3);
    Object.freeze(scale$f);
    Object.freeze(transpose2x2$6);
    Object.freeze(transpose3x3$6);
    Object.freeze(transpose4x4$6);
    Object.freeze(mult$c);
    Object.freeze(size$6);
    Object.freeze(det2x2$6);
    Object.freeze(inverse2x2$6);
    Object.freeze(vmult$3);
    Object.freeze(vmult2x2$3);
    Object.freeze(multv$3);
    Object.freeze(isEqual$9);

    function zeros$7(m, n) {
        setContext$1$1$1("zeros(m, n)", arguments);
        positiveInteger$1$1("m");
        positiveInteger$1$1("n");
        clearContext$1$1();
        return zeros$6(m, n);
    }

    function constant$7(m, n, value) {
    	setContext$1$1$1("constant(m, n, value)", arguments);
        positiveInteger$1$1("m");
        positiveInteger$1$1("n");
        realNumber$2$1("value");
        clearContext$1$1();
        return constant$6(m, n, value);
    }

    function identity$7(m) {
    	setContext$1$1$1("identity(m)", arguments);
        positiveInteger$1$1("m");
        clearContext$1$1();
        return identity$6(m);
    }

    //TODO: debug for 'flatten

    //Scaling
    function scale$g(mat, k, target$1$1$1) {
    	setContext$1$1$1("scale(mat, k, target)", arguments);
        flatMatrix$1$1("mat");
        realNumber$2$1("k");
        target$1$1('target', mat.length);
        clearContext$1$1();
        return scale$f(mat, k, target$1$1$1);
    }

    //Transpose
    function transpose2x2$7(mat, target$1$1$1) {
        setContext$1$1$1("transpose2x2(mat, target)", arguments);
    	flatMatrix$1$1("mat", 2, 2);
        target$1$1('target', mat.length);
        clearContext$1$1();
        return transpose2x2$6(mat, target$1$1$1);
    }

    function transpose3x3$7(mat, target$1$1$1) {
    	setContext$1$1$1("transpose3x3(mat, target)", arguments);
    	flatMatrix$1$1("mat", 3, 3);
        target$1$1('target', mat.length);
        clearContext$1$1();
        return transpose3x3$6(mat, target$1$1$1);
    }

    function transpose4x4$7(mat, target$1$1$1) {
    	setContext$1$1$1("transpose4x4(mat, target)", arguments);
    	flatMatrix$1$1("mat", [4, 4] );
        target$1$1('target', mat.length);
        clearContext$1$1();
        return transpose4x4$6(mat, target$1$1$1);
    }

    //Matrix multiplication
    function mult$d(mat1, mat2) {
    	setContext$1$1$1("mult(mat1, mat2)", arguments);
    	flatMatrix$1$1("mat1");
    	flatMatrix$1$1("mat2", mat1.ncols);
        clearContext$1$1();
        return mult$c(mat1, mat2);
    }

    //Size
    function size$7(mat) {
    	setContext$1$1$1("size(mat)", arguments);
    	flatMatrix$1$1("mat");
        clearContext$1$1();
    	return size$6(mat);
    }

    //Determinant
    function det2x2$7(mat) {
    	setContext$1$1$1("det2x2(mat)", arguments);
    	flatMatrix$1$1("mat", 2, 2);
    	clearContext$1$1();
    	return det2x2$6(mat);
    }

    //Inverse
    function inverse2x2$7(mat, target$1$1$1) {
    	setContext$1$1$1("inverse2(mat, target)", arguments);
    	flatMatrix$1$1("mat", 2, 2);
    	target$1$1('target', 4);
        clearContext$1$1();
    	return inverse2x2$6(mat, target$1$1$1);
    }

    // Freeze exports
    Object.freeze(zeros$7);
    Object.freeze(constant$7);
    Object.freeze(identity$7);
    //Object.freeze(flatten);
    Object.freeze(scale$g);
    Object.freeze(transpose2x2$7);
    Object.freeze(transpose3x3$7);
    Object.freeze(transpose4x4$7);
    Object.freeze(mult$d);
    Object.freeze(size$7);
    Object.freeze(det2x2$7);
    Object.freeze(inverse2x2$7);

    function conj$c(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function real$c(z) {
    	return z[0];
    }

    function imag$c(z) {
    	return z[1];
    }

    function arg$c(z) {
    	return atan2$1$1(z[1], z[0]);
    }

    function abs$d(z) {
    	return hypot$1$1(z[0], z[1]);
    }

    function add$8(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$8(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] - z2[0];
    	target[1] = z1[1] - z2[1];
    	return target;
    }

    function mult$e(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	target[0] = re1 * re2 - im1 * im2;
    	target[1] = re1 * im2 - re2 * im1;
    	return target;
    }

    function scale$h(z, k, target = new Float64Array(2)) {
    	target[0] = z[0] * k;
    	target[1] = z[1] * k;
    	return target;
    }

    function div$c(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (- re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function inverse$c(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (-re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function toPolar$3(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const r = hypot$1$1(re, im);
    	target[0] = r;
    	target[1] = atan2$1$1(im, re);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$c);
    Object.freeze(real$c);
    Object.freeze(imag$c);
    Object.freeze(arg$c);
    Object.freeze(abs$d);
    Object.freeze(add$8);
    Object.freeze(sub$8);
    Object.freeze(mult$e);
    Object.freeze(scale$h);
    Object.freeze(div$c);
    Object.freeze(inverse$c);
    Object.freeze(toPolar$3);

    function conj$d(z, target$1$1$1) {
        setContext("conj(z, ?target)", arguments);
    	rectComplex$1$1("z");
        target$1$1('target', 2);
        clearContext$1$1();
        return conj$c(z, target$1$1$1);
    }

    function real$d(z) {
    	setContext("real(z)", arguments);
    	rectComplex$1$1("z");
        clearContext$1$1();
        return real$c(z);
    }

    function imag$d(z) {
    	setContext("imag(z)", arguments);
    	rectComplex$1$1("z");
        clearContext$1$1();
        return imag$c(z);
    }

    function arg$d(z) {
    	setContext("arg(z)", arguments);
    	rectComplex$1$1("z");
        clearContext$1$1();
        return arg$c(z);
    }

    function abs$e(z) {
    	setContext("abs(z)", arguments);
    	rectComplex$1$1("z");
        clearContext$1$1();
        return abs$d(z);
    }

    function add$9(z1, z2, target$1$1$1) {
    	setContext("add(z1, z2, ?target)", arguments);
    	rectComplex$1$1("z1");
        rectComplex$1$1("z2");
        target$1$1('target', 2);
        clearContext$1$1();
        return add$8(z1, z2, target$1$1$1);
    }

    function sub$9(z1, z2, target$1$1$1) {
    	setContext("sub(z1, z2, ?target)", arguments);
    	rectComplex$1$1("z1");
        rectComplex$1$1("z2");
        target$1$1('target', 2);
        clearContext$1$1();
        return sub$8(z1, z2, target$1$1$1);
    }

    function mult$f(z1, z2, target$1$1$1) {
    	setContext("mult(z1, z2, ?target)", arguments);
    	rectComplex$1$1("z1");
        rectComplex$1$1("z2");
        target$1$1('target', 2);
        clearContext$1$1();
        return mult$e(z1, z2, target$1$1$1);
    }

    function scale$i(z, k, target$1$1$1) {
    	setContext("scale(z, k, ?target)", arguments);
    	rectComplex$1$1("z");
        realNumber$2$1("k");
        target$1$1('target', 2);
        clearContext$1$1();
        return scale$h(z, k, target$1$1$1);
    }

    function div$d(z1, z2, target$1$1$1) {
    	setContext("div(z1, z2, ?target)", arguments);
    	rectComplex$1$1("z1");
        rectComplex$1$1("z2");
        target$1$1('target', 2);
        const result = div$c(z1, z2, target$1$1$1);
        notDefined$1$1(result);
        clearContext$1$1();
        return result;
    }

    function inverse$d(z, target$1$1$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex$1$1("z");
        target$1$1('target', 2);
        const result = inverse$c(z, target$1$1$1);
        notDefined$1$1(result);
        clearContext$1$1();
        return result;
    }

    function toPolar$4(z, target$1$1$1) {
    	setContext("toPolar(z, ?target)", arguments);
    	rectComplex$1$1("z");
        target$1$1('target', 2);
        const result = toPolar$3(z, target$1$1$1);
        notDefined$1$1(result);
        clearContext$1$1();
        return result;
    }

    // Freeze exports
    Object.freeze(conj$d);
    Object.freeze(real$d);
    Object.freeze(imag$d);
    Object.freeze(arg$d);
    Object.freeze(abs$e);
    Object.freeze(add$9);
    Object.freeze(sub$9);
    Object.freeze(mult$f);
    Object.freeze(scale$i);
    Object.freeze(div$d);
    Object.freeze(inverse$d);
    Object.freeze(toPolar$4);

    function toArg$3(angle) { //Not to be exported
    	angle = angle%TWO_PI$1$1;
    	if (angle > PI$1$1) {return angle - TWO_PI$1$1;}
    	if (angle < -PI$1$1) {return angle + TWO_PI$1$1;}
    	return angle;
    }

    function conj$e(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = -toArg$3(theta + PI$1$1);
    	} else {
    		target[0] = r;
    		target[1] = -toArg$3(theta);
    	}
    	return target;
    }

    function real$e(z) {
    	return z[0] * cos$1$1(z[1]);
    }

    function imag$e(z) {
    	return z[0] * sin$1$1(z[1]);
    }

    function arg$e(z) {
    	return toArg$3(z[1]);
    }

    function abs$f(z) {
    	return abs$1$1(z[0]);
    }

    function scale$j(z, k, target = new Float64Array(2)) {
    	const r = z[0] * k;
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$3(theta + PI$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$3(theta);
    	}
    	return target;
    }

    function mult$g(z1, z2, target = new Float64Array(2)) {
    	const r = z1[0] * z2[0];
    	const theta = z1[1] + z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$3(theta + PI$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$3(theta);
    	}
    	return target;
    }

    function div$e(z1, z2, target = new Float64Array(2)) {
    	const r2 = z2[0];
    	if (r2 === 0) {return undefined;}
    	const r = z1[0] / r2;
    	const theta = z1[1] - z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$3(theta + PI$1$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$3(theta);
    	}
    	return target;
    }

    function pow$7(z, n, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = pow$1$1(-r, n);
    		target[1] = toArg$3(n * (theta + PI$1$1));
    	} else {
    		target[0] = pow$1$1(r, n);
    		target[1] = toArg$3(n * theta);
    	}
    	return target;
    }

    function inverse$e(z, target = new Float64Array(2)) {
    	const r = z[0];
    	if (r === 0) {return undefined;}
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -1/r;
    		target[1] = toArg$3(-theta - PI$1$1);
    	} else {
    		target[0] = 1/r;
    		target[1] = toArg$3(-theta);
    	}
    	return target;
    }

    function toRect$3(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	target[0] = r * cos$1$1(theta);
    	target[1] = r * sin$1$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$e);
    Object.freeze(real$e);
    Object.freeze(imag$e);
    Object.freeze(arg$e);
    Object.freeze(abs$f);
    Object.freeze(scale$j);
    Object.freeze(mult$g);
    Object.freeze(div$e);
    Object.freeze(pow$7);
    Object.freeze(inverse$e);
    Object.freeze(toRect$3);

    function conj$f(z, target$1$1$1) {
        setContext$1$1$1("conj(z, ?target)", arguments);
        target$1$1('target', 2);
        polarComplex$1$1("z");
        clearContext$1$1();
        return conj$e(z, target$1$1$1);
    }

    function real$f(z) {
        setContext$1$1$1("real(z)", arguments);
        polarComplex$1$1("z");
        clearContext$1$1();
    	return real$e(z);
    }

    function imag$f(z) {
        setContext$1$1$1("imag(z)", arguments);
        polarComplex$1$1("z");
        clearContext$1$1();
    	return imag$e(z);
    }

    function arg$f(z) {
        setContext$1$1$1("arg(z)", arguments);
        polarComplex$1$1("z");
        clearContext$1$1();
    	return arg$e(z);
    }

    function abs$g(z) {
        setContext$1$1$1("abs(z)", arguments);
        polarComplex$1$1("z");
        clearContext$1$1();
    	return abs$f(z);
    }

    function scale$k(z, k, target$1$1$1) {
        setContext$1$1$1("scale(z, k, ?target)", arguments);
    	polarComplex$1$1("z");
        realNumber$2$1("k");
        target$1$1('target', 2);
        clearContext$1$1();
        return scale$j(z, k, target$1$1$1);
    }

    function mult$h(z1, z2, target$1$1$1) {
    	setContext$1$1$1("mult(z1, z2, ?target)", arguments);
    	polarComplex$1$1("z1");
        polarComplex$1$1("z2");
        target$1$1('target', 2);
        return mult$g(z1, z2, target$1$1$1);
    }

    function div$f(z1, z2, target$1$1$1) {
    	setContext$1$1$1("div(z1, z2, ?target)", arguments);
    	polarComplex$1$1("z1");
        polarComplex$1$1("z2");
        target$1$1('target', 2);
        const result = div$e(z1, z2, target$1$1$1);
        notDefined$1$1(result);
        clearContext$1$1();
        return result;
    }

    function pow$8(z, n, target$1$1$1) {
    	setContext$1$1$1("pow(z, n, ?target)", arguments);
        polarComplex$1$1("z");
        realNumber$2$1("n");
        target$1$1('target', 2);
        clearContext$1$1();
        return pow$7(z, n, target$1$1$1);
    }

    function inverse$f(z, target$1$1$1) {
    	setContext$1$1$1("inverse(z, ?target)", arguments);
        polarComplex$1$1("z");
        target$1$1('target', 2);
        clearContext$1$1();
        return inverse$e(z, target$1$1$1);
    }

    function toRect$4(z, target$1$1$1) {
    	setContext$1$1$1("toRect(z, ?target)", arguments);
        polarComplex$1$1("z");
        target$1$1('target', 2);
        clearContext$1$1();
        return toRect$3(z, target$1$1$1);
    }

    // Freeze exports
    Object.freeze(conj$f);
    Object.freeze(real$f);
    Object.freeze(imag$f);
    Object.freeze(arg$f);
    Object.freeze(abs$g);
    Object.freeze(scale$k);
    Object.freeze(mult$h);
    Object.freeze(div$f);
    Object.freeze(pow$8);
    Object.freeze(inverse$f);
    Object.freeze(toRect$4);

    function sum$a(arr) {
    	setContext$1$1$1("sum(arr)", arguments);
    	realArray$1$1("arr");
    	const result = sum$9(arr);
    	realOverflow$1$1(result);
    	clearContext$1$1();
    	return result;
    }

    function min$8(arr, sorted$1$1$1) {
    	setContext$1$1$1("min(arr, ?sorted)", arguments);
    	realArray$1$1("arr");
    	bool$1$1$1("sorted");
    	sorted$1$1("arr", "sorted");
    	clearContext$1$1();
    	return min$7(arr, sorted$1$1$1);
    }

    function max$8(arr, sorted$1$1$1) {
    	setContext$1$1$1("max(arr, ?sorted)", arguments);
    	realArray$1$1("arr");
    	bool$1$1$1("sorted");
    	sorted$1$1("arr", "sorted");
    	clearContext$1$1();
    	return max$7(arr, sorted$1$1$1);
    }

    function prod$7(arr) {
    	setContext$1$1$1("prod(arr)", arguments);
    	realArray$1$1('arr');
    	clearContext$1$1();
    	return prod$6(arr);
    }

    function unique$7(arr, sorted$1$1$1) {
    	setContext$1$1$1("unique(arr, ?sorted)", arguments);
    	realArray$1$1('arr');
    	bool$1$1$1('sorted');
    	sorted$1$1('arr', 'sorted');
    	clearContext$1$1();
    	return unique$6(arr, sorted$1$1$1);
    }

    function indexOf$7(arr, value, sorted$1$1$1) {
    	setContext$1$1$1("indexOf(arr, value, ?sorted)", arguments);
    	realArray$1$1('arr');
    	realNumber$2$1('value');
    	bool$1$1$1('sorted');
    	sorted$1$1('arr', 'sorted');
    	clearContext$1$1();
    	return indexOf$6(arr, value, sorted$1$1$1);
    }

    function union$7(arr1, arr2, sorted$1$1$1) {
    	setContext$1$1$1("union(arr1, arr2, ?sorted)", arguments);
    	realArray$1$1('arr1');
    	realArray$1$1('arr2');
    	bool$1$1$1('sorted');
    	sorted$1$1('arr1', 'sorted');
    	sorted$1$1('arr2', 'sorted'); // May have ensure sorted same way as arr1
    	clearContext$1$1();
    	return union$6(arr1, arr2, sorted$1$1$1);
    }

    function isEqual$a(arr1, arr2) {
    	setContext$1$1$1("isEqual(arr1, arr2)", arguments);
    	realArray$1$1('arr1');
    	realArray$1$1('arr2');
    	clearContext$1$1();
    	return isEqual$8(arr1, arr2);
    }

    function sortUint8$7(arr, target$1$1$1) {
    	setContext$1$1$1('sortUint8(arr, ?target)', arguments);
    	if (arr.constructor !== Uint8Array) {
    		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
    	}
    	target$1$1('target', arr.length);
    	clearContext$1$1();
    	return sortUint8$6(arr, target$1$1$1);
    }

    function count$7(arr, value, sorted$1$1$1) {
    	setContext$1$1$1("count(arr, value, ?sorted)", arguments);
    	realArray$1$1('arr');
    	realNumber$2$1('value');
    	bool$1$1$1('sorted');
    	sorted$1$1('arr', 'sorted');
    	clearContext$1$1();
    	return count$6(arr, value, sorted$1$1$1);
    }

    // Freeze exports
    Object.freeze(sum$a);
    Object.freeze(min$8);
    Object.freeze(max$8);
    Object.freeze(prod$7);
    Object.freeze(unique$7);
    Object.freeze(indexOf$7);
    Object.freeze(union$7);
    Object.freeze(isEqual$a);
    Object.freeze(sortUint8$7);
    Object.freeze(count$7);

    var array_debug$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sum: sum$a,
        min: min$8,
        max: max$8,
        prod: prod$7,
        unique: unique$7,
        indexOf: indexOf$7
    });

    var array_lib$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: array_debug$3,
        sum: sum$9,
        min: min$7,
        max: max$7,
        prod: prod$6,
        unique: unique$6,
        indexOf: indexOf$6,
        union: union$6,
        isEqual: isEqual$8,
        sortUint8: sortUint8$6,
        imin: imin$3,
        imax: imax$3,
        count: count$6
    });

    function sum$b(arr, freq = undefined) {
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

    function mean$3(arr, freq = undefined) { //In future must add option to prevent overflow by breaking array down
    	const count = arr.length;
    	if (freq === undefined) {
    		return sum$b(arr)/count;
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

    function variance$3(arr, freq = undefined, sample = true) { //Can be made much more efficient in future
    	const len = arr.length;
    	let result = 0;
    	const mu = mean$3(arr, freq);
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

    function sdev$3(arr, freq = undefined, sample = true) {
    	return sqrt$1$1(variance$3(arr, freq, sample));
    }

    function cov$3(xarr, yarr, sample = true) {
    	meanX = mean$3(xarr);
    	meanY = mean$3(yarr);
    	const n = xarr.length;
    	let result = 0;
    	for (let i = 0; i < n; i++) {
    		result += (xarr[i] - meanX) * (yarr[i] - meanY);
    	}
    	if (sample && (n > 1)) {n -= 1;}
    	return result / n;
    }

    function cor$3(xarr, yarr, sample = true) { //Could be significantly optimised
    	if (xarr.length === 0) {return undefined;}
    	const covariance = cov$3(xarr, yarr, sample);
    	return covariance / (sdev$3(xarr) * sdev$3(yarr));
    }

    function modes$3(arr, freq = undefined, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (freq === undefined) {
    		[arr, freq] = toFreq$3(arr, sorted);
    	}
    	modes$3 = {};
    	maxValue = arr[0] - 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value > maxValue) {
    			maxValue = value;
    			modes$3 = {};
    			modes$3[value] = true;
    		} else if (value === maxValue) {
    			modes$3[value] = true;
    		}
    	}
    	return new Float64Array(modes$3.keys());
    }

    function toFreq$3(arr, sorted = false) { //TODO: make use of 'sorted' parameter
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

    function freq$3(arr, value, sorted = false) {
    	return count$6(arr, value, sorted);
    }

    function unifPdf$3(x, a, b) {
    	if ((x < a)||(x > b)) {return 0;}
    	return 1 / (a - b);
    }

    function unifCdf$3(x, a, b) {
    	if (x < a){return 0;}
    	if (x > b){return 1;}
    	return (x - a) / (b - a);
    }

    function unifInvCdf$3(p, a, b) {
    	return a + p * (a - b);
    }

    function expPdf$3(x, lambda) {
    	return lambda * exp$1$1(-lambda * x);
    }
    function expCdf$3(x, lambda) {
    	return 1 - exp$1$1(-lambda * x);
    }
    function expInvCdf$3(p, lambda) {
    	return -ln$1$1(1 - p) / lambda;
    }

    Object.freeze(sum$b);
    Object.freeze(mean$3);
    Object.freeze(variance$3);
    Object.freeze(sdev$3);
    Object.freeze(cov$3);
    Object.freeze(cor$3);
    Object.freeze(modes$3);
    Object.freeze(freq$3);
    Object.freeze(toFreq$3);

    Object.freeze(unifPdf$3);
    Object.freeze(unifCdf$3);
    Object.freeze(unifInvCdf$3);
    Object.freeze(expPdf$3);
    Object.freeze(expCdf$3);
    Object.freeze(expInvCdf$3);

    function frac$3(num, tolerance = num * EPSILON$1$1) { //Farey rational approximation algorithm
    	const wholePart = floor$1$1(num);
    	const fractionalPart = num - whole;
    	let leftNumerator = 0;
    	let leftDenominator = 1;
    	let rightNumerator = 1;
    	let rightDenominator = 1;
    	let numerator = 1;
    	let denominator = 2;
    	let currentValue = numerator / denominator;
    	while (abs$1$1(currentValue - num) > tolerance) {
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

    function deriv$3(f, x) {
    	x0 = x * (1 + EPSILON$1$1);
    	x1 = x * (1 - EPSILON$1$1);
    	dx = x1 - x0;
    	return (f(x1) - f(x0)) / dx;
    }

    //Freeze exports
    Object.freeze(frac$3);
    Object.freeze(deriv$3);

    //Constants
    // Ratio-of-uniforms
    const RU_SCALE_CONSTANT$3 = sqrt$1$1(2 / E$1$1);
    // Park-Miller
    const MCG_A$3 = 48271;
    const MCG_M$3 = 2147483647;
    const MCG_M_PLUS_1$3 = MCG_M$3 + 1;

    //Unseeded random number generation
    // Continuous uniform distribution
    function unif$4(a = 0, b = 1, count = undefined) { //a>b or b>a
    	if (count === undefined) { //Return single value
    		return a + (b - a) * random$1$1();
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = a + (b - a) * random$1$1();
    		}
    		return result;
    	}
    }

    // Uniform integer distribution
    function int$4(a, b, count = undefined) { //assumes b > a
    	const A = ceil$1$1(a);
    	const B = floor$1$1(b) + 1;
    	const r = B - A;
    	if (count === undefined) { //Return single value
    		return floor$1$1(A + random$1$1() * r);
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = floor$1$1(A + r * random$1$1());
    		}
    		return result;
    	}
    }

    // Normal distribution
    function norm$4(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
    	if (count === undefined) { //Return single value
    		while (true) {
    			const u1 = random$1$1();
    			const v2 = random$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$3;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1(-0.5 * x * x)) {
    				return mean + x * sd;
    			}
    		}
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		let i = 0;
    		while (i < count) {
    			const u1 = random$1$1();
    			const v2 = random$1$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$3;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1$1(-0.5 * x * x)) {
    				result[i++] = mean + x * sd;
    			}
    		}
    		return result;
    	}
    }

    // Exponential distribution
    function exp$5(lambda = 1, count = undefined) {
    	if (count === undefined) { //Return single value
    		return -ln$1$1(random$1$1()) / lambda;
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = -ln$1$1(random$1$1()) / lambda;
    		}
    		return result;
    	}
    }

    //Seeded random number generators

    // (Uniform) Multiplicative congruential generator
    function MCG$4(a = 0, b = 1, seed = int$4(1, 4294967295)) {
    	let scaleFactor, state; //Declare variables
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = floor$1$1(abs$1$1(s)); //TODO: use hash instead of just floor(abs())
    			state = seed;
    		}
    		return seed; //Return current seed (whether updated or not)
    	};
    	const _range = function(r = a, s = b) {
    		//Set new range
    		a = r;
    		b = s;
    		scaleFactor = (b - a) / MCG_M_PLUS_1$3;
    		return [a, b];
    	};
    	//Initialise variables
    	_seed(seed);
    	_range(a, b);

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			state = (state * MCG_A$3) % MCG_M$3;
    			return a + state * scaleFactor;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				state = (state * MCG_A$3) % MCG_M$3;
    				result[i] = a + state * scaleFactor;
    			}
    			return result;
    		}
    	};

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	return Object.freeze(generator);
    }

    //Xorshift
    function Xorshift32$4(a = 0, b = 1, seed = int$4(1, 4294967295)) {
    	const state = new Uint32Array(1);
    	let scaleFactor;
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = trunc$1$1(s) || 1; //TODO: use hash, not just trunc(s)
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

    function RU$4(mean = 0, sd = 1, seed = int$4(1, 4294967295)) { //Ratio of uniforms
    	const urand = Xorshift32$4(0, 1, seed); //TODO: hash seed
    	
    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			while (true) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$3;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1$1(-0.5 * x * x)) {
    					return mean + x * sd;
    				}
    			}
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			let i = 0;
    			while (i < count) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$3;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1$1(-0.5 * x * x)) {
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

    const Unif$4 = Xorshift32$4;
    const Norm$4 = RU$4;

    const Int$4 = function(a, b, seed = int$4(1, 4294967295)) {
    	const urand = Xorshift32$4(ceil$1$1(a), floor$1$1(b) + 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return floor$1$1(urand());
    		} else { //Return array of values
    			const result = urand(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = floor$1$1(result[i]);
    			}
    			return result;
    		}
    	};

    	const _range = function(r = a, s = b) {
    		a = r;
    		b = s;
    		urand.range(ceil$1$1(a), floor$1$1(b) + 1);
    		return [a, b];
    	};

    	generator.seed = urand.seed; //TODO: hash seed
    	generator.range = Object.freeze(_range);

    	return Object.freeze(generator);
    };

    // Exponential
    function Exp$4(lambda = 1, seed = int$4(1, 4294967295)) {
    	const urand = Xorshift32$4(0, 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return -ln$1$1(urand()) / lambda;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = -ln$1$1(urand()) / lambda;
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
    Object.freeze(unif$4);
    Object.freeze(int$4);
    Object.freeze(norm$4);
    Object.freeze(exp$5);

    Object.freeze(MCG$4);
    Object.freeze(Xorshift32$4);
    Object.freeze(RU$4);

    Object.freeze(Unif$4);
    Object.freeze(Int$4);
    Object.freeze(Norm$4);
    Object.freeze(Exp$4);

    //Uniform mapping
    function Float1to1$3(seed = int$4(1, MAX_SAFE_INTEGER$1$1)) { //Scalar -> scalar
    	//Seed checking
    	seed = mod$2$1(seed * 10.23, 4096000);
    	//Function
    	const rng = function(x) {
    		x = fract$4$1(x * 0.1031);
    		x *= x + seed;
    		x *= x + x;
    		return fract$4$1(x);
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    function Float2to1$3(seed = int$4(1, MAX_SAFE_INTEGER$1$1)) { //2D vector -> scalar
    	//Seed checking
    	seed = mod$2$1(seed * 10.23, MAX_SAFE_INTEGER$1$1);
    	//Function
    	const rng = function(vec) {
    		const pX = fract$4$1(vec[0] * 0.1031);
    		const pY = fract$4$1(vec[1] * 0.1031);
    		const offset = dot3$2$1([pX, pY, pX], [pY + seed, pX + seed, pX + seed]);
    		return fract$4$1((pX + pY + 2 * offset) * (pX + offset));
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    // Freeze exports
    Object.freeze(Float1to1$3);
    Object.freeze(Float2to1$3);

    //1D Perlin noise
    function fade$3(t) {
    	return t * t * t * ((t * (6 * t - 15)) + 10);
    }

    function dfdt$3(t) {
    	return t * t * (30 + t * (30 * t + 60));
    }

    function Perlin1D$3(range = [0, 1], seed = int$4(1, Number.MAX_SAFE_INTEGER)) {
    	const grad = Float1to1$3(seed);
    	//Natural amplitude of 1D Perlin noise is 0.5
    	const rmin = range[0];
    	const avg = 0.5 * (rmin + range[1]);
    	const amp = avg - rmin;
    	const scaleFactor = 2 * amp;

    	//Function
    	const perlin = function(x) { //Just value
    		const x0 = floor$1$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return avg + lerp$2$1(c0, c1, fade$3(u)) * scaleFactor;
    	};
    	//Make seed public
    	perlin.seed = seed;
    	//Derivative
    	const deriv = function(x) { //Just derivative
    		const x0 = floor$1$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return (c1 - c0) * dfdt$3(u) * scaleFactor;
    	};
    	perlin.deriv = Object.freeze(deriv);
    	//Gridded data
    	const grid = function(xmin, count, step) {
    		const minCell = floor$1$1(xmin);
    		const maxCell = floor$1$1(xmin + count * step);
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
    				result[index++] = lerp$2$1(c0, c1, fade$3(locX));
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
    Object.freeze(Perlin1D$3);

    function unif$5(a, b, count) {
    	setContext$1$1$1("unif(?a, ?b, ?count)", arguments);
    	realNumber$1$1$1('a');
    	realNumber$1$1$1('b');
    	undefined('count');
    	clearContext$1$1();
    	return unif$4(a, b, count);
    }

    function int$5(a, b, count) {
    	setContext$1$1$1("int(a, b, ?count)", arguments);
    	realNumber$1$1$1('a');
    	realNumber$1$1$1('b');
    	undefined('count');
    	clearContext$1$1();
    	return int$4(a, b, count);
    }

    function norm$5(mean, sd, count) {
    	setContext$1$1$1("norm(?mean, ?sd, ?count)", arguments);
    	realNumber$1$1$1("mean");
    	realNumber$1$1$1("sd");
    	undefined("sd");
    	undefined('count');
    	clearContext$1$1();
    	return norm$4(mean, sd, count);
    }

    function exp$6(lambda, count) {
    	setContext$1$1$1("exp(?lambda, ?count)", arguments);
    	realNumber$1$1$1("lambda");
    	undefined('count');
    	clearContext$1$1();
    	return exp$5(lambda, count);
    }

    function MCG$5(a, b, seed) {
    	setContext$1$1$1("MCG(?a, ?b, ?seed)", arguments);
    	realNumber$2$1(a, "a", signature);
    	realNumber$2$1(b, "b", signature);
    	positiveInteger$1$1(seed); //Consider allowing 0 in future
    	return MCG$4(a, b, seed);
    }

    function Xorshift32$5(a = 0, b = 1, seed = int$4(1, 4294967295)) {
    	setContext$1$1$1("Xorshift32(?a, ?b, ?seed)", arguments);
    	realNumber$2$1(a, "a", signature);
    	realNumber$2$1(b, "b", signature);
    	positiveInteger$1$1(seed); //Consider allowing 0 in future
    	return Xorshift32$4(a, b, seed);
    }

    function RU$5(mean = 0, sd = 1, seed = int$4(1, 4294967295)) { //Ratio of uniforms
    	setContext$1$1$1("RU(?mean, ?sd, ?seed)", arguments);
    	realNumber$2$1(mean, "mean", signature);
    	realNumber$2$1(sd, "sd", signature);
    	//Current implementation technically permits sd < 0, but we disallow it here
    	nonNegative$1$1(sd, "sd", signature);
    	positiveInteger$1$1(seed); //Consider allowing 0 in future
    	return RU$4(mean, sd, seed);
    }

    const Unif$5 = Xorshift32$5; //TODO: will have incorrect signature
    const Norm$5 = RU$5; //TODO: will have incorrect signature

    const Int$5 = function(a, b, seed = int$4(1, 4294967295)) {
    	setContext$1$1$1("Int(a, b, ?seed)", arguments);
    	realNumber$2$1(a, "a", signature); //Don't have to be integers
    	realNumber$2$1(b, "b", signature);
    	positiveInteger$1$1(seed); //Consider allowing 0 in future
    	return Int$4(a, b, seed);
    };

    // Exponential
    function Exp$5(lambda = 1, seed = int$5(1, 4294967295)) {

    }

    // Freeze exports
    Object.freeze(unif$5);
    Object.freeze(int$5);
    Object.freeze(norm$5);
    Object.freeze(exp$6);

    Object.freeze(MCG$5);
    Object.freeze(Xorshift32$5);
    Object.freeze(RU$5);

    Object.freeze(Unif$5);
    Object.freeze(Int$5);
    Object.freeze(Norm$5);
    Object.freeze(Exp$5);

    const MAX_LINEAR_SEARCH_LENGTH$4 = 64; //Yet to be optimised

    function sum$c(arr) {
    	const len = arr.length;
    	let result = 0;
    	for (let i = 0; i < len; i++) {
    		result += arr[i];
    	}
    	return result;
    }

    function min$9(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return min$1(arr[0], arr[len-1]);
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

    function max$9(arr, sorted = false) {
    	const len = arr.length;
    	if (sorted) {
    		return max$1(arr[0], arr[len-1]);
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

    function imax$4(arr, sorted = false) {
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

    function imin$4(arr, sorted = false) {
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

    function prod$8(arr) {
    	const len = arr.length;
    	let result = 1; //By convention for empty array
    	for (let i = 1; i < len; i++) {
    		result *= arr[i];
    	}
    	return result;
    }

    function unique$8(arr, sorted = false) {
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

    function indexOf$8(arr, value, sorted = false) {
    	const len = arr.length;
    	if ((!sorted)||(len <= MAX_LINEAR_SEARCH_LENGTH$4)) { //Unsorted or small length
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$4) {
    				currentIndex = floor$1(0.5 * (lowerBound + upperBound));
    				currentValue = arr[currentIndex];
    				if (currentValue > value) {
    					lowerBound = currentIndex;
    				} else {
    					upperBound = currentIndex;
    				}
    			}
    		} else { //Ascending order
    			if ((startValue > value)||(endValue < value)) {return -1;} //Quick return: value not contained
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$4) {
    				currentIndex = floor$1(0.5 * (lowerBound + upperBound));
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

    function union$8(arr1, arr2, sorted = false) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if ( (!sorted) || (len1 + len2 < MAX_LINEAR_SEARCH_LENGTH$4) ) { //Arrays unsorted or short
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

    function isEqual$b(arr1, arr2) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if (len1 !== len2) {return false;}
    	for (let i = 0; i < len1; i++) {
    		if (arr1[i] !== arr2[i]) {return false;}
    	}
    	return true;
    }

    function sortUint8$8(arr, target = new Uint8Array(arr.length)) { //Radix sort
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

    function count$8(arr, value, sorted = false) {
    	const len = arr.length;
    	let result = 0;
    	if ((!sorted)||(arr.length <= MAX_LINEAR_SEARCH_LENGTH$4)) { //Unsorted or short array
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$4) {
    				currentIndex = floor$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$4) {
    				currentIndex = floor$1(0.5 * (lowerBound + upperBound));
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
    			while (upperBoundFirst - lowerBound > MAX_LINEAR_SEARCH_LENGTH$4) {
    				currentIndex = floor$1(0.5 * (lowerBound + upperBoundFirst));
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
    			while (upperBound - lowerBoundLast > MAX_LINEAR_SEARCH_LENGTH$4) {
    				currentIndex = floor$1(0.5 * (lowerBoundLast + upperBound));
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
    Object.freeze(sum$c);
    Object.freeze(min$9);
    Object.freeze(max$9);
    Object.freeze(prod$8);
    Object.freeze(unique$8);
    Object.freeze(indexOf$8);
    Object.freeze(union$8);
    Object.freeze(isEqual$b);
    Object.freeze(sortUint8$8);
    Object.freeze(imin$4);
    Object.freeze(imax$4);
    Object.freeze(count$8);

    function zeros$8(nrows, ncols) {
    	const result = new Float64Array(nrows * ncols);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function constant$8(nrows, ncols, value) {
    	const result = new Float64Array(nrows * ncols);
    	result.fill(value);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function identity$8(n) {
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

    function flatten$4(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
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
    function scale$l(mat, k, target = new Float64Array(mat.length)) {
    	const len = mat.length;
    	for (let i = 0; i < len; i++) {
    		target[i] = mat[i] * k;
    	}
    	target.nrows = mat.nrows;
    	target.ncols = mat.ncols;
    	return target;
    }

    //Transpose
    function transpose2x2$8(mat, target = new Float64Array(4)) {
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

    function transpose3x3$8(mat, target = new Float64Array(9)) {
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

    function transpose4x4$8(mat, target = new Float64Array(16)) {
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
    function mult$i(mat1, mat2) { //consider adding target parameter
    	const r1 = mat1.nrows;
    	const c1 = mat1.ncols;
    	const r2 = mat2.nrows;
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
    function size$8(mat) {
    	return [mat.nrows, mat.ncols];
    }

    //Determinant
    function det2x2$8(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
    }

    //Inverse
    function inverse2x2$8(mat, target = new Float64Array(4)) {
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
    function vmult$4(vec, mat) { //Premultiply by vector (assumed row-vector)
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

    function vmult2x2$4(vec, mat) {
    	const target = new Float64Array(2);
    	const v0 = vec[0];
    	const v1 = vec[1];
    	target[0] = v0 * mat[0] + v1 * mat[2];
    	target[0] = v0 * mat[1] + v1 * mat[3];
    	return target;
    }

    function multv$4(mat, vec) {
    	const nrows = mat.nrows;
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

    function isEqual$c(mat1, mat2) {
    	if ( (mat1.nrows !== mat2.nrows) || (mat1.ncols !== mat2.ncols) ) {
    		return false;
    	}
    	return array_lib$3.isArrayEqual(mat1, mat2);
    }

    // Freeze exports
    Object.freeze(zeros$8);
    Object.freeze(constant$8);
    Object.freeze(identity$8);
    Object.freeze(flatten$4);
    Object.freeze(scale$l);
    Object.freeze(transpose2x2$8);
    Object.freeze(transpose3x3$8);
    Object.freeze(transpose4x4$8);
    Object.freeze(mult$i);
    Object.freeze(size$8);
    Object.freeze(det2x2$8);
    Object.freeze(inverse2x2$8);
    Object.freeze(vmult$4);
    Object.freeze(vmult2x2$4);
    Object.freeze(multv$4);
    Object.freeze(isEqual$c);

    function zeros$9(m, n) {
        setContext$1$1("zeros(m, n)", arguments);
        positiveInteger$1("m");
        positiveInteger$1("n");
        clearContext$1();
        return zeros$8(m, n);
    }

    function constant$9(m, n, value) {
    	setContext$1$1("constant(m, n, value)", arguments);
        positiveInteger$1("m");
        positiveInteger$1("n");
        realNumber$2("value");
        clearContext$1();
        return constant$8(m, n, value);
    }

    function identity$9(m) {
    	setContext$1$1("identity(m)", arguments);
        positiveInteger$1("m");
        clearContext$1();
        return identity$8(m);
    }

    //TODO: debug for 'flatten

    //Scaling
    function scale$m(mat, k, target$1$1) {
    	setContext$1$1("scale(mat, k, target)", arguments);
        flatMatrix$1("mat");
        realNumber$2("k");
        target$1('target', mat.length);
        clearContext$1();
        return scale$l(mat, k, target$1$1);
    }

    //Transpose
    function transpose2x2$9(mat, target$1$1) {
        setContext$1$1("transpose2x2(mat, target)", arguments);
    	flatMatrix$1("mat", 2, 2);
        target$1('target', mat.length);
        clearContext$1();
        return transpose2x2$8(mat, target$1$1);
    }

    function transpose3x3$9(mat, target$1$1) {
    	setContext$1$1("transpose3x3(mat, target)", arguments);
    	flatMatrix$1("mat", 3, 3);
        target$1('target', mat.length);
        clearContext$1();
        return transpose3x3$8(mat, target$1$1);
    }

    function transpose4x4$9(mat, target$1$1) {
    	setContext$1$1("transpose4x4(mat, target)", arguments);
    	flatMatrix$1("mat", [4, 4] );
        target$1('target', mat.length);
        clearContext$1();
        return transpose4x4$8(mat, target$1$1);
    }

    //Matrix multiplication
    function mult$j(mat1, mat2) {
    	setContext$1$1("mult(mat1, mat2)", arguments);
    	flatMatrix$1("mat1");
    	flatMatrix$1("mat2", mat1.ncols);
        clearContext$1();
        return mult$i(mat1, mat2);
    }

    //Size
    function size$9(mat) {
    	setContext$1$1("size(mat)", arguments);
    	flatMatrix$1("mat");
        clearContext$1();
    	return size$8(mat);
    }

    //Determinant
    function det2x2$9(mat) {
    	setContext$1$1("det2x2(mat)", arguments);
    	flatMatrix$1("mat", 2, 2);
    	clearContext$1();
    	return det2x2$8(mat);
    }

    //Inverse
    function inverse2x2$9(mat, target$1$1) {
    	setContext$1$1("inverse2(mat, target)", arguments);
    	flatMatrix$1("mat", 2, 2);
    	target$1('target', 4);
        clearContext$1();
    	return inverse2x2$8(mat, target$1$1);
    }

    // Freeze exports
    Object.freeze(zeros$9);
    Object.freeze(constant$9);
    Object.freeze(identity$9);
    //Object.freeze(flatten);
    Object.freeze(scale$m);
    Object.freeze(transpose2x2$9);
    Object.freeze(transpose3x3$9);
    Object.freeze(transpose4x4$9);
    Object.freeze(mult$j);
    Object.freeze(size$9);
    Object.freeze(det2x2$9);
    Object.freeze(inverse2x2$9);

    function conj$g(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function real$g(z) {
    	return z[0];
    }

    function imag$g(z) {
    	return z[1];
    }

    function arg$g(z) {
    	return atan2$1(z[1], z[0]);
    }

    function abs$h(z) {
    	return hypot$1(z[0], z[1]);
    }

    function add$a(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$a(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] - z2[0];
    	target[1] = z1[1] - z2[1];
    	return target;
    }

    function mult$k(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	target[0] = re1 * re2 - im1 * im2;
    	target[1] = re1 * im2 - re2 * im1;
    	return target;
    }

    function scale$n(z, k, target = new Float64Array(2)) {
    	target[0] = z[0] * k;
    	target[1] = z[1] * k;
    	return target;
    }

    function div$g(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (- re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function inverse$g(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (-re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function toPolar$5(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const r = hypot$1(re, im);
    	target[0] = r;
    	target[1] = atan2$1(im, re);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$g);
    Object.freeze(real$g);
    Object.freeze(imag$g);
    Object.freeze(arg$g);
    Object.freeze(abs$h);
    Object.freeze(add$a);
    Object.freeze(sub$a);
    Object.freeze(mult$k);
    Object.freeze(scale$n);
    Object.freeze(div$g);
    Object.freeze(inverse$g);
    Object.freeze(toPolar$5);

    function conj$h(z, target$1$1) {
        setContext("conj(z, ?target)", arguments);
    	rectComplex$1("z");
        target$1('target', 2);
        clearContext$1();
        return conj$g(z, target$1$1);
    }

    function real$h(z) {
    	setContext("real(z)", arguments);
    	rectComplex$1("z");
        clearContext$1();
        return real$g(z);
    }

    function imag$h(z) {
    	setContext("imag(z)", arguments);
    	rectComplex$1("z");
        clearContext$1();
        return imag$g(z);
    }

    function arg$h(z) {
    	setContext("arg(z)", arguments);
    	rectComplex$1("z");
        clearContext$1();
        return arg$g(z);
    }

    function abs$i(z) {
    	setContext("abs(z)", arguments);
    	rectComplex$1("z");
        clearContext$1();
        return abs$h(z);
    }

    function add$b(z1, z2, target$1$1) {
    	setContext("add(z1, z2, ?target)", arguments);
    	rectComplex$1("z1");
        rectComplex$1("z2");
        target$1('target', 2);
        clearContext$1();
        return add$a(z1, z2, target$1$1);
    }

    function sub$b(z1, z2, target$1$1) {
    	setContext("sub(z1, z2, ?target)", arguments);
    	rectComplex$1("z1");
        rectComplex$1("z2");
        target$1('target', 2);
        clearContext$1();
        return sub$a(z1, z2, target$1$1);
    }

    function mult$l(z1, z2, target$1$1) {
    	setContext("mult(z1, z2, ?target)", arguments);
    	rectComplex$1("z1");
        rectComplex$1("z2");
        target$1('target', 2);
        clearContext$1();
        return mult$k(z1, z2, target$1$1);
    }

    function scale$o(z, k, target$1$1) {
    	setContext("scale(z, k, ?target)", arguments);
    	rectComplex$1("z");
        realNumber$2("k");
        target$1('target', 2);
        clearContext$1();
        return scale$n(z, k, target$1$1);
    }

    function div$h(z1, z2, target$1$1) {
    	setContext("div(z1, z2, ?target)", arguments);
    	rectComplex$1("z1");
        rectComplex$1("z2");
        target$1('target', 2);
        const result = div$g(z1, z2, target$1$1);
        notDefined$1(result);
        clearContext$1();
        return result;
    }

    function inverse$h(z, target$1$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex$1("z");
        target$1('target', 2);
        const result = inverse$g(z, target$1$1);
        notDefined$1(result);
        clearContext$1();
        return result;
    }

    function toPolar$6(z, target$1$1) {
    	setContext("toPolar(z, ?target)", arguments);
    	rectComplex$1("z");
        target$1('target', 2);
        const result = toPolar$5(z, target$1$1);
        notDefined$1(result);
        clearContext$1();
        return result;
    }

    // Freeze exports
    Object.freeze(conj$h);
    Object.freeze(real$h);
    Object.freeze(imag$h);
    Object.freeze(arg$h);
    Object.freeze(abs$i);
    Object.freeze(add$b);
    Object.freeze(sub$b);
    Object.freeze(mult$l);
    Object.freeze(scale$o);
    Object.freeze(div$h);
    Object.freeze(inverse$h);
    Object.freeze(toPolar$6);

    function toArg$4(angle) { //Not to be exported
    	angle = angle%TWO_PI$1;
    	if (angle > PI$1) {return angle - TWO_PI$1;}
    	if (angle < -PI$1) {return angle + TWO_PI$1;}
    	return angle;
    }

    function conj$i(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = -toArg$4(theta + PI$1);
    	} else {
    		target[0] = r;
    		target[1] = -toArg$4(theta);
    	}
    	return target;
    }

    function real$i(z) {
    	return z[0] * cos$1(z[1]);
    }

    function imag$i(z) {
    	return z[0] * sin$1(z[1]);
    }

    function arg$i(z) {
    	return toArg$4(z[1]);
    }

    function abs$j(z) {
    	return abs$1(z[0]);
    }

    function scale$p(z, k, target = new Float64Array(2)) {
    	const r = z[0] * k;
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$4(theta + PI$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$4(theta);
    	}
    	return target;
    }

    function mult$m(z1, z2, target = new Float64Array(2)) {
    	const r = z1[0] * z2[0];
    	const theta = z1[1] + z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$4(theta + PI$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$4(theta);
    	}
    	return target;
    }

    function div$i(z1, z2, target = new Float64Array(2)) {
    	const r2 = z2[0];
    	if (r2 === 0) {return undefined;}
    	const r = z1[0] / r2;
    	const theta = z1[1] - z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$4(theta + PI$1);
    	} else {
    		target[0] = r;
    		target[1] = toArg$4(theta);
    	}
    	return target;
    }

    function pow$9(z, n, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = pow$1(-r, n);
    		target[1] = toArg$4(n * (theta + PI$1));
    	} else {
    		target[0] = pow$1(r, n);
    		target[1] = toArg$4(n * theta);
    	}
    	return target;
    }

    function inverse$i(z, target = new Float64Array(2)) {
    	const r = z[0];
    	if (r === 0) {return undefined;}
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -1/r;
    		target[1] = toArg$4(-theta - PI$1);
    	} else {
    		target[0] = 1/r;
    		target[1] = toArg$4(-theta);
    	}
    	return target;
    }

    function toRect$5(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	target[0] = r * cos$1(theta);
    	target[1] = r * sin$1(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$i);
    Object.freeze(real$i);
    Object.freeze(imag$i);
    Object.freeze(arg$i);
    Object.freeze(abs$j);
    Object.freeze(scale$p);
    Object.freeze(mult$m);
    Object.freeze(div$i);
    Object.freeze(pow$9);
    Object.freeze(inverse$i);
    Object.freeze(toRect$5);

    function conj$j(z, target$1$1) {
        setContext$1$1("conj(z, ?target)", arguments);
        target$1('target', 2);
        polarComplex$1("z");
        clearContext$1();
        return conj$i(z, target$1$1);
    }

    function real$j(z) {
        setContext$1$1("real(z)", arguments);
        polarComplex$1("z");
        clearContext$1();
    	return real$i(z);
    }

    function imag$j(z) {
        setContext$1$1("imag(z)", arguments);
        polarComplex$1("z");
        clearContext$1();
    	return imag$i(z);
    }

    function arg$j(z) {
        setContext$1$1("arg(z)", arguments);
        polarComplex$1("z");
        clearContext$1();
    	return arg$i(z);
    }

    function abs$k(z) {
        setContext$1$1("abs(z)", arguments);
        polarComplex$1("z");
        clearContext$1();
    	return abs$j(z);
    }

    function scale$q(z, k, target$1$1) {
        setContext$1$1("scale(z, k, ?target)", arguments);
    	polarComplex$1("z");
        realNumber$2("k");
        target$1('target', 2);
        clearContext$1();
        return scale$p(z, k, target$1$1);
    }

    function mult$n(z1, z2, target$1$1) {
    	setContext$1$1("mult(z1, z2, ?target)", arguments);
    	polarComplex$1("z1");
        polarComplex$1("z2");
        target$1('target', 2);
        return mult$m(z1, z2, target$1$1);
    }

    function div$j(z1, z2, target$1$1) {
    	setContext$1$1("div(z1, z2, ?target)", arguments);
    	polarComplex$1("z1");
        polarComplex$1("z2");
        target$1('target', 2);
        const result = div$i(z1, z2, target$1$1);
        notDefined$1(result);
        clearContext$1();
        return result;
    }

    function pow$a(z, n, target$1$1) {
    	setContext$1$1("pow(z, n, ?target)", arguments);
        polarComplex$1("z");
        realNumber$2("n");
        target$1('target', 2);
        clearContext$1();
        return pow$9(z, n, target$1$1);
    }

    function inverse$j(z, target$1$1) {
    	setContext$1$1("inverse(z, ?target)", arguments);
        polarComplex$1("z");
        target$1('target', 2);
        clearContext$1();
        return inverse$i(z, target$1$1);
    }

    function toRect$6(z, target$1$1) {
    	setContext$1$1("toRect(z, ?target)", arguments);
        polarComplex$1("z");
        target$1('target', 2);
        clearContext$1();
        return toRect$5(z, target$1$1);
    }

    // Freeze exports
    Object.freeze(conj$j);
    Object.freeze(real$j);
    Object.freeze(imag$j);
    Object.freeze(arg$j);
    Object.freeze(abs$k);
    Object.freeze(scale$q);
    Object.freeze(mult$n);
    Object.freeze(div$j);
    Object.freeze(pow$a);
    Object.freeze(inverse$j);
    Object.freeze(toRect$6);

    function sum$d(arr) {
    	setContext$1$1("sum(arr)", arguments);
    	realArray$1("arr");
    	const result = sum$c(arr);
    	realOverflow$1(result);
    	clearContext$1();
    	return result;
    }

    function min$a(arr, sorted$1$1) {
    	setContext$1$1("min(arr, ?sorted)", arguments);
    	realArray$1("arr");
    	bool$1$1("sorted");
    	sorted$1("arr", "sorted");
    	clearContext$1();
    	return min$9(arr, sorted$1$1);
    }

    function max$a(arr, sorted$1$1) {
    	setContext$1$1("max(arr, ?sorted)", arguments);
    	realArray$1("arr");
    	bool$1$1("sorted");
    	sorted$1("arr", "sorted");
    	clearContext$1();
    	return max$9(arr, sorted$1$1);
    }

    function prod$9(arr) {
    	setContext$1$1("prod(arr)", arguments);
    	realArray$1('arr');
    	clearContext$1();
    	return prod$8(arr);
    }

    function unique$9(arr, sorted$1$1) {
    	setContext$1$1("unique(arr, ?sorted)", arguments);
    	realArray$1('arr');
    	bool$1$1('sorted');
    	sorted$1('arr', 'sorted');
    	clearContext$1();
    	return unique$8(arr, sorted$1$1);
    }

    function indexOf$9(arr, value, sorted$1$1) {
    	setContext$1$1("indexOf(arr, value, ?sorted)", arguments);
    	realArray$1('arr');
    	realNumber$2('value');
    	bool$1$1('sorted');
    	sorted$1('arr', 'sorted');
    	clearContext$1();
    	return indexOf$8(arr, value, sorted$1$1);
    }

    function union$9(arr1, arr2, sorted$1$1) {
    	setContext$1$1("union(arr1, arr2, ?sorted)", arguments);
    	realArray$1('arr1');
    	realArray$1('arr2');
    	bool$1$1('sorted');
    	sorted$1('arr1', 'sorted');
    	sorted$1('arr2', 'sorted'); // May have ensure sorted same way as arr1
    	clearContext$1();
    	return union$8(arr1, arr2, sorted$1$1);
    }

    function isEqual$d(arr1, arr2) {
    	setContext$1$1("isEqual(arr1, arr2)", arguments);
    	realArray$1('arr1');
    	realArray$1('arr2');
    	clearContext$1();
    	return isEqual$b(arr1, arr2);
    }

    function sortUint8$9(arr, target$1$1) {
    	setContext$1$1('sortUint8(arr, ?target)', arguments);
    	if (arr.constructor !== Uint8Array) {
    		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
    	}
    	target$1('target', arr.length);
    	clearContext$1();
    	return sortUint8$8(arr, target$1$1);
    }

    function count$9(arr, value, sorted$1$1) {
    	setContext$1$1("count(arr, value, ?sorted)", arguments);
    	realArray$1('arr');
    	realNumber$2('value');
    	bool$1$1('sorted');
    	sorted$1('arr', 'sorted');
    	clearContext$1();
    	return count$8(arr, value, sorted$1$1);
    }

    // Freeze exports
    Object.freeze(sum$d);
    Object.freeze(min$a);
    Object.freeze(max$a);
    Object.freeze(prod$9);
    Object.freeze(unique$9);
    Object.freeze(indexOf$9);
    Object.freeze(union$9);
    Object.freeze(isEqual$d);
    Object.freeze(sortUint8$9);
    Object.freeze(count$9);

    var array_debug$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sum: sum$d,
        min: min$a,
        max: max$a,
        prod: prod$9,
        unique: unique$9,
        indexOf: indexOf$9
    });

    var array_lib$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: array_debug$4,
        sum: sum$c,
        min: min$9,
        max: max$9,
        prod: prod$8,
        unique: unique$8,
        indexOf: indexOf$8,
        union: union$8,
        isEqual: isEqual$b,
        sortUint8: sortUint8$8,
        imin: imin$4,
        imax: imax$4,
        count: count$8
    });

    function sum$e(arr, freq = undefined) {
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

    function mean$4(arr, freq = undefined) { //In future must add option to prevent overflow by breaking array down
    	const count = arr.length;
    	if (freq === undefined) {
    		return sum$e(arr)/count;
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

    function variance$4(arr, freq = undefined, sample = true) { //Can be made much more efficient in future
    	const len = arr.length;
    	let result = 0;
    	const mu = mean$4(arr, freq);
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

    function sdev$4(arr, freq = undefined, sample = true) {
    	return sqrt$1(variance$4(arr, freq, sample));
    }

    function cov$4(xarr, yarr, sample = true) {
    	meanX = mean$4(xarr);
    	meanY = mean$4(yarr);
    	const n = xarr.length;
    	let result = 0;
    	for (let i = 0; i < n; i++) {
    		result += (xarr[i] - meanX) * (yarr[i] - meanY);
    	}
    	if (sample && (n > 1)) {n -= 1;}
    	return result / n;
    }

    function cor$4(xarr, yarr, sample = true) { //Could be significantly optimised
    	if (xarr.length === 0) {return undefined;}
    	const covariance = cov$4(xarr, yarr, sample);
    	return covariance / (sdev$4(xarr) * sdev$4(yarr));
    }

    function modes$4(arr, freq = undefined, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (freq === undefined) {
    		[arr, freq] = toFreq$4(arr, sorted);
    	}
    	modes$4 = {};
    	maxValue = arr[0] - 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value > maxValue) {
    			maxValue = value;
    			modes$4 = {};
    			modes$4[value] = true;
    		} else if (value === maxValue) {
    			modes$4[value] = true;
    		}
    	}
    	return new Float64Array(modes$4.keys());
    }

    function toFreq$4(arr, sorted = false) { //TODO: make use of 'sorted' parameter
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

    function freq$4(arr, value, sorted = false) {
    	return count$8(arr, value, sorted);
    }

    function unifPdf$4(x, a, b) {
    	if ((x < a)||(x > b)) {return 0;}
    	return 1 / (a - b);
    }

    function unifCdf$4(x, a, b) {
    	if (x < a){return 0;}
    	if (x > b){return 1;}
    	return (x - a) / (b - a);
    }

    function unifInvCdf$4(p, a, b) {
    	return a + p * (a - b);
    }

    function expPdf$4(x, lambda) {
    	return lambda * exp$1(-lambda * x);
    }
    function expCdf$4(x, lambda) {
    	return 1 - exp$1(-lambda * x);
    }
    function expInvCdf$4(p, lambda) {
    	return -ln$1(1 - p) / lambda;
    }

    Object.freeze(sum$e);
    Object.freeze(mean$4);
    Object.freeze(variance$4);
    Object.freeze(sdev$4);
    Object.freeze(cov$4);
    Object.freeze(cor$4);
    Object.freeze(modes$4);
    Object.freeze(freq$4);
    Object.freeze(toFreq$4);

    Object.freeze(unifPdf$4);
    Object.freeze(unifCdf$4);
    Object.freeze(unifInvCdf$4);
    Object.freeze(expPdf$4);
    Object.freeze(expCdf$4);
    Object.freeze(expInvCdf$4);

    function frac$4(num, tolerance = num * EPSILON$1) { //Farey rational approximation algorithm
    	const wholePart = floor$1(num);
    	const fractionalPart = num - whole;
    	let leftNumerator = 0;
    	let leftDenominator = 1;
    	let rightNumerator = 1;
    	let rightDenominator = 1;
    	let numerator = 1;
    	let denominator = 2;
    	let currentValue = numerator / denominator;
    	while (abs$1(currentValue - num) > tolerance) {
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

    function deriv$4(f, x) {
    	x0 = x * (1 + EPSILON$1);
    	x1 = x * (1 - EPSILON$1);
    	dx = x1 - x0;
    	return (f(x1) - f(x0)) / dx;
    }

    //Freeze exports
    Object.freeze(frac$4);
    Object.freeze(deriv$4);

    //Constants
    // Ratio-of-uniforms
    const RU_SCALE_CONSTANT$4 = sqrt$1(2 / E$1);
    // Park-Miller
    const MCG_A$4 = 48271;
    const MCG_M$4 = 2147483647;
    const MCG_M_PLUS_1$4 = MCG_M$4 + 1;

    //Unseeded random number generation
    // Continuous uniform distribution
    function unif$6(a = 0, b = 1, count = undefined) { //a>b or b>a
    	if (count === undefined) { //Return single value
    		return a + (b - a) * random$1();
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = a + (b - a) * random$1();
    		}
    		return result;
    	}
    }

    // Uniform integer distribution
    function int$6(a, b, count = undefined) { //assumes b > a
    	const A = ceil$1(a);
    	const B = floor$1(b) + 1;
    	const r = B - A;
    	if (count === undefined) { //Return single value
    		return floor$1(A + random$1() * r);
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = floor$1(A + r * random$1());
    		}
    		return result;
    	}
    }

    // Normal distribution
    function norm$6(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
    	if (count === undefined) { //Return single value
    		while (true) {
    			const u1 = random$1();
    			const v2 = random$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$4;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1(-0.5 * x * x)) {
    				return mean + x * sd;
    			}
    		}
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		let i = 0;
    		while (i < count) {
    			const u1 = random$1();
    			const v2 = random$1();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$4;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp$1(-0.5 * x * x)) {
    				result[i++] = mean + x * sd;
    			}
    		}
    		return result;
    	}
    }

    // Exponential distribution
    function exp$7(lambda = 1, count = undefined) {
    	if (count === undefined) { //Return single value
    		return -ln$1(random$1()) / lambda;
    	} else { //Return array of values
    		const result = new Float64Array(count);
    		for (let i = 0; i < count; i++) {
    			result[i] = -ln$1(random$1()) / lambda;
    		}
    		return result;
    	}
    }

    //Seeded random number generators

    // (Uniform) Multiplicative congruential generator
    function MCG$6(a = 0, b = 1, seed = int$6(1, 4294967295)) {
    	let scaleFactor, state; //Declare variables
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = floor$1(abs$1(s)); //TODO: use hash instead of just floor(abs())
    			state = seed;
    		}
    		return seed; //Return current seed (whether updated or not)
    	};
    	const _range = function(r = a, s = b) {
    		//Set new range
    		a = r;
    		b = s;
    		scaleFactor = (b - a) / MCG_M_PLUS_1$4;
    		return [a, b];
    	};
    	//Initialise variables
    	_seed(seed);
    	_range(a, b);

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			state = (state * MCG_A$4) % MCG_M$4;
    			return a + state * scaleFactor;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				state = (state * MCG_A$4) % MCG_M$4;
    				result[i] = a + state * scaleFactor;
    			}
    			return result;
    		}
    	};

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	return Object.freeze(generator);
    }

    //Xorshift
    function Xorshift32$6(a = 0, b = 1, seed = int$6(1, 4294967295)) {
    	const state = new Uint32Array(1);
    	let scaleFactor;
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = trunc$1(s) || 1; //TODO: use hash, not just trunc(s)
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

    function RU$6(mean = 0, sd = 1, seed = int$6(1, 4294967295)) { //Ratio of uniforms
    	const urand = Xorshift32$6(0, 1, seed); //TODO: hash seed
    	
    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			while (true) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$4;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1(-0.5 * x * x)) {
    					return mean + x * sd;
    				}
    			}
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			let i = 0;
    			while (i < count) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$4;
    				const x = u2 / u1;
    				if ( (u1 * u1) <= exp$1(-0.5 * x * x)) {
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

    const Unif$6 = Xorshift32$6;
    const Norm$6 = RU$6;

    const Int$6 = function(a, b, seed = int$6(1, 4294967295)) {
    	const urand = Xorshift32$6(ceil$1(a), floor$1(b) + 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return floor$1(urand());
    		} else { //Return array of values
    			const result = urand(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = floor$1(result[i]);
    			}
    			return result;
    		}
    	};

    	const _range = function(r = a, s = b) {
    		a = r;
    		b = s;
    		urand.range(ceil$1(a), floor$1(b) + 1);
    		return [a, b];
    	};

    	generator.seed = urand.seed; //TODO: hash seed
    	generator.range = Object.freeze(_range);

    	return Object.freeze(generator);
    };

    // Exponential
    function Exp$6(lambda = 1, seed = int$6(1, 4294967295)) {
    	const urand = Xorshift32$6(0, 1, seed); //TODO: hash seed

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			return -ln$1(urand()) / lambda;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				result[i] = -ln$1(urand()) / lambda;
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
    Object.freeze(unif$6);
    Object.freeze(int$6);
    Object.freeze(norm$6);
    Object.freeze(exp$7);

    Object.freeze(MCG$6);
    Object.freeze(Xorshift32$6);
    Object.freeze(RU$6);

    Object.freeze(Unif$6);
    Object.freeze(Int$6);
    Object.freeze(Norm$6);
    Object.freeze(Exp$6);

    //Uniform mapping
    function Float1to1$4(seed = int$6(1, MAX_SAFE_INTEGER$1)) { //Scalar -> scalar
    	//Seed checking
    	seed = mod$2(seed * 10.23, 4096000);
    	//Function
    	const rng = function(x) {
    		x = fract$4(x * 0.1031);
    		x *= x + seed;
    		x *= x + x;
    		return fract$4(x);
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    function Float2to1$4(seed = int$6(1, MAX_SAFE_INTEGER$1)) { //2D vector -> scalar
    	//Seed checking
    	seed = mod$2(seed * 10.23, MAX_SAFE_INTEGER$1);
    	//Function
    	const rng = function(vec) {
    		const pX = fract$4(vec[0] * 0.1031);
    		const pY = fract$4(vec[1] * 0.1031);
    		const offset = dot3$2([pX, pY, pX], [pY + seed, pX + seed, pX + seed]);
    		return fract$4((pX + pY + 2 * offset) * (pX + offset));
    	};
    	//Seed
    	rng.seed = seed;
    	//Return frozen function
    	return Object.freeze(rng);
    }

    // Freeze exports
    Object.freeze(Float1to1$4);
    Object.freeze(Float2to1$4);

    //1D Perlin noise
    function fade$4(t) {
    	return t * t * t * ((t * (6 * t - 15)) + 10);
    }

    function dfdt$4(t) {
    	return t * t * (30 + t * (30 * t + 60));
    }

    function Perlin1D$4(range = [0, 1], seed = int$6(1, Number.MAX_SAFE_INTEGER)) {
    	const grad = Float1to1$4(seed);
    	//Natural amplitude of 1D Perlin noise is 0.5
    	const rmin = range[0];
    	const avg = 0.5 * (rmin + range[1]);
    	const amp = avg - rmin;
    	const scaleFactor = 2 * amp;

    	//Function
    	const perlin = function(x) { //Just value
    		const x0 = floor$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return avg + lerp$2(c0, c1, fade$4(u)) * scaleFactor;
    	};
    	//Make seed public
    	perlin.seed = seed;
    	//Derivative
    	const deriv = function(x) { //Just derivative
    		const x0 = floor$1(x);
    		const x1 = x0 + 1;
    		const g0 = grad(x0);
    		const g1 = grad(x1);
    		const u = x - x0;
    		const c0 = g0 * u;
    		const c1 = g1 * (u - 1);
    		return (c1 - c0) * dfdt$4(u) * scaleFactor;
    	};
    	perlin.deriv = Object.freeze(deriv);
    	//Gridded data
    	const grid = function(xmin, count, step) {
    		const minCell = floor$1(xmin);
    		const maxCell = floor$1(xmin + count * step);
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
    				result[index++] = lerp$2(c0, c1, fade$4(locX));
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
    Object.freeze(Perlin1D$4);

    function unif$7(a, b, count) {
    	setContext$1$1("unif(?a, ?b, ?count)", arguments);
    	realNumber$1$1('a');
    	realNumber$1$1('b');
    	nonNegativeInteger$1('count');
    	clearContext$1();
    	return unif$6(a, b, count);
    }

    function int$7(a, b, count) {
    	setContext$1$1("int(a, b, ?count)", arguments);
    	realNumber$1$1('a');
    	realNumber$1$1('b');
    	nonNegativeInteger$1('count');
    	clearContext$1();
    	return int$6(a, b, count);
    }

    function norm$7(mean, sd, count) {
    	setContext$1$1("norm(?mean, ?sd, ?count)", arguments);
    	realNumber$1$1("mean");
    	realNumber$1$1("sd");
    	undefined("sd");
    	nonNegativeInteger$1('count');
    	clearContext$1();
    	return norm$6(mean, sd, count);
    }

    function exp$8(lambda, count) {
    	setContext$1$1("exp(?lambda, ?count)", arguments);
    	realNumber$1$1("lambda");
    	nonNegativeInteger$1('count');
    	clearContext$1();
    	return exp$7(lambda, count);
    }

    function MCG$7(a, b, seed) {
    	setContext$1$1("MCG(?a, ?b, ?seed)", arguments);
    	realNumber$2(a, "a", signature);
    	realNumber$2(b, "b", signature);
    	positiveInteger$1(seed); //Consider allowing 0 in future
    	return MCG$6(a, b, seed);
    }

    function Xorshift32$7(a = 0, b = 1, seed = int$6(1, 4294967295)) {
    	setContext$1$1("Xorshift32(?a, ?b, ?seed)", arguments);
    	realNumber$2(a, "a", signature);
    	realNumber$2(b, "b", signature);
    	positiveInteger$1(seed); //Consider allowing 0 in future
    	return Xorshift32$6(a, b, seed);
    }

    function RU$7(mean = 0, sd = 1, seed = int$6(1, 4294967295)) { //Ratio of uniforms
    	setContext$1$1("RU(?mean, ?sd, ?seed)", arguments);
    	realNumber$2(mean, "mean", signature);
    	realNumber$2(sd, "sd", signature);
    	//Current implementation technically permits sd < 0, but we disallow it here
    	nonNegative$2(sd, "sd", signature);
    	positiveInteger$1(seed); //Consider allowing 0 in future
    	return RU$6(mean, sd, seed);
    }

    const Unif$7 = Xorshift32$7; //TODO: will have incorrect signature
    const Norm$7 = RU$7; //TODO: will have incorrect signature

    const Int$7 = function(a, b, seed = int$6(1, 4294967295)) {
    	setContext$1$1("Int(a, b, ?seed)", arguments);
    	realNumber$2(a, "a", signature); //Don't have to be integers
    	realNumber$2(b, "b", signature);
    	positiveInteger$1(seed); //Consider allowing 0 in future
    	return Int$6(a, b, seed);
    };

    // Exponential
    function Exp$7(lambda = 1, seed = int$7(1, 4294967295)) {

    }

    // Freeze exports
    Object.freeze(unif$7);
    Object.freeze(int$7);
    Object.freeze(norm$7);
    Object.freeze(exp$8);

    Object.freeze(MCG$7);
    Object.freeze(Xorshift32$7);
    Object.freeze(RU$7);

    Object.freeze(Unif$7);
    Object.freeze(Int$7);
    Object.freeze(Norm$7);
    Object.freeze(Exp$7);

    const MAX_LINEAR_SEARCH_LENGTH$5 = 64; //Yet to be optimised

    function sum$f(arr) {
    	const len = arr.length;
    	let result = 0;
    	for (let i = 0; i < len; i++) {
    		result += arr[i];
    	}
    	return result;
    }

    function min$b(arr, sorted = false) {
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

    function max$b(arr, sorted = false) {
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

    function imax$5(arr, sorted = false) {
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

    function imin$5(arr, sorted = false) {
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

    function prod$a(arr) {
    	const len = arr.length;
    	let result = 1; //By convention for empty array
    	for (let i = 1; i < len; i++) {
    		result *= arr[i];
    	}
    	return result;
    }

    function unique$a(arr, sorted = false) {
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

    function indexOf$a(arr, value, sorted = false) {
    	const len = arr.length;
    	if ((!sorted)||(len <= MAX_LINEAR_SEARCH_LENGTH$5)) { //Unsorted or small length
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$5) {
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$5) {
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

    function union$a(arr1, arr2, sorted = false) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if ( (!sorted) || (len1 + len2 < MAX_LINEAR_SEARCH_LENGTH$5) ) { //Arrays unsorted or short
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

    function isEqual$e(arr1, arr2) {
    	const len1 = arr1.length;
    	const len2 = arr2.length;
    	if (len1 !== len2) {return false;}
    	for (let i = 0; i < len1; i++) {
    		if (arr1[i] !== arr2[i]) {return false;}
    	}
    	return true;
    }

    function sortUint8$a(arr, target = new Uint8Array(arr.length)) { //Radix sort
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

    function count$a(arr, value, sorted = false) {
    	const len = arr.length;
    	let result = 0;
    	if ((!sorted)||(arr.length <= MAX_LINEAR_SEARCH_LENGTH$5)) { //Unsorted or short array
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$5) {
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
    			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH$5) {
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
    			while (upperBoundFirst - lowerBound > MAX_LINEAR_SEARCH_LENGTH$5) {
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
    			while (upperBound - lowerBoundLast > MAX_LINEAR_SEARCH_LENGTH$5) {
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
    Object.freeze(sum$f);
    Object.freeze(min$b);
    Object.freeze(max$b);
    Object.freeze(prod$a);
    Object.freeze(unique$a);
    Object.freeze(indexOf$a);
    Object.freeze(union$a);
    Object.freeze(isEqual$e);
    Object.freeze(sortUint8$a);
    Object.freeze(imin$5);
    Object.freeze(imax$5);
    Object.freeze(count$a);

    function zeros$a(nrows, ncols) {
    	const result = new Float64Array(nrows * ncols);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function constant$a(nrows, ncols, value) {
    	const result = new Float64Array(nrows * ncols);
    	result.fill(value);
    	result.nrows = nrows;
    	result.ncols = ncols;
    	return result;
    }

    function identity$a(n) {
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

    function flatten$5(mat2d, target = new Float64Array(mat2d.length * mat2d[0].length)) { //Flattens 2D array into 1D array
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
    function scale$r(mat, k, target = new Float64Array(mat.length)) {
    	const len = mat.length;
    	for (let i = 0; i < len; i++) {
    		target[i] = mat[i] * k;
    	}
    	target.nrows = mat.nrows;
    	target.ncols = mat.ncols;
    	return target;
    }

    //Transpose
    function transpose2x2$a(mat, target = new Float64Array(4)) {
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

    function transpose3x3$a(mat, target = new Float64Array(9)) {
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

    function transpose4x4$a(mat, target = new Float64Array(16)) {
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
    function mult$o(mat1, mat2) { //consider adding target parameter
    	const r1 = mat1.nrows;
    	const c1 = mat1.ncols;
    	const r2 = mat2.nrows;
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
    function size$a(mat) {
    	return [mat.nrows, mat.ncols];
    }

    //Determinant
    function det2x2$a(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
    }

    //Inverse
    function inverse2x2$a(mat, target = new Float64Array(4)) {
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
    function vmult$5(vec, mat) { //Premultiply by vector (assumed row-vector)
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

    function vmult2x2$5(vec, mat) {
    	const target = new Float64Array(2);
    	const v0 = vec[0];
    	const v1 = vec[1];
    	target[0] = v0 * mat[0] + v1 * mat[2];
    	target[0] = v0 * mat[1] + v1 * mat[3];
    	return target;
    }

    function multv$5(mat, vec) {
    	const nrows = mat.nrows;
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

    function isEqual$f(mat1, mat2) {
    	if ( (mat1.nrows !== mat2.nrows) || (mat1.ncols !== mat2.ncols) ) {
    		return false;
    	}
    	return array_lib$4.isArrayEqual(mat1, mat2);
    }

    // Freeze exports
    Object.freeze(zeros$a);
    Object.freeze(constant$a);
    Object.freeze(identity$a);
    Object.freeze(flatten$5);
    Object.freeze(scale$r);
    Object.freeze(transpose2x2$a);
    Object.freeze(transpose3x3$a);
    Object.freeze(transpose4x4$a);
    Object.freeze(mult$o);
    Object.freeze(size$a);
    Object.freeze(det2x2$a);
    Object.freeze(inverse2x2$a);
    Object.freeze(vmult$5);
    Object.freeze(vmult2x2$5);
    Object.freeze(multv$5);
    Object.freeze(isEqual$f);

    function zeros$b(m, n) {
        setContext$1("zeros(m, n)", arguments);
        positiveInteger("m");
        positiveInteger("n");
        clearContext();
        return zeros$a(m, n);
    }

    function constant$b(m, n, value) {
    	setContext$1("constant(m, n, value)", arguments);
        positiveInteger("m");
        positiveInteger("n");
        realNumber("value");
        clearContext();
        return constant$a(m, n, value);
    }

    function identity$b(m) {
    	setContext$1("identity(m)", arguments);
        positiveInteger("m");
        clearContext();
        return identity$a(m);
    }

    //TODO: debug for 'flatten

    //Scaling
    function scale$s(mat, k, target$1) {
    	setContext$1("scale(mat, k, target)", arguments);
        flatMatrix("mat");
        realNumber("k");
        target('target', mat.length);
        clearContext();
        return scale$r(mat, k, target$1);
    }

    //Transpose
    function transpose2x2$b(mat, target$1) {
        setContext$1("transpose2x2(mat, target)", arguments);
    	flatMatrix("mat", 2, 2);
        target('target', mat.length);
        clearContext();
        return transpose2x2$a(mat, target$1);
    }

    function transpose3x3$b(mat, target$1) {
    	setContext$1("transpose3x3(mat, target)", arguments);
    	flatMatrix("mat", 3, 3);
        target('target', mat.length);
        clearContext();
        return transpose3x3$a(mat, target$1);
    }

    function transpose4x4$b(mat, target$1) {
    	setContext$1("transpose4x4(mat, target)", arguments);
    	flatMatrix("mat", [4, 4] );
        target('target', mat.length);
        clearContext();
        return transpose4x4$a(mat, target$1);
    }

    //Matrix multiplication
    function mult$p(mat1, mat2) {
    	setContext$1("mult(mat1, mat2)", arguments);
    	flatMatrix("mat1");
    	flatMatrix("mat2", mat1.ncols);
        clearContext();
        return mult$o(mat1, mat2);
    }

    //Size
    function size$b(mat) {
    	setContext$1("size(mat)", arguments);
    	flatMatrix("mat");
        clearContext();
    	return size$a(mat);
    }

    //Determinant
    function det2x2$b(mat) {
    	setContext$1("det2x2(mat)", arguments);
    	flatMatrix("mat", 2, 2);
    	clearContext();
    	return det2x2$a(mat);
    }

    //Inverse
    function inverse2x2$b(mat, target$1) {
    	setContext$1("inverse2(mat, target)", arguments);
    	flatMatrix("mat", 2, 2);
    	target('target', 4);
        clearContext();
    	return inverse2x2$a(mat, target$1);
    }

    // Freeze exports
    Object.freeze(zeros$b);
    Object.freeze(constant$b);
    Object.freeze(identity$b);
    //Object.freeze(flatten);
    Object.freeze(scale$s);
    Object.freeze(transpose2x2$b);
    Object.freeze(transpose3x3$b);
    Object.freeze(transpose4x4$b);
    Object.freeze(mult$p);
    Object.freeze(size$b);
    Object.freeze(det2x2$b);
    Object.freeze(inverse2x2$b);
    //export {flatten}

    var matrix_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        zeros: zeros$b,
        constant: constant$b,
        identity: identity$b,
        scale: scale$s,
        transpose2x2: transpose2x2$b,
        transpose3x3: transpose3x3$b,
        transpose4x4: transpose4x4$b,
        mult: mult$p,
        size: size$b,
        det2x2: det2x2$b,
        inverse2x2: inverse2x2$b
    });

    var matrix_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: matrix_debug,
        zeros: zeros$a,
        constant: constant$a,
        identity: identity$a,
        flatten: flatten$5,
        scale: scale$r,
        transpose2x2: transpose2x2$a,
        transpose3x3: transpose3x3$a,
        transpose4x4: transpose4x4$a,
        mult: mult$o,
        size: size$a,
        det2x2: det2x2$a,
        inverse2x2: inverse2x2$a,
        vmult: vmult$5,
        vmult2x2: vmult2x2$5,
        multv: multv$5,
        isEqual: isEqual$f
    });

    function conj$k(z, target = new Float64Array(2)) {
    	target[0] = z[0];
    	target[1] = -z[1];
    	return target;
    }

    function real$k(z) {
    	return z[0];
    }

    function imag$k(z) {
    	return z[1];
    }

    function arg$k(z) {
    	return atan2(z[1], z[0]);
    }

    function abs$l(z) {
    	return hypot(z[0], z[1]);
    }

    function add$c(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$c(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] - z2[0];
    	target[1] = z1[1] - z2[1];
    	return target;
    }

    function mult$q(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	target[0] = re1 * re2 - im1 * im2;
    	target[1] = re1 * im2 - re2 * im1;
    	return target;
    }

    function scale$t(z, k, target = new Float64Array(2)) {
    	target[0] = z[0] * k;
    	target[1] = z[1] * k;
    	return target;
    }

    function div$k(z1, z2, target = new Float64Array(2)) {
    	const re1 = z1[0];
    	const im1 = z1[1];
    	const re2 = z2[0];
    	const im2 = z2[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (- re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function inverse$k(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const scale = 1 / (re2 * re2 + im2 * im2);
    	target[0] = (re1 * re2 + im1 * im2) * scale;
    	target[1] = (-re1 * im2 - re2 * im1) * scale;
    	return target;
    }

    function toPolar$7(z, target = new Float64Array(2)) {
    	const re = z[0];
    	const im = z[1];
    	const r = hypot(re, im);
    	target[0] = r;
    	target[1] = atan2(im, re);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$k);
    Object.freeze(real$k);
    Object.freeze(imag$k);
    Object.freeze(arg$k);
    Object.freeze(abs$l);
    Object.freeze(add$c);
    Object.freeze(sub$c);
    Object.freeze(mult$q);
    Object.freeze(scale$t);
    Object.freeze(div$k);
    Object.freeze(inverse$k);
    Object.freeze(toPolar$7);

    function conj$l(z, target$1) {
        setContext("conj(z, ?target)", arguments);
    	rectComplex("z");
        target('target', 2);
        clearContext();
        return conj$k(z, target$1);
    }

    function real$l(z) {
    	setContext("real(z)", arguments);
    	rectComplex("z");
        clearContext();
        return real$k(z);
    }

    function imag$l(z) {
    	setContext("imag(z)", arguments);
    	rectComplex("z");
        clearContext();
        return imag$k(z);
    }

    function arg$l(z) {
    	setContext("arg(z)", arguments);
    	rectComplex("z");
        clearContext();
        return arg$k(z);
    }

    function abs$m(z) {
    	setContext("abs(z)", arguments);
    	rectComplex("z");
        clearContext();
        return abs$l(z);
    }

    function add$d(z1, z2, target$1) {
    	setContext("add(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        clearContext();
        return add$c(z1, z2, target$1);
    }

    function sub$d(z1, z2, target$1) {
    	setContext("sub(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        clearContext();
        return sub$c(z1, z2, target$1);
    }

    function mult$r(z1, z2, target$1) {
    	setContext("mult(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        clearContext();
        return mult$q(z1, z2, target$1);
    }

    function scale$u(z, k, target$1) {
    	setContext("scale(z, k, ?target)", arguments);
    	rectComplex("z");
        realNumber("k");
        target('target', 2);
        clearContext();
        return scale$t(z, k, target$1);
    }

    function div$l(z1, z2, target$1) {
    	setContext("div(z1, z2, ?target)", arguments);
    	rectComplex("z1");
        rectComplex("z2");
        target('target', 2);
        const result = div$k(z1, z2, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    function inverse$l(z, target$1) {
    	setContext("inverse(z, ?target)", arguments);
    	rectComplex("z");
        target('target', 2);
        const result = inverse$k(z, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    function toPolar$8(z, target$1) {
    	setContext("toPolar(z, ?target)", arguments);
    	rectComplex("z");
        target('target', 2);
        const result = toPolar$7(z, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    // Freeze exports
    Object.freeze(conj$l);
    Object.freeze(real$l);
    Object.freeze(imag$l);
    Object.freeze(arg$l);
    Object.freeze(abs$m);
    Object.freeze(add$d);
    Object.freeze(sub$d);
    Object.freeze(mult$r);
    Object.freeze(scale$u);
    Object.freeze(div$l);
    Object.freeze(inverse$l);
    Object.freeze(toPolar$8);

    var rect_debug$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        conj: conj$l,
        real: real$l,
        imag: imag$l,
        arg: arg$l,
        abs: abs$m,
        add: add$d,
        sub: sub$d,
        mult: mult$r,
        scale: scale$u,
        div: div$l,
        inverse: inverse$l,
        toPolar: toPolar$8
    });

    var rect_lib$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: rect_debug$1,
        conj: conj$k,
        real: real$k,
        imag: imag$k,
        arg: arg$k,
        abs: abs$l,
        add: add$c,
        sub: sub$c,
        mult: mult$q,
        scale: scale$t,
        div: div$k,
        inverse: inverse$k,
        toPolar: toPolar$7
    });

    function toArg$5(angle) { //Not to be exported
    	angle = angle%TWO_PI;
    	if (angle > PI) {return angle - TWO_PI;}
    	if (angle < -PI) {return angle + TWO_PI;}
    	return angle;
    }

    function conj$m(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = -toArg$5(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = -toArg$5(theta);
    	}
    	return target;
    }

    function real$m(z) {
    	return z[0] * cos(z[1]);
    }

    function imag$m(z) {
    	return z[0] * sin(z[1]);
    }

    function arg$m(z) {
    	return toArg$5(z[1]);
    }

    function abs$n(z) {
    	return abs(z[0]);
    }

    function scale$v(z, k, target = new Float64Array(2)) {
    	const r = z[0] * k;
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$5(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = toArg$5(theta);
    	}
    	return target;
    }

    function mult$s(z1, z2, target = new Float64Array(2)) {
    	const r = z1[0] * z2[0];
    	const theta = z1[1] + z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$5(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = toArg$5(theta);
    	}
    	return target;
    }

    function div$m(z1, z2, target = new Float64Array(2)) {
    	const r2 = z2[0];
    	if (r2 === 0) {return undefined;}
    	const r = z1[0] / r2;
    	const theta = z1[1] - z2[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = toArg$5(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = toArg$5(theta);
    	}
    	return target;
    }

    function pow$b(z, n, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = pow(-r, n);
    		target[1] = toArg$5(n * (theta + PI));
    	} else {
    		target[0] = pow(r, n);
    		target[1] = toArg$5(n * theta);
    	}
    	return target;
    }

    function inverse$m(z, target = new Float64Array(2)) {
    	const r = z[0];
    	if (r === 0) {return undefined;}
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -1/r;
    		target[1] = toArg$5(-theta - PI);
    	} else {
    		target[0] = 1/r;
    		target[1] = toArg$5(-theta);
    	}
    	return target;
    }

    function toRect$7(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	target[0] = r * cos(theta);
    	target[1] = r * sin(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(conj$m);
    Object.freeze(real$m);
    Object.freeze(imag$m);
    Object.freeze(arg$m);
    Object.freeze(abs$n);
    Object.freeze(scale$v);
    Object.freeze(mult$s);
    Object.freeze(div$m);
    Object.freeze(pow$b);
    Object.freeze(inverse$m);
    Object.freeze(toRect$7);

    function conj$n(z, target$1) {
        setContext$1("conj(z, ?target)", arguments);
        target('target', 2);
        polarComplex("z");
        clearContext();
        return conj$m(z, target$1);
    }

    function real$n(z) {
        setContext$1("real(z)", arguments);
        polarComplex("z");
        clearContext();
    	return real$m(z);
    }

    function imag$n(z) {
        setContext$1("imag(z)", arguments);
        polarComplex("z");
        clearContext();
    	return imag$m(z);
    }

    function arg$n(z) {
        setContext$1("arg(z)", arguments);
        polarComplex("z");
        clearContext();
    	return arg$m(z);
    }

    function abs$o(z) {
        setContext$1("abs(z)", arguments);
        polarComplex("z");
        clearContext();
    	return abs$n(z);
    }

    function scale$w(z, k, target$1) {
        setContext$1("scale(z, k, ?target)", arguments);
    	polarComplex("z");
        realNumber("k");
        target('target', 2);
        clearContext();
        return scale$v(z, k, target$1);
    }

    function mult$t(z1, z2, target$1) {
    	setContext$1("mult(z1, z2, ?target)", arguments);
    	polarComplex("z1");
        polarComplex("z2");
        target('target', 2);
        return mult$s(z1, z2, target$1);
    }

    function div$n(z1, z2, target$1) {
    	setContext$1("div(z1, z2, ?target)", arguments);
    	polarComplex("z1");
        polarComplex("z2");
        target('target', 2);
        const result = div$m(z1, z2, target$1);
        notDefined(result);
        clearContext();
        return result;
    }

    function pow$c(z, n, target$1) {
    	setContext$1("pow(z, n, ?target)", arguments);
        polarComplex("z");
        realNumber("n");
        target('target', 2);
        clearContext();
        return pow$b(z, n, target$1);
    }

    function inverse$n(z, target$1) {
    	setContext$1("inverse(z, ?target)", arguments);
        polarComplex("z");
        target('target', 2);
        clearContext();
        return inverse$m(z, target$1);
    }

    function toRect$8(z, target$1) {
    	setContext$1("toRect(z, ?target)", arguments);
        polarComplex("z");
        target('target', 2);
        clearContext();
        return toRect$7(z, target$1);
    }

    // Freeze exports
    Object.freeze(conj$n);
    Object.freeze(real$n);
    Object.freeze(imag$n);
    Object.freeze(arg$n);
    Object.freeze(abs$o);
    Object.freeze(scale$w);
    Object.freeze(mult$t);
    Object.freeze(div$n);
    Object.freeze(pow$c);
    Object.freeze(inverse$n);
    Object.freeze(toRect$8);

    var polar_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        conj: conj$n,
        real: real$n,
        imag: imag$n,
        arg: arg$n,
        abs: abs$o,
        scale: scale$w,
        mult: mult$t,
        div: div$n,
        pow: pow$c,
        inverse: inverse$n,
        toRect: toRect$8
    });

    var polar_lib$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: polar_debug,
        conj: conj$m,
        real: real$m,
        imag: imag$m,
        arg: arg$m,
        abs: abs$n,
        scale: scale$v,
        mult: mult$s,
        div: div$m,
        pow: pow$b,
        inverse: inverse$m,
        toRect: toRect$7
    });

    var complex_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        rect: rect_lib$1,
        polar: polar_lib$1,
        debug: rect_debug$1,
        conj: conj$k,
        real: real$k,
        imag: imag$k,
        arg: arg$k,
        abs: abs$l,
        add: add$c,
        sub: sub$c,
        mult: mult$q,
        scale: scale$t,
        div: div$k,
        inverse: inverse$k,
        toPolar: toPolar$7
    });

    function sum$g(arr) {
    	setContext$1("sum(arr)", arguments);
    	realArray("arr");
    	const result = sum$f(arr);
    	realOverflow(result);
    	clearContext();
    	return result;
    }

    function min$c(arr, sorted$1) {
    	setContext$1("min(arr, ?sorted)", arguments);
    	realArray("arr");
    	bool$1("sorted");
    	sorted("arr", "sorted");
    	clearContext();
    	return min$b(arr, sorted$1);
    }

    function max$c(arr, sorted$1) {
    	setContext$1("max(arr, ?sorted)", arguments);
    	realArray("arr");
    	bool$1("sorted");
    	sorted("arr", "sorted");
    	clearContext();
    	return max$b(arr, sorted$1);
    }

    function prod$b(arr) {
    	setContext$1("prod(arr)", arguments);
    	realArray('arr');
    	clearContext();
    	return prod$a(arr);
    }

    function unique$b(arr, sorted$1) {
    	setContext$1("unique(arr, ?sorted)", arguments);
    	realArray('arr');
    	bool$1('sorted');
    	sorted('arr', 'sorted');
    	clearContext();
    	return unique$a(arr, sorted$1);
    }

    function indexOf$b(arr, value, sorted$1) {
    	setContext$1("indexOf(arr, value, ?sorted)", arguments);
    	realArray('arr');
    	realNumber('value');
    	bool$1('sorted');
    	sorted('arr', 'sorted');
    	clearContext();
    	return indexOf$a(arr, value, sorted$1);
    }

    function union$b(arr1, arr2, sorted$1) {
    	setContext$1("union(arr1, arr2, ?sorted)", arguments);
    	realArray('arr1');
    	realArray('arr2');
    	bool$1('sorted');
    	sorted('arr1', 'sorted');
    	sorted('arr2', 'sorted'); // May have ensure sorted same way as arr1
    	clearContext();
    	return union$a(arr1, arr2, sorted$1);
    }

    function isEqual$g(arr1, arr2) {
    	setContext$1("isEqual(arr1, arr2)", arguments);
    	realArray('arr1');
    	realArray('arr2');
    	clearContext();
    	return isEqual$e(arr1, arr2);
    }

    function sortUint8$b(arr, target$1) {
    	setContext$1('sortUint8(arr, ?target)', arguments);
    	if (arr.constructor !== Uint8Array) {
    		throw 'sortUint8(arr, ?target): arr must be a Uint8Array';
    	}
    	target('target', arr.length);
    	clearContext();
    	return sortUint8$a(arr, target$1);
    }

    function count$b(arr, value, sorted$1) {
    	setContext$1("count(arr, value, ?sorted)", arguments);
    	realArray('arr');
    	realNumber('value');
    	bool$1('sorted');
    	sorted('arr', 'sorted');
    	clearContext();
    	return count$a(arr, value, sorted$1);
    }

    // Freeze exports
    Object.freeze(sum$g);
    Object.freeze(min$c);
    Object.freeze(max$c);
    Object.freeze(prod$b);
    Object.freeze(unique$b);
    Object.freeze(indexOf$b);
    Object.freeze(union$b);
    Object.freeze(isEqual$g);
    Object.freeze(sortUint8$b);
    Object.freeze(count$b);

    var array_debug$5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sum: sum$g,
        min: min$c,
        max: max$c,
        prod: prod$b,
        unique: unique$b,
        indexOf: indexOf$b
    });

    var array_lib$5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: array_debug$5,
        sum: sum$f,
        min: min$b,
        max: max$b,
        prod: prod$a,
        unique: unique$a,
        indexOf: indexOf$a,
        union: union$a,
        isEqual: isEqual$e,
        sortUint8: sortUint8$a,
        imin: imin$5,
        imax: imax$5,
        count: count$a
    });

    var statistics_debug = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    function sum$h(arr, freq = undefined) {
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

    function mean$5(arr, freq = undefined) { //In future must add option to prevent overflow by breaking array down
    	const count = arr.length;
    	if (freq === undefined) {
    		return sum$h(arr)/count;
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

    function variance$5(arr, freq = undefined, sample = true) { //Can be made much more efficient in future
    	const len = arr.length;
    	let result = 0;
    	const mu = mean$5(arr, freq);
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

    function sdev$5(arr, freq = undefined, sample = true) {
    	return sqrt(variance$5(arr, freq, sample));
    }

    function cov$5(xarr, yarr, sample = true) {
    	meanX = mean$5(xarr);
    	meanY = mean$5(yarr);
    	const n = xarr.length;
    	let result = 0;
    	for (let i = 0; i < n; i++) {
    		result += (xarr[i] - meanX) * (yarr[i] - meanY);
    	}
    	if (sample && (n > 1)) {n -= 1;}
    	return result / n;
    }

    function cor$5(xarr, yarr, sample = true) { //Could be significantly optimised
    	if (xarr.length === 0) {return undefined;}
    	const covariance = cov$5(xarr, yarr, sample);
    	return covariance / (sdev$5(xarr) * sdev$5(yarr));
    }

    function modes$5(arr, freq = undefined, sorted = false) {
    	const len = arr.length;
    	if (len === 0) {return undefined;}
    	if (freq === undefined) {
    		[arr, freq] = toFreq$5(arr, sorted);
    	}
    	modes$5 = {};
    	maxValue = arr[0] - 1;
    	for (let i = 0; i < len; i++) {
    		const value = arr[i];
    		if (value > maxValue) {
    			maxValue = value;
    			modes$5 = {};
    			modes$5[value] = true;
    		} else if (value === maxValue) {
    			modes$5[value] = true;
    		}
    	}
    	return new Float64Array(modes$5.keys());
    }

    function toFreq$5(arr, sorted = false) { //TODO: make use of 'sorted' parameter
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

    function freq$5(arr, value, sorted = false) {
    	return count$a(arr, value, sorted);
    }

    function unifPdf$5(x, a, b) {
    	if ((x < a)||(x > b)) {return 0;}
    	return 1 / (a - b);
    }

    function unifCdf$5(x, a, b) {
    	if (x < a){return 0;}
    	if (x > b){return 1;}
    	return (x - a) / (b - a);
    }

    function unifInvCdf$5(p, a, b) {
    	return a + p * (a - b);
    }

    function expPdf$5(x, lambda) {
    	return lambda * exp(-lambda * x);
    }
    function expCdf$5(x, lambda) {
    	return 1 - exp(-lambda * x);
    }
    function expInvCdf$5(p, lambda) {
    	return -ln(1 - p) / lambda;
    }

    Object.freeze(sum$h);
    Object.freeze(mean$5);
    Object.freeze(variance$5);
    Object.freeze(sdev$5);
    Object.freeze(cov$5);
    Object.freeze(cor$5);
    Object.freeze(modes$5);
    Object.freeze(freq$5);
    Object.freeze(toFreq$5);

    Object.freeze(unifPdf$5);
    Object.freeze(unifCdf$5);
    Object.freeze(unifInvCdf$5);
    Object.freeze(expPdf$5);
    Object.freeze(expCdf$5);
    Object.freeze(expInvCdf$5);

    var statistics_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: statistics_debug,
        sum: sum$h,
        mean: mean$5,
        variance: variance$5,
        sdev: sdev$5,
        cov: cov$5,
        cor: cor$5,
        get modes () { return modes$5; },
        freq: freq$5,
        toFreq: toFreq$5,
        unifPdf: unifPdf$5,
        unifCdf: unifCdf$5,
        unifInvCdf: unifInvCdf$5,
        expPdf: expPdf$5,
        expCdf: expCdf$5,
        expInvCdf: expInvCdf$5
    });

    function frac$5(num, tolerance = num * EPSILON) { //Farey rational approximation algorithm
    	const wholePart = floor(num);
    	const fractionalPart = num - whole;
    	let leftNumerator = 0;
    	let leftDenominator = 1;
    	let rightNumerator = 1;
    	let rightDenominator = 1;
    	let numerator = 1;
    	let denominator = 2;
    	let currentValue = numerator / denominator;
    	while (abs(currentValue - num) > tolerance) {
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

    function deriv$5(f, x) {
    	x0 = x * (1 + EPSILON);
    	x1 = x * (1 - EPSILON);
    	dx = x1 - x0;
    	return (f(x1) - f(x0)) / dx;
    }

    //Freeze exports
    Object.freeze(frac$5);
    Object.freeze(deriv$5);

    var numerical_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        frac: frac$5,
        deriv: deriv$5
    });

    //Constants
    // Ratio-of-uniforms
    const RU_SCALE_CONSTANT$5 = sqrt(2 / E);
    // Park-Miller
    const MCG_A$5 = 48271;
    const MCG_M$5 = 2147483647;
    const MCG_M_PLUS_1$5 = MCG_M$5 + 1;

    //Unseeded random number generation
    // Continuous uniform distribution
    function unif$8(a = 0, b = 1, count = undefined) { //a>b or b>a
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
    function int$8(a, b, count = undefined) { //assumes b > a
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
    function norm$8(mean = 0, sd = 1, count = undefined) { //Ratio-of-uniforms algorithm
    	if (count === undefined) { //Return single value
    		while (true) {
    			const u1 = random();
    			const v2 = random();
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$5;
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
    			const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$5;
    			const x = u2 / u1;
    			if ( (u1 * u1) <= exp(-0.5 * x * x)) {
    				result[i++] = mean + x * sd;
    			}
    		}
    		return result;
    	}
    }

    // Exponential distribution
    function exp$9(lambda = 1, count = undefined) {
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
    function MCG$8(a = 0, b = 1, seed = int$8(1, 4294967295)) {
    	let scaleFactor, state; //Declare variables
    	const _seed = function(s = undefined) {
    		if (s !== undefined) { //Set new seed and reset state
    			seed = floor(abs(s)); //TODO: use hash instead of just floor(abs())
    			state = seed;
    		}
    		return seed; //Return current seed (whether updated or not)
    	};
    	const _range = function(r = a, s = b) {
    		//Set new range
    		a = r;
    		b = s;
    		scaleFactor = (b - a) / MCG_M_PLUS_1$5;
    		return [a, b];
    	};
    	//Initialise variables
    	_seed(seed);
    	_range(a, b);

    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			state = (state * MCG_A$5) % MCG_M$5;
    			return a + state * scaleFactor;
    		} else { //Return array of values
    			const result = new Float64Array(count);
    			for (let i = 0; i < count; i++) {
    				state = (state * MCG_A$5) % MCG_M$5;
    				result[i] = a + state * scaleFactor;
    			}
    			return result;
    		}
    	};

    	generator.seed = Object.freeze(_seed);
    	generator.range = Object.freeze(_range);
    	return Object.freeze(generator);
    }

    //Xorshift
    function Xorshift32$8(a = 0, b = 1, seed = int$8(1, 4294967295)) {
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

    function RU$8(mean = 0, sd = 1, seed = int$8(1, 4294967295)) { //Ratio of uniforms
    	const urand = Xorshift32$8(0, 1, seed); //TODO: hash seed
    	
    	const generator = function(count = undefined) {
    		if (count === undefined) { //Return single value
    			while (true) {
    				const u1 = urand();
    				const v2 = urand();
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$5;
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
    				const u2 = (2 * v2 - 1) * RU_SCALE_CONSTANT$5;
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

    const Unif$8 = Xorshift32$8;
    const Norm$8 = RU$8;

    const Int$8 = function(a, b, seed = int$8(1, 4294967295)) {
    	const urand = Xorshift32$8(ceil(a), floor(b) + 1, seed); //TODO: hash seed

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
    function Exp$8(lambda = 1, seed = int$8(1, 4294967295)) {
    	const urand = Xorshift32$8(0, 1, seed); //TODO: hash seed

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
    Object.freeze(unif$8);
    Object.freeze(int$8);
    Object.freeze(norm$8);
    Object.freeze(exp$9);

    Object.freeze(MCG$8);
    Object.freeze(Xorshift32$8);
    Object.freeze(RU$8);

    Object.freeze(Unif$8);
    Object.freeze(Int$8);
    Object.freeze(Norm$8);
    Object.freeze(Exp$8);

    //Uniform mapping
    function Float1to1$5(seed = int$8(1, MAX_SAFE_INTEGER)) { //Scalar -> scalar
    	//Seed checking
    	seed = mod(seed * 10.23, 4096000);
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

    function Float2to1$5(seed = int$8(1, MAX_SAFE_INTEGER)) { //2D vector -> scalar
    	//Seed checking
    	seed = mod(seed * 10.23, MAX_SAFE_INTEGER);
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
    Object.freeze(Float1to1$5);
    Object.freeze(Float2to1$5);

    //1D Perlin noise
    function fade$5(t) {
    	return t * t * t * ((t * (6 * t - 15)) + 10);
    }

    function dfdt$5(t) {
    	return t * t * (30 + t * (30 * t + 60));
    }

    function Perlin1D$5(range = [0, 1], seed = int$8(1, Number.MAX_SAFE_INTEGER)) {
    	const grad = Float1to1$5(seed);
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
    		return avg + lerp(c0, c1, fade$5(u)) * scaleFactor;
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
    		return (c1 - c0) * dfdt$5(u) * scaleFactor;
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
    				result[index++] = lerp(c0, c1, fade$5(locX));
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
    Object.freeze(Perlin1D$5);

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

    function Perlin2D(range = [0, 1], seed = int$8(1, 1000)) {
        const rand = Float2to1$5(seed);

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
            const delC0 = add2(add2(g00, scale2$1(sub2(g10, g00), delWX)), [delWX * (c10 - c00), 0]);
            const delC1 = add2(add2(g01, scale2$1(sub2(g11, g01), delWX)), [delWX * (c11 - c01), 0]);
            let deriv = add2(add2(delC0, scale2$1(sub2(delC1, delC0), delWY)), [0, delWY * (c1 - c0)]);
            deriv = scale2$1(deriv, scaleFactor);
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

    function unif$9(a, b, count) {
    	setContext$1("unif(?a, ?b, ?count)", arguments);
    	realNumber$1('a');
    	realNumber$1('b');
    	nonNegativeInteger('count');
    	clearContext();
    	return unif$8(a, b, count);
    }

    function int$9(a, b, count) {
    	setContext$1("int(a, b, ?count)", arguments);
    	realNumber$1('a');
    	realNumber$1('b');
    	nonNegativeInteger('count');
    	clearContext();
    	return int$8(a, b, count);
    }

    function norm$9(mean, sd, count) {
    	setContext$1("norm(?mean, ?sd, ?count)", arguments);
    	realNumber$1("mean");
    	realNumber$1("sd");
    	nonNegative$1("sd");
    	nonNegativeInteger('count');
    	clearContext();
    	return norm$8(mean, sd, count);
    }

    function exp$a(lambda, count) {
    	setContext$1("exp(?lambda, ?count)", arguments);
    	realNumber$1("lambda");
    	nonNegativeInteger('count');
    	clearContext();
    	return exp$9(lambda, count);
    }

    function MCG$9(a, b, seed) {
    	setContext$1("MCG(?a, ?b, ?seed)", arguments);
    	realNumber(a, "a", signature);
    	realNumber(b, "b", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return MCG$8(a, b, seed);
    }

    function Xorshift32$9(a = 0, b = 1, seed = int$8(1, 4294967295)) {
    	setContext$1("Xorshift32(?a, ?b, ?seed)", arguments);
    	realNumber(a, "a", signature);
    	realNumber(b, "b", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return Xorshift32$8(a, b, seed);
    }

    function RU$9(mean = 0, sd = 1, seed = int$8(1, 4294967295)) { //Ratio of uniforms
    	setContext$1("RU(?mean, ?sd, ?seed)", arguments);
    	realNumber(mean, "mean", signature);
    	realNumber(sd, "sd", signature);
    	//Current implementation technically permits sd < 0, but we disallow it here
    	nonNegative(sd, "sd", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return RU$8(mean, sd, seed);
    }

    const Unif$9 = Xorshift32$9; //TODO: will have incorrect signature
    const Norm$9 = RU$9; //TODO: will have incorrect signature

    const Int$9 = function(a, b, seed = int$8(1, 4294967295)) {
    	setContext$1("Int(a, b, ?seed)", arguments);
    	realNumber(a, "a", signature); //Don't have to be integers
    	realNumber(b, "b", signature);
    	positiveInteger(seed); //Consider allowing 0 in future
    	return Int$8(a, b, seed);
    };

    // Exponential
    function Exp$9(lambda = 1, seed = int$9(1, 4294967295)) {

    }

    // Freeze exports
    Object.freeze(unif$9);
    Object.freeze(int$9);
    Object.freeze(norm$9);
    Object.freeze(exp$a);

    Object.freeze(MCG$9);
    Object.freeze(Xorshift32$9);
    Object.freeze(RU$9);

    Object.freeze(Unif$9);
    Object.freeze(Int$9);
    Object.freeze(Norm$9);
    Object.freeze(Exp$9);

    //Following debug files not implemented
    //export * from "./perlin1d.debug.js";
    //export * from "./perlin2d.debug.js";
    //export * from "./map.debug.js";

    var random_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        unif: unif$9,
        int: int$9,
        norm: norm$9,
        exp: exp$a,
        MCG: MCG$9,
        Xorshift32: Xorshift32$9,
        RU: RU$9,
        Unif: Unif$9,
        Int: Int$9,
        Norm: Norm$9,
        Exp: Exp$9
    });

    var random_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: random_debug,
        unif: unif$8,
        int: int$8,
        norm: norm$8,
        exp: exp$9,
        MCG: MCG$8,
        Xorshift32: Xorshift32$8,
        RU: RU$8,
        Unif: Unif$8,
        Int: Int$8,
        Norm: Norm$8,
        Exp: Exp$8,
        Float1to1: Float1to1$5,
        Float2to1: Float2to1$5,
        Perlin1D: Perlin1D$5,
        Perlin2D: Perlin2D
    });

    const VERSION = "beta-4.0.0";

    exports.VERSION = VERSION;
    exports.array = array_lib$5;
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
