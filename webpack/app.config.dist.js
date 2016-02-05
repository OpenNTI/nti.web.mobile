/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

/*eslint no-var: 0 strict: 0*/
'use strict';

var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var AppCachePlugin = require('./plugins/appcache');
var statsCollector = require('./plugins/stats-collector');

var e = [];

var cfg = require('./app.config.js');

if (!Array.isArray(cfg)) {
	cfg = [cfg];
}

cfg.forEach(function (o) { e.push(Object.assign({}, o)); });


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
	x.stats = {
		// version: true,
		// hash: false,
		// timings: false,
		// assets: false,
		// chunks: false,
		// chunkModules: false,
		// chunkOrigins: false,
		// modules: false,
		// cached: false,
		// cachedAssets: false,
		// showChildren: false,
		// source: false,
		//
		// colors: true,
		// reasons: true,
		// errorDetails: true
	};
	x.debug = false;

	if (x.target === 'web') {

		if (process.env.NODE_ENV === 'production') {
			x.plugins.push(
				new webpack.optimize.UglifyJsPlugin({
					test: /\.js(x?)($|\?)/i,
					compress: { warnings: false }
				})
			);
		}

		x.plugins.push(
			new CompressionPlugin({
				algorithm: 'gzip'
			})
		);
	}
});


module.exports = e;
