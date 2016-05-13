/*eslint no-var: 0 strict: 0*/
var fs = require('fs');
var path = require('path');

const AppCachePlugin = require('appcache-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');

var baseConfig = require('./app.config')[0];

function getWidgets () {
	var widgetPath = path.join(__dirname, '..', 'src', 'main', 'widgets');

	var o = {};

	fs.readdirSync(widgetPath).forEach(function (file) {
		if (file === 'example') {return; } //skip the example

		var dir = path.join(widgetPath, file);
		var entry = path.join(dir, 'main.js');
		var isDir = fs.statSync(dir).isDirectory();
		var entryExists = isDir && fs.existsSync(entry);
		if (entryExists) {
			o[file] = entry;
		}
	});

	return o;
}


function blacklistedPluginsForWidgets (o) {
	return !(
		o instanceof AppCachePlugin
		|| o instanceof StatsPlugin
		|| o instanceof ExtractTextPlugin //so we can replace it.
		|| o instanceof SplitByPathPlugin
	);
}


function includeWidgets () {
	var w = getWidgets();
	var v;
	var o = [];

	for (var k in w) {
		if (!w.hasOwnProperty(k)) {continue; }

		v = Object.assign({}, baseConfig, {
			name: 'Widget: ' + k,

			output: {
				path: baseConfig.output.path.replace(/\/client.*$/i, '/widgets/' + k + '/'),
				filename: 'main.js',
				chunkFilename: '[id].chunk.js',
				publicPath: './'
			},

			entry: w[k],

			plugins: baseConfig.plugins.filter(blacklistedPluginsForWidgets)
				.concat(new ExtractTextPlugin('styles.css', {allChunks: true}))
		});

		o.push(v);
	}

	return o;
}


module.exports = exports = includeWidgets();
