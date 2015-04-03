/*
 * Webpack development server configuration
 */
 /*eslint no-var: 0*/
'use strict';

var NodeModulesThatNeedCompiling = [
	'react-editor-component',
	'nti\\..+'
	];

var webpack = require('webpack');
var assign = require('object-assign');
var CompressionPlugin = require("compression-webpack-plugin");

var path = require('path');
var fs = require('fs');

var StyleCollector = path.join(__dirname, 'src', 'server', 'lib', 'style-collector');

var scssIncludes =
	'includePaths[]=' + (path.resolve(__dirname, './src/main/resources/vendor/foundation/scss'));

var root = path.join(__dirname, 'src', 'main', 'js');

var appFontName = /OpenSans.*\-(Cond(Bold|Light)|Regular|Bold)\-.*woff/i;

var commonLoaders = [
	{ test: /\.json$/, loader: 'json' },
	{ test: /\.js(x?)$/,
		loader: 'babel?optional=runtime',
		exclude: excludeNodeModulesExceptOurs
	},

	{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/[ext]' },

	{ test: appFontName, loader: 'url' },
	{
		test: function(s) {
			if (/woff$/.test(s)) {
				return !appFontName.test(s);
			}

			return /\.(eot|ttf)$/.test(s);
		},
		loader: 'file',
		query: {
			name: 'resources/fonts/[name].[ext]'
		}
	}

];


function isOurModule (s) {
	var ourprojects = NodeModulesThatNeedCompiling.join('|');

	if(s.indexOf(__dirname) === 0) {
		s = s.substr(__dirname.length);
	}

	if (new RegExp(ourprojects).test(s)) {
		return !(new RegExp('('+ourprojects+')/node_modules').test(s));
	}
	return false;
}


function excludeNodeModulesExceptOurs(s) {
	if (/(node_modules|resources\/vendor)/.test(s)) {
		return !isOurModule(s);
	}
	return false;
}


function getWidgets() {
	var widgetPath = path.join(__dirname, 'src', 'main', 'widgets');

	var o = {};

	fs.readdirSync(widgetPath).forEach(function(file) {
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


function includeWidgets(o) {
	var w = getWidgets();
	var v;

	for (var k in w) {
		if (!w.hasOwnProperty(k)) {continue; }

		v = assign({}, o[0], {
			name: 'Widget: '+ k,

			output: {
				path: '<%= pkg.stage %>/widgets/' + k + '/',
				filename: 'main.js',
				chunkFilename: '[id].chunk.js'
			},

			entry: w[k],

			plugins: [
				new webpack.DefinePlugin({
					SERVER: false,
					"process.env": {
						// This has effect on the react lib size
						"NODE_ENV": JSON.stringify(process.env.NODE_ENV||"development")
					}
				}),
				new webpack.optimize.OccurenceOrderPlugin(),
				new webpack.optimize.DedupePlugin(),
				new webpack.optimize.UglifyJsPlugin(),
				new CompressionPlugin({
					asset: "{file}.gz",
					algorithm: "gzip",
					regExp: /$/
				})
			]
		});

		o.push(v);
	}
}


exports = module.exports = [
	{
		name: 'browser',
		output: {
			path: '<%= pkg.stage %>/client/',
			filename: 'js/[hash].js',
			chunkFilename: 'js/[hash]-[id].js',
			publicPath: '<%= pkg.public_root %>'
		},

		cache: true,
		debug: true,
		devtool: 'source-map',

		entry: '<%= pkg.src %>/js/index.js',

		target: 'web',
		stats: {
			colors: true,
			reasons: true
		},

		node: {
			net: 'empty',
			tls: 'empty',
			request: 'empty'
		},
		externals: [
			{
				request: true
			}
		],

		resolve: {
			root: root,
			extensions: ['', '.jsx', '.js', '.json', '.css', '.scss', '.html']
		},


		plugins: [
			//new webpack.HotModuleReplacementPlugin(),
			new webpack.optimize.DedupePlugin(),
			new webpack.DefinePlugin({
				SERVER: false,
				"process.env": {
					// This has effect on the react lib size
					"NODE_ENV": JSON.stringify(process.env.NODE_ENV||"development")
				}
			})
		],

		module: {
			loaders: commonLoaders.concat([
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.scss$/, loader: 'style!css!sass?' + scssIncludes }
			])
		}
	},
	{
		// The configuration for the server-side rendering
		name: 'server-side rendering',
		entry: '<%= pkg.src %>/../server/lib/page.js',
		target: 'node',
		bail: true,
		output: {
			path: '<%= pkg.stage %>/server/node_modules/page.generated/',
			filename: 'index.js',
			chunkFilename: 'chunk-[id].js',
			publicPath: '<%= pkg.public_root %>',
			library: 'page.generated',
			libraryTarget: 'commonjs2'
		},
		resolve: {
			root: root,
			extensions: ['', '.jsx', '.js', '.css', '.scss', '.html']
		},
		plugins: [
			new webpack.DefinePlugin({
				SERVER: true,
				"process.env": {
					// This has effect on the react lib size
					"NODE_ENV": JSON.stringify(process.env.NODE_ENV||"development")
				}
			})
		],

		externals: [
			{
				url: true,
				path: true,
				fs: true,
				net: true,
				tls: true,
				request: true
			}
		],

		module: {
			loaders: commonLoaders.concat([
				{ test: /\.html$/, loader: 'html?attrs=link:href' },
				{ test: /\.css$/, loader: StyleCollector + '!css' },
				{ test: /\.scss$/, loader: StyleCollector + '!css!sass?' + scssIncludes }
			])
		}
	}
];


includeWidgets(exports);
