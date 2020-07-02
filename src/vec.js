/* MathicallJS module: vec.js

Dependencies: std
*/

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