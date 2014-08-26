/*
* Webpack development server configuration
*
* This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
* the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
*/

'use strict';

var webpack = require('webpack');
var path = require("path");


var commonLoaders = [
    { test: /\.js$/, loader: "jsx-loader" },
    { test: /\.jsx$/, loader: 'jsx-loader' },
    { test: /\.json$/, loader: 'json-loader' },
    { test: /\.png$/, loader: "url-loader" },
    { test: /\.jpg$/, loader: "file-loader" }
];


module.exports = [
    {
        name: 'browser',
        output: {
            path: "<%= pkg.dist %>",
            filename: "js/[hash].js",
            publicPath: "<%= pkg.public_root %>"
        },

        cache: true,
        debug: true,
        devtool: true,
        entry: '<%= pkg.src %>/js/index.js',

        stats: {
            colors: true,
            reasons: true
        },

        resolve: {extensions: ["", ".jsx", ".js", ".css"] },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin('js/common.js'),
            function(compiler) {
                this.plugin("done", function(stats) {
                    require("fs").writeFileSync(
                        path.join(__dirname, "dist", "server", "stats.generated.json"),
                        JSON.stringify(stats.toJson()));
                });
            }
        ],

        module: {
            preLoaders: [{
                test: '\\.js$',
                exclude: 'node_modules',
                loader: 'jshint'
            }],

            loaders: commonLoaders.concat([
                //{ test: /\.css$/, loader: 'style/url!url?limit=10&prefix=style/&postfix=.css' }
                { test: /\.css$/, loader: "style-loader!css-loader" },
            ])
        }
    },
    {
        // The configuration for the server-side rendering
        name: "server-side rendering",
        entry: '<%= pkg.src %>/../server/page.js',
        target: "node",
        output: {
            path: "<%= pkg.dist %>",
            filename: "server/page.generated.js",
            publicPath: "<%= pkg.public_root %>",
            libraryTarget: "commonjs2"
        },
        resolve: {extensions: ["", ".jsx", ".js", ".css"] },
        externals: /^[a-z\-0-9]+$/,
        module: {
            preLoaders: [{
                test: '\\.js$',
                exclude: 'node_modules',
                loader: 'jshint'
            }],

            loaders: commonLoaders.concat([
                { test: /\.html$/, loader: 'html-loader' },
                { test: /\.css$/,  loader: path.join(__dirname, "src", "server", "style-collector") + "!css-loader" }
            ])
        }
    }
];
