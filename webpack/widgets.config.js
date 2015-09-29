/*eslint no-var: 0 strict: 0*/
var assign = require('object-assign');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var CompressionPlugin = require('compression-webpack-plugin');

var gitRevision = require('../src/server/lib/git-revision');

var baseConfig = require('./app.config')[0];

var scssIncludes =
	'includePaths[]=' + (path.resolve(__dirname, '../src/main/resources/vendor/foundation/scss'));

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

		v = assign({}, baseConfig, {
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
					{ test: /\.(s?)css$/, loader: 'style!css?-minimize!autoprefixer!sass?' + scssIncludes }
				])
			}

		});

		o.push(v);
	}

	return o;
}


module.exports = exports = includeWidgets();
