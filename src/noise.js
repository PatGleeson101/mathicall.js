/* MathicallJS module: noise.js

Dependencies: std, vec, rand
*/

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