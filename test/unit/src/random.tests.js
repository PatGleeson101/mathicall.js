import * as src from "../../../src/random/random.lib.js";
import { log } from "../../../src/core/core.lib.js";

console.log("unif");
console.log(src.unif(1, 3));
console.log(src.unif(1, 3, 10));
console.log("int");
console.log(src.int(1,10));
console.log(src.int(1,10,10));
console.log("exp");
console.log(src.exp(1));
console.log(src.exp(1,10));
console.log("norm");
console.log(src.norm(0,1));
console.log(src.norm(0,1,10));

console.log("MCG");
const mcg = src.MCG(0, 1);
console.log(mcg(), mcg(), mcg());
console.log(mcg.seed( mcg.seed() )); //Reset to same seed
console.log(mcg(3));

console.log("Xorshift32");
const xr = src.Xorshift32(0, 1);
console.log(xr(), xr(), xr());
console.log(xr.seed( xr.seed() ));
console.log(xr(3));

console.log("RU");
const ru = src.RU(0, 1);
console.log(ru(), ru(), ru());
console.log(ru.seed( ru.seed() ));
console.log(ru(3));

console.log("Exp");
const exp = src.Exp(1);
console.log(exp(), exp(), exp());
console.log(exp.seed( exp.seed() ));
console.log(exp(3));