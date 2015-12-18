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

var getCodeLoaderConfig = require('./getCodeLoaderConfig');
var gitRevision = require('../src/server/lib/git-revision');

var appFontName = /(icomoon.*|(OpenSans.*woff))/i;

exports = module.exports = [
	{
		name: 'browser',
		output: {
			path: outPath + 'client/',
			filename: 'js/[hash].js',
			chunkFilename: 'js/[hash]-[id].js',
			publicPath: publicPath
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
				}
			],
			loaders: [
				{ test: /\.async\.jsx$/i, loader: 'react-proxy'},

				getCodeLoaderConfig(/\.js(x?)$/i),

				{ test: /\.json$/, loader: 'json' },
				{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/[ext]' },

				{ test: appFontName, loader: 'url' },
				{
					test (s) {
						return !appFontName.test(s) && /\.(eot|ttf|woff)$/.test(s);
					},
					loader: 'file',
					query: {
						name: 'resources/fonts/[name].[ext]'
					}
				},

				{ test: /\.(s?)css$/, loader: ExtractTextPlugin.extract(
					'style-loader',
					(global.distribution
						? 'css?sourceMap&-minimize!autoprefixer!sass'
						: 'css?sourceMap!autoprefixer!sass'
					))
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
				SERVER: false,
				'build_source': gitRevision,
				'process.env': {
					// This has effect on the react lib size
					'NODE_ENV': JSON.stringify(global.distribution
						? 'production'
						: (process.env.NODE_ENV || 'development')
					)
				}
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
				SERVER: true,
				'build_source': gitRevision,
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
				request: true
			}
		],

		module: {
			loaders: [
				getCodeLoaderConfig(/\.js(x?)$/i),
				{ test: /\.json$/, loader: 'json' },
				{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url' },
				{ test: /\.(s?)css$/, loader: 'null' }
			]
		}
	}
];
