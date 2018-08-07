import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript'
import json from 'rollup-plugin-json'
import fs from 'fs';
import path from 'path';
import pkg from './package.json'

const libraryName = 'atn'
const src = path.resolve('src');

const onwarn = warning => {
	console.error(
		'Building Rollup produced warnings that need to be resolved. ' +
			'Please keep in mind that the browser build may never have external dependencies!'
	);
	throw new Error(warning.message);
};

function resolveTypescript() {
	return {
		name: 'resolve-typescript',
		resolveId(importee, importer) {
			if (~importee.indexOf('package.json')) return path.resolve('package.json');
			if (
				importer &&
				importer.startsWith(src) &&
				importee[0] === '.' &&
				path.extname(importee) === ''
			) {
				return path.resolve(path.dirname(importer), `${importee}.ts`);
			}
		}
	};
}

export default [{
  input: `src/${libraryName}.ts`,
  onwarn,
  output: [
    { file: pkg.browser, name: camelCase(libraryName), format: 'umd', sourcemap: true },
  ],
  plugins: [
    json(),
    resolveTypescript(),
    typescript({ typescript: require('typescript') }),
    commonjs(),
    resolve({ browser: true }),
    sourceMaps(),
  ],
},{
  input: `src/${libraryName}.ts`,
  onwarn,
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  external: [''],
  plugins: [
    json(),
    resolveTypescript(),
    typescript({ typescript: require('typescript') }),
    commonjs(),
    resolve(),
    sourceMaps(),
  ],
}]
