/*MathicallJS item: hashing.js
A hash function module

*/

var hashing = (function(){
	function szudzikPair(x,y) { //Does not maximise storage density in the signed-integer world
		if (x < y) {
			return y*y + x;
		} else {
			return x*x + x + y;
		}
	}

	return {szudzikPair: szudzikPair};
}());