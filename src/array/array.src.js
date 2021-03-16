import {random, floor, min as stdMin, max as stdMax} from "../standard/standard.lib.js";

const MAX_LINEAR_SEARCH_LENGTH = 64; //Yet to be optimised

function sum(arr) {
	const len = arr.length;
	let result = 0;
	for (let i = 0; i < len; i++) {
		result += arr[i];
	}
	return result;
}

function min(arr, sorted = false) {
	const len = arr.length;
	if (sorted) {
		return stdMin(arr[0], arr[len-1]);
	}
	let result = arr[0]; //Defaults to undefined if array is empty
	let element = 0;
	for (let i = 1; i < len; i++) {
		element = arr[i];
		if (element < result) {
			result = element;
		}
	}
	return result;
}

function max(arr, sorted = false) {
	const len = arr.length;
	if (sorted) {
		return stdMax(arr[0], arr[len-1]);
	}
	let result = arr[0]; //Defaults to undefined if array is empty
	let element = 0;
	for (let i = 1; i < len; i++) {
		element = arr[i];
		if (element > result) {
			result = element;
		}
	}
	return result;
}

function prod(arr) {
	const len = arr.length;
	let result = arr[0]; //Defaults to undefined if array is empty
	for (let i = 1; i < len; i++) {
		result *= arr[i];
	}
	return result;
}

function unique(arr, sorted = false) {
	const len = arr.length;
	if (sorted) { //Sorted
		const uniqueElements = new Float64Array(len); //In future, reduce wasted memory by allocating in blocks
		let uniqueCount = 0;
		let previous = 0;
		let current = arr[0];
		let i = 0;
		while (i < len) {
			resultBlock[uniqueCount++] = current;
			previous = current;
			while (current === previous) {
				current = arr[i++];
			}
		}
		return uniqueElements.slice(0, uniqueCount);
	} else { //Unsorted
		const uniqueElements = {};
		let value = 0;
		for (let i = 0; i < len; i++) {
			value = arr[i];
			uniqueElements[value] = value;
		}
		return new Float64Array(uniqueElements.values());
	}
}

function indexOf(arr, value, sorted = false) {
	const len = arr.length;
	if ((!sorted)||(len <= MAX_LINEAR_SEARCH_LENGTH)) { //Unsorted or small length
		for (let i = 0; i < len; i++) {
			if (arr[i] === value) {return i;} //Return first instance (if contained)
		}
	} else { //Sorted & sufficiently long; use binary search
		//Get bounds
		let lowerBound = 0;
		let upperBound = len - 1;
		let startValue = arr[lowerBound];
		let endValue = arr[upperBound];
		let currentIndex = 0;
		let currentValue = 0;
		//Find (at most) one occurrence
		if (startValue > endValue) { //Descending order
			if ((startValue < value)||(endValue > value)) {return -1;} //Quick return: value not contained
			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
				currentIndex = floor(0.5 * (lowerBound + upperBound));
				currentValue = arr[currentIndex];
				if (currentValue > value) {
					lowerBound = currentIndex;
				} else {
					upperBound = currentIndex;
				}
			}
		} else { //Ascending order
			if ((startValue > value)||(endValue < value)) {return -1;} //Quick return: value not contained
			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
				currentIndex = floor(0.5 * (lowerBound + upperBound));
				currentValue = arr[currentIndex];
				if (currentValue < value) {
					lowerBound = currentIndex;
				} else {
					upperBound = currentIndex;
				}
			}
		}
		//Linear search for first occurrence once region becomes small enough
		while (lowerBound <= upperBound) { 
			if (array[lowerBound] === value) {return lowerBound;}
			lowerBound++;
		}
	}
	return -1; //Not contained
}

// Freeze exports
Object.freeze(sum);
Object.freeze(min);
Object.freeze(max);
Object.freeze(prod);
Object.freeze(unique);
Object.freeze(indexOf);

// Export exports
export {sum, min, max, prod, unique, indexOf}