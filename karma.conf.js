/*eslint no-var: 0 strict: 0*/
'use strict';
var path = require('path');
var webpack = require('webpack');

var root = path.resolve(__dirname, 'src', 'main', 'js');
var modules = path.resolve(__dirname, 'node_modules');


module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'src/test/**/*.js'
		],

		preprocessors: {
			'src/test/**/*.js': ['webpack', 'sourcemap']
		},

		coverageReporter: {
			dir: 'reports/coverage/',
			reporters: [
				{ type: 'html', subdir: 'html' },
				{ type: 'lcov', subdir: 'lcov' },
				{ type: 'cobertura', subdir: '.', file: 'cobertura.xml' },
				{ type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
				{ type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
				{ type: 'text', subdir: '.', file: 'text.txt' },
				{ type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
			]
		},

		htmlReporter: {
			outputDir: 'reports',
			reportName: 'test-results'
		},

		junitReporter: {
			outputDir: 'reports/test-results/',
			outputFile: 'index.xml',
			suite: 'nti-web-mobile',
			useBrowserName: false
		},


		exclude: [],
		port: 8090,
		logLevel: config.LOG_WARN,
		colors: true,
		autoWatch: false,
		browsers: ['PhantomJS'],
		// browsers: ['Chrome'], //to use, you will need: `npm install karma-chrome-launcher`

		// other possible values: 'dots', 'progress', 'junit', 'html', 'coverage'
		reporters: ['mocha'],
		captureTimeout: 60000,
		singleRun: true,


		webpackServer: {
			noInfo: true,
			stats: {
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
			}
		},

		webpack: {
			cache: true,
			debug: true,
			devtool: 'inline-source-map',

			node: {
				crypto: 'empty',
				net: 'empty',
				tls: 'empty'
			},

			resolve: {
				root: [root, modules],
				extensions: ['', '.jsx', '.js', '.css', '.scss', '.html']
			},

			plugins: [
				new webpack.DefinePlugin({SERVER: false})
			],

			module: {
				preLoaders: [
					{
						test: /\.jsx?$/,
						loader: 'isparta-instrumenter',
						exclude: [
							/node_modules/,
							/__test__/,
							/test\//
						]
					}
				],
				loaders: [
					{ test: /\.js(x?)$/i, loader: 'babel', exclude: /node_modules/ },
					{ test: /\.json$/, loader: 'json' },
					{ test: /\.(html?|sass|s?css|ico|gif|png|jpg|eot|ttf|woff)$/, loader: 'null' }
				]
			}
		}
	});
};
