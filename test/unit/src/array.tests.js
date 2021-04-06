//import { log } from "../../../src/core/core.src.js";
import {floor, random} from "../../../src/standard/standard.lib.js";
import * as src from "../../../src/array/array.src.js";


//sum
console.log( src.sum([]) === 0 ); // By convention
console.log( src.sum([1,2,3,4,5]) === 15 ); //Regular behaviour


//min
// setup
const minArray = new Float64Array(100);
for (let i = 0; i < 100; i++) {
    minArray[i] = 1 + random() * 10;
}
minArray[floor(random()*100)] = 0;
// tests
console.log( src.min(minArray) === 0 ); //Unsorted input
minArray.sort();
console.log( src.min(minArray, true) === 0 ); //Sorted input


//max
// setup
const maxArray = new Float64Array(100);
for (let i = 0; i < 100; i++) {
    maxArray[i] = random() * 10;
}
maxArray[floor(random()*100)] = 11;
// tests
console.log( src.max(maxArray) === 11 ); //Unsorted input
maxArray.sort();
console.log( src.max(maxArray, true) === 11 ); //Sorted input


//prod
console.log( src.prod([]) === 1 ); // By convention
console.log( src.prod([1,2,3,4,5]) === 120 ); //Regular behaviour


//unique
const uniqueArray = new Float64Array(100);
for (let j = 1, k = 0; j < 11; j++) {
    for (let i = 0; i < 10; i++) {
        uniqueArray[k++] = j;
    }
}
console.log( src.isEqual(src.unique(uniqueArray, true), [1,2,3,4,5,6,7,8,9,10]) ) //Sorted
// shuffle
for (let i = 0; i < 100; i++) {
    const j = floor( random() * 100 );
    const val = uniqueArray[j];
    uniqueArray[j] = uniqueArray[i];
    uniqueArray[i] = val;
}
console.log( src.isEqual(src.unique(uniqueArray), [1,2,3,4,5,6,7,8,9]) ) //Unsorted


//indexOf


//count
const unsortedFloat64 = new Float64Array(1000000);
for (let i = 0; i < 1000000; i++) {
    unsortedFloat64[i] = floor(random()*500);
}

const sortedFloat64 = unsortedFloat64.slice().sort();

console.log(src.count(sortedFloat64, 56), src.count(sortedFloat64, 56, true));
console.log(src.count(sortedFloat64, 501), src.count(sortedFloat64, 501, true));


//union
console.log("union [1,2] [3,4]");
console.log(src.union([1,2],[3,4]));

console.log("union [1,2,3] [3,4]");
console.log(src.union([1,2,3],[3,4]));


//sorting
const unsortedUint8 = new Uint8Array(60000);
for (let i = 0; i < 60000; i++) {
    unsortedUint8[i] = floor(random() * 256);
}

const sortedUint8 = unsortedUint8.slice().sort();
console.log ( src.isEqual( src.sortUint8(unsortedUint8), sortedUint8) );

console.log("union of sorted u8Arr and myArr");
console.log(src.union(unsortedUint8, sortedUint8));