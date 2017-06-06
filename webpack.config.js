/*eslint strict: 0, no-console: 0, import/no-unresolved: 0*/
'use strict';
const path = require('path');

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const AppCachePlugin = require('appcache-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const gitRevision = JSON.stringify(require('nti-util-git-rev'));


const publicPath = '/mobile/';

const outPath = path.resolve(__dirname, 'dist') + '/';
const root = path.resolve(__dirname, 'src', 'main', 'js');
const modules = path.resolve(__dirname, 'node_modules');
const sassRoot = path.resolve(__dirname, 'src', 'main', 'resources', 'scss');
// const eslintrc = path.resolve(__dirname, '.eslintrc');


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
		// devtool: PROD ? 'hidden-source-map' : 'source-map',
		devtool: 'cheap-module-source-map',

		entry: {
			main: [
				// 'whatwg-fetch',
				'./src/main/js/index.js'
			]
		},

		externals: [
			{
				'react' : 'React',
				'react-dom': 'ReactDOM'
			}
		],

		target: 'web',

		resolve: {
			modules: [root, modules],
			extensions: ['.jsx', '.async.jsx', '.js', '.json', '.css', '.scss', '.html']
		},

		module: {
			rules: [
				// {
				// 	test: /src.main.js.+jsx?$/,
				// 	loader: 'eslint',
				// 	enforce: 'pre',
				// 	exclude: /node_modules/
				// 	options: {
				// 		configFile: eslintrc,
				// 		emitError: true,
				// 		failOnError: true,
				// 		quiet: true
				// 	}
				// },
				{
					test: /src.main.js.+jsx?$/,
					loader: 'baggage-loader',
					options: {
						'[file].scss':{}
					}
				},
				{
					test: /\.js(x?)$/,
					enforce: 'pre',
					include: /nti\-/,
					loader: 'source-map-loader'
				},

				{
					test: /\.async\.jsx$/i,
					loader: 'react-proxy-loader'
				},

				{
					test: /\.js(x?)$/i,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},

				{
					test: /\.(ico|gif|png|jpg|svg)$/,
					loader: 'url-loader',
					options: {
						limit: 1,
						name: 'resources/images/[name].[ext]',
						mimeType: 'image/[ext]'
					}
				},

				{
					test: /\.(eot|ttf|woff)$/,
					loader: 'file-loader',
					options: {
						name: 'resources/fonts/[name].[ext]'
					}
				},

				{
					test: /\.(s?)css$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									sourceMap: true
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									sourceMap: true,
									plugins: () => [
										autoprefixer({ browsers: ['> 1% in US', 'last 2 versions', 'iOS > 8'] })
									]
								}
							},
							{
								loader: 'resolve-url-loader',
								options: {
									// debug:true,
									// silent: false,
									sourceMap: true,
									root: __dirname
								}
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: true,
									includePaths: [sassRoot]
								}
							}
						]
					})
				}
			]
		},

		plugins: [
			new webpack.EnvironmentPlugin({
				NODE_ENV: PROD ? 'production' : 'development'
			}),

			PROD && new StatsPlugin('../server/compile-data.json'),

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

			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				// names: ['vendor', 'manifest'],
				// children: true,
				minChunks: (module) => (
					module.context
					&& /node_modules/.test(module.context)
					&& !NTI_PACKAGES.test(module.context)
				)
			}),

			new ExtractTextPlugin({
				filename: 'resources/styles.css',
				allChunks: true,
				disable: false
			}),

			new webpack.DefinePlugin({
				'BUILD_SOURCE': gitRevision,
			}),

			PROD && new webpack.optimize.UglifyJsPlugin({
				test: /\.js(x?)($|\?)/i,
				compress: { warnings: false }
			}),

			// PROD && new CompressionPlugin({ algorithm: 'gzip' })
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
			extensions: ['.jsx', '.async.jsx', '.js', '.json', '.css', '.scss', '.html']
		},
		plugins: [
			new webpack.EnvironmentPlugin({
				NODE_ENV: 'production'
			}),

			new webpack.DefinePlugin({
				'BUILD_SOURCE': gitRevision,
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
			/^nti\-common/i,
			/^nti\-lib-interfaces/i,
			/^nti\-util-logger/i
		],

		module: {
			rules: [
				{
					test: /\.js(x?)$/i,
					exclude: /node_modules/,
					loader: 'babel',
					query: {
						sourceMaps: true
					}
				},
				{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url' },
				{ test: /\.(s?)css$/, loader: 'null' }
			]
		}
	}
];
