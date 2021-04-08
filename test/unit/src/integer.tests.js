import * as src from "../../../src/integer/integer.src.js";
import { isEqual } from "../../../src/array/array.src.js";

//Compute factorials
console.log( isEqual(src.computeFactorials(7), [1, 1, 2, 6, 24, 120, 720, 5040]) );

//Factorial
console.log( src.factorial(7) === 5040);

//Binomial
console.log( src.choose(10, 3) === 120);

//Permute
console.log( src.permute(10, 3) === 720);

//GCD
console.log (src.gcd(1001, 1313) === 13);

//LCM
console.log(src.lcm(1001, 1313) === 101101);

//Modular exponentiation
console.log(src.mpow(7, 6, 3) === 1)