import {random} from "../../build/mathicall.module.js";

import pkg from 'benchmark';
const {Benchmark} = pkg;

var suite = new Benchmark.Suite;

const perlin = random.Perlin2D([0,1], 10258);

// add tests
suite.add('perlin(): 10^6 values', function() {
    for (let x = 0; x < 50; x += 0.05) {
        for (let y = 0; y < 50; y += 0.05) {
            perlin(x, y);
        }
    }
})
.add('perlin.grid(): 10^6 values', function() {
    perlin.grid(0, 0, 1000, 1000, 0.05, 0.05);
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });