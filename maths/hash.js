/* MathicallJS module: hash.js
A hash function module

Dependencies: None
*/

var hash = (function(){
	"use strict";

	//Pairing functions
	function szudzikPair(x,y) { //Works for nonnegative integers; maps to nonnegative integers
		if (x < y) {
			return y*y + x;
		} else {
			return x*x + x + y;
		}
	}

	//Bitwise pairing functions
	function bit16Pair(x, y) { //Takes two signed integers in the range +/- 65535 (= 2^16 - 1)
		return (x << 16) | y; //Returns a single signed integer in the range +/- 2147483648 (= 2^31 - 1)
	}

	function bit26Pair(x, y) {
		return x*67108864 | y; //Currently inaccurate
	}

	//Return public functions
	return {
		szudzikPair: szudzikPair,
		bit16Pair: bit16Pair
			};
}());