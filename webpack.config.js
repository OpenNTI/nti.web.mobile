/*
 * Webpack development server configuration
 */

'use strict';

var webpack = require('webpack');
var path = require('path');


var commonLoaders = [
    { test: /\.js$/, loader: 'jsx' },
    { test: /\.jsx$/, loader: 'jsx' },
    { test: /\.json$/, loader: 'json' },
    { test: /\.png$/, loader: 'url' },
    { test: /\.jpg$/, loader: 'file' }
];


module.exports = [
    {
        name: 'browser',
        output: {
            path: '<%= pkg.dist %>',
            filename: 'js/[hash].js',
            publicPath: '<%= pkg.public_root %>'
        },

        cache: true,
        debug: true,
        devtool: '#source-map',
        entry: [
            // 'webpack-dev-server/client?http://localhost:9001',
            // 'webpack/hot/dev-server',
            '<%= pkg.src %>/js/index.js'
        ],

        target: 'web',
        stats: {
            colors: true,
            reasons: true
        },

        node: {
             net: 'empty',
             tls: 'empty'
        },

        resolve: {extensions: ['', '.jsx', '.js', '.css', '.scss'] },

        plugins: [
            //new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin('js/common.js'),
            function(compiler) {
                this.plugin('done', function(stats) {
                    require('fs').writeFileSync(
                        path.join(__dirname, 'dist', 'server', 'stats.generated.json'),
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
                { test: /\.css$/, loader: 'style!css' },
                { test: /\.scss$/, loader: 'style!css!sass?includePaths[]=' +
                    (path.resolve(__dirname, './src/main/resources/vendor/foundation/scss')) }
            ])
        }
    },
    {
        // The configuration for the server-side rendering
        name: 'server-side rendering',
        entry: '<%= pkg.src %>/../server/page.js',
        target: 'node',
        devtool: 'source-map',
        output: {
            path: '<%= pkg.dist %>',
            filename: 'server/page.generated.js',
            publicPath: '<%= pkg.public_root %>',
            libraryTarget: 'commonjs2'
        },
        resolve: {extensions: ['', '.jsx', '.js', '.css'] },
        externals: /^[a-z\-0-9]+$/,
        module: {
            preLoaders: [{
                test: '\\.js$',
                exclude: 'node_modules',
                loader: 'jshint'
            }],

            loaders: commonLoaders.concat([
                { test: /\.html$/, loader: 'html' },
                { test: /\.css$/,  loader: path.join(__dirname, 'src', 'server', 'style-collector') + '!css' },
                { test: /\.scss$/,  loader: path.join(__dirname, 'src', 'server', 'style-collector') +
                    '!sass?includePaths[]=' +
                    (path.resolve(__dirname, './src/main/resources/vendor/foundation/scss')) }
            ])
        }
    }
];
