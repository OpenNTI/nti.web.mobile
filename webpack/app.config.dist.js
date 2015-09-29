/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

/*eslint no-var: 0 strict: 0*/
'use strict';
var assign = require('object-assign');
var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var AppCachePlugin = require('./plugins/appcache');
var statsCollector = require('./plugins/stats-collector');

var e = [];

global.distribution = true;
var cfg = require('./app.config.js');
delete global.distribution;

if (!Array.isArray(cfg)) {
	cfg = [cfg];
}

cfg.forEach(function (o) { e.push(assign({}, o)); });


e[0].plugins.unshift(
	statsCollector(path.resolve(__dirname, '..')),
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
		fallback: ['/dataserver2/ offline.json', '/ page.html']
	})
);


e.forEach(function (x) {
	x.stats = true;
	x.debug = false;

	if (x.target === 'web') {
		x.plugins.push(
			new webpack.optimize.UglifyJsPlugin({ test: /\.js(x?)($|\?)/i }),
			new CompressionPlugin({
				asset: '{file}.gz',
				algorithm: 'gzip',
				regExp: /$/
			})
		);
	}
});


module.exports = e;
