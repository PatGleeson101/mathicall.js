import * as src from "../../../src/matrix/matrix.src.js";
import { isEqual } from "../../../src/array/array.src.js";

//identity
console.log( isEqual(src.identity(2), [1, 0, 0, 1]) );

//scalar multiplication
console.log( isEqual(src.smult([1,2,3], 2), [2, 4, 6]) );
console.log( isEqual(src.smult([], 2), []) );

//transposing
console.log( isEqual(src.transpose2x2([1,2,3,4]), [1, 3, 2, 4]));
console.log( isEqual(src.transpose3x3([1,2,3,4,5,6,7,8,9]), [1,4,7,2,5,8,3,6,9]));
const mat4x4 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
mat4x4.nrows = 4;
mat4x4.ncols = 4;
const mat4x4T = [1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16];
mat4x4T.nrows = 4;
mat4x4T.ncols = 4;
console.log( isEqual(src.transpose4x4(mat4x4), mat4x4T));

//size
console.log( isEqual(src.size(mat4x4), [4, 4]));

//matrix multiplication
const m1m2 = [30, 70, 110, 150, 70, 174, 278, 382, 110, 278, 446, 614, 150, 382, 614, 846]
console.log( isEqual(src.mmult(mat4x4, mat4x4T), m1m2) );

//determinant
console.log (src.det2x2([1,2,3,4]) === -2);

//inverse
console.log( isEqual(src.inverse2x2([1,2,3,4]), [-2, 1, 1.5, -0.5]) );

//vmult
//vmult2x2
//multv