import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import { readFileSync } from 'fs';
import path from 'path';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);
const dedupe = importee => importee === 'svelte' || importee.startsWith('svelte/');


export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				preprocess: {
					style: ({ content = '', attributes, filename }) => {

						// Read all src attributes and add content to the page
						if ( attributes.src ) {
							const base = path.dirname( filename );
							const styles = path.basename( attributes.src );
							const stylesPath = path.join( base, styles );
							content = readFileSync( stylesPath ).toString();
						}

						return {
							code: content
						}
					}
				},
				dev,
				hydratable: true,
				emitCss: true
			}),
			resolve({
				browser: true,
				dedupe
			}),
			commonjs(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				preprocess: {
					style: ({ content = '', attributes, filename }) => {
						
						// Read all src attributes and add content to the page
						if ( attributes.src ) {
							const base = path.dirname( filename );
							const styles = path.basename( attributes.src );
							const stylesPath = path.join( base, styles );
							content = readFileSync( stylesPath ).toString();
						}

						return {
							code: content
						}
					}
				},
				generate: 'ssr',
				dev
			}),
			resolve({
				dedupe
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		],

		onwarn
	}
};
