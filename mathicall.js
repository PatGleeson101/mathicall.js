/* mathicall.js: The entire MathicallJS library */

var MATHICALL = (function(){
	var std = (function(){
		"use strict";

		//Cache function dependencies
		const trunc = Math.trunc;
		const floor = Math.floor;

		//Functions
		function min(a, b) {
			return (a < b) ? a : b;
		}

		function max(a, b) {
			return (a > b) ? a : b;
		}

		function lerp(x, y, r) {
			return x + (y - x) * r;
		}

		function mod(x, m) {
			return x - m * floor(x / m);
		}

		function fract(x) {
			return x - trunc(x);
		}

		return {
			min: min,
			max: max,
			lerp: lerp,
			mod: mod,
			fract: fract,
		};
	}());

	var int = (function(){
		"use strict";

		//Cache function dependencies
		const round = Math.round;
		const abs = Math.abs;
		const min = std.min;

		//Constants
		function computeFactorials() { //Private to module
			const result = new Float64Array(171);
			result[0] = 1;
			for (let i = 1; i < 171; i++) {
				result[i] = i * result[i-1];
			}
			return result;
		}

		function computeBinomials(n) { //Private to module
			const result = Array(++n);
			let row = new Float64Array([1]);
			let prev = row;
			result[0] = row;
			for (let i = 1; i < n; i++) {
				row = new Float64Array(i+1);
				row[0] = 1;
				for (let j = 1; j < i; j++) {
					row[j] = prev[j-1] + prev[j];
				}
				row[i] = 1;
				prev = row;
				result[i] = row;
			}
			return result;
		}

		const FACTORIALS = computeFactorials();
		const PASCAL_MAX_ROW = 10;
		const BINOMIALS = computeBinomials(PASCAL_MAX_ROW);

	    //Combinatorial functions
	    function factorial(n) {
			if (n > 170) {return Number.MAX_VALUE;}
			if (n < 0) {return undefined;}
			return FACTORIALS[n];
		}

		function choose(n, r) {
			if ((r > n)||(n < 0)||(r < 0)) {return 0;} //Return 0
			if (n <= PASCAL_MAX_ROW) {return BINOMIALS[n][r];} //Return pre-computed
			//Not pre-computed
			const k = min(r, n - r);
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
			r = n - r;
			if (n < 171) {
				return round(FACTORIALS[n]/FACTORIALS[r]);
			}
			let result = 1;
			if (r < 168) { //MUST OPTIMISE THIS CONSTANT (cannot be larger than 170)
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
			} else { //Numbers too large to use bitwise operators
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

		//Szudzik integer pairing functions
		function pair(x, y) { //signed to signed
			x = (x < 0) ? (-2 * x - 1) : (x * 2);
			y = (y < 0) ? (-2 * y - 1) : (y * 2);
			return (y < x) ? (x * x + x + y) : (y * y + x);
		}

		function upair(x, y) { //unsigned to unsigned
			x = abs(x);
			y = abs(y);
			return (y < x) ? (x * x + x + y) : (y * y + x);
		}

		//Modular exponentiation
		function mpow(base, exp, m) {
			base = abs(round(base));
			exp = abs(round(exp));
			m = round(m);
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
		
		return {
			factorial: factorial,
			choose: choose,
			permute: permute,
			gcd: gcd,
			lcm: lcm,
			pair: pair,
			upair: upair,
			mpow: mpow,
		};
	}());

	var vec = (function() {
		"use strict";

		//Cache function dependencies
		const sqrt = Math.sqrt;
		const acos = Math.acos;
		const hypot = Math.hypot;
		const fract = std.fract;

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

		//Cross product
		function cross3(vec1, vec2) {
			const result = new Float64Array(3);
			result[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
			result[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
			result[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
			return result;
		}

		//Addition
		function sum(...vecs) {
			const count = vecs.length;
			const dimension = vecs[0].length;
			const result = new Float64Array(dimension);
			for (let i = 0; i < count; i++) {
				const vec = vecs[i];
				for (let j = 0; j < dimension; j++) {
					result[j] += vec[j];
				}
			}
			return result;
		}

		function sum2(...vecs) {
			const result = new Float64Array(2);
			const count = vecs.length;
			for (let i = 0; i < count; i++) {
				const vec = vecs[i];
				result[0] += vec[0];
				result[1] += vec[1];
			}
			return result;
		}

		function sum3(...vecs) {
			const result = new Float64Array(3);
			const count = vecs.length;
			for (let i = 0; i < count; i++) {
				const vec = vecs[i];
				result[0] += vec[0];
				result[1] += vec[1];
				result[2] += vec[2];
			}
			return result;
		}

		function add(vec1, vec2) {
			const dimension = vec1.length;
			const result = new Float64Array(dimension);
			for (let i = 0; i < dimension; i++) {
				result[i] = vec1[i] + vec2[i];
			}
		}

		function add2(vec1, vec2) {
			const result = new Float64Array(2);
			result[0] = vec1[0] + vec2[0];
			result[1] = vec1[1] + vec2[1];
			return result;
		}

		function add3(vec1, vec2) {
			const result = new Float64Array(3);
			result[0] = vec1[0] + vec2[0];
			result[1] = vec1[1] + vec2[1];
			result[2] = vec1[2] + vec2[2];
			return result;
		}

		//Subtraction
		function sub(vec1, vec2) {
			const dimension = vec1.length
			const result = new Float64Array(dimension);
			for (let i = 0; i < dimension; i++) {
				result[i] = vec1[i] - vec2[i];
			}
			return result;
		}

		function sub2(vec1, vec2) {
			const result = new Float64Array(2);
			result[0] = vec1[0] - vec2[0];
			result[1] = vec1[1] - vec2[1];
			return result;
		}

		function sub3(vec1, vec2) {
			const result = new Float64Array(3);
			result[0] = vec1[0] - vec2[0];
			result[1] = vec1[1] - vec2[1];
			result[2] = vec1[2] - vec2[2];
			return result;
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

		//Scaling
		function scale(vec, k) {
			const dimension = vec.length;
			const result = new Float64Array(dimension);
			for (let i = 0; i < dimension; i++) {
				result[i] = vec[i] * k;
			}
			return result;
		}

		function scale2(vec, k) {
			const result = new Float64Array(2);
			result[0] = vec[0] * k;
			result[1] = vec[1] * k;
			return result;
		}

		function scale3(vec, k) {
			const result = new Float64Array(3);
			result[0] = vec[0] * k;
			result[1] = vec[1] * k;
			result[2] = vec[2] * k;
			return result;
		}

		function scaleTo(vec, m) {
			return scale(vec, m / mag(vec));
		}

		function scaleTo2(vec, m) {
			return scale2(vec, m / mag2(vec));
		}

		function scaleTo3(vec, m) {
			return scale3(vec, m / mag3(vec));
		}

		function normalize(vec) {
			return scaleTo(vec, 1);
		}

		function normalize2(vec) {
			return scaleTo2(vec, 1);
		}

		function normalize3(vec) {
			return scaleTo3(vec, 1);
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

		//Other component-wise operations
		function vfract(vec) { //Name has 'v' to differentiate from fract
			const dimension = vec.length;
			const result = new Float64Array(dimension);
			for (let i = 0; i < dimension; i++) {
				result[i] = fract(vec[i]);
			}
			return result;
		}

		function fract2(vec) {
			const result = new Float64Array(2);
			result[0] = fract(vec[0]);
			result[1] = fract(vec[1]);
			return result;
		}

		function fract3(vec) {
			const result = new Float64Array(3);
			result[0] = fract(vec[0]);
			result[1] = fract(vec[1]);
			result[2] = fract(vec[2]);
			return result;
		}

		//Return all public functions
		return {
			dot: dot,
			dot2: dot2,
			dot3: dot3,
			cross3: cross3,
			sum: sum,
			sum2: sum2,
			sum3: sum3,
			add: add,
			add2: add2,
			add3: add3,
			sub: sub,
			sub2: sub2,
			sub3: sub3,
			mag: mag,
			mag2: mag2,
			mag3: mag3,
			scale: scale,
			scale2: scale2,
			scale3: scale3,
			scaleTo: scaleTo,
			scaleTo2: scaleTo2,
			scaleTo3: scaleTo3,
			fract: vfract,
			fract2: fract2,
			fract3: fract3,
			normalize: normalize,
			normalize2: normalize2,
			normalize3: normalize3,
			angle: angle,
			angle2: angle2,
			angle3: angle3,
		};
	}());

	var mat = (function(){
		"use strict";

		//Cache function dependencies
		const dot = vec.dot;

		//Common matrices
		function zeros(m, n) {
			const result = new Array(m);
			for (let i = 0; i < m; i++) {
				result[i] = new Float64Array(n);
			}
			return result;
		}

		function constant(m, n, value) {
			const result = new Array(m);
			for (let i = 0; i < m; i++) {
				const row = new Float64Array(n);
				row.fill(value);
				result[i] = row;
			}
			return result;
		}

		function identity(m) {
			const result = new Array(m);
			for (let i = 0; i < m; i++) {
				const row = new Float64Array(m);
				row[i] = 1;
				result[i] = row;
			}
			return result;
		}

		//Scaling
		function scale(mat, k) {
			const m = mat.length;
			const n = mat[0].length;
			const result = Array(m);
			for (let i = 0; i < m; i++) {
				const rowOld = mat[i];
				const rowNew = new Float64Array(n);
				for (let j = 0; j < n; j++) {
					rowNew[j] = rowOld[j] * k;
				}
				result[i] = rowNew;
			}
			return result;
		}

		//Transpose
		function transpose(mat) {
			const m = mat.length;
			const n = mat[0].length;
			const result = new Array(n);
			for (let i = 0; i < n; i++) {
				const row = new Float64Array(m);
				for (let j = 0; j < m; j++) {
					row[j] = mat[j][i];
				}
				result[i] = row;
			}
			return result;
		}
		
		//Matrix multiplication
		function mult(mat1, mat2) {
			const m1 = mat1.length;
			const n1 = mat1[0].length;
			const m2 = mat2.length;
			const n2 = mat2[0].length;
			const result = Array(m1);
			for (let i1 = 0; i1 < m1; i1++) {
				const mat1Row = mat1[i1];
				const newRow = new Float64Array(n2);
				for (let j2 = 0; j2 < n2; j2++) {
					let value = 0;
					for (let i2 = 0; i2 < n2; i2++) {
						value += mat1Row[i2] * mat2[i2][j2];
					}
					newRow[j2] = value;
				}
				result[i1] = newRow;
			}
			return result;
		}

		function vmult(vec, mat) { //Premultply by (assumed row-) vector
			const m = mat.length;
			const n = mat[0].length;
			const result = new Float64Array(n);
			for (let i = 0; i < m; i++) {
				const row = mat[i];
				const component = vec[i];
				for (let j = 0; j < n; j++) {
					result[j] += row[j] * component;
				}
			}
			return result; //Result is a vector, not a matrix
		}

		function multv(mat, vec) { //Postmultply by (assumed column-) vector
			const m = mat.length;
			const result = new Float64Array(m);
			for (let i = 0; i < m; i++) {
				result[i] = dot(mat[i], vec);
			}
			return result; //Result is a vector, not a matrix
		}

		//Sizing
		function size(matrix) {
			return new Float64Array([matrix.length, matrix[0].length]);
		}

		//Return public functions
		return {
			constant: constant,
			identity: identity,
			zeros: zeros,
			scale: scale,
			transpose: transpose,
			mult: mult,
			vmult: vmult,
			multv: multv,
			size: size,
				};
	}());

	var rand = (function(){
		"use strict";

		//Cache function dependencies
		const mod = std.mod;
		const floor = Math.floor;
		const abs = Math.abs;
		const fract = std.fract;
		const dot3 = vec.dot3;

		//Park-Miller constants
		const a = 48271;
		const m = 2147483647;
		const mp1 = 2147483648;

		//Multiplicative congruential generator using Park-Miller constants
		function MCG(seed) {
			seed = floor(seed) || 1;
		    return function() {
		    	seed = mod(seed * a, m);
		    	return seed / mp1;
		    }
		};

		//Indexed MCG
		function iMCG(seed) {
			//Constants (seed also remains constant)
			seed = abs(foor(seed)) || 1;
			const minSkip = 700; //Must be optimised

			//Internal state
			let state = seed;
			let i = 0;
			let skip = 0;

			//Function
			return function(index) {
				//Starting state
				index = mod(index, mp1);
				if (index < i) {
					i = 0;
					state = seed;
				}

				//Skip to desired index
				skip = index - i;
				if (skip < minSkip) { //Faster to iterate (small skip)
					for (let j = 0; j < skip; j++) {
						state = mod(state * a, m);
					}
				} else { //Faster to use fast modular exponentiation (large skip)
					let aiMod = 1;
					while (skip > 0) {
						if (skip%2 === 1) {
							aiMod = (aiMod*a) % m
						} //Otherwise, result remains constant
						skip = skip >> 1;
						aiMod = (aiMod**2) % m;
					}
					state = (aiMod * state) % m;
				}

				//Update index
				i = index;

				//Return state mapped to [0,1]
				return state / mp1;
			}
		}

		//Wrapper for window's inbuilt 'Crypto' functions
		const crypto = window.crypto || window.msCrypto;
		let cryptoUint32 = null;
		if (crypto != undefined) {
			cryptoUint32 = function(n = 1) {
				const result = new Uint32Array(n);
				crypto.getRandomValues(result);
				return result;
			}
		} else {
			console.warn('rand: crypto functions unavailable');
		}

		//Random hashing hashing
		function floatfloat(p) {
			p = fract(p * 0.1031);
			p *= p + 33.33;
			p *= p + p;
			return fract(p);
		}

		function vec2float(vec) {
			const pX = fract(vec[0] * 0.1031);
			const pY = fract(vec[1] * 0.1031);
			const offset = dot3([pX, pY, pX], [pY + 33.33, pX + 33.33, pX + 33.33]);
			return fract((pX + pY + 2 * offset) * (pX + offset));
		}

		return {
			MCG: MCG,
			iMCG: iMCG,
			cryptoUint32: cryptoUint32,
			floatfloat: floatfloat,
			vec2float: vec2float
				};
	}());

	var noise = (function(){
		"use strict";

		//Dependencies
		const dot2 = vec.dot2;
		const sub2 = vec.sub2;
		const add2 = vec.add2;
		const scale2 = vec.scale2;
		const lerp = std.lerp;
		const floor = Math.floor;
		const ceil = Math.ceil;
		const sqrt = Math.sqrt;
		const vec2float = rand.vec2float;
		const cos = Math.cos;
		const sin = Math.sin;
		const PI = Math.PI;
		const round = Math.round;

		//Constants
		const VAL = 0; //Code for 'value'
		const DER = 1; //Code for 'derivative'
		const ALL = 2; //Code for 'all'

		//Perlin noise
		function smootherstep(t) {
			return t * t * t * ((t * (6 * t - 15)) + 10);
		}

		function grad2(x, y) {
			const theta = 2 * PI * vec2float([x, y]);
			return [cos(theta), sin(theta)];
		}

		function Perlin2() {
			const range = 0.5 * sqrt(2);
			const p2lerp = function(c00, c01, c10, c11, locX, locY) {
				const wgtX = smootherstep(locX); //Weighted x
				const wgtY = smootherstep(locY); //Weighted y
				const c0 = lerp(c00, c01, wgtY);
				const c1 = lerp(c10, c11, wgtY);
				return 0.5 * (1 + lerp(c0, c1, wgtX)/range); //Return value
			}
			const value = function(x, y, mode = VAL) {
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
				if (mode === VAL) { //Value only
					return p2lerp(c00, c01, c10, c11, locX, locY)
				} else { //Calculate derivative
					const wgtX = smootherstep(locX); //Weighted x
					const wgtY = smootherstep(locY); //Weighted y
					const c0 = lerp(c00, c01, wgtY);
					const c1 = lerp(c10, c11, wgtY);
					const delWX = 30 * locX * locX * (locX * (locX - 2) + 1);
					const delWY = 30 * locY * locY * (locY * (locY - 2) + 1);
					const delC0 = add2(add2(g00, scale2(sub2(g10, g00), delWX)), [delWX * (c10 - c00), 0]);
					const delC1 = add2(add2(g01, scale2(sub2(g11, g01), delWX)), [delWX * (c11 - c01), 0]);
					let deriv = add2(add2(delC0, scale2(sub2(delC1, delC0), delWY)), [0, delWY * (c1 - c0)]);
					deriv = scale2(deriv, range);
					if (mode === DER) { //Return derivative
						return deriv;
					} else if (mode === ALL) { //Return both value and derivative
						const val = 0.5 * (1 + lerp(c0, c1, wgtX)/range);
						return {val: val, deriv: deriv};
					}
				}
			}

			const fbm = function(x, y, octaves = 5, lacunarity = 1.5, persistence = 0.7, scale = 1) {
				let output = 0;
				let amp = 1;
				let rng = 1;
				const offset = 0.3;
				while (octaves--) {
					output += amp * value(x, y, 'val');
					rng += amp;
					//Increment
					amp *= persistence;
					x = x * lacunarity + offset;
					y = y * lacunarity + offset;
				}
				output /= rng;
				return output;
			}

			const grid = function(xMin, yMin, xCount, yCount, xStep, yStep, amplitude = 1) {
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
						c10Seed = dot2([locX - 1, locY], g10);;
						c11Seed = dot2([locX - 1, locY - 1], g11);
						while (locY <= maxLocY) {
							//Initialise row
							index = indexSeed;
							locX = locXSeed;
							c00 = c00Seed;
							c01 = c01Seed;
							c10 = c10Seed;
							c11 = c11Seed;
							while (locX <= maxLocX) {
								output[index++] = p2lerp(c00, c01, c10, c11, locX, locY) * amplitude;
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
				return output;
			}

			return {
				dimension: 2,
				value: value,
				fbm: fbm,
				grid: grid,
			};
		}

		return {
			Perlin2: Perlin2,
				};
	}());

	var set = (function(){
		"use strict";

		//Cache function dependencies
		const random = Math.random;
		const floor = Math.floor;

		//Constants
		const UNS = 0; //Code for unsorted
		const ASC = 1; //Code for ascending order
		const DES = 2; //Code for descending order

		//Functions
		function contains(set, value, sorted = UNS) {
			const len = set.length;
			if ((sorted === UNS)||(len < 32/*CHOOSE THIS PROPERLY*/)) { //Unsorted or length small; search entire array
				for (let i = 0; i < len; i++) {
					if (set[i] === value) {return i;} //Found it
				}
			} else { //Sorted; use binary search
				let lowerBound = 0;
				let upperBound = len - 1;
				if (sorted === ASC) {
					while (upperBound - lowerBound > 16) {
						let i = floor(0.5 * (lowerBound + upperBound));
						const val = set[i];
						if (val > value) {
							upperBound = i - 1;
						} else if (val < value) {
							lowerBound = i + 1;
						} else { //Found it!
							return i;
						}
					}
				} else if (sorted === DES) {
					while (upperBound - lowerBound > 16) {
						let i = floor(0.5 * (lowerBound + upperBound));
						const val = set[i];
						if (val > value) {
							lowerBound = i + 1;
						} else if (val < value) {
							upperBound = i - 1;
						} else { //Found it!
							return i;
						}
					}
				}
				while (lowerBound <= upperBound) { //Linear search once region becomes small enough
					if (set[lowerBound] === value) {return lowerBound;}
					lowerBound++;
				}
			}
			return -1; //Not contained
		}

		function count(set, value, sorted = UNS) {
			const len = set.length;
			let result = 0;
			for (let i = 0; i < len; i++) {
					if (set[i] === value) {result += 1;}
			}
			return result;
			/*
			if ((sorted === UNS)||(len < 64/*CHOOSE THIS PROPERLY//)) { //Unsorted or length small; search entire array
			} else {//Sorted; use binary search
				//WIP
			}*/
		}

		function min(set) { //No 'sorted' parameter as min of sorted is trivial
			let min = set[0]; //Defaults to undefined if count is 0
			const count = set.length;
			for (let i = 1; i < count; i++) {
				const element = set[i];
				if (element < min) {
					min = element;
				}
			}
			return min;
		}

		function max(set) { //No 'sorted' parameter as max of sorted is trivial
			let max = set[0]; //Defaults to undefined if count is 0
			const count = set.length;
			for (let i = 1; i < count; i++) {
				const element = set[i];
				if (element > max) {
					max = element;
				}
			}
			return max;
		}

		function sum(set) {
			const count = set.length;
			let sum = 0;
			for (let i = 0; i < count; i++) {
				sum += set[i];
			}
			return sum;
		}

		function mean(set) { //In future must add option to prevent overflow by breaking array down
			return sum(set) / set.length;
		}

		return {
			contains: contains,
			count: count,
			min: min,
			max: max,
			sum: sum,
			mean: mean
		};
	}());

	//Return modules
	return {
		VERSION: "beta-2.0",
		std: std,
		int: int,
		vec: vec,
		mat: mat,
		rand: rand,
		noise: noise,
		set: set
	};
}());