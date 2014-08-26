/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var merge = require('merge');
var webpack = require('webpack');
var e = [];
var cfg = require("./webpack.config.js");
if (!Array.isArray(cfg)) {
    cfg = [cfg];
}

cfg.forEach(function(o) { e.push(merge(true, o)); });


e[0].debug = false;
e[0].devtool = false;

e[0].plugins.push(
    new webpack.optimize.CommonsChunkPlugin('js/common.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
);


module.exports = e;
