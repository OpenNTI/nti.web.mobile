/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var merge = require('merge');
var webpack = require('webpack');
var e = module.exports = merge(true, require("./webpack.config.js"));

e.debug = false;
e.devtool = false;

e.plugins = [
    new webpack.optimize.CommonsChunkPlugin('js/common.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
];
