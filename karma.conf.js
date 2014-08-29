'use strict';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/test/helpers/**/*.js',
      'src/test/spec/**/*.js'
    ],
    preprocessors: {
      'src/test/spec/**/*.js': ['webpack']
    },
    webpack: {
	    cache: true,
	    debug: true,
	    devtool: true,

	    stats: {
	        colors: true,
	        reasons: true
	    },

	    resolve: {extensions: ["", ".jsx", ".js", ".css"] },

	    module: {
	        loaders: [{
	            test: /\.css$/,
          loader: 'style/url!url?limit=10000&postfix=.css'
        }, {
          test: /\.gif/,
          loader: 'url-loader?limit=10000&minetype=image/gif'
        }, {
          test: /\.jpg/,
          loader: 'url-loader?limit=10000&minetype=image/jpg'
        }, {
          test: /\.png/,
          loader: 'url-loader?limit=10000&minetype=image/png'
	        }, {
	            test: /\.jsx$/,
	            loader: 'jsx-loader'
	        }]
	    }
    },
    webpackServer: {
      stats: {
        colors: true
      }
    },
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    captureTimeout: 60000,
    singleRun: true
  });
};
