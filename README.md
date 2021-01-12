# MathicallJS

MathicallJS is a javascript library that unites different areas of mathematics under a single high-performance API.

[Usage](#usage) &mdash;
[Features](#features) &mdash;
[Documentation](#documentation) &mdash;
[Licence](#licence) &mdash;
[About](#about)

## Usage
The MathicallJS library is currently available as both a static script (`mathicall.js`) and an ES6 module (`mathicall.mjs`), both of which can be found in the `/build` directory. To make use of MathicallJS, download the appropriate file to a convenient location (e.g. your project directory) and load it according to one of the examples below. MathicallJS is not currently available as an `npm` package.

### In HTML page:
#### mathicall.js
Running `mathicall.js` in a HTML page creates a global `Mathicall` object through which you can access the library.
```html
<!-- Run MathicallJS library script -->
<script type="text/javascript" src="path/to/mathicall.js"></script>

<!-- Use library -->
<script type="text/javascript">
	Mathicall.standard.fract(1.577); //0.577
</script>
```

#### mathicall.mjs
Loading the `mathicall.mjs` in a HTML page is not recommended, but possible. The following example creates a `Mathicall` object from the module. Note that due to web-browsers' _CORS_ policy, modules can only be included in HTML pages hosted by a web server; if you're loading a HTML page statically (e.g. using a browser to open a .html file), use the previous `mathicall.js` example.
```html
<!-- Load MathicallJS module inside module script -->
<script type="module">
	import * as Mathicall from "path/to/mathicall.mjs";
	window.Mathicall = Mathicall;
</script>

<!-- Use library through Mathicall object -->
<script type="text/javascript">
	Mathicall.standard.fract(1.577); //0.577
</script>
```

### In module or Node.js
Other ES6 modules and sufficiently-recent Node.js versions (at or above 13.2.0) can include `mathicall.mjs` using normal ES6 syntax:
##### Example 1
```javascript
import * as Mathicall from "path/to/mathicall.mjs";
Mathicall.vector.rect.dot([1, 2], [0.5, 3]); //6.5
```
##### Example 2
```javascript
import * from "path/to/mathicall.mjs";
vector.rect.dot([1, 2], [0.5, 3]); //6.5
```
##### Example 3
```javascript
import {vector} from "path/to/mathicall.mjs";
vector.rect.dot([1, 2], [0.5, 3]); //6.5
```

## Features
- Standard functions (e.g. lerp, mod)
- Vectors
- Matrices
- Random numbers (temporarily unavailable)
- Random noise (temporarily unavailable)
- Complex numbers
- Array operations (e.g. sum)
- Integer operations (e.g. greatest common divisor)

For work-in-progress and proposed features, see [Future development](https://github.com/PatGleeson101/mathicall.js/wiki/Future-development).


## Documentation
Documentation for MathicallJS can be found at its GitHub wiki - see specifically the [Getting started guide](https://github.com/PatGleeson101/mathicall.js/wiki/Getting-started) and the [API documentation](https://github.com/PatGleeson101/mathicall.js/wiki/API-documentation)

## Licence
MathicallJS is provided under the [MIT licence](LICENCE).

## About
### Origin
MathicallJS originally grew from a javascript implementation of 3D [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise) for a terrain-generation project. Attempts to improve performance revealed the benefits of combining efficient algorithms with a knowledge of javascript's quirks and features, as well as the need for interconnection between different mathematical fields to produce tools like Perlin noise. This led to the idea of a javascript API that would allow mathematics to be both fast and interdependent.

### Aim
MathicallJS aims to provide a common, robust API for different areas of mathematics, while maintaining the speed required for data-intensive applications such as image processing and realtime simulation. Specifically, the library aims:

1. _**To provide fast mathematics by implementing efficient algorithms that are tailored to the javascript language.**_
2. _**To provide a consistent, well-structured API that gives simple, powerful control over these functions and how they are combined.**_

A key consideration in the design of MathicallJS is leveraging features and optimisations that are shared by different areas of maths. If this is successful, becoming familiar with just a few [Fundamentals](https://github.com/PatGleeson101/mathicall.js/wiki/Getting-started#Fundamentals) should give access to a wide range of fast mathematics. By making these basic features as intuitive as possible, we hope to make MathicallJS worthwhile even in applications that don't demand high performance.


### Influences
Several other tools have influenced MathicallJS:

- The basic repository structure was inspired by [three.js](https://github.com/mrdoob/three.js/).
- The API structure is similar to python libraries such as [matplotlib](https://matplotlib.org/) and [NumPy](https://numpy.org/).
- The choice, naming, and categorising of several functions were influenced by [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language) and the [TI-84 Plus CE](https://education.ti.com/en-au/products/calculators/graphing-calculators/ti-84-plus-ce) graphing calculator.
- The detachment of debugging from function implementation in order to maintain speed was inspired by the use of validation layers in the [Vulkan API](https://en.wikipedia.org/wiki/Vulkan_(API)).