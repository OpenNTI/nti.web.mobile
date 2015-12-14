/*eslint no-var: 0 strict: 0*/
'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var fs = require('fs');
var path = require('path');

var distSiteCSS = './dist/client/resources/css/sites';
var stageSiteCSS = './stage/client/resources/css/sites';

function getSites () {
	var sitePath = path.join(__dirname, '..', 'src', 'main', 'resources', 'scss', 'sites');

	var o = {};

	fs.readdirSync(sitePath).forEach(function (file) {
		if (file === 'example') { return; } //skip the example

		var dir = path.join(sitePath, file);
		var entry = path.join(dir, 'site.scss');
		var isDir = fs.statSync(dir).isDirectory();
		var entryExists = isDir && fs.existsSync(entry);
		if (entryExists) {
			o[file] = entry;
		}
	});

	return o;
}



var w = getSites();
var sites = exports = module.exports = [];

for (var k in w) {
	if (!w.hasOwnProperty(k)) {continue; }

	sites.push({
		name: 'Site: ' + k,

		output: {
			path: stageSiteCSS + '/' + k + '/',
			filename: '[hash]',
			chunkFilename: '[hash]-[id].js',
			publicPath: distSiteCSS
		},

		devtool: 'none',

		entry: w[k],

		noInfo: true,
		stats: {
			version: false,
			hash: false,
			// timings: false,
			// assets: false,
			// chunks: false,
			// chunkModules: false,
			// chunkOrigins: false,
			// modules: false,
			// cached: false,
			// cachedAssets: false,
			children: false,
			// colors: true,
			// source: false,
			// reasons: false,
			errorDetails: true
		},

		resolve: {
			extensions: ['', '.js', '.css', '.scss']
		},

		module: {
			loaders: [
				{ test: /\.(ico|gif|png|jpg|svg|woff|eot|ttf)$/, loader: 'url?limit=100000&name=[hash]-[name].[ext]&mimeType=image/[ext]' },
				{ test: /\.(s?)css$/, loader: ExtractTextPlugin.extract(
					'style-loader',
					'css?-minimize!autoprefixer!sass')
				}
			]
		},


		plugins: [
			new ExtractTextPlugin('site.css', {allChunks: true})
		]
	});
}
