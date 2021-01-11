var Mathicall = (function (exports) {
	'use strict';

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

	//Constants
	const E = Math.E;
	const LN2 = Math.LN2;
	const SQRT2 = Math.SQRT2;
	const PI = Math.PI;

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

	function d_lerp(x, y, r) {
		checkNumericInput({x:x, y:y, r:r}, 'lerp(x, y, r)', 'std.debug');
		return lerp(x, y, r);
	}

	function d_mod(x, m) {
		checkNumericInput({x:x, m:m}, 'mod(x, m)', 'std.debug');
		return mod(x, m);
	}

	function d_fract(x) {
		checkNumericInput({x:x}, 'fract(x)', 'std.debug');
		return fract(x);
	}

	function d_deg(radians) {
		checkNumericInput({radians: radians}, 'deg(radians)', 'std.debug');
		return deg(radians);
	}

	function d_rad(degrees) {
		checkNumericInput({degrees: degrees}, 'rad(degrees)', 'std.debug');
		return rad(degrees);
	}

	var stdDebug = /*#__PURE__*/Object.freeze({
		__proto__: null,
		lerp: d_lerp,
		mod: d_mod,
		fract: d_fract,
		deg: d_deg,
		rad: d_rad
	});

	var standardLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		debug: stdDebug,
		E: E,
		LN2: LN2,
		SQRT2: SQRT2,
		PI: PI,
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
		rad: rad
	});

	function precomputeFactorials() { //Private to module
		const result = new Float64Array(171);
		result[0] = 1;
		for (let i = 1; i < 171; i++) {
			result[i] = i * result[i-1];
		}
		return result;
	}

	function precomputeBinomials(b) {
		let n = 30;
		if ((b.constructor === Number)&&(isFinite(b))) { //Only accept numeric input
			n = abs(round(b));
		} else {
			throw "precomputeBinomials takes numeric input";
		}
		const len = 0.5 * (++n) * (n + 1);
		const result = new Float64Array(len);
		let i = -1;
		for (let k = 0; k < n; k++) {
			result[i++] = 1;
			for (let r = 1; r < k; r++) {
				result[i] = result[i - k - 1] + result[i - k];
				i++;
			}
			result[i++] = 1;
		}
		return result;
	}

	const FACTORIALS = precomputeFactorials(); //Max factorial is 170!
	let BINOM_MAX_STORED_N = 30;
	let BINOMIALS = precomputeBinomials(BINOM_MAX_STORED_N);

	//Combinatorial functions
	function factorial(n) {
		if (n < 0) {return undefined;}
		if (n > 170) {return Number.MAX_VALUE;}
		return FACTORIALS[n];
	}

	function choose(n, r) {
		if ((r > n)||(n < 0)||(r < 0)) {return 0;} //Return 0
		if (n <= BINOM_MAX_STORED_N) {return BINOMIALS[0.5 * n * (n + 1) + r];} //Return pre-computed
		//Not pre-computed
		const k = min(r, n - r);
		if (k > 514) {return Number.MAX_VALUE;} //Overflow check
		const nMinusK = n - k;
		let result = 1;
		let i = 1;
		while (i <= k) {
			result *= (nMinusK + i)/(i++);
		}
		return result;
	}

	function permute(n, r) {
		if ((r > n) || (n < 0) || (r < 0)) {return 0;}
		if (r > 170) {return Number.MAX_VALUE;}
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
		base = abs(base);
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

	function d_factorial(n) {
		checkIntInput({n: n}, "factorial(n)", "int.debug");
		const result = factorial(n);
		checkOutputOverflow(result, "factorial(n)", "int.debug");
		return result;
	}

	function d_choose(n, r) {
		checkIntInput({n: n, r: r}, "choose(n, r)", "int.debug");
		const result = choose(n, r);
		checkOutputOverflow(result, "choose(n, r)", "int.debug");
		return result;
	}

	function d_permute(n, r) {
		checkIntInput({n: n, r: r}, "permute(n, r)", "int.debug");
		const result = permute(n, r);
		checkOutputOverflow(result, "permute(n, r)", "int.debug");
		return result;
	}

	function d_gcd(a, b) {
		checkIntInput({a: a, b: b}, "gcd(a, b)", "int.debug");
		return gcd(a, b);
	}

	function d_lcm(a, b) {
		checkIntInput({a: a, b: b}, "lcm(a, b)", "int.debug");
		return lcm(a, b);
	}

	function d_mpow(base, exp, m) { //Unsure whether to reject negative input
		checkIntInput({base: base, exp: exp, m: m}, "mpow(base, exp, m)", "int.debug");
		return mpow(base, exp, m);
	}

	var intDebug = /*#__PURE__*/Object.freeze({
		__proto__: null,
		factorial: d_factorial,
		choose: d_choose,
		permute: d_permute,
		gcd: d_gcd,
		lcm: d_lcm,
		mpow: d_mpow
	});

	var integerLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		debug: intDebug,
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
	function fract$1(vec, target = new Float64Array(vec.length)) {
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

	var vecRectLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
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
		fract: fract$1,
		fract2: fract2,
		fract3: fract3,
		fract4: fract4,
		polar2: polar2
	});

	function dot2$1(vec1, vec2) {
		return vec1[0] * vec2[0] * cos(vec1[1] - vec2[1]);
	}

	function mag$1(vec) {
		return abs(vec[0]);
	}

	function smult2$1(vec, k, target = new Float64Array(2)) {
		target[0] = vec[0] * k;
		target[1] = mod(vec[1], TWO_PI);
	}

	function normalize2$1(vec, target = new Float64Array(2)) {
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

	var vecPolarLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		dot2: dot2$1,
		mag: mag$1,
		smult2: smult2$1,
		normalize2: normalize2$1,
		rect2: rect2
	});

	var vectorLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		rect: vecRectLib,
		polar: vecPolarLib
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
	function smult$1(mat, k, target = new Float64Array(mat.length)) {
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

	var matrixLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		zeros: zeros,
		constant: constant,
		identity: identity,
		flatten: flatten,
		smult: smult$1,
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

	function add$1(z1, z2, target = new Float64Array(2)) {
		target[0] = z1[0] + z2[0];
		target[1] = z1[1] + z2[1];
		return target;
	}

	function sub$1(z1, z2, target = new Float64Array(2)) {
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

	function smult$2(z, k, target = new Float64Array(2)) {
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

	var compRectLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		conj: conj,
		real: real,
		imag: imag,
		arg: arg,
		abs: abs$1,
		add: add$1,
		sub: sub$1,
		cmult: cmult,
		smult: smult$2,
		div: div,
		inverse: inverse,
		polar: polar
	});

	function toArg(angle) {
		angle = angle%TWO_PI;
		if (angle > PI) {return angle - TWO_PI;}
		if (angle < -PI) {return angle + TWO_PI;}
		return angle;
	}

	function conj$1(z, target = new Float64Array(2)) {
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

	function real$1(z) {
		return z[0] * cos(z[1]);
	}

	function imag$1(z) {
		return z[0] * sin(z[1]);
	}

	function arg$1(z) {
		return toArg(z[1]);
	}

	function abs$2(z) {
		return abs(z[0]);
	}

	function smult$3(z, k, target = new Float64Array(2)) {
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

	function cmult$1(z1, z2, target = new Float64Array(2)) {
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

	function div$1(z1, z2, target = new Float64Array(2)) {
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

	function inverse$1(z, target = new Float64Array(2)) {
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

	var compPolarLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		conj: conj$1,
		real: real$1,
		imag: imag$1,
		arg: arg$1,
		abs: abs$2,
		smult: smult$3,
		cmult: cmult$1,
		div: div$1,
		pow: pow$1,
		inverse: inverse$1,
		rect: rect
	});

	var complexLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		rect: compRectLib,
		polar: compPolarLib
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

	var arrayLib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		sum: sum,
		min: min$1,
		max: max$1,
		prod: prod,
		unique: unique,
		indexOf: indexOf
	});

	const VERSION = "beta-3.0.0";

	exports.VERSION = VERSION;
	exports.array = arrayLib;
	exports.complex = complexLib;
	exports.integer = integerLib;
	exports.matrix = matrixLib;
	exports.standard = standardLib;
	exports.vector = vectorLib;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

}({}));
