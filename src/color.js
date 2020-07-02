/* MathicallJS module: color.js

Dependencies: std
*/

var color = (function(){
	"use strict";

	//Dependencies
	const lerp = std.lerp;
	const mod = std.mod;
	const round = Math.round;
	const min = Math.min;
	const max = Math.max;
	const floor = Math.floor;
	const abs = Math.abs

	//Colour conversion
	function RGBtoHSL(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		const cmax = max(r, g, b);
		const cmin = min(r, g, b);
		const delta = cmax - cmin;

		let h = 0;
		switch (cmax) {
			case cmin:
				break;
			case r:
				h = ((g - b) / delta) % 6;
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			case b:
				h = (r - g) / delta + 4;
		}
		h = round(h * 60);
		if (h < 0) {h += 360};

		let l = 0.5 * (cmax + cmin);
		let s = delta / (1 - abs(2 * l - 1));

		s = +(s * 100).toFixed(1);
  		l = +(l * 100).toFixed(1);
  		return [h, s, l];
	}

	function HSLtoRGB(h, s, l) {
		s /= 100;
		l /= 100;
		h = mod(h, 360);
		let c = (1 - abs(2 * l - 1)) * s;
		let x = c * (1 - abs((h / 60) % 2 - 1));
		let m = l - c/2;
		let r = 0;
		let g = 0;
		let b = 0;

		switch(floor(h/60)) {
			case 0:
				r = c; g = x; b = 0;
				break;
			case 1:
				r = x; g = c; b = 0;
				break;
			case 2:
				r = 0; g = c; b = x;
				break;
			case 3:
				r = 0; g = x; b = c;
				break;
			case 4:
				r = x; g = 0; b = c;
				break;
			case 5:
				r = c; g = 0; b = x;
				break;
		}
		r = round((r + m) * 255);
  		g = round((g + m) * 255);
  		b = round((b + m) * 255);
  		return [r, g, b];
	}

	//Values to string
	function rgbStr(r, g, b) {
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	function rgbaStr(r, g, b, a) {
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	}

	function hexStr(r, g, b) {
		r = r.toString(16);
		g = g.toString(16);
		b = b.toString(16);
		if (r.length == 1) {r = "0" + r}
		if (g.length == 1) {g = "0" + g}
		if (b.length == 1) {b = "0" + b}
		return "#" + r + g + b;
	}

	function hexaStr(r, g, b, a) {
		r = r.toString(16);
		g = g.toString(16);
		b = b.toString(16);
		a = a.toString(16);
		if (r.length == 1) {r = "0" + r}
		if (g.length == 1) {g = "0" + g}
		if (b.length == 1) {b = "0" + b}
		if (a.length == 1) {a = "0" + a}
		return "#" + r + g + b + a;
	}

	//Blending functions
	function mixRGB(rgb1, rgb2, weight) {
		return [round(lerp(rgb1[0], rgb2[0], weight)),
				round(lerp(rgb1[1], rgb2[1], weight)),
				round(lerp(rgb1[2], rgb2[2], weight))];
	}

	//Return public functions
	return {
		RGBtoHSL: RGBtoHSL,
		HSLtoRGB: HSLtoRGB,
		rgbStr: rgbStr,
		rgbaStr: rgbaStr,
		hexStr: hexStr,
		hexaStr: hexaStr,
		mixRGB: mixRGB
		};
}());