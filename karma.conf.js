'use strict';

var path = require('path');
var webpack = require('webpack');

var scssIncludes = 'includePaths[]=' + (path.resolve(__dirname, 'src/main/resources/vendor/foundation/scss'));

var root = path.join(__dirname,'src','main','js');


module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/test/helpers/**/*.js',
      'src/test/spec/**/*.js'
    ],
    preprocessors: {
      'src/test/spec/**/*.js': ['webpack', 'sourcemaps']
    },
    webpack: {
	    cache: true,
	    debug: true,
        devtool: 'inline-source-map',

	    stats: {
	        colors: true,
	        reasons: true
	    },

        node: {
            net: 'empty',
            tls: 'empty'
        },

        resolve: {
            root: root,
            extensions: ['', '.jsx', '.js', '.css', '.scss', '.html']
        },

        plugins: [
            new webpack.DefinePlugin({
                SERVER: false
            }),
        ],

	    module: {
	        loaders: [
                { test: /\.js$/, loader: 'jsx?stripTypes&harmony' },
                { test: /\.jsx$/, loader: 'jsx?stripTypes&harmony' },
                { test: /\.json$/, loader: 'json' },
                { test: /\.ico$/, loader: 'url?limit=1000000' },
                { test: /\.gif$/, loader: 'url?limit=1000000' },
                { test: /\.png$/, loader: 'url?limit=1000000' },
                { test: /\.jpg$/, loader: 'url?limit=1000000' },
                { test: /\.eot$/, loader: 'url?limit=1000000' },
                { test: /\.ttf$/, loader: 'url?limit=1000000' },
                { test: /\.woff$/, loader: 'url?limit=1000000' },
                { test: /\.html$/, loader: 'html?attrs=link:href' },
                { test: /\.css$/, loader: 'style!css' },
                { test: /\.scss$/, loader: 'style!css!sass?' + scssIncludes }
            ]
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
