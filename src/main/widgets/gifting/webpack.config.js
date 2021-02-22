/*eslint strict: 0, import/no-commonjs:0*/
'use strict';
const path = require('path');

const output = path.resolve(__dirname, 'dist');

const baseConfig = require('@nti/app-scripts/config/webpack.config');

Object.assign(module.exports, baseConfig, {
	name: 'Widget: Gifting',

	output: {
		path: output,
		filename: 'js/main.js',
		chunkFilename: '[id].chunk.js',
		publicPath: './',
	},

	entry: path.resolve(__dirname, 'src', 'js', 'main.js'),
	externals: void 0,

	plugins: baseConfig.plugins,
});
