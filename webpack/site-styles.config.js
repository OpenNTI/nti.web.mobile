/*eslint no-var: 0 strict: 0*/
'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var fs = require('fs');
var path = require('path');

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
			path: '<%= pkg.stageSiteCSS %>/' + k + '/',
			filename: '[hash]',
			chunkFilename: '[hash]-[id].js',
			publicPath: '<%= pkg.distSiteCSS %>'
		},

		devtool: 'none',

		entry: w[k],

		resolve: {
			extensions: ['', '.js', '.css', '.scss']
		},

		module: {
			loaders: [
				{ test: /\.(ico|gif|png|jpg|svg|woff|eot|ttf)$/, loader: 'url?limit=100000&name=[hash]-[name].[ext]&mimeType=image/[ext]' },
				{ test: /\.(s?)css$/, loader: ExtractTextPlugin.extract(
					'style-loader',
					'css?-minimize!autoprefixer!sass?')
				}
			]
		},


		plugins: [
			new ExtractTextPlugin('site.css', {allChunks: true})
		]
	});
}
