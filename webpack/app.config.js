/*eslint no-var: 0 strict: 0*/
'use strict';

var publicPath = '/mobile/';
var outPath = './stage/';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

var root = path.resolve(__dirname, '..', 'src', 'main', 'js');
var sassRoot = path.resolve(__dirname, '..', 'src', 'main', 'resources', 'scss');
var modules = path.resolve(__dirname, '..', 'node_modules');

var gitRevision = JSON.stringify(require('../src/server/lib/git-revision'));

exports = module.exports = [
	{
		name: 'browser',
		output: {
			path: outPath + 'client/',
			filename: 'js/[hash].js',
			chunkFilename: 'js/[hash]-[id].js',
			publicPath: publicPath//,
			// devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
			// devtoolFallbackModuleFilenameTemplate: 'webpack:///[absolute-resourcePath]?[hash]'
		},

		cache: true,
		devtool: 'source-map',

		entry: './src/main/js/index.js',

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
			root: [root, modules],
			extensions: ['', '.jsx', '.js', '.json', '.css', '.scss', '.html']
		},

		module: {
			preLoaders: [
				{
					test: /src.main.js.+jsx?$/,
					loader: 'baggage?[file].scss'
				},
				{ test: /\.js(x?)$/, loader: 'source-map' }
			],
			loaders: [
				{ test: /\.async\.jsx$/i, loader: 'react-proxy!exports?exports.default' },

				{ test: /\.js(x?)$/i, loader: 'babel', exclude: /node_modules/ },

				{ test: /\.json$/, loader: 'json' },
				{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url?limit=10000&name=resources/images/[name].[ext]&mimeType=image/[ext]' },

				{ test: /\.(eot|ttf|woff)$/, loader: 'file?name=resources/fonts/[name].[ext]' },

				{ test: /\.(s?)css$/, loader: ExtractTextPlugin.extract(
					'style-loader',
					'css?sourceMap&-minimize!autoprefixer!resolve-url!sass?sourceMap'
					)
				}
			]
		},


		sassLoader: {
			sourceMap: true,
			includePaths: [sassRoot]
		},


		plugins: [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.DefinePlugin({
				'SERVER': false,
				'BUILD_SOURCE': gitRevision,
				'process.browser': true,
				'process.env': {
					// This has effect on the react lib size
					'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
				}
			}),
			new webpack.ProvidePlugin({
				'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
			}),
			new ExtractTextPlugin('resources/styles.css', {allChunks: true})
		]
	},
	{
		// The configuration for the server-side rendering
		name: 'server-side rendering',
		entry: './src/server/lib/page.js',
		target: 'node',
		output: {
			path: outPath + 'server/node_modules/page.generated/',
			filename: 'index.js',
			chunkFilename: 'chunk-[id].js',
			publicPath: publicPath,
			library: 'page.generated',
			libraryTarget: 'commonjs2'
		},
		resolve: {
			root: [root, modules],
			extensions: ['', '.jsx', '.js', '.css', '.scss', '.html']
		},
		plugins: [
			new webpack.DefinePlugin({
				'SERVER': true,
				'BUILD_SOURCE': gitRevision,
				'process.browser': false,
				'process.env': {
					'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
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
				request: true,
				'nti-lib-interfaces': true
			}
		],

		module: {
			loaders: [
				{ test: /\.js(x?)$/i, loader: 'babel', exclude: /node_modules/ },
				{ test: /\.json$/, loader: 'json' },
				{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url' },
				{ test: /\.(s?)css$/, loader: 'null' }
			]
		}
	}
];
