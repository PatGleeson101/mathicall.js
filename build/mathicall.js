var Mathicall = (function (exports) {
    'use strict';

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

    //Math constants
    const E = Math.E;
    const LN2 = Math.LN2;
    const SQRT2 = Math.SQRT2;
    const PI = Math.PI;

    //Number constants
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
    const MAX_VALUE = Number.MAX_VALUE;

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
    	const signature = "lerp(x, y, r)";
    	realNumber(x, "x", signature);
    	realNumber(y, "y", signature);
    	realNumber(r, "r", signature);
    	return lerp(x, y, r);
    }

    function mod$1(x, m) {
    	const signature = "mod(x, m)";
    	realNumber(x, "x", signature);
    	realNumber(m, "m", signature);
    	return mod(x, m);
    }

    function fract$1(x) {
    	const signature = "fract(x)";
    	realNumber(x, "x", signature);
    	return fract(x);
    }

    function deg$1(radians) {
    	const signature = "deg(radians)";
    	realNumber(radians, "radians", signature);
    	return deg(radians);
    }

    function rad$1(degrees) {
    	const signature = "rad(degrees)";
    	realNumber(degrees, "degrees", signature);
    	return rad(degrees);
    }

    function linmap$1(x, domain, range) {
    	const signature = "linmap(x, domain, range)";
    	realNumber(x, "x", signature);
    	//assert domain
    	//assert range
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
    	if (r > 170) {return MAX_VALUE;}
    	r = n - r;
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
    	const signature = "factorial(n)";
    	integer(n, "n", signature);
    	nonNegative(n, "n", signature);
    	const result = factorial(n);
    	realOverflow(result, signature);
    	intOverflow(result, signature);
    	return result;
    }

    function choose$1(n, r) {
    	const signature = "choose(n, r)";
    	integer(n, "n", signature);
    	integer(r, "r", signature);
    	const result = choose(n, r);
    	realOverflow(result, signature);
    	intOverflow(result, signature);
    	return result;
    }

    function permute$1(n, r) {
    	const signature = "permute(n, r)";
    	integer(n, "n", signature);
    	integer(r, "r", signature);
    	const result = permute(n, r);
    	realOverflow(result, signature);
    	intOverflow(result, signature);
    	return result;
    }

    function gcd$1(a, b) {
    	const signature = "gcd(a, b)";
    	integer(a, "a", signature);
    	integer(b, "b", signature);
    	return gcd(a, b);
    }

    function lcm$1(a, b) {
    	const signature = "lcm(a, b)";
    	integer(a, "a", signature);
    	integer(b, "b", signature);
    	return lcm(a, b);
    }

    function mpow$1(base, exp, m) {
    	const signature = "mpow(base, exp, m)";
    	integer(base, "base", signature);
    	integer(exp, "exp", signature);
    	nonNegative(exp, "exp", signature);
    	integer(m, "m", signature);
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

    function normalize(vec, target) { //'target' intentionally defaults to undefined
    	return scale(vec, 1 / mag(vec), target);
    }

    function normalize2(vec, target) {
    	return scale2(vec, 1 / mag2(vec), target);
    }

    function normalize3(vec, target) {
    	return scale3(vec, 1 / mag3(vec), target);
    }

    function normalize4(vec, target) {
    	return scale4(vec, 1 / mag4(vec), target);
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

    function polar2(vec, target = new Float64Array(2)) {
    	target[0] = mag2(vec);
    	target[1] = atan2(vec[1], vec[0]) + PI;
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
    Object.freeze(smult);
    Object.freeze(smult2);
    Object.freeze(smult3);
    Object.freeze(smult4);
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
    Object.freeze(polar2);

    //Dot product
    function dot$1(vec1, vec2) {
    	const signature = "dot(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert size match
    	return dot(vec1, vec2);
    }

    function dot2$1(vec1, vec2) {
    	const signature = "dot2(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	return dot2(vec1, vec2);
    }

    function dot3$1(vec1, vec2) {
    	const signature = "dot3(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	return dot3(vec1, vec2);
    }

    function dot4$1(vec1, vec2) {
    	const signature = "dot4(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	return dot4(vec1, vec2);
    }

    //Cross product
    function cross3$1(vec1, vec2, target) {
    	const signature = "cross3(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return cross3(vec1, vec2, target);
    }

    //Addition
    function add$1(vec1, vec2, target) {
    	const signature = "add(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array size match
    	//assert target
    	return add(vec1, vec2, target);
    }

    function add2$1(vec1, vec2, target) {
    	const signature = "add2(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return add2(vec1, vec2, target);
    }

    function add3$1(vec1, vec2, target) {
    	const signature = "add3(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return add3(vec1, vec2, target);
    }

    function add4$1(vec1, vec2, target) {
    	const signature = "add4(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return add4(vec1, vec2, target);
    }

    //Subtraction
    function sub$1(vec1, vec2, target) {
    	const signature = "sub(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return sub(vec1, vec2, target);
    }

    function sub2$1(vec1, vec2, target) {
    	const signature = "sub2(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return sub2(vec1, vec2, target);
    }

    function sub3$1(vec1, vec2, target) {
    	const signature = "sub3(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return sub3(vec1, vec2, target);
    }

    function sub4$1(vec1, vec2, target) {
    	const signature = "sub4(vec1, vec2, ?target)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	//assert target
    	return sub4(vec1, vec2, target);
    }

    //Magnitude
    function mag$1(vec) {
    	const signature = "mag(vec)";
    	realArray(vec, "vec", signature);
    	return mag(vec);
    }

    function mag2$1(vec) {
    	const signature = "mag2(vec)";
    	realArray(vec, "vec", signature);
    	//warn array size
    	return mag2(vec);
    }

    function mag3$1(vec) {
    	const signature = "mag3(vec)";
    	realArray(vec, "vec", signature);
    	//warn array size
    	return mag3(vec);
    }

    function mag4$1(vec) {
    	const signature = "mag4(vec)";
    	realArray(vec, "vec", signature);
    	//warn array size
    	return mag4(vec);
    }

    //Scaling
    function smult$1(vec, k, target) {
    	const signature = "smult(vec, k, ?target)";
    	realArray(vec, "vec", signature);
    	realNumber(k, "k", signature);
    	//assert target
    	return smult(vec, k, target);
    }

    function smult2$1(vec, k, target) {
    	const signature = "smult2(vec, k, ?target)";
    	realArray(vec, "vec", signature);
    	realNumber(k, "k", signature);
    	//assert target
    	// warn vec size
    	return smult2(vec, k, target);
    }

    function smult3$1(vec, k, target) {
    	const signature = "smult3(vec, k, ?target)";
    	realArray(vec, "vec", signature);
    	realNumber(k, "k", signature);
    	//assert target
    	// warn vec size
    	return smult3(vec, k, target);
    }

    function smult4$1(vec, k, target) {
    	const signature = "smult4(vec, k, ?target)";
    	realArray(vec, "vec", signature);
    	realNumber(k, "k", signature);
    	//assert target
    	// warn vec size
    	return smult4(vec, k, target);
    }

    function normalize$1(vec, target) { //'target' intentionally defaults to undefined
    	const signature = "normalize(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	return normalize(vec, target);
    }

    function normalize2$1(vec, target) {
    	const signature = "normalize2(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	//warn array size
    	return normalize2(vec, target);
    }

    function normalize3$1(vec, target) {
    	const signature = "normalize3(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	//warn array size
    	return normalize3(vec, target);
    }

    function normalize4$1(vec, target) {
    	const signature = "normalize4(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	//warn array size
    	return normalize4(vec, target);
    }

    //Angles & rotations
    function angle$1(vec1, vec2) {
    	const signature = "angle(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array size match
    	return angle(vec1, vec2);
    }

    function angle2$1(vec1, vec2) {
    	const signature = "angle2(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	return angle2(vec1, vec2);
    }

    function angle3$1(vec1, vec2) {
    	const signature = "angle3(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	return angle3(vec1, vec2);
    }

    function angle4$1(vec1, vec2) {
    	const signature = "angle4(vec1, vec2)";
    	realArray(vec1, "vec1", signature);
    	realArray(vec2, "vec2", signature);
    	// warn/assert array sizes
    	return angle4(vec1, vec2);
    }

    //Other component-wise operations
    function fract$3(vec, target) {
    	const signature = "fract(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	return fract$2(vec, target);
    }

    function fract2$1(vec, target) {
    	const signature = "fract2(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	//warn array size
    	return fract2(vec, target);
    }

    function fract3$1(vec, target) {
    	const signature = "fract3(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	//warn array size
    	return fract3(vec, target);
    }

    function fract4$1(vec, target) {
    	const signature = "fract4(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	//warn array size
    	return fract4(vec, target);
    }

    function polar2$1(vec, target) {
    	const signature = "polar2(vec, ?target)";
    	realArray(vec, "vec", signature);
    	//assert target
    	//warn array size
    	return polar2(vec, target);
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
    Object.freeze(smult$1);
    Object.freeze(smult2$1);
    Object.freeze(smult3$1);
    Object.freeze(smult4$1);
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
    Object.freeze(polar2$1);

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
        smult: smult$1,
        smult2: smult2$1,
        smult3: smult3$1,
        smult4: smult4$1,
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
        polar2: polar2$1
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
        smult: smult,
        smult2: smult2,
        smult3: smult3,
        smult4: smult4,
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
        polar2: polar2
    });

    function dot2$2(vec1, vec2) {
    	return vec1[0] * vec2[0] * cos(vec1[1] - vec2[1]);
    }

    function mag$2(vec) {
    	return abs(vec[0]);
    }

    function smult2$2(vec, k, target = new Float64Array(2)) {
    	target[0] = vec[0] * k;
    	target[1] = mod(vec[1], TWO_PI);
    }

    function normalize2$2(vec, target = new Float64Array(2)) {
    	target[0] = 1;
    	target[1] = mod(vec[1], TWO_PI);
    }

    function rect2(vec, target = new Float64Array(2)) {
    	const r = vec[0];
    	const theta = vec[1];
    	target[0] = r * cos(theta);
    	target[1] = r * sin(theta);
    	return target;
    }

    // Freeze exports
    Object.freeze(dot2$2);
    Object.freeze(mag$2);
    Object.freeze(smult2$2);
    Object.freeze(normalize2$2);
    Object.freeze(rect2);

    var polar_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dot2: dot2$2,
        mag: mag$2,
        smult2: smult2$2,
        normalize2: normalize2$2,
        rect2: rect2
    });

    var vector_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        rect: rect_lib,
        polar: polar_lib
    });

    function zeros(m, n) {
    	const result = new Float64Array(m * n);
    	result.rows = m;
    	result.cols = n;
    	return result;
    }

    function constant(m, n, value) {
    	const result = new Float64Array(m * n);
    	result.fill(value);
    	result.rows = m;
    	result.cols = n;
    	return result;
    }

    function identity(m) {
    	const len = m * m;
    	const inc = m + 1;
    	const result = new Float64Array(len);
    	for (let i = 0; i < len; i += inc) {
    		result[i] = 1;
    	}
    	result.rows = m;
    	result.cols = m;
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
    	target.rows = rows;
    	target.cols = cols;
    	return target;
    }

    //Scaling
    function smult$2(mat, k, target = new Float64Array(mat.length)) {
    	const len = mat.length;
    	for (let i = 0; i < len; i++) {
    		target[i] = mat[i] * k;
    	}
    	target.rows = mat.rows;
    	target.cols = mat.cols;
    	return target;
    }

    //Transpose
    function transpose2(mat, target = new Float64Array(4)) {
    	//Main diagonal
    	target[0] = mat[0];
    	target[3] = mat[3];
    	//Other entries
    	const cached = mat[1];
    	target[1] = mat[2];
    	target[2] = cached;
    	target.rows = 2;
    	target.cols = 2;
    	return target;
    }

    function transpose3(mat, target = new Float64Array(9)) {
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
    	target.rows = 3;
    	target.cols = 3;
    	return target;
    }

    function transpose4(mat, target = new Float64Array(16)) {
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
    	target.rows = 4;
    	target.cols = 4;
    	return target;
    }

    //Matrix multiplication
    function mmult(mat1, mat2) { //consider adding target parameter
    	const r1 = mat1.rows;
    	const c1 = mat1.cols;
    	const r2 = mat2.rows;
    	const c2 = mat2.cols;
    	const target = new Float64Array(r1 * c2);
    	target.rows = r1;
    	target.cols = c2;
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
    	return [mat.rows, mat.cols];
    }

    //Determinant
    function det2(mat) {
    	return mat[0] * mat[3] - mat[1] * mat[2];
    }

    //Inverse
    function inverse2(mat, target = new Float64Array(4)) {
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
    	target.rows = 2;
    	target.cols = 2;
    	return target;
    }

    // Freeze exports
    Object.freeze(zeros);
    Object.freeze(constant);
    Object.freeze(identity);
    Object.freeze(flatten);
    Object.freeze(smult$2);
    Object.freeze(transpose2);
    Object.freeze(transpose3);
    Object.freeze(transpose4);
    Object.freeze(mmult);
    Object.freeze(size);
    Object.freeze(det2);
    Object.freeze(inverse2);

    function zeros$1(m, n) {
        const signature = "zeros(m, n)";
        positiveInteger(m, "m", signature);
        positiveInteger(n, "n", signature);
        return zeros(m, n);
    }

    function constant$1(m, n, value) {
    	const signature = "constant(m, n, value)";
        positiveInteger(m, "m", signature);
        positiveInteger(n, "n", signature);
        realNumber(value, "value", signature);
        return constant(m, n, value);
    }

    function identity$1(m) {
    	const signature = "identity(m)";
        positiveInteger(m, "m", signature);
        return identity(m);
    }

    function flatten$1(mat2d, target) { //Flattens 2D array into 1D array
        //assert that mat2d is valid 2d unflattened matrix
        //assert target
        return flatten(mat2d, target);
    }

    //Scaling
    function smult$3(mat, k, target) {
    	const signature = "smult(mat, k, target)";
        flatMatrix(mat, "mat", signature);
        realNumber(k, "k", signature);
        //assert target
        return smult$2(mat, k, target);
    }

    //Transpose
    function transpose2$1(mat, target) {
        const signature = "transpose2(mat, target)";
    	flatMatrix(mat, "mat", signature);
    	//assert correct matrix size
        //assert target
        return transpose2(mat, target);
    }

    function transpose3$1(mat, target) {
    	const signature = "transpose3(mat, target)";
    	flatMatrix(mat, "mat", signature);
        //assert correct matrix size
        //assert target
        return transpose3(mat, target);
    }

    function transpose4$1(mat, target) {
    	const signature = "transpose4(mat, target)";
    	flatMatrix(mat, "mat", signature);
        //assert correct matrix size
        //assert target
        return transpose4(mat, target);
    }

    //Matrix multiplication
    function mmult$1(mat1, mat2) { //consider adding target parameter
    	const signature = "mmult(mat1, mat2)";
    	flatMatrix(mat1, "mat1", signature);
    	flatMatrix(mat2, "mat2", signature);
    	//assert.mmultConformable(mat1, mat2, "mat1", "mat2", signature);
        //assert correct matrix size
        //assert target
        return mmult(mat1, mat2);
    }

    //Size
    function size$1(mat) {
    	const signature = "size(mat)";
    	flatMatrix(mat, "mat", signature);
    	return size(mat);
    }

    //Determinant
    function det2$1(mat) {
    	const signature = "det2(mat)";
    	flatMatrix(mat, "mat", signature);
    	//assert correct size
    	return det2(mat);
    }

    //Inverse
    function inverse2$1(mat, target) {
    	const signature = "inverse2(mat, target)";
    	flatMatrix(mat, "mat", signature);
    	//assert correct size
    	//assert target
    	return inverse2(mat, target);
    }

    // Freeze exports
    Object.freeze(zeros$1);
    Object.freeze(constant$1);
    Object.freeze(identity$1);
    Object.freeze(flatten$1);
    Object.freeze(smult$3);
    Object.freeze(transpose2$1);
    Object.freeze(transpose3$1);
    Object.freeze(transpose4$1);
    Object.freeze(mmult$1);
    Object.freeze(size$1);
    Object.freeze(det2$1);
    Object.freeze(inverse2$1);

    var matrix_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        zeros: zeros$1,
        constant: constant$1,
        identity: identity$1,
        flatten: flatten$1,
        smult: smult$3,
        transpose2: transpose2$1,
        transpose3: transpose3$1,
        transpose4: transpose4$1,
        mmult: mmult$1,
        size: size$1,
        det2: det2$1,
        inverse2: inverse2$1
    });

    var matrix_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: matrix_debug,
        zeros: zeros,
        constant: constant,
        identity: identity,
        flatten: flatten,
        smult: smult$2,
        transpose2: transpose2,
        transpose3: transpose3,
        transpose4: transpose4,
        mmult: mmult,
        size: size,
        det2: det2,
        inverse2: inverse2
    });

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
    	return atan2(z[1], z[0]);
    }

    function abs$1(z) {
    	return hypot(z[0], z[1]);
    }

    function add$2(z1, z2, target = new Float64Array(2)) {
    	target[0] = z1[0] + z2[0];
    	target[1] = z1[1] + z2[1];
    	return target;
    }

    function sub$2(z1, z2, target = new Float64Array(2)) {
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
    Object.freeze(add$2);
    Object.freeze(sub$2);
    Object.freeze(cmult);
    Object.freeze(smult$4);
    Object.freeze(div);
    Object.freeze(inverse);
    Object.freeze(polar);

    function conj$1(z, target) {
        const signature = "conj(z, ?target)";
    	rectComplex(z, "z", signature);
        //assert.target...
        return conj(z, target);
    }

    function real$1(z) {
    	const signature = "real(z)";
    	rectComplex(z, "z", signature);
        return real(z);
    }

    function imag$1(z) {
    	const signature = "imag(z)";
    	rectComplex(z, "z", signature);
        return imag(z);
    }

    function arg$1(z) {
    	const signature = "arg(z)";
    	rectComplex(z, "z", signature);
        return arg(z);
    }

    function abs$2(z) {
    	const signature = "abs(z)";
    	rectComplex(z, "z", signature);
        return abs$1(z);
    }

    function add$3(z1, z2, target) {
    	const signature = "add(z1, z2, ?target)";
    	rectComplex(z1, "z1", signature);
        rectComplex(z2, "z2", signature);
        //assert target...
        return add$2(z1, z2, target);
    }

    function sub$3(z1, z2, target) {
    	const signature = "sub(z1, z2, ?target)";
    	rectComplex(z1, "z1", signature);
        rectComplex(z2, "z2", signature);
        //assert target...
        return sub$2(z1, z2, target);
    }

    function cmult$1(z1, z2, target) {
    	const signature = "cmult(z1, z2, ?target)";
    	rectComplex(z1, "z1", signature);
        rectComplex(z2, "z2", signature);
        //assert target...
        return cmult(z1, z2, target);
    }

    function smult$5(z, k, target) {
    	const signature = "smult(z, k, ?target)";
    	rectComplex(z, "z", signature);
        realNumber(k, "k", signature);
        return smult$4(z, k, target);
    }

    function div$1(z1, z2, target) {
    	const signature = "div(z1, z2, ?target)";
    	rectComplex(z1, "z1", signature);
        rectComplex(z2, "z2", signature);
        //assert target...
        return div(z1, z2, target);
        //warn.unDefined...
    }

    function inverse$1(z, target) {
    	const signature = "inverse(z, ?target)";
    	rectComplex(z, "z", signature);
        //assert.target...
        return inverse(z, target);
        //warn.unDefined...
    }

    function polar$1(z, target) {
    	const signature = "inverse(z, ?target)";
    	rectComplex(z, "z", signature);
        //assert.target...
        return inverse(z, target);
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

    var rect_debug$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        conj: conj$1,
        real: real$1,
        imag: imag$1,
        arg: arg$1,
        abs: abs$2,
        add: add$3,
        sub: sub$3,
        cmult: cmult$1,
        smult: smult$5,
        div: div$1,
        inverse: inverse$1,
        polar: polar$1
    });

    var rect_lib$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: rect_debug$1,
        conj: conj,
        real: real,
        imag: imag,
        arg: arg,
        abs: abs$1,
        add: add$2,
        sub: sub$2,
        cmult: cmult,
        smult: smult$4,
        div: div,
        inverse: inverse,
        polar: polar
    });

    function toArg(angle) { //Not to be exported
    	angle = angle%TWO_PI;
    	if (angle > PI) {return angle - TWO_PI;}
    	if (angle < -PI) {return angle + TWO_PI;}
    	return angle;
    }

    function conj$2(z, target = new Float64Array(2)) {
    	const r = z[0];
    	const theta = z[1];
    	if (r < 0) {
    		target[0] = -r;
    		target[1] = -toArg(theta + PI);
    	} else {
    		target[0] = r;
    		target[1] = -toArg(theta);
    	}
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

    function smult$6(z, k, target = new Float64Array(2)) {
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

    function cmult$2(z1, z2, target = new Float64Array(2)) {
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

    function rect(z, target = new Float64Array(2)) {
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
    Object.freeze(smult$6);
    Object.freeze(cmult$2);
    Object.freeze(div$2);
    Object.freeze(pow$1);
    Object.freeze(inverse$2);
    Object.freeze(rect);

    function conj$3(z, target) {
        const signature = "conj(z, ?target)";
        //assert.complexTarget
        polarComplex(z, "z", signature);
        return conj$2(z, target);
    }

    function real$3(z) {
        const signature = "real(z)";
        polarComplex(z, "z", signature);
    	return real$2(z);
    }

    function imag$3(z) {
        const signature = "imag(z)";
        polarComplex(z, "z", signature);
    	return imag$2(z);
    }

    function arg$3(z) {
        const signature = "arg(z)";
        polarComplex(z, "z", signature);
    	return arg$2(z);
    }

    function abs$4(z) {
        const signature = "abs(z)";
        polarComplex(z, "z", signature);
    	return abs$3(z);
    }

    function smult$7(z, k, target) {
        const signature = "smult(z, k, ?target)";
    	polarComplex(z, "z", signature);
        realNumber(k, "k", signature);
        //assert.target...
        return smult$6(z, k, target);
    }

    function cmult$3(z1, z2, target) {
    	const signature = "cmult(z1, z2, ?target)";
    	polarComplex(z1, "z1", signature);
        polarComplex(z2, "z2", signature);
        //assert.target...
        return cmult$2(z1, z2, target);
    }

    function div$3(z1, z2, target) {
    	const signature = "div(z1, z2, ?target)";
    	polarComplex(z1, "z1", signature);
        polarComplex(z2, "z2", signature);
        //assert.target...
        return div$2(z1, z2, target);
        //warn.notDefined
    }

    function pow$2(z, n, target) {
    	const signature = "pow(z, n, ?target)";
        polarComplex(z, "z", signature);
        realNumber(n, "n", signature);
        //assert.target...
        return pow$1(z, n, target);
    }

    function inverse$3(z, target) {
    	const signature = "inverse(z, ?target)";
        polarComplex(z, "z", signature);
        //assert.target...
        return inverse$2(z, target);
    }

    function rect$1(z, target) {
    	const signature = "rect(z, ?target)";
        polarComplex(z, "z", signature);
        //assert.target...
        return rect(z, target);
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

    var polar_debug = /*#__PURE__*/Object.freeze({
        __proto__: null,
        conj: conj$3,
        real: real$3,
        imag: imag$3,
        arg: arg$3,
        abs: abs$4,
        smult: smult$7,
        cmult: cmult$3,
        div: div$3,
        pow: pow$2,
        inverse: inverse$3,
        rect: rect$1
    });

    var polar_lib$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        debug: polar_debug,
        conj: conj$2,
        real: real$2,
        imag: imag$2,
        arg: arg$2,
        abs: abs$3,
        smult: smult$6,
        cmult: cmult$2,
        div: div$2,
        pow: pow$1,
        inverse: inverse$2,
        rect: rect
    });

    var complex_lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        rect: rect_lib$1,
        polar: polar_lib$1
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

    function prod(arr) {
    	const len = arr.length;
    	let result = arr[0]; //Defaults to undefined if array is empty
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
    			resultBlock[uniqueCount++] = current;
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
    		return new Float64Array(uniqueElements.values());
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
    			if (array[lowerBound] === value) {return lowerBound;}
    			lowerBound++;
    		}
    	}
    	return -1; //Not contained
    }

    // Freeze exports
    Object.freeze(sum);
    Object.freeze(min$1);
    Object.freeze(max$1);
    Object.freeze(prod);
    Object.freeze(unique);
    Object.freeze(indexOf);

    function sum$1(arr) {
    	const signature = "sum(arr)";
    	realArray(arr, "arr", signature);
    	const result = sum(arr);
    	realOverflow(result, signature);
    	return result;
    }

    function min$2(arr, sorted) {
    	const signature = "min(arr, ?sorted)";
    	realArray(arr, "arr", signature);
    	bool(sorted, "sorted", signature);
    	//assert.sortedMatch(arr, sorted);
    	return min$1(arr, sorted);
    }

    function max$2(arr, sorted) {
    	const signature = "max(arr, ?sorted)";
    	realArray(arr, "arr", signature);
    	bool(sorted, "sorted", signature);
    	return max$1(arr, sorted);
    }

    function prod$1(arr) {
    	const signature = "prod(arr)";
    	realArray(arr, "arr", signature);
    	return prod(arr);
    }

    function unique$1(arr, sorted) {
    	const signature = "unique(arr, ?sorted)";
    	realArray(arr, "arr", signature);
    	bool(sorted, "sorted", signature);
    	return unique(arr, sorted);
    }

    function indexOf$1(arr, value, sorted) {
    	const signature = "indexOf(arr, value, ?sorted)";
    	bool(sorted, "sorted", signature);
    	realArray(arr, "arr", signature);
    	ifSorted(arr, sorted, "arr", signature);
    	return indexOf(arr, value, sorted);
    }

    // Freeze exports
    Object.freeze(sum$1);
    Object.freeze(min$2);
    Object.freeze(max$2);
    Object.freeze(prod$1);
    Object.freeze(unique$1);
    Object.freeze(indexOf$1);

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
        min: min$1,
        max: max$1,
        prod: prod,
        unique: unique,
        indexOf: indexOf
    });

    //export * as random from "./random/random.lib.js";

    const VERSION = "beta-3.0.0";

    exports.VERSION = VERSION;
    exports.array = array_lib;
    exports.complex = complex_lib;
    exports.integer = integer_lib;
    exports.matrix = matrix_lib;
    exports.standard = standard_lib;
    exports.vector = vector_lib;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
