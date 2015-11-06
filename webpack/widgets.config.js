/*eslint no-var: 0 strict: 0*/
if (!Object.assign) {
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function (target) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert first argument to object');
			}

			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) {
					continue;
				}
				nextSource = Object(nextSource);

				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		}
	});
}


var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var CompressionPlugin = require('compression-webpack-plugin');

var gitRevision = require('../src/server/lib/git-revision');

var baseConfig = require('./app.config')[0];

function getWidgets () {
	var widgetPath = path.join(__dirname, '..', 'src', 'main', 'widgets');

	var o = {};

	fs.readdirSync(widgetPath).forEach(function (file) {
		if (file === 'example') {return; } //skip the example

		var dir = path.join(widgetPath, file);
		var entry = path.join(dir, 'main.js');
		var isDir = fs.statSync(dir).isDirectory();
		var entryExists = isDir && fs.existsSync(entry);
		if (entryExists) {
			o[file] = entry;
		}
	});

	return o;
}


function css (o) {
	var test = o.test;
	return test && !(typeof test === 'function' ? test('foo.css') : test.test('foo.css'));
}


function includeWidgets () {
	var w = getWidgets();
	var v;
	var o = [];

	for (var k in w) {
		if (!w.hasOwnProperty(k)) {continue; }

		v = Object.assign({}, baseConfig, {
			name: 'Widget: ' + k,

			output: {
				path: '<%= pkg.stage %>/' + k + '/',
				filename: 'main.js',
				chunkFilename: '[id].chunk.js'
			},

			entry: w[k],

			plugins: [
				new webpack.optimize.DedupePlugin(),
				new webpack.optimize.OccurenceOrderPlugin(),
				new webpack.DefinePlugin({
					SERVER: false,
					'build_source': gitRevision,
					'process.env': {
						// This has effect on the react lib size
						'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
					}
				}),
				new webpack.optimize.UglifyJsPlugin({ test: /\.js(x?)($|\?)/i }),
				new CompressionPlugin({
					asset: '{file}.gz',
					algorithm: 'gzip',
					regExp: /$/
				})
			],

			module: {
				loaders: baseConfig.module.loaders.filter(css).concat([
					{ test: /\.(s?)css$/, loader: 'style!css?-minimize!autoprefixer!sass' }
				])
			}

		});

		o.push(v);
	}

	return o;
}


module.exports = exports = includeWidgets();
