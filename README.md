# MathicallJS

MathicallJS provides fast maths for applications such as simulation and data processing.

[Usage](#usage) &mdash;
[Features](#features) &mdash;
[Documentation](#documentation) &mdash;
[Licence](#licence) &mdash;
[About](#about)

## Usage
The library is currently available as a static script (`mathicall.js`) or ES6 module (`mathicall.module.js`), both found in the `build/` directory. After downloading the appropriate file to a convenient location, you can load it according to one of the examples below:

### In the browser
Running `mathicall.js` in a HTML page will create a global `Mathicall` object:
```html
<!-- Run MathicallJS library script -->
<script type="text/javascript" src="path/to/mathicall.js"></script>

<!-- Use library -->
<script type="text/javascript">
	Mathicall.standard.fract(1.577); //0.577
</script>
```
Alternatively, a HTML page can load `mathicall.module.js`. Due to web browsers' _CORS_ policy, this is only possible for pages hosted by a web server; for static pages, use the previous `mathicall.js` example.
```html
<!-- Load MathicallJS module inside module script -->
<script type="module">
	import * as Mathicall from "path/to/mathicall.module.js";
	//Use library here...
	Mathicall.array.count([1,4,4,3], 4); //2
	//Or attach it to the window for use elsewhere:
	window.Mathicall = Mathicall;
</script>

<!-- Use library through Mathicall object -->
<script type="text/javascript">
	Mathicall.standard.fract(1.577); //0.577
</script>
```

### Module or Node.js
ES6 modules and sufficiently-recent Node.js versions (at or above 13.2.0) can include `mathicall.module.js` using ES6 syntax:
##### Example 1
```javascript
import * as Mathicall from "path/to/mathicall.module.js";
Mathicall.vector.rect.dot([1, 2], [0.5, 3]); //6.5
```
##### Example 2
```javascript
import * from "path/to/mathicall.module.js";
vector.rect.dot([1, 2], [0.5, 3]); //6.5
```
##### Example 3
```javascript
import {vector} from "path/to/mathicall.module.js";
vector.rect.dot([1, 2], [0.5, 3]); //6.5
```


## Features
- Common functions (e.g. lerp, mod)
- Vectors
- Matrices
- Random numbers
- Perlin noise
- Complex numbers
- Array operations
- Statistics
- Integer operations (e.g. greatest common divisor)

For work-in-progress and proposed features, see [Future development](https://github.com/PatGleeson101/mathicall.js/wiki/Future-development).


## Documentation
Documentation for MathicallJS can be found on its GitHub wiki - see specifically the [Getting started guide](https://github.com/PatGleeson101/mathicall.js/wiki/Getting-started) and [API documentation](https://github.com/PatGleeson101/mathicall.js/wiki/API-documentation).


## Licence
MathicallJS is provided under the [MIT licence](LICENCE).


## About
### Origin
A few years ago I created a simple terrain generator consisting of a basic 3D graphics engine and an implementation of 2D [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise). The project required a combination of good performance and several areas of maths - namely vectors, matrices and random numbers. MathicallJS was designed to make this as easy as possible, by taking advantage of efficient algorithms, javascript's quirks and a thought-out API.

### Aim
MathicallJS aims to provide a common, robust API for different areas of mathematics, while maintaining the speed required for data-intensive applications such as image processing and realtime simulation. Specifically, the library aims to provide:

1. _**Fast mathematics by implementing efficient algorithms tailored to javascript.**_
2. _**A consistent, well-structured API that makes combining these functions as simple and powerful as possible.**_

A key consideration in the design of MathicallJS is leveraging features and optimisations shared by several areas of maths. If this is successful, becoming familiar with just a few [Fundamentals](https://github.com/PatGleeson101/mathicall.js/wiki/Getting-started#Fundamentals) should make it easy to use and combine a large number of fast functions. These basics are hopefully intuitive enough for MathicallJS to be worthwhile even in applications that don't demand high performance.


### Influences
Below are some existing tools which have influenced MathicallJS.

- The repository structure is based on [three.js](https://github.com/mrdoob/three.js/).
- The API structure is similar to python libraries such as [matplotlib](https://matplotlib.org/) and [NumPy](https://numpy.org/).
- Several functions are inspired by counterparts found in [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language), [SciPy](https://www.scipy.org/), the [R](https://www.r-project.org/) language and the [TI-84 Plus CE](https://education.ti.com/en-au/products/calculators/graphing-calculators/ti-84-plus-ce) graphing calculator.
- The detachment of debugging from source functionality was prompted by the use of validation layers in the [Vulkan API](https://en.wikipedia.org/wiki/Vulkan_(API)).