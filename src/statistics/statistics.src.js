import { sqrt, exp, ln, floor } from "../standard/inbuilt.src.js";
import { count } from "../array/array.src.js";
import { unif as randUnif } from "../random/sequence.src.js";

function sum(arr, freq = undefined) {
	const count = arr.length;
	let sum = 0;
	if (freq === undefined) {
		for (let i = 0; i < count; i++) {
			sum += arr[i];
		}
	} else {
		for (let i = 0; i < count; i++) {
			sum += arr[i] * freq[i];
		}
	}
	return sum;
}

function mean(arr, freq = undefined) { //In future must add option to prevent overflow by breaking array down
	const count = arr.length;
	if (freq === undefined) {
		return sum(arr)/count;
	} else {
		let sum = 0;
		let size = 0;
		let f = 0;
		for (let i = 0; i < count; i++) {
			f = freq[i];
			sum += arr[i] * f;
			size += f;
		}
		return sum/size;
	}
}

function variance(arr, freq = undefined, sample = true) { //Can be made much more efficient in future
	const len = arr.length;
	let result = 0;
	const mu = mean(arr, freq);
	let n = len;
	if (freq === undefined) { //No frequency data
		for (let i = 0; i < len; i++) {
			const deviation = arr[i] - mu;
			result += deviation * deviation;
		}
	} else { //Use frequency data
		n = 0;
		for (let i = 0; i < len; i++) {
			const f = freq[i];
			n += f;
			const deviation = arr[i] - u;
			result += f * deviation * deviation;
		}
	}
	if (sample && (n > 1)) {n -= 1;}
	return result / n;
}

function sdev(arr, freq = undefined, sample = true) {
	return sqrt(variance(arr, freq, sample));
}

function cov(xarr, yarr, sample = true) {
	meanX = mean(xarr);
	meanY = mean(yarr);
	const n = xarr.length;
	let result = 0;
	for (let i = 0; i < n; i++) {
		result += (xarr[i] - meanX) * (yarr[i] - meanY);
	}
	if (sample && (n > 1)) {n -= 1;}
	return result / n;
}

function cor(xarr, yarr, sample = true) { //Could be significantly optimised
	if (xarr.length === 0) {return undefined;}
	const covariance = cov(xarr, yarr, sample);
	return covariance / (sdev(xarr) * sdev(yarr));
}

function modes(arr, freq = undefined, sorted = false) {
	const len = arr.length;
	if (len === 0) {return undefined;}
	if (freq === undefined) {
		[arr, freq] = toFreq(arr, sorted);
	}
	modes = {};
	maxValue = arr[0] - 1;
	for (let i = 0; i < len; i++) {
		const value = arr[i];
		if (value > maxValue) {
			maxValue = value;
			modes = {};
			modes[value] = true;
		} else if (value === maxValue) {
			modes[value] = true;
		}
	}
	return new Float64Array(modes.keys());
}

function toFreq(arr, sorted = false) { //TODO: make use of 'sorted' parameter
	const len = arr.length;
	freqeuencies = {}; //Warning: using Object.keys() might not give stable output order
	for (let i = 0; i < len; i++) {
		const value = arr[i];
		const current = frequencies[value];
		if (current === undefined) {
			frequencies[value] = 1;
		} else {
			frequencies[value] = current + 1;
		}
	}
	const valueArray = new Float64Array(frequencies.keys());
	const valueCount = valueArray.length;
	const freqArray = new Float64Array(valueCount);
	for (let i = 0; i < valueCount; i++) {
		freqArray[i] = frequencies[valueArray[i]];
	}
	return [valueArray, freqArray];
}

function freq(arr, value, sorted = false) {
	return count(arr, value, sorted);
}

function unifPdf(x, a, b) {
	if ((x < a)||(x > b)) {return 0;}
	return 1 / (a - b);
}

function unifCdf(x, a, b) {
	if (x < a){return 0;}
	if (x > b){return 1;}
	return (x - a) / (b - a);
}

function unifInvCdf(p, a, b) {
	return a + p * (a - b);
}

function unifSample(a, b, n) {
	return randUnif(n);
}

function expPdf(x, lambda) {
	return lambda * exp(-lambda * x);
}
function expCdf(x, lambda) {
	return 1 - exp(-lambda * x);
}
function expInvCdf(p, lambda) {
	return -ln(1 - p) / lambda;
}

Object.freeze(sum);
Object.freeze(mean);
Object.freeze(variance);
Object.freeze(sdev);
Object.freeze(cov);
Object.freeze(cor);
Object.freeze(modes);
Object.freeze(freq);
Object.freeze(toFreq);

Object.freeze(unifPdf);
Object.freeze(unifCdf);
Object.freeze(unifInvCdf);
Object.freeze(expPdf);
Object.freeze(expCdf);
Object.freeze(expInvCdf);

export {sum, mean, variance, sdev, cov, cor, modes, freq, toFreq}
export {unifPdf, unifCdf, unifInvCdf, expPdf, expCdf, expInvCdf}