/* MathicallJS item: fvec.js
A function-oriented implementation of vectors

Notes:
Vectors are represented as arrays [x1, x2, x3,...]
Angles in radians
*/

var fVec = (function() {
	"use strict";

	//Dot product functions
	function dotVec(vec1, vec2) {
		let result = 0;
		for (let i = vec1.length-1; i >= 0; i--) {
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


	//Cross product functions
	function crossVec3(vec1,vec2) {
		return [vec1[1]*vec2[2] - vec1[2]*vec2[1], 
				vec1[2]*vec2[0] - vec1[0]*vec2[2],
				vec1[0]*vec2[1] - vec1[1]*vec2[0]];
	}


	//Sum functions
	function sumVec(...vecs) {
		let length = vecs.length;
		let order = vecs[0].length
		let result = new Array(order).fill(0);
		for (let i = 0; i < order; i++) {
			for (let j = 0; j < length; j++) {
				result[i] += vecs[i][j];
			}
		}
		return result;
	}

	function sumVec3(...vecs) {
		let result = [0,0,0];
		for (let i = 0; i < 3; i++) {
			for (let j = vecs.length-1; j > 0; j--) {
				result[i] += vecs[i][j];
			}
		}
		return result;
	}

	function addVec3(vec1, vec2) {
		return [vec1[0]+vec2[0],
				vec1[1]+vec2[1],
				vec1[2]+vec2[2]];
	}


	//Subtraction functions
	function subVec(vec1, vec2) {
		let order = vec1.length
		let result = new Array(order).fill(0);
		for (let i = 0; i < order; i++) {
			result[i] = vec1[i] - vec2[i];
		}
		return result;
	}



	function subVec3(vec1, vec2) {
		return [vec1[0]-vec2[0],
				vec1[1]-vec2[1],
				vec1[2]-vec2[2]];
	}


	//Magnitude functions
	function magVec(vec) {
		let sum = 0;
		let length
		for (let i = 0; i < 3; i++) {
			sum += vector[i]*vector[i];
		}
		return Math.sqrt(sum);
	}

	function magVec3(vec) {
		return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
	}


	//Scale functions
	function scaleVecBy(vec, k) {
		let order = vec.length;
		let result = new Array(order).fill(0);
		for (let i = 0; i < order; i++) {
			result[i] = vec[i]*k;
		}
		return result;
	}

	function scaleVecTo(vec, m) {
		return scaleVecBy(vec, m/magVec(vec));
	}

	function scaleVec3By(vec, k) {
		return [vec[0]*k, vec[1]*k, vec[2]*k];
	}

	function scaleVec3To(vec, m) {
		return scaleVec3By(vec, m/magVec3(vec));
	}


	//Angle functions
	function angleBetweenVec(vec1, vec2) {
		return Math.acos(dotVec(vec1,vec2)/(magVeg(vec1)*magVec(vec2)));
	}


	//Rotate functions (not yet implemented, perhaps to be implemented elsewhere)

	//Return all public functions
	return {
		dotVec: dotVec,
		dotVec2: dotVec2,
		dotVec3: dotVec3,
		crossVec3: crossVec3,
		sumVec: sumVec,
		sumVec3: sumVec3,
		addVec3: addVec3,
		subVec: subVec,
		subVec3: subVec3,
		magVec: magVec,
		magVec3: magVec3,
		scaleVecBy: scaleVecBy,
		scaleVecTo: scaleVecTo,
		scaleVec3By: scaleVec3By,
		scaleVec3To: scaleVec3To,
		angleBetweenVec: angleBetweenVec
	}
}());




