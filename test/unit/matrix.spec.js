import {matrix} from "../../build/mathicall.module.js";

test("identity", () => {
    const id2 = matrix.identity(2);
    expect(id2).toEqual(new Float64Array([1, 0, 0, 1]));
    expect(id2.nrows).toBe(2);
    expect(id2.ncols).toBe(2);
});

//Equality
test("identity", () => {
    const id2 = matrix.identity(2);
    expect(id2).toEqual(new Float64Array([1, 0, 0, 1]));
    expect(id2.nrows).toBe(2);
    expect(id2.ncols).toBe(2);
});

//scalar multiplication
test("scale", () => {
    expect(matrix.scale([1,2,3], 2)).toEqual(new Float64Array([2, 4, 6]));
    expect(matrix.scale([], 2)).toEqual(new Float64Array([]));
});

const mat4x4 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
mat4x4.nrows = 4;
mat4x4.ncols = 4;
const mat4x4T = [1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16];
mat4x4T.nrows = 4;
mat4x4T.ncols = 4;

//transposing
test("transpose", () => {
    expect(matrix.transpose2x2([1,2,3,4])).toEqual(new Float64Array([1, 3, 2, 4]))
    expect(matrix.transpose3x3([1,2,3,4,5,6,7,8,9])).toEqual(new Float64Array([1,4,7,2,5,8,3,6,9]));
    
    expect(matrix.transpose4x4(mat4x4)).toEqual(mat4x4T);
});

//matrix multiplication
test("mult", () => {
    const m1m2 = new Float64Array([30, 70, 110, 150, 70, 174, 278, 382, 110, 278, 446, 614, 150, 382, 614, 846]);
    expect(matrix.mult(mat4x4, mat4x4T)).toEqual(m1m2); //TODO: check nrows/ncols
});

//determinant
test("determinant", () => {
    expect(matrix.det2x2([1,2,3,4])).toEqual(-2);
});

//inverse
test("inverse", () => {
    expect(matrix.inverse2x2([1,2,3,4])).toEqual(new Float64Array([-2, 1, 1.5, -0.5]));
});

//vmult
//vmult2x2
//multv
//size