/*eslint no-var: 0 strict: 0*/
'use strict';
var path = require('path');
var webpack = require('webpack');

var scssIncludes = 'includePaths[]=' + (path.resolve(__dirname, 'src/main/resources/vendor/foundation/scss'));

var root = path.join(__dirname, 'src', 'main', 'js');

var stat = {
	version: false,
	hash: false,
	timings: false,
	assets: false,
	chunks: false,
	chunkModules: false,
	chunkOrigins: false,
	modules: false,
	cached: false,
	cachedAssets: false,
	showChildren: false,
	source: false,

	colors: true,
	reasons: true,
	errorDetails: true
};


module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'src/test/helpers/**/*.js',
			'src/**/*.spec.js'
		],
		preprocessors: {
			'src/test/helpers/**/*.js': ['webpack'],
			'src/**/*.spec.js': ['webpack', 'sourcemap']
		},
		webpack: {
			quiet: true,
			cache: true,
			debug: true,
			devtool: 'inline-source-map',

			stats: stat,

			node: {
				net: 'empty',
				tls: 'empty'
			},

			resolve: {
				root: root,
				extensions: ['', '.jsx', '.js', '.css', '.scss', '.html']
			},

			plugins: [
				new webpack.DefinePlugin({
					SERVER: false
				})
			],

			module: {
				loaders: [
					{ test: /\.js(x)?$/, loader: 'babel' },
					{ test: /\.json$/, loader: 'json' },
					{ test: /\.ico$/, loader: 'url' },
					{ test: /\.gif$/, loader: 'url' },
					{ test: /\.png$/, loader: 'url' },
					{ test: /\.jpg$/, loader: 'url' },
					{ test: /\.eot$/, loader: 'url' },
					{ test: /\.ttf$/, loader: 'url' },
					{ test: /\.woff$/, loader: 'url' },
					{ test: /\.html$/, loader: 'html' },
					{ test: /\.css$/, loader: 'style!css' },
					{ test: /\.scss$/, loader: 'style!css!sass?' + scssIncludes }
				]
			}
		},
		webpackServer: {
			quiet: true,
			stats: stat
		},

		//coverageReporter: { type: 'html', dir: 'reports/coverage/' },

		htmlReporter: {
			//templatePath: __dirname+'/jasmine_template.html',
			outputDir: 'reports/test-results'
		},

		junitReporter: {
			outputFile: 'reports/test-results.xml',
			suite: ''
		},


		exclude: [],
		port: 8090,
		logLevel: config.LOG_INFO,
		colors: true,
		autoWatch: false,
		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// other possible values: 'dots', 'progress', 'junit', 'html', 'coverage'
		reporters: ['mocha'],
		captureTimeout: 60000,
		singleRun: true
	});
};
