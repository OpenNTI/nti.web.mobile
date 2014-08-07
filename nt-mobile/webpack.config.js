/*
* Webpack development server configuration
*
* This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
* the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
*/

'use strict';

var webpack = require('webpack');

module.exports = {
    output: {
        publicPatch: 'dist/',
        path: 'dist/',
        filename: 'js/main.js'
    },

    cache: true,
    debug: true,
    devtool: true,
    entry: './src/main/js/<%= pkg.mainInput %>.jsx',

    stats: {
        colors: true,
        reasons: true
    },

    resolve: {extensions: ["", ".jsx", ".js", ".css"] },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('js/common.js')
    ],

    module: {
        preLoaders: [{
            test: '\\.js$',
            exclude: 'node_modules',
            loader: 'jshint'
        }],

        loaders: [{
            test: /\.css$/,
            loader: 'style/url!url?limit=10&prefix=style/&postfix=.css'
            // loader: 'style!css'
        }, {
            test: /\.jsx$/,
            loader: 'jsx-loader'
        }]
    }
};
