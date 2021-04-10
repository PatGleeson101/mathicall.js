import {Float1to1} from "./map.src.js";
import {floor, lerp} from "../standard/standard.lib.js";
import {int} from "./sequence.src.js";

//1D Perlin noise
function fade(t) {
	return t * t * t * ((t * (6 * t - 15)) + 10);
}

function dfdt(t) {
	return t * t * (30 + t * (30 * t + 60));
}

function Perlin1D(range = [0, 1], seed = int(1, Number.MAX_SAFE_INTEGER)) {
	const grad = Float1to1(seed);
	//Natural amplitude of 1D Perlin noise is 0.5
	const rmin = range[0];
	const avg = 0.5 * (rmin + range[1]);
	const amp = avg - rmin;
	const scaleFactor = 2 * amp;

	//Function
	const perlin = function(x) { //Just value
		const x0 = floor(x);
		const x1 = x0 + 1;
		const g0 = grad(x0);
		const g1 = grad(x1);
		const u = x - x0;
		const c0 = g0 * u;
		const c1 = g1 * (u - 1);
		return avg + lerp(c0, c1, fade(u)) * scaleFactor;
	}
	//Make seed public
	perlin.seed = seed;
	//Derivative
	const deriv = function(x) { //Just derivative
		const x0 = floor(x);
		const x1 = x0 + 1;
		const g0 = grad(x0);
		const g1 = grad(x1);
		const u = x - x0;
		const c0 = g0 * u;
		const c1 = g1 * (u - 1);
		return (c1 - c0) * dfdt(u) * scaleFactor;
	}
	perlin.deriv = Object.freeze(deriv);
	//Gridded data
	const grid = function(xmin, count, step) {
		const minCell = floor(xmin);
		const maxCell = floor(xmin + count * step);
		const cellCount = maxCell - minCell;
		const result = new Float64Array(count);
		const xmax = xmin + count * step;
		const floatError = step * 0.0001
		let locX = xmin - minCell;
		let index = 0;
		let g0 = 0;
		let d0 = 0
		let g1 = grad(minCell);
		let d1 = step * g1
		for (let i = 0; i < cellCount; i++) {
			g0 = g1;
			d0 = d1;
			g1 = grad(i+1);
			d1 = g1 * step;
			c0 = locX * g0;
			c1 = (locX - 1) * g1

			const maxLocX = (i === cellCount-1) ? xmax - maxCellX + floatError : 1 + floatError;
			while (locX < maxLocX) {
				result[index++] = lerp(c0, c1, fade(locX))
				c0 += d0;
				c1 += d1;
			}
			locX -= 1;
		}
		return result;
	}

	//Add grid to perlin object
	perlin.grid = Object.freeze(grid);
	//Return frozen object
	return Object.freeze(perlin);
}

// Freeze exports
Object.freeze(Perlin1D);

// Export
export {Perlin1D}