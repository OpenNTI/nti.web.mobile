/*eslint no-var: 0 strict: 0*/
'use strict';

var NodeModulesThatNeedCompiling = [
	'react-editor-component',
	'nti\\..+'
];

var webpack = require('webpack');


var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');

var gitRevision = require('../src/server/lib/git-revision');

var scssIncludes =
	'includePaths[]=' + (path.resolve(__dirname, '../src/main/resources/vendor/foundation/scss'));

var root = path.resolve(__dirname, '..', 'src', 'main', 'js');
var modules = path.resolve(__dirname, '..', 'node_modules');

var appFontName = /(icomoon|(OpenSans.*\-(Cond(Bold|Light)|Regular|Bold)\-)).*woff/i;

var commonLoaders = [
	getCodeLoaderConfig(/\.js(x?)$/i),

	{ test: /\.json$/, loader: 'json' },
	{ test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/[ext]' },

	{ test: appFontName, loader: 'url' },
	{
		test: function (s) {
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


function getCodeLoaderConfig (test, loader) {
	return {
		test: test,
		loader: (loader ? loader + '!' : '')
			+ 'babel?optional[]=runtime&plugins[]=' + path.resolve(__dirname, 'plugins/relay'),
		exclude: excludeNodeModulesExceptOurs
	};
}


function isOurModule (s) {
	var ourprojects = NodeModulesThatNeedCompiling.join('|');
	var ours = new RegExp(ourprojects);

	var dir = path.resolve(__dirname, '..');

	if(s.indexOf(dir) === 0) {
		s = s.substr(dir.length);
	}

	if (ours.test(s)) {
		//ignore node_modules in our libraries
		s = s.split(new RegExp('(' + ourprojects + ')/node_modules')).pop();
		//still ours?
		return ours.test(s);
	}
	return false;
}


function excludeNodeModulesExceptOurs (s) {
	if (/(node_modules|resources\/vendor)/.test(s)) {
		return !isOurModule(s);
	}
	return false;
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
			root: [root, modules],
			extensions: ['', '.jsx', '.js', '.json', '.css', '.scss', '.html']
		},

		module: {
			loaders: [
				getCodeLoaderConfig(/\.async\.jsx$/i, 'react-proxy')
			]
				.concat(commonLoaders)
				.concat([
					{ test: /\.(s?)css$/, loader: ExtractTextPlugin.extract(
						'style-loader',
						(global.distribution
							? 'css?-minimize!autoprefixer!sass?'
							: 'css?sourceMap!autoprefixer!sass?sourceMap&'
						) + scssIncludes )
					}
				])
		},


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
			new ExtractTextPlugin('resources/styles.css', {allChunks: true})
		]
	},
	{
		// The configuration for the server-side rendering
		name: 'server-side rendering',
		entry: '<%= pkg.src %>/../server/lib/page.js',
		target: 'node',
		output: {
			path: '<%= pkg.stage %>/server/node_modules/page.generated/',
			filename: 'index.js',
			chunkFilename: 'chunk-[id].js',
			publicPath: '<%= pkg.public_root %>',
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
			loaders: commonLoaders.concat([
				{ test: /\.html$/, loader: 'html?attrs=link:href' },
				{ test: /\.(s?)css$/, loader: 'null' }
			])
		}
	}
];
