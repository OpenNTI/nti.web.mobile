'use strict';

module.exports = function(port) {

	var webpackConfig = require('../../webpack.config')[0];

	webpackConfig.output.path = '/';
	webpackConfig.output.publicPath = '/mobile/';
	webpackConfig.output.filename = 'js/main.js';
	webpackConfig.entry = './src/main/js/index.js';

	var WebpackServer = require('webpack-dev-server');
	var webpack = require('webpack');

	var webpackServer = new WebpackServer(webpack(webpackConfig), {
		contentBase: port,
		//hot: true,

		noInfo: false,
		quiet: false,
		lazy: false,
		watchDelay: 1000,
		publicPath: '/',

		stats: {
			version: true,
			hash: true,
			timings: true,

			assets: false,

			chunks: true,
			chunkModules: false,
			chunkOrigins: false,

			modules: false,

			// cached: false,
			// cachedAssets: false,
			// showChildren: false,
			// source: false,

			colors: true,
			reasons: true,
			errorDetails: true
		}
	});

	port += 1;

	return {
		middleware: webpackServer.middleware,
		entry: webpackConfig.output.filename,
		start: function() {
			webpackServer.listen(port, 'localhost', function (err) {
				if (err) {
					console.log(err);
				}

				console.log('WebPack Dev Server listening on port %d', port);
			});
		}
	};
};
