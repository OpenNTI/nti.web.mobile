/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var merge = require('merge');
var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
var AppCachePlugin = require('./src/webpack-plugins/appcache.js');

var e = [];
var cfg = require("./webpack.config.js");
if (!Array.isArray(cfg)) {
    cfg = [cfg];
}

cfg.forEach(function(o) { e.push(merge(true, o)); });


e[0].debug = false;
e[0].devtool = '#source-map';

e[0].plugins.push(
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new AppCachePlugin({
        cache: ['page.html'],
        //network: null,
        fallback: ['/ page.html']
    }),
    new CompressionPlugin({
        asset: "{file}.gz",
        algorithm: "gzip",
        regExp: /$/
    })
);


module.exports = e;
