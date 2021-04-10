import {mod, fract, MAX_SAFE_INTEGER} from "../standard/standard.lib.js";
import {int} from "./sequence.src.js";
import {dot3} from "../vector/rect/rect.src.js";

//Uniform mapping
function Float1to1(seed = int(1, MAX_SAFE_INTEGER)) { //Scalar -> scalar
	//Seed checking
	seed = mod(seed * 10.23, 4096000);
	//Function
	const rng = function(x) {
		x = fract(x * 0.1031);
		x *= x + seed;
		x *= x + x;
		return fract(x);
	}
	//Seed
	rng.seed = seed;
	//Return frozen function
	return Object.freeze(rng);
}

function Float2to1(seed = int(1, MAX_SAFE_INTEGER)) { //2D vector -> scalar
	//Seed checking
	seed = mod(seed * 10.23, MAX_SAFE_INTEGER);
	//Function
	const rng = function(vec) {
		const pX = fract(vec[0] * 0.1031);
		const pY = fract(vec[1] * 0.1031);
		const offset = dot3([pX, pY, pX], [pY + seed, pX + seed, pX + seed]);
		return fract((pX + pY + 2 * offset) * (pX + offset));
	}
	//Seed
	rng.seed = seed;
	//Return frozen function
	return Object.freeze(rng);
}

// Freeze exports
Object.freeze(Float1to1);
Object.freeze(Float2to1);

// Export
export { Float1to1, Float2to1 }