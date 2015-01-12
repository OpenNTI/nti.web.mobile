/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var assign = require('object-assign');

var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
var AppCachePlugin = require('./src/webpack-plugins/appcache');
var StatsCollector = require('./src/webpack-plugins/stats-collector');

var e = [];
var cfg = require("./webpack.config.js");
if (!Array.isArray(cfg)) {
    cfg = [cfg];
}

cfg.forEach(function(o) { e.push(assign({}, o)); });


e[0].plugins = [
    StatsCollector(__dirname),
    new webpack.DefinePlugin({
        SERVER: false,
        "process.env": {
            // This has effect on the react lib size
            "NODE_ENV": JSON.stringify("production")
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
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
        fallback: ['/dataserver2/ offline.json','/ page.html']
    }),
    new CompressionPlugin({
        asset: "{file}.gz",
        algorithm: "gzip",
        regExp: /$/
    })
];


e.forEach(function(x) {
    x.stats = true;
    x.debug = true;
    x.devtool = undefined;
});


module.exports = e;
