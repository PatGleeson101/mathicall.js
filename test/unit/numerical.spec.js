import {numerical} from "../../build/mathicall.module.js";

test("deriv", () => {
    function xPlus1Squared(x) {
        return (x + 1) * (x + 1)
    }

    expect(numerical.deriv(xPlus1Squared, 2.5)).toBeCloseTo(7);
});

test("frac", () => {
    expect(numerical.frac(3.728)).toEqual(new Int32Array([466, 125]));
});