/* MathicallJS module: vec.js

Dependencies: std
*/

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