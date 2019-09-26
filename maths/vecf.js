/* MathicallJS module: vecf.js
A function-oriented implementation of vectors

Notes:
Vectors are represented as arrays [x1, x2, x3,...]
Angles in radians

Dependencies:
pmath.js
*/

var vecf = (function() {
	"use strict";

	//Dependencies
	const sqrt = Math.sqrt;
	const acos = Math.acos;


	//Dot product functions
	function dotVec(vec1, vec2) {
		let result = 0;
		let len = vec1.length;
		for (let i = 0; i  < len; i++) {
			result += vec1[i]*vec2[i];
		}
		return result;
	}

	function dotVec2(vec1, vec2) {
		return vec1[0]*vec2[0] + vec1[1]*vec2[1];
	}

	function dotVec3(vec1, vec2) {
		return vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2];
	}


	//Cross product function
	function crossVec3(vec1,vec2) {
		return [vec1[1]*vec2[2] - vec1[2]*vec2[1], 
				vec1[2]*vec2[0] - vec1[0]*vec2[2],
				vec1[0]*vec2[1] - vec1[1]*vec2[0]];
	}


	//Sum functions
	function sumVec(...vecs) {
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

	function sumVec2(...vecs) {
		let result = [0,0];
		let length = vecs.length;
		let vec;
		for (let i = 0; i < length; i++) {
			vec = vecs[i];
			result[0] += vec[0];
			result[1] += vec[1];
		}
		return result;
	}

	function sumVec3(...vecs) {
		let result = [0,0,0];
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

	function addVec2(vec1, vec2) {
		return [vec1[0]+vec2[0],
				vec1[1]+vec2[1]];
	}

	function addVec3(vec1, vec2) {
		return [vec1[0]+vec2[0],
				vec1[1]+vec2[1],
				vec1[2]+vec2[2]];
	}


	//Subtraction functions
	function subVec(vec1, vec2) {
		let order = vec1.length
		let result = Array(order);
		for (let i = 0; i < order; i++) {
			result[i] = vec1[i] - vec2[i];
		}
		return result;
	}

	function subVec2(vec1, vec2) {
		return [vec1[0]-vec2[0],
				vec1[1]-vec2[1]];
	}

	function subVec3(vec1, vec2) {
		return [vec1[0]-vec2[0],
				vec1[1]-vec2[1],
				vec1[2]-vec2[2]];
	}


	//Magnitude functions
	function magVec(vec) {
		let len = vec.length; 
		let sum = 0; 
		let value; 
		for (let i = 0; i < len; i++) {
			value = vec[i]; 
			sum += value*value;
		};
		return sqrt(sum);
	}

	function magVec2(vec) {
		return sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
	}

	function magVec3(vec) {
		return sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
	}


	//Scale functions
	function scaleVecBy(vec, k) {
		let order = vec.length;
		let result = [];
		for (let i = 0; i < order; i++) {
			result.push(vec[i]*k);
		}
		return result;
	}

	function scaleVec2By(vec, k) {
		return [vec[0]*k, vec[1]*k];
	}

	function scaleVec3By(vec, k) {
		return [vec[0]*k, vec[1]*k, vec[2]*k];
	}

	function scaleVecTo(vec, m) {
		return scaleVecBy(vec, m/magVec(vec));
	}

	function scaleVec2To(vec, m) {
		return scaleVec2By(vec, m/magVec3(vec));
	}

	function scaleVec3To(vec, m) {
		return scaleVec3By(vec, m/magVec3(vec));
	}

	function normalize(vec) {
		return scaleVecTo(vec,1);
	}


	//Angle functions
	function angleBetweenVec(vec1, vec2) {
		return acos(dotVec(vec1,vec2)/(magVeg(vec1)*magVec(vec2)));
	}


	//Rotate functions (not yet implemented, perhaps to be implemented elsewhere)

	//Return all public functions
	return {
		dotVec: dotVec,
		dotVec2: dotVec2,
		dotVec3: dotVec3,
		crossVec3: crossVec3,
		sumVec: sumVec,
		sumVec2: sumVec2,
		sumVec3: sumVec3,
		addVec2: addVec2,
		addVec3: addVec3,
		subVec: subVec,
		subVec2: subVec2,
		subVec3: subVec3,
		magVec: magVec,
		magVec2: magVec2,
		magVec3: magVec3,
		scaleVecBy: scaleVecBy,
		scaleVec2By: scaleVec2By,
		scaleVec3By: scaleVec3By,
		scaleVecTo: scaleVecTo,
		scaleVec2To: scaleVec2To,
		scaleVec3To: scaleVec3To,
		normalize: normalize,
		angleBetweenVec: angleBetweenVec
			};
}());




