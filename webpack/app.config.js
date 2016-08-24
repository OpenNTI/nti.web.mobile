/*eslint strict: 0, no-console: 0*/
'use strict';

const publicPath = '/mobile/';
const outPath = './stage/';

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

const AppCachePlugin = require('appcache-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');

const path = require('path');

const root = path.resolve(__dirname, '..', 'src', 'main', 'js');
const sassRoot = path.resolve(__dirname, '..', 'src', 'main', 'resources', 'scss');
const modules = path.resolve(__dirname, '..', 'node_modules');
const eslintrc = path.resolve(__dirname, '..', '.eslintrc');

const gitRevision = JSON.stringify(require('nti-util-git-rev'));

const ENV = process.env.NODE_ENV || 'development';
const PROD = ENV === 'production';

//fake out the plugin (it does an instanceof test)
const NTI_PACKAGES = Object.assign(new RegExp(''), {
	prefix: `${modules}/nti-`,
	decendent: /node_modules/,

	test (x) {
		let str = x ? x.toString() : '';
		if(str.startsWith(this.prefix)) {
			str = str.substr(this.prefix.length);
			return !this.decendent.test(str);
		}
	}
});



exports = module.exports = [
	{
		name: 'browser',
		output: {
			path: outPath + 'client/',
			filename: 'js/[name]-[hash].js',
			chunkFilename: 'js/[name]-[hash]-[id].js',
			publicPath: publicPath
		},

		cache: true,
		devtool: PROD ? 'hidden-source-map' : 'source-map',

		entry: {
			main: ['whatwg-fetch','./src/main/js/index.js']
		},

		target: 'web',

		resolve: {
			root: [root, modules],
			extensions: ['', '.jsx', '.async.jsx', '.js', '.json', '.css', '.scss', '.html']
		},

		resolveLoader: {
			root: [modules]
		},


		module: {
			preLoaders: [
				// {
				// 	test: /src.main.js.+jsx?$/,
				// 	loader: 'eslint',
				// 	exclude: /node_modules/
				// },
				{
					test: /src.main.js.+jsx?$/,
					loader: 'baggage-loader?[file].scss'
				},
				{
					test: /\.js(x?)$/,
					include: /.+nti\-/,
					loader: 'source-map-loader'
				}
			],
			loaders: [
				{ test: /\.async\.jsx$/i, loader: 'react-proxy-loader!exports-loader?exports.default' },

				{
					test: /\.js(x?)$/i,
					exclude: /.*node_modules.*/,
					include: /src.main.+jsx?$/,
					loader: 'babel-loader',
					query: {
						sourceMaps: true
					}
				},

				{
					test: /\.json$/,
					loader: 'json-loader'
				},

				{
					test: /\.(ico|gif|png|jpg|svg)$/,
					loader: 'url-loader',
					query: {
						limit: 1,
						name: 'resources/images/[name].[ext]',
						mimeType: 'image/[ext]'
					}
				},

				{
					test: /\.(eot|ttf|woff)$/,
					loader: 'file-loader',
					query: {
						name: 'resources/fonts/[name].[ext]'
					}
				},

				{
					test: /\.(s?)css$/,
					loader: ExtractTextPlugin.extract(
						'style-loader',
						'css?-minimize!postcss!resolve-url!sass'
					)
				}
			]
		},

		eslint: {
			configFile: eslintrc,
			emitError: true,
			failOnError: true,
			quiet: true
		},

		postcss: [
			autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'iOS > 8'] })
		],

		sassLoader: {
			sourceMap: true,
			includePaths: [sassRoot]
		},

		plugins: [
			new StatsPlugin('../server/compile-data.json'),
			new AppCachePlugin({
				cache: [
					'page.html',
					'offline.json',
					'resources/images/favicon.ico',
					'resources/images/app-icon.png',
					'resources/images/app-splash.png'
				],
				network: [
					'/dataserver2/',
					'/content/',
					'*'
				],
				fallback: ['/dataserver2/ offline.json', '/ page.html'],
				settings: ['prefer-online'],
				exclude: [],
				output: 'manifest.appcache'
			}),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.OccurenceOrderPlugin(),
			new SplitByPathPlugin([
				{
					name: 'vendor',
					path: modules
				}
			], {
				ignore: [
					NTI_PACKAGES
				]
			}),
			new webpack.DefinePlugin({
				'SERVER': false,
				'BUILD_SOURCE': gitRevision,
				'process.browser': true,
				'process.env': {
					// This has effect on the react lib size
					'NODE_ENV': JSON.stringify(ENV)
				}
			}),
			new ExtractTextPlugin('resources/styles.css', {allChunks: true}),
			PROD && new webpack.optimize.UglifyJsPlugin({
				test: /\.js(x?)($|\?)/i,
				compress: { warnings: false }
			}),
			PROD && new CompressionPlugin({ algorithm: 'gzip' })
		].filter(x => x)
	},
	{
		// The configuration for the server-side rendering
		name: 'server-side rendering',
		entry: './src/main/js/app/View',
		target: 'node',
		output: {
			path: outPath + 'server/node_modules/app-renderer/',
			filename: 'index.js',
			chunkFilename: 'chunk-[id].js',
			publicPath: publicPath,
			library: 'app-renderer',
			libraryTarget: 'commonjs2'
		},
		resolve: {
			root: [root, modules],
			extensions: ['', '.jsx', '.async.jsx', '.js', '.json', '.css', '.scss', '.html']
		},
		plugins: [
			new webpack.DefinePlugin({
				'SERVER': true,
				'BUILD_SOURCE': gitRevision,
				'process.browser': false,
				'process.env': {
					'NODE_ENV': JSON.stringify(ENV)
				}
			})
		],

		externals: [
			{
				url: true,
				path: true,
				fs: true,
				net: true,
				tls: true
			},
			// Every nti module
			/^nti\-/i
		],

		module: {
			loaders: [
				{
					test: /\.js(x?)$/i,
					exclude: /node_modules/,
					loader: 'babel',
					query: {
						sourceMaps: true
					}
				},
				{ test: /\.json$/, loader: 'json' },
				{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url' },
				{ test: /\.(s?)css$/, loader: 'null' }
			]
		}
	}
];
