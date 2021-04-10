# Changelog

#### Dev 1.0.0
- Rename `smult` to `scale` in `complex`, `matrix` and `vector` sublibraries.
- Make rectangular form directly accessible through `vector` and `complex` by default. These functions can still be accessed through `vector.rect` and `complex.rect` as well.
- Switch to Jest for unit testing
- Introduce Perlin noise
- Add basic examples

#### beta-4.0.0
- Introduce basic unit testing
- Re-introduce `random` sublibrary
- Introduce new array functions, notably `count(arr, value)`
- Introduce `statistics` and `numerical` sublibraries
- Re-introduce matrix-vector multiplication
- All MathicallJS functions are now frozen, preventing their properties from being modified
- Clearer file naming convention
- Introduce debug mode

#### beta-3.0.0
- Introduced changelog
- Switched to using ES6 module syntax instead of function closures, to improve ease of development and installation.
- Switched from building manually to using [rollup.js](https://rollupjs.org/guide/en/).
- Switched to using non-abbreviated sublibrary names (e.g. `vector` replaced `vec`).
- Switched to flattened-array representations of matrices. Flattened data will continue to be standard in future.
- Temporarily removed `random` and `noise` sublibraries, as well as several other functions. These will be reintroduced after being transitioned to the new API structure.
- Moved documentation for all sublibraries to a single [API documentation](https://github.com/PatGleeson101/mathicall.js/wiki/API-documentation) page.
- Updated [README](README.md) and the [Getting started guide](https://github.com/PatGleeson101/mathicall.js/wiki/Getting-started) to reflect changes.