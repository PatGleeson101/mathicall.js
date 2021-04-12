import {integer} from "../../build/mathicall.module.js";

//Compute factorials
describe("compute factorials", () => {
    test("n < 0 -> empty array", () => {
        expect(integer.computeFactorials(-1)).toEqual([]);
    });
    test("n = 5", () => {
        expect(integer.computeFactorials(5)).toEqual(new Float64Array([1,1,2,6,24,120]));
    });
});

//Factorial
describe("factorial", () => {
    test("n < 0 -> undefined", () => {
        expect(integer.factorial(-1)).toBeUndefined();
    });
    test("n <= 170 (pre-computed)", () => {
        expect(integer.factorial(5)).toBe(120);
    });
    test("n > 170 (overflow)", () => {
        expect(integer.factorial(172)).toBe(Number.MAX_VALUE);
    });
});

//Binomial
describe("choose", () => {
    test("n < 0 -> 0", () => {
        expect(integer.choose(-1, 3)).toBe(0);
    });
    test("n < r -> 0", () => {
        expect(integer.choose(10, 11)).toBe(0);
    });
    test("r < 0 -> 0", () => {
        expect(integer.choose(10, -2)).toBe(0);
    });
    test("n <= 30 (pre-computed)", () => {
        expect(integer.choose(20, 4)).toBe(4845);
    });
    test("n > 30 (generated)", () => {
        expect(integer.choose(100, 5)).toBe(75287520);
    });
});

//Permute
describe("permute", () => {
    test("n < 0 -> 0", () => {
        expect(integer.permute(-1, 3)).toBe(0);
    });
    test("n < r -> 0", () => {
        expect(integer.permute(10, 11)).toBe(0);
    });
    test("r < 0 -> 0", () => {
        expect(integer.permute(10, -2)).toBe(0);
    });
    test("n <= 170 (use pre-computed factorials)", () => {
        expect(integer.permute(20, 4)).toBe(116280);
    });
    test("n > 170, r < 170 (non-overflow)", () => {
        expect(Math.log10(integer.permute(180, 150))).toBeCloseTo(296.8793, 1);
    });
    test("n > 170, r > 170 (overflow)", () => {
        expect(integer.permute(300, 280)).toBeGreaterThanOrEqual(Number.MAX_VALUE);
    });
});

//GCD
describe("gcd", () => {
    test("zero", () => {
        expect(integer.gcd(0, 0)).toBe(0);
        expect(integer.gcd(0, 5)).toBe(5);
        expect(integer.gcd(5, 0)).toBe(5);
        expect(integer.gcd(-10, 0)).toBe(10);
    });
    test("nonzero", () => {
        expect(integer.gcd(10, 5)).toBe(5);
        expect(integer.gcd(113, 7)).toBe(1);
        expect(integer.gcd(200, 80)).toBe(40);
        expect(integer.gcd(-1001, 1313)).toBe(13);
    });
})

//LCM
describe("lcm", () => {
    test("zero", () => {
        expect(integer.lcm(0, 0)).toBe(0);
        expect(integer.lcm(0, 5)).toBe(0);
        expect(integer.lcm(5, 0)).toBe(0);
        expect(integer.lcm(-10, 0)).toBe(0);
    });
    test("nonzero", () => {
        expect(integer.lcm(10, 5)).toBe(10);
        expect(integer.lcm(113, 7)).toBe(791);
        expect(integer.lcm(200, 80)).toBe(400);
        expect(integer.lcm(-1001, 1313)).toBe(101101);
    });
})

//Modular exponentiation
describe("lcm", () => {
    test("positive", () => {
        expect(integer.mpow(7, 6, 3)).toEqual(1);
    });
})