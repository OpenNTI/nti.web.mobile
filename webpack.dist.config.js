/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var merge = require('merge');
var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");

var e = [];
var cfg = require("./webpack.config.js");
if (!Array.isArray(cfg)) {
    cfg = [cfg];
}

cfg.forEach(function(o) { e.push(merge(true, o)); });


e[0].debug = false;
e[0].devtool = false;

e[0].plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
            asset: "{file}.gz",
            algorithm: "gzip",
            regExp: /\.js$|\.html$/
        })
);


module.exports = e;
