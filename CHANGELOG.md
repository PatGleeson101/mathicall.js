# Changelog

#### beta-3.0.0
- Introduced changelog
- Switched to using ES6 module syntax instead of function closures, to improve ease of development and installation.
- Switched from building manually to using [rollup.js](https://rollupjs.org/guide/en/).
- Switched to using non-abbreviated sublibrary names (e.g. `vector` replaced `vec`).
- Switched to flattened-array representations of matrices. Flattened data will continue to be standard in future.
- Temporarily removed `random` and `noise` sublibraries, as well as several other functions. These will be reintroduced after being transitioned to the new API structure.
- Moved documentation for all sublibraries to a single [API documentation](https://github.com/PatGleeson101/mathicall.js/wiki/API-documentation) page.
- Updated [README](README.md) and the [Getting started guide](https://github.com/PatGleeson101/mathicall.js/wiki/Getting-started) to reflect changes.