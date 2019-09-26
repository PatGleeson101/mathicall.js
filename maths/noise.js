/* MathicallJS module: noise.js
Useful noise functions

Notes:
Noise functions output in the range [0,1];

Dependencies: 
vecf.js
rand.js (requires hash.js)
*/

//Noises to implement:
//Value noise??
//opensimplex noise
//fractal = fractal brownian motion: sum(1/n * noise of frequency n)

var noise = (function(){
	"use strict";

	//Dependencies
	const biRand = rand.biRand;
	const dotVec2 = vecf.dotVec2;

	//Perlin Noise implementations
	class Perlin {
		constructor(dimension, seed = Math.random()) {
			//Set properties
			this.dimension = dimension;
			this.seed = seed;
		}

		fade(t) {
			return t*t*t*((t*(6*t-15))+10);
		}

		interpolate() {

		}

		value(...coordinates) {
			//Check that sufficient coordinates were given
			if (coordinates.length !== this.dimension) {
				throw this.dimension+"D Perlin value requires exactly "+this.dimension+" coordinates";
			}
			//Check that coordinates are numbers
		}
	}

	class Perlin2D { //Defines a 2D Perlin noisespace, nonrepeating in the range 
		constructor(seed) {
			this.s = seed;
			this.gradients = [[0,1],
						 	  [0,-1],
						 	  [1,0],
						 	  [-1,0],
						 	  vecf.normalize([1,1]),
						 	  vecf.normalize([-1,-1]),
						 	  vecf.normalize([1,-1]),
						 	  vecf.normalize([-1,1])];

			this.prand = biRand(this.s);
		}

		fade(t) {
			return t*t*t*((t*(6*t-15))+10);
		}	

		interpolate(w1, w2, w3, w4, localX, localY) {
			//Interpolate & return result
			const xr = this.fade(localX); //Weighted xRatio
			const yr = this.fade(localY); //Weighted yRatio
			const w12 = w1 + (w2 - w1)*xr; //Linearly interpolate w1 & w2 (horizontally)
			const w34 = w3 + (w4 - w3)*xr; //Linearly interpolate w3 & w4 (horizontally)
			return (w12 + (w34-w12)*yr+1)/2; //Return (vertically) interpolated value, mapped to range [0,1]
		}

		value(x, y) {
			//Determine cell coordinates
			const x1 = Math.floor(x);
			const x2 = x1 + 1;
			const y1 = Math.floor(y);
			const y2 = y1 + 1;

			//Determine gradient vectors
			const g1 = this.gradients[Math.floor(this.prand(x1, y1)*8)];
			const g2 = this.gradients[Math.floor(this.prand(x2, y1)*8)];
			const g3 = this.gradients[Math.floor(this.prand(x1, y2)*8)];
			const g4 = this.gradients[Math.floor(this.prand(x2, y2)*8)];

			//Determine position vectors
			const localX = x - x1;
			const localY = y - y1;

			const p1 = [localX, localY];
			const p2 = [localX-1, localY];
			const p3 = [localX, localY-1];
			const p4 = [localX-1, localY-1];

			//Determine weights
			const w1 = dotVec2(g1, p1);
			const w2 = dotVec2(g2, p2);
			const w3 = dotVec2(g3, p3);
			const w4 = dotVec2(g4, p4);

			//Interpolate & return result
			return this.interpolate(w1, w2, w3, w4, localX, localY);
		}

		fract(x, y, octaves, stepSize = 1, lacunarity = 2, persistence = 0.5) {
			let output = 0;
			let amplitude = 1;
			let totalAmplitude = 0;
			let frequency = stepSize;
			for (let i = 0; i < octaves; i++) {
				totalAmplitude += amplitude;
				output += this.value(x*frequency, y*frequency)*amplitude;
				amplitude *= persistence;
				frequency += 1;
			}
			return output/totalAmplitude;
		}

		grid(x, y, width, height, stepSize) { //Generates a grid of Perlin noise very efficiently
			//Start & stop coordinates
			const startCellX = Math.floor(x);
			const startCellY = Math.floor(y);
			const endX = x + width*stepSize;
			const endY = y + height*stepSize;

			//Output array
			let output = Array(width*height);

			//Initialise gradient columns
			let leftCol = Array(Math.ceil(endY) - startCellY + 1);
			let rightCol = Array(leftCol.length);
			let newGradient = [null, null]; 
			//Initialise rightCol (gets switched to leftCol at start of loop)
			for (let j = rightCol.length-1; j >= 0; j--) { //Looping backwards just saves an extra cache
				newGradient = this.gradients[Math.floor(this.prand(startCellX, startCellY+j)*8)]; //Generate & store gradient
				rightCol[j] = [newGradient, newGradient[0]*stepSize, newGradient[1]*stepSize]; //Cache gradient and precalculated horizontal and vertical increment values
			}

			//Initialise loop variables
			//Coordinate tracking
			let cellX = startCellX;
			let cellY = startCellY;
			let localX = x - cellX;
			let localY = y - cellY;
			let startX;
			//Row tracking
			let row;
			let rowLength;
			let cellIndex = 0;
			let cellHeight;
			//Output index tracking
			let xIndex = 0;
			let yIndex = 0;
			let xIndexInitial = 0;

			//Main loop: effectively looping by column
			while (cellX < endX) { //'<' excludes endX
				//Reset row-trackers
				cellY = startCellY;
				localY = y - cellY;
				yIndex = 0;
				cellIndex = 0;

				//Switch columns
				leftCol = rightCol.slice(0); //Set leftCol to rightCol
				//Re-generate rightCol
				for (let j = rightCol.length-1; j >= 0; j--) { //Looping backwards just saves an extra cache
					newGradient = this.gradients[Math.floor(this.prand(cellX+1, cellY+j)*8)]; //Generate & store gradient
					rightCol[j] = [newGradient, newGradient[0]*stepSize, newGradient[1]*stepSize]; //Cache gradient and precalculated horizontal and vertical increment values
				}

				//Initialise row & output index variables
				rowLength = Math.ceil((Math.min(1, endX - cellX) - localX)/stepSize);
				row = Array(rowLength);

				//Semi-initialise first weight-quadruplet
				row[0] = [null,
						  null,
						  vec.dotVec2( [localX, localY-stepSize], leftCol[0][0] ),
					      vec.dotVec2( [localX-1, localY-stepSize], rightCol[0][0] )];

				//Record initial localX
				startX = localX;

				//Loop over each cell in the column
				while (cellY < endY) { //'<' excludes endY, as intended
					//Set cellHeight & horizontal indexing
					cellHeight = Math.ceil((Math.min(1, endY - cellY) - localY)/stepSize);
					xIndex = xIndexInitial;
					localX = startX;

					//Initialise & compute first row
					//Initialise cell's first weight-quadruplet
					row[0] = [(row[0].slice(0))[2] + leftCol[cellIndex][2], 
							  (row[0].slice(0))[3] + rightCol[cellIndex][2],
							  dotVec2( [localX, localY-1], leftCol[cellIndex+1][0] ),
					      	  dotVec2( [localX-1, localY-1], rightCol[cellIndex+1][0] ) ];
					output[yIndex*width+xIndex] = this.interpolate(...row[0], localX, localY);
					localX += stepSize;
					xIndex += 1;
					//Loop over pixels to complete first row
					for (let i = 1; i < rowLength; i++) {
						row[i] = row[i-1].slice(0);
						row[i][0] += leftCol[cellIndex][1];
						row[i][1] += rightCol[cellIndex][1];
						row[i][2] += leftCol[cellIndex+1][1];
						row[i][3] += rightCol[cellIndex+1][1];
						output[yIndex*width+xIndex] = this.interpolate(...row[i], localX, localY);
						localX += stepSize;
						xIndex += 1;
					}
					yIndex += 1;
					localY += stepSize;

					//Loop over cell's rows
					for (let j = 1; j < cellHeight; j++) {
						//Initialise new row
						xIndex = xIndexInitial;
						localX = startX;

						//Loop over pixels
						for (let i = 0; i < rowLength; i++) {
							row[i][0] += leftCol[cellIndex][2];
							row[i][1] += rightCol[cellIndex][2];
							row[i][2] += leftCol[cellIndex+1][2];
							row[i][3] += rightCol[cellIndex+1][2];
							output[yIndex*width+xIndex] = this.interpolate(...row[i], localX, localY); //Note: localY occasionally goes to 1.
							localX += stepSize;
							xIndex += 1;
						}

						//Increment localY
						localY += stepSize;
						yIndex += 1;
					}
					//Prepare localY for next cell
					localY = localY - 1; 

					//Increment cellY & cellIndex
					cellY += 1;
					cellIndex += 1;
				}
				//Increment indexX
				xIndexInitial += rowLength;

				//Prepare localX for next iteration
				localX = localX - 1;

				//Increment cellX
				cellX += 1;
			}

			//Return output
			return output;
		}

		fractGrid(x, y, width, height, octaves, stepSize = 0.01, persistence = 0.5, lacunarity = 2, fbm = false) {
			//Initialise array
			const len = width*height;
			let output = Array(len);
			output.fill(0);

			//Initialise variables
			let frequency = stepSize;
			let amplitude = 1;
			let totalAmplitude = 0;

			//Loop over octaves and add scaled values
			for (let i = 0; i < octaves; i++) {
				const octave = this.grid(x/frequency, y/frequency, width, height, frequency);
				totalAmplitude += amplitude;
				for (let j = 0; j < len; j++) {
					output[j] += octave[j] * amplitude;
				}
				if (fbm) { //Fractal style
					frequency += stepSize;
					amplitude = 1/(frequency/stepSize);
				} else { //Linear addition style
					frequency *= lacunarity;
					amplitude *= persistence;
				}
			}

			//Scale values
			for (let i = 0; i < len; i++) {
				output[i] /= totalAmplitude
			}

			return output;
		}
	}


	//Worley Noise implementations
	class Worley2D {
		constructor(seed, density) {
			this.s = seed;
			this.d = density;
			this.prand = rand.multiRand(2, Math.pow(2,14)-1);
		}

		value(x,y,n) {
			//Coordinate setup
			const cellX = Math.floor(x);
			const cellY = Math.floor(y);
			const localX = x - cellX;
			const localY = y - cellY;

			//Set range-scaling factor based on average(ish) expected distance
			const rScale = 2*n/this.d; //Not rigorously defined

			//Basic implementation checks surrounding cells without limiting/selecting them efficiently/logically
			let distSort = [];
			for (let i = -1; i < 2; i++) {
				for (let j = -1; j < 2; j++) {
					//Get points from cell i x-units and j y-units away
					let newPoints = this.points(cellX + i, cellY + j);

					//Iterate over points and get distance
					for (let q = 0; q < newPoints.length; q++) {
						const p = newPoints[q];
						const d = vec.magVec([p[0] - x, p[1] - y]);
						for (let index = 0; index < distSort.length; index ++) {
							if (d < distSort[index]) {
								distSort.splice(index, 0, d);
								if (distSort.length > n) {
									distSort.pop();
								}
								break;
							}
						}
						if (distSort.length === 0) {
							distSort.push(d);
						}
					}
				}
			}

			return distSort[n-1];
		}

		points(cellX, cellY) { //Function to get all points in a given cell, in local cell coordinates
			let points = [];
			let pointCount = Math.round((this.prand(cellX, cellY)+0.5)*this.d)-1 //Basic random number of points to generate. Currently, mean != density
			for (let i = 0; i < pointCount; i++) { //Generate number of points according to density
				const x = this.prand(cellX, cellY, this.s+i); //Randomness of these two is not well done yet
				const y = this.prand(cellY, cellX+cellY, this.s+i);
				points.push([cellX + x, cellY + y]) //Possible change: local instead of absolute coordinates
			}
			return points
		}
	}

	class Worley3D {
		constructor(seed, density) {
			this.s = seed;
			this.d = density;
			this.prand = rand.randFrom;
		}

		value(x,y,z,n) {
			//Coordinate setup
			const cellX = Math.floor(x);
			const cellY = Math.floor(y);
			const cellZ = Math.floor(z);
			const localX = x - cellX;
			const localY = y - cellY;
			const localZ = z - cellZ;

			//Basic implementation checks surrounding cells without limiting/selecting them efficiently/logically
			let distSort = [];
			for (let i = -1; i < 2; i++) {
				for (let j = -1; j < 2; j++) {
					for (let k = -1; k < 2; k++) {
						//Get points from cell i x-units and j y-units away
						let newPoints = this.points(cellX + i, cellY + j, cellZ + k);

						//Iterate over points and get distance
						for (let q = 0; q < newPoints.length; q++) {
							const p = newPoints[q];
							const d = vec.magVec([p[0] - x, p[1] - y, p[2] - z]);
							for (let index = 0; index < distSort.length; index ++) {
								if (d < distSort[index]) {
									distSort.splice(index, 0, d);
									if (distSort.length > n) {
										distSort.pop();
									}
									break;
								}
							}
							if (distSort.length === 0) {
								distSort.push(d);
							}
						}
					}
				}
			}
			return distSort[n-1]/2;
		}

		points(cellX, cellY, cellZ) { //Function to get all points in a given cell, in local cell coordinates
			let points = [];
			let pointCount = Math.round((this.prand(cellX, cellY, cellZ)+0.5)*this.d)-1 //Basic random number of points to generate. Currently, mean != density
			for (let i = 0; i < pointCount; i++) { //Generate number of points according to density
				const x = this.prand(cellX, cellY, this.s+i); //Randomness of these two is not well done yet
				const y = this.prand(cellY, cellZ, this.s+i);
				const z = this.prand(cellZ, cellX, this.s+i);
				points.push([cellX + x, cellY + y, cellZ + z]) //Possible change: local instead of absolute coordinates
			}
			return points
		}
	}

	return {
		Perlin2D: Perlin2D,
		Worley2D: Worley2D,
		Worley3D: Worley3D
			};
}());