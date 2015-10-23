/*eslint no-var: 0 strict: 0*/
'use strict';
var path = require('path');
var webpack = require('webpack');
var getCodeLoaderConfig = require('./webpack/getCodeLoaderConfig');

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
					getCodeLoaderConfig(/\.js(x)?$/),
					{ test: /\.json$/, loader: 'json' },
					{ test: /\.(html?|sass|s?css|ico|gif|png|jpg|eot|ttf|woff)$/, loader: 'null' }
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
		logLevel: config.LOG_WARN,
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
