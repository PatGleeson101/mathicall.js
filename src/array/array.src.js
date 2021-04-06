import {floor, min as stdMin, max as stdMax} from "../standard/standard.lib.js";

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

function imax(arr, sorted = false) {
	const len = arr.length;
	if (len === 0) {return undefined;}
	if (sorted) {
		return (arr[0] >= arr[len-1]) ? 0 : len - 1; //>= is important; ensures first occurrence returned
	}
	let result = 0;
	let maxValue = arr[0] - 1;
	for (let i = 0; i < len; i++) {
		const value = arr[i];
		if (value > maxValue) {
			maxValue = value;
			result = i;
		}
	}
	return result;
}

function imin(arr, sorted = false) {
	const len = arr.length;
	if (len === 0) {return undefined;}
	if (sorted) {
		return (arr[0] <= arr[len-1]) ? 0 : len - 1;
	}
	let result = 0;
	let minValue = arr[0] + 1;
	for (let i = 0; i < len; i++) {
		const value = arr[i];
		if (value < minValue) {
			minValue = value;
			result = i;
		}
	}
	return result;
}

function prod(arr) {
	const len = arr.length;
	let result = 1; //By convention for empty array
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
			uniqueElements[uniqueCount++] = current;
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
		return new Float64Array(Object.values(uniqueElements));
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
			if (arr[lowerBound] === value) {return lowerBound;}
			lowerBound++;
		}
	}
	return -1; //Not contained
}

function union(arr1, arr2, sorted = false) {
	const len1 = arr1.length;
	const len2 = arr2.length;
	if ( (!sorted) || (len1 + len2 < MAX_LINEAR_SEARCH_LENGTH) ) { //Arrays unsorted or short
		const unionElements = {};
		let value = 0;
		for (let i = 0; i < len1; i++) {
			value = arr1[i];
			unionElements[value] = value;
		}
		for (let i = 0; i < len2; i++) {
			value = arr2[i];
			unionElements[value] = value;
		}
		return new Float64Array(Object.values(unionElements));
	} else { //Sorted and sufficiently long
		const result = [];
		let i = 0;
		let j = 0;
		let val1 = 0;
		let val2 = 0;
		let prev_val1 = NaN;
		let prev_val2 = NaN;
		while ( (i < len1) && (j < len2) ) {
			val1 = arr1[i];
			val2 = arr2[j];
			if (val1 < val2) {
				if (val1 !== prev_val1) {
					result.push(val1);
					prev_val1 = val1;
				}
				i++
			} else if (val1 > val2) {
				if (val2 !== prev_val2) {
					result.push(val2);
					prev_val2 = val2;
				}
				j++
			} else { //broken
				if (val1 !== prev_val1) {
					result.push(val1);
				}
				i++;
				j++;
			}
			//Catch rest of larger array
			while (i < len1) {
				result.push(arr1[i++]);
			}
			while (j < len2) {
				result.push(arr2[j++]);
			}
			return new Float64Array(result);
		}
	}
}

function isEqual(arr1, arr2) {
	const len1 = arr1.length;
	const len2 = arr2.length;
	if (len1 !== len2) {return false;}
	for (let i = 0; i < len1; i++) {
		if (arr1[i] !== arr2[i]) {return false;}
	}
	return true;
}

const MIN_BUCKET_SORT_LENGTH = 256;

function sortUint8(arr, target = new Uint8Array(arr.length)) { //Radix sort
	const buckets = new Uint32Array(256);
	const len = arr.length;
	for (let i = 0; i < len; i++) { //Count occurrences
		buckets[arr[i]] += 1;
	}
	let j = 0;
	for (let i = 0; i < 256; i++) {
		const count = buckets[i];
		for (let k = 0; k < count; k++) {
			target[j++] = i;
		}
	}
	return target;
}

function count(arr, value, sorted = false) {
	const len = arr.length;
	let result = 0;
	if ((!sorted)||(arr.length <= MAX_LINEAR_SEARCH_LENGTH)) { //Unsorted or short array
		for (let i = 0; i < len; i++) {
			if (arr[i] === value) {result += 1;}
		}
	} else { //Sorted and sufficiently long
		//Get bounds
		let lowerBound = 0;
		let upperBound = len - 1;
		let startValue = arr[lowerBound];
		let endValue = arr[upperBound];
		let currentIndex = 0;
		let currentValue = 0;
		let pivot = undefined;
		//Find one occurrence (not necessarily first)
		if (startValue > endValue) { //Descending order
			if ((startValue < value)||(endValue > value)) {return 0;} //Quick return: value not contained
			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
				currentIndex = floor(0.5 * (lowerBound + upperBound));
				currentValue = arr[currentIndex];
				if (currentValue > value) {
					lowerBound = currentIndex + 1;
				} else if (currentValue < value) {
					upperBound = currentIndex - 1;
				} else { //Found an instance
					pivot = currentIndex;
					break;
				}
			}
		} else { //Ascending order
			if ((startValue > value)||(endValue < value)) {return 0;} //Quick return: value not contained
			while (upperBound - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
				currentIndex = floor(0.5 * (lowerBound + upperBound));
				currentValue = arr[currentIndex];
				if (currentValue < value) {
					lowerBound = currentIndex + 1;
				} else if (currentValue > value) {
					upperBound = currentIndex - 1;
				} else { //Found an instance
					pivot = currentIndex;
					break;
				}
			}
		}
		if (pivot !== undefined) { //Could also check whether upperBound - lowerBound still > MAX_LINEAR_SEARCH_LENGTH
			//Initial search ended because a pivot was found. Split binary search to find first and last occurrence.
			//FIRST OCCURRENCE
			let upperBoundFirst = pivot;
			while (upperBoundFirst - lowerBound > MAX_LINEAR_SEARCH_LENGTH) {
				currentIndex = floor(0.5 * (lowerBound + upperBoundFirst));
				currentValue = arr[currentIndex];
				if (currentValue !== value) {
					lowerBound = currentIndex;
				} else {
					upperBoundFirst = currentIndex;
				}
			}
			// Linear search for first occurrence once region becomes small enough
			while (lowerBound <= upperBoundFirst) { 
				if (arr[lowerBound] === value) {break;}
				lowerBound++;
			}
			//LAST OCCURRENCE
			let lowerBoundLast = pivot;
			while (upperBound - lowerBoundLast > MAX_LINEAR_SEARCH_LENGTH) {
				currentIndex = floor(0.5 * (lowerBoundLast + upperBound));
				currentValue = arr[currentIndex];
				if (currentValue !== value) {
					upperBound = currentIndex;
				} else {
					lowerBoundLast = currentIndex;
				}
			}
			// Linear search for first occurrence once region becomes small enough
			while (upperBound >= lowerBoundLast) { 
				if (arr[upperBound] === value) {break;}
				upperBound--;
			}
			//Set result
			result = upperBound - lowerBound + 1;
		} else {
			//Initial search ended because bounds got too close together
			for (let i = lowerBound; i <= upperBound; i++) {
				if (arr[i] === value) {result += 1;}
			}
		}
	}
	return result;
}

// Freeze exports
Object.freeze(sum);
Object.freeze(min);
Object.freeze(max);
Object.freeze(prod);
Object.freeze(unique);
Object.freeze(indexOf);
Object.freeze(union);
Object.freeze(isEqual);
Object.freeze(sortUint8);
Object.freeze(imin);
Object.freeze(imax);
Object.freeze(count);

// Export exports
export {sum, min, max, prod, unique, indexOf, union, isEqual, sortUint8, imin, imax, count}