/* MathicallJS module: colour.js
Colour functions

Dependencies:
pmath.js
*/

var colour = (function(){
	"use strict";

	//Dependencies
	const lerp = pmath.lerp;
	const round = Math.round;

	//Blending functions
	function blendRGB(rgb1, rgb2, weight) {
		return [round(lerp(rgb1[0], rgb2[0], weight)),
				round(lerp(rgb1[1], rgb2[1], weight)),
				round(lerp(rgb1[2], rgb2[2], weight))];
	}

	//Return public functions
	return {
		blendRGB: blendRGB
	}
}());