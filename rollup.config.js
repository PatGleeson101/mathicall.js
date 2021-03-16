import {terser} from 'rollup-plugin-terser';

export default {
	input: 'src/mathicall.lib.js',
	output: [
		{
			file: 'build/mathicall.js',
			format: 'iife',
			name: 'Mathicall'
		},
		{
			file: 'build/mathicall.module.js',
			format: 'es',
		},
		{
			file: 'build/mathicall.min.js',
			format: 'iife',
			name: 'Mathicall',
			plugins: [terser()]
		}
	]
}