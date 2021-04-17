import {vector} from "../../build/mathicall.module.js";

const polar = vector.polar;


test("Dot product", () => {
    expect(polar.dot2([1, 0], [1, Math.PI])).toBe(-1);
});


test("Magnitude", () => {
    expect(polar.mag([3.57, Math.PI / 2])).toBeCloseTo(3.57);
});


test("Scaling", () => {
    //Positive factor
    expect(polar.scale2([3.57, Math.PI / 2], 5)[0]).toBeCloseTo(17.85);
    //Negative factor
    expect(polar.scale2([3.57, Math.PI / 2], -5)[1]).toBeCloseTo(3 * Math.PI / 2);
});


test("Normalizing", () => {
    //Undefined cases
    expect(polar.normalize2([0, 0])).toBeUndefined();
    //Regular cases
    expect(polar.mag(polar.normalize2([1.67, Math.PI]))).toBeCloseTo(1);
});