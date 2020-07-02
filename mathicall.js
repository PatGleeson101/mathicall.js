/* mathicall.js: The entire MathicallJS library */

var MATHICALL = (function(){
	var std = (function(){
		"use strict";

		const trunc = Math.trunc;
		const floor = Math.floor;
		const round = Math.round;
		const abs = Math.abs;

		function min2(a, b) {
			return (a > b) ? b : a;
		}

		function max2(a, b) {
			return (a > b) ? a : b;
		}

		function minA(array) {
			let min = array[0];
			let len = array.length;
			let item;
			for (let i = 1; i < len; i++) {
				item = array[i];
				if (item < min) {
					min = item;
				}
			}
			return min;
		}

		function maxA(array) {
			let max = array[0];
			let len = array.length;
			let item;
			for (let i = 1; i < len; i++) {
				item = array[i];
				if (item > max) {
					max = item;
				}
			}
			return max;
		}

		function lerp(x, y, r) {
			return x + (y - x) * r;
		}

		//Modular exponentiation
		function powMod(base, exp, m) {
			base = abs(round(base));
			exp = abs(round(exp));
			m = round(m);
			if (m === 1) {
				return 0;
			} else {
				let result = 1;
				base = base % m;
				while (exp > 0) {
					if (exp & 0x1) {
						result = (result * base) % m;
					}
					exp = exp >> 1;
					base = (base ** 2) % m;
				}
				return result;
			}
		}

		function mod(x, m) {
			return x - m * floor(x / m);
		}

		const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 622702800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000];

		function factorial(n) {
			if (n > 18) {
				return Number.MAX_SAFE_INTEGER;
			} else if (n >= 0) {
				return factorials[n];
			} else {
				return undefined;
			}
		}

		function nCr(n, r) {
			return factorial(n)/(factorial(r)*factorial(n-r)); //To be optimised in future by removing common factors or using pascal's triangle
		}

		function nPr(n, r) {
			if ((r > n) || (n < 0) || (r < 0)) {
				return 0;
			} else if (n < 19) {
				return factorials[n]/factorials[r];
			} else {
				result = 1;
				while (n > r) {
					result *= n--;
				}
				return result;
			}
		}

		function fract(x) {
			return x - trunc(x);
		}

		return {
			min2: min2,
			max2: max2,
			minA: minA,
			maxA: maxA,
			lerp: lerp,
			hypot: Math.hypot,
			mod: mod,
			powMod: powMod,
			factorial: factorial,
			nCr: nCr,
			nPr: nPr,
			trunc: trunc,
			fract: fract
		};
	}());

	var rand = (function(){
		"use strict";

		//Dependencies
		const mod = std.mod;
		const floor = Math.floor;
		const abs = Math.abs;

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
				let result = new Uint32Array(n);
				crypto.getRandomValues(result);
				return result;
			}
		} else {
			console.warn('rand: crypto functions unavailable');
		}

		return {
			MCG: MCG,
			iMCG: iMCG,
			cryptoUint32: cryptoUint32,
				};
	}());

	var vec = (function() {
		"use strict";

		//Dependencies
		const sqrt = Math.sqrt;
		const acos = Math.acos;
		const hypot = Math.hypot;
		const fract = std.fract;

		//Dot product
		function dot(vec1, vec2) {
			let result = 0;
			let len = vec1.length;
			for (let i = 0; i  < len; i++) {
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
			return [vec1[1] * vec2[2] - vec1[2] * vec2[1], 
					vec1[2] * vec2[0] - vec1[0] * vec2[2],
					vec1[0] * vec2[1] - vec1[1] * vec2[0]];
		}

		//Sum functions
		function sum(...vecs) {
			let length = vecs.length;
			let order = vecs[0].length;
			let result = Array(order).fill(0);
			let vec;
			for (let i = 0; i < length; i++) {
				vec = vecs[i];
				for (let j = 0; j < order; j++) {
					result[j] += vec[j];
				}
			}
			return result;
		}

		function sum2(...vecs) {
			let result = [0, 0];
			let length = vecs.length;
			let vec;
			for (let i = 0; i < length; i++) {
				vec = vecs[i];
				result[0] += vec[0];
				result[1] += vec[1];
			}
			return result;
		}

		function sum3(...vecs) {
			let result = [0, 0, 0];
			let length = vecs.length;
			let vec;
			for (let i = 0; i < length; i++) {
				vec = vecs[i];
				result[0] += vec[0];
				result[1] += vec[1];
				result[2] += vec[2];
			}
			return result;
		}

		function add2(vec1, vec2) {
			return [vec1[0] + vec2[0],
					vec1[1] + vec2[1]];
		}

		function add3(vec1, vec2) {
			return [vec1[0] + vec2[0],
					vec1[1] + vec2[1],
					vec1[2] + vec2[2]];
		}

		//Subtraction
		function sub(vec1, vec2) {
			let order = vec1.length
			let result = Array(order);
			for (let i = 0; i < order; i++) {
				result[i] = vec1[i] - vec2[i];
			}
			return result;
		}

		function sub2(vec1, vec2) {
			return [vec1[0] - vec2[0],
					vec1[1] - vec2[1]];
		}

		function sub3(vec1, vec2) {
			return [vec1[0] - vec2[0],
					vec1[1] - vec2[1],
					vec1[2] - vec2[2]];
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
		function smult(vec, k) {
			let order = vec.length;
			let result = [];
			for (let i = 0; i < order; i++) {
				result.push(vec[i]*k);
			}
			return result;
		}

		function smult2(vec, k) {
			return [vec[0] * k, vec[1] * k];
		}

		function smult3(vec, k) {
			return [vec[0] * k, vec[1] * k, vec[2] * k];
		}

		function toMag(vec, m) {
			return smult(vec, m/magVec(vec));
		}

		function toMag2(vec, m) {
			return smult2(vec, m/magVec3(vec));
		}

		function toMag3(vec, m) {
			return smult3(vec, m/magVec3(vec));
		}

		//Std equivalents
		function fractv(vec) {
			order = vec.length;
			let result = Array(order);
			for (let i = 0; i < order; i++) {
				result[i] = fract(vec[i])
			}
			return result;
		}

		function fract2(vec) {
			return [fract(vec[0]), fract(vec[1])];
		}

		function fract3(vec) {
			return [fract(vec[0]), fract(vec[1]), fract(vec[2])];
		}

		function normalized(vec) {
			return toMag(vec, 1);
		}

		//Angles & rotations
		function innerAngle(vec1, vec2) {
			return acos(dot(vec1, vec2)/(mag(vec1) * mag(vec2)));
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
			add2: add2,
			add3: add3,
			sub: sub,
			sub2: sub2,
			sub3: sub3,
			mag: mag,
			mag2: mag2,
			mag3: mag3,
			smult: smult,
			smult2: smult2,
			smult3: smult3,
			toMag: toMag,
			toMag2: toMag2,
			toMag3: toMag3,
			fract: fractv,
			fract2: fract2,
			fract3: fract3,
			normalized: normalized,
			innerAngle: innerAngle,
				};
	}());

	var hash = (function(){
		"use strict";

		//Dependencies
		const abs = Math.abs;
		const fract = std.fract;
		const dot3 = vec.dot3;

		//Szudzik pairing functions
		function uSzudzik2(x, y) { //W -> W
			const X = abs(x);
			const Y = abs(y);
			return (X >= Y) ? (X * X + X + Y) : (Y * Y + X);
		}

		function sSzudzik2(x, y) { //Z -> Z
			const X = x >= 0 ? x * 2 : x * -2 - 1;
			const Y = y >= 0 ? y * 2 : y * -2 - 1;
			return (X >= Y) ? (X * X + X + Y) : (Y * Y + X);
		};

		function recursiveSzudzik(...ints) {
			if (ints.length === 2) {
				return sSzudzik2(ints[0], ints[1]);
			} else {
				return sSzudzik2(ints[0], recursiveSzudzik(...ints.slice(1)));
			}
		}

		//Vector hashing
		function float1to1(p) {
			p = fract(p * 0.1031);
			p *= p + 33.33;
			p *= p + p;
			return fract(p);
		}

		function vec2to1(vec) {
			const pX = fract(vec[0] * 0.1031);
			const pY = fract(vec[1] * 0.1031);
			const offset = dot3([pX, pY, pX], [pY + 33.33, pX + 33.33, pX + 33.33]);
			return fract((pX + pY + 2 * offset) * (pX + offset));
		}
		
		return {
			uSzudzik2: uSzudzik2,
			sSzudzik2: sSzudzik2,
			recursiveSzudzik: recursiveSzudzik,
			float1to1: float1to1,
			vec2to1: vec2to1
				};
	}());

	var color = (function(){
		"use strict";

		//Dependencies
		const lerp = std.lerp;
		const mod = std.mod;
		const round = Math.round;
		const min = Math.min;
		const max = Math.max;
		const floor = Math.floor;
		const abs = Math.abs

		//Colour conversion
		function RGBtoHSL(r, g, b) {
			r /= 255;
			g /= 255;
			b /= 255;

			const cmax = max(r, g, b);
			const cmin = min(r, g, b);
			const delta = cmax - cmin;

			let h = 0;
			switch (cmax) {
				case cmin:
					break;
				case r:
					h = ((g - b) / delta) % 6;
					break;
				case g:
					h = (b - r) / delta + 2;
					break;
				case b:
					h = (r - g) / delta + 4;
			}
			h = round(h * 60);
			if (h < 0) {h += 360};

			let l = 0.5 * (cmax + cmin);
			let s = delta / (1 - abs(2 * l - 1));

			s = +(s * 100).toFixed(1);
	  		l = +(l * 100).toFixed(1);
	  		return [h, s, l];
		}

		function HSLtoRGB(h, s, l) {
			s /= 100;
			l /= 100;
			h = mod(h, 360);
			let c = (1 - abs(2 * l - 1)) * s;
			let x = c * (1 - abs((h / 60) % 2 - 1));
			let m = l - c/2;
			let r = 0;
			let g = 0;
			let b = 0;

			switch(floor(h/60)) {
				case 0:
					r = c; g = x; b = 0;
					break;
				case 1:
					r = x; g = c; b = 0;
					break;
				case 2:
					r = 0; g = c; b = x;
					break;
				case 3:
					r = 0; g = x; b = c;
					break;
				case 4:
					r = x; g = 0; b = c;
					break;
				case 5:
					r = c; g = 0; b = x;
					break;
			}
			r = round((r + m) * 255);
	  		g = round((g + m) * 255);
	  		b = round((b + m) * 255);
	  		return [r, g, b];
		}

		//Values to string
		function rgbStr(r, g, b) {
			return "rgb(" + r + "," + g + "," + b + ")";
		}

		function rgbaStr(r, g, b, a) {
			return "rgba(" + r + "," + g + "," + b + "," + a + ")";
		}

		function hexStr(r, g, b) {
			r = r.toString(16);
			g = g.toString(16);
			b = b.toString(16);
			if (r.length == 1) {r = "0" + r}
			if (g.length == 1) {g = "0" + g}
			if (b.length == 1) {b = "0" + b}
			return "#" + r + g + b;
		}

		function hexaStr(r, g, b, a) {
			r = r.toString(16);
			g = g.toString(16);
			b = b.toString(16);
			a = a.toString(16);
			if (r.length == 1) {r = "0" + r}
			if (g.length == 1) {g = "0" + g}
			if (b.length == 1) {b = "0" + b}
			if (a.length == 1) {a = "0" + a}
			return "#" + r + g + b + a;
		}

		//Blending functions
		function mixRGB(rgb1, rgb2, weight) {
			return [round(lerp(rgb1[0], rgb2[0], weight)),
					round(lerp(rgb1[1], rgb2[1], weight)),
					round(lerp(rgb1[2], rgb2[2], weight))];
		}

		//Return public functions
		return {
			RGBtoHSL: RGBtoHSL,
			HSLtoRGB: HSLtoRGB,
			rgbStr: rgbStr,
			rgbaStr: rgbaStr,
			hexStr: hexStr,
			hexaStr: hexaStr,
			mixRGB: mixRGB
			};
	}());

	var noise = (function(){
		"use strict";

		//Dependencies
		const dot2 = vec.dot2;
		const sub2 = vec.sub2;
		const add2 = vec.add2;
		const smult2 = vec.smult2;
		const lerp = std.lerp;
		const floor = Math.floor;
		const ceil = Math.ceil;
		const sqrt = Math.sqrt;
		const vec2to1 = hash.vec2to1;
		const cos = Math.cos;
		const sin = Math.sin;
		const PI = Math.PI;
		const round = Math.round;

		//Perlin noise
		function smootherstep(t) {
			return t * t * t * ((t * (6 * t - 15)) + 10);
		}

		function grad2(x, y) {
			const theta = 2 * PI * vec2to1([x, y]);
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
			const value = function(x, y, mode = 'val') {
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
				if (mode === 'val') { //Value only
					return p2lerp(c00, c01, c10, c11, locX, locY)
				} else { //Calculate derivative
					const wgtX = smootherstep(locX); //Weighted x
					const wgtY = smootherstep(locY); //Weighted y
					const c0 = lerp(c00, c01, wgtY);
					const c1 = lerp(c10, c11, wgtY);
					const delWX = 30 * locX * locX * (locX * (locX - 2) + 1);
					const delWY = 30 * locY * locY * (locY * (locY - 2) + 1);
					const delC0 = add2(add2(g00, smult2(sub2(g10, g00), delWX)), [delWX * (c10 - c00), 0]);
					const delC1 = add2(add2(g01, smult2(sub2(g11, g01), delWX)), [delWX * (c11 - c01), 0]);
					let deriv = add2(add2(delC0, smult2(sub2(delC1, delC0), delWY)), [0, delWY * (c1 - c0)]);
					deriv = smult(deriv, range);
					if (mode === 'deriv') { //Return derivative
						return deriv;
					} else if (mode === 'all') { //Return both value and derivative
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

	//Return modules
	return {
		VERSION: "beta-1.0",
		std: std,
		rand: rand,
		vec: vec,
		hash: hash,
		color: color,
		noise: noise
	};
}());