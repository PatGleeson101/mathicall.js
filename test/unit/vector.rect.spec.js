import {vector} from "../../build/mathicall.module.js";

const rect = vector.rect;


test("Dot product", () => {
    //Degenerate case
    expect(rect.dot([], [])).toBe(0);
    //Regular cases
    expect(rect.dot([1, 1], [1, 1])).toBe(2);
    expect(rect.dot2([1, 1], [1, 1])).toBe(2);
    expect(rect.dot3([1, 1, 0], [1, 1, -2])).toBe(2);
    expect(rect.dot4([1, 1, 0, 6], [1, 1, -2, -1])).toBe(-4);
});


test("Cross product", () => {
    expect(rect.cross3([1, 0, 0], [0, 1, 0])).toEqual(new Float64Array([0, 0, 1]));
});


test("Addition", () => {
    expect(rect.add([], [])).toEqual(new Float64Array());
    expect(rect.add([1, 1, 4, 5, 7], [1, 1, 1, 1, 1])).toEqual(new Float64Array([2, 2, 5, 6, 8]));
    expect(rect.add2([1, 1], [1, 1])).toEqual(new Float64Array([2, 2]));
    expect(rect.add3([1, 1, 0], [1, 1, -2])).toEqual(new Float64Array([2, 2, -2]));
    expect(rect.add4([1, 1, 0, 6], [1, 1, -2, -1])).toEqual(new Float64Array([2, 2, -2, 5]));
});


test("Subtraction", () => {
    expect(rect.sub([], [])).toEqual(new Float64Array());
    expect(rect.sub([1, 1, 4, 5, 7], [1, 1, 1, 1, 1])).toEqual(new Float64Array([0, 0, 3, 4, 6]));
    expect(rect.sub2([1, 1], [1, 1])).toEqual(new Float64Array([0, 0]));
    expect(rect.sub3([1, 1, 0], [1, 1, -2])).toEqual(new Float64Array([0, 0, 2]));
    expect(rect.sub4([1, 1, 0, 6], [1, 1, -2, -1])).toEqual(new Float64Array([0, 0, 2, 7]));
});


test("Magnitude", () => {
    expect(rect.mag([])).toBe(0);
    expect(rect.mag([1, 1, 4, 5, 7])).toBeCloseTo(Math.sqrt(1 + 1 + 16 + 25 + 49));
    expect(rect.mag2([1, 1], [1, 1])).toBeCloseTo(Math.sqrt(1 + 1));
    expect(rect.mag3([1, 1, 0])).toBeCloseTo(Math.sqrt(1 + 1 + 0));
    expect(rect.mag4([1, 1, 0, 6])).toBeCloseTo(Math.sqrt(1 + 1 + 0 + 36));
});


test("Scaling", () => {
    expect(rect.scale([], 3.5)).toEqual(new Float64Array());
    expect(rect.scale([1, 1, 4, 5, 7], 3.5)).toEqual(new Float64Array([3.5, 3.5, 14, 17.5, 24.5]));
    expect(rect.scale2([1, 1], -5)).toEqual(new Float64Array([-5, -5]));
    expect(rect.scale3([1, 1, 0], 0)).toEqual(new Float64Array([0, 0, 0]));
    expect(rect.scale4([1, 1, 0, 6], -1.5)).toEqual(new Float64Array([-1.5, -1.5, -0, -9]));
});


test("Normalizing", () => {
    //Undefined cases
    expect(rect.normalize([])).toBeUndefined();
    expect(rect.normalize([0, 0, 0, 0, 0, 0])).toBeUndefined();
    expect(rect.normalize2([0, 0])).toBeUndefined();
    expect(rect.normalize3([0, 0, 0])).toBeUndefined();
    expect(rect.normalize4([0, 0, 0, 0])).toBeUndefined();
    //Regular cases
    expect(rect.mag(rect.normalize([1, 2, 3, 4, 5, 6]))).toBeCloseTo(1);
    expect(rect.mag(rect.normalize2([1, 2]))).toBeCloseTo(1);
    expect(rect.mag(rect.normalize3([1, 2, 3]))).toBeCloseTo(1);
    expect(rect.mag(rect.normalize4([1, 2, 3, 4]))).toBeCloseTo(1);
});


test("Contained angle", () => {
    //Undefined cases
    expect(rect.angle([], [])).toBeUndefined();
    expect(rect.angle([0, 0], [109, -1])).toBeUndefined();
    //Regular cases
    expect(rect.angle([1, 0], [1, 1])).toBeCloseTo(Math.PI / 4);
    expect(rect.angle2([1, 0], [1, 1])).toBeCloseTo(Math.PI / 4);
    expect(rect.angle3([1, 0, 1], [1, 0, -1])).toBeCloseTo(Math.PI / 2);
});