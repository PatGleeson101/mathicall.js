import {complex} from "../../build/mathicall.module.js";

const rect = complex.rect;

test("Real part", () => {
    expect(rect.real([2, 4])).toBe(2);
});

test("Imaginary part", () => {
    expect(rect.imag([2, 4])).toBe(4);
});

test("Argument", () => {
    expect(rect.arg([0, 0])).toBe(0); //Chosen convention
    expect(rect.arg([0, 1])).toBeCloseTo(Math.PI / 2);
    expect(rect.arg([-1, 0])).toBeCloseTo(Math.PI); //NOT (-PI)
    expect(rect.arg([-1, -0.0001])).toBeCloseTo(-Math.PI);
});

test("Absolute value", () => {
    expect(rect.abs([0, 0])).toBeCloseTo(0);
    expect(rect.abs([3, 4])).toBeCloseTo(5);
    expect(rect.abs([3, -4])).toBeCloseTo(5);
});


test("Conjugate", () => {
    expect(rect.conj([2, 4])).toEqual(new Float64Array([2, -4]));
});

test("Negation", () => {
    expect(rect.negate([2, 4])).toEqual(new Float64Array([-2, -4]));
});

test("Addition", () => {
    expect(rect.add([2, 4], [3, 6])).toEqual(new Float64Array([5, 10]));
});

test("Subtraction", () => {
    expect(rect.sub([2, 4], [3, 6])).toEqual(new Float64Array([-1, -2]));
});

test("Multiplication", () => {
    expect(rect.mult([0, 0], [3, 6])).toEqual(new Float64Array([0, 0]));
    expect(rect.mult([1, 1], [-1, 1])).toEqual(new Float64Array([-2, 0]));
});

test("Scaling", () => {
    expect(rect.scale([8, -3], 3)).toEqual(new Float64Array([24, -9]));
});

test("Division", () => {
    expect(rect.div([1,1],[0,0])).toBeUndefined();
    expect(rect.div([-2, 0], [1, 1])).toEqual(new Float64Array([-1, 1]));
});

test("Inverse", () => {
    expect(rect.inverse([0,0])).toBeUndefined();
    const result = rect.inverse([1, 1]);
    expect(result[0]).toBeCloseTo(0.5);
    expect(result[1]).toBeCloseTo(-0.5);
});

test("Conversion to polar", () => {
    expect(rect.toPolar([1, 0])).toEqual(new Float64Array([1, 0]));
});