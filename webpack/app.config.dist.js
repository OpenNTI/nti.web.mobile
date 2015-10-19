/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

/*eslint no-var: 0 strict: 0*/
'use strict';
if (!Object.assign) {
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function (target) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert first argument to object');
			}

			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) {
					continue;
				}
				nextSource = Object(nextSource);

				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		}
	});
}

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
