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
    { test: /\.ico$/, loader: 'url?limit=10000&name=resources/images/[hash].ico&mimeType=image/ico' },
    { test: /\.gif$/, loader: 'url?limit=10000&name=resources/images/[hash].gif&mimeType=image/gif' },
    { test: /\.png$/, loader: 'url?limit=10000&name=resources/images/[hash].png&mimeType=image/png' },
    { test: /\.jpg$/, loader: 'url?limit=10000&name=resources/images/[hash].jpg&mimeType=image/jpeg' },

    { test: /\.eot$/, loader: 'url?limit=200000&name=resources/fonts/[hash].eot' },
    { test: /\.svg$/, loader: 'url?limit=200000&name=resources/fonts/[hash].svg' },
    { test: /\.ttf$/, loader: 'url?limit=200000&name=resources/fonts/[hash].ttf' },
    { test: /\.woff$/, loader: 'url?limit=200000&name=resources/fonts/[hash].woff' }
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

        resolve: {
            root: path.join(__dirname,'src/main/js'),
            extensions: ['', '.jsx', '.js', '.css', '.scss']
        },

        plugins: [
            //new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin('js/common.js'),
            function(compiler) {
                this.plugin('done', function(stats) {
                    var file = path.join(__dirname, 'dist', 'server', 'stats.generated.json');
                    try {
                        require('fs').writeFileSync(file, JSON.stringify(stats.toJson()));
                    } catch (e) {
                        console.warn('Could not write %s', file);
                    }
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
                { test: /\.html$/, loader: 'html?attrs=link:href' },
                { test: /\.css$/,  loader: path.join(__dirname, 'src', 'server', 'style-collector') + '!css' },
                { test: /\.scss$/,  loader: path.join(__dirname, 'src', 'server', 'style-collector') +
                    '!css!sass?includePaths[]=' +
                    (path.resolve(__dirname, './src/main/resources/vendor/foundation/scss')) }
            ])
        }
    }
];
