import {vector} from "../../build/mathicall.module.js";

import pkg from 'benchmark';
const {Benchmark} = pkg;

var dotSuite = new Benchmark.Suite;
 
// add tests
const vec1 = vector.Vector([1, 3]);
const vec2 = vector.Vector([2, -7]);
const arr1 = [1, 2];
const arr2 = [3, 4];
const resultArray = vector.Vector([0, 0]);

dotSuite.add('vector.dot [no target]', function() {
  const result = vector.dot(arr1, arr2);
})
.add('vector.dot2 [no target]', function() {
  const result = vector.dot2(arr1, arr2);
})
.add('vector.dot [target]', function() {
  vector.dot(arr1, arr2, resultArray);
})
.add('vector.dot2 [target]', function() {
  vector.dot2(arr1, arr2, resultArray);
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