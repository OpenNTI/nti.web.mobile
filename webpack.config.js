/*
 * Webpack development server configuration
 */

'use strict';

var webpack = require('webpack');
var assign = require('object-assign');
var CompressionPlugin = require("compression-webpack-plugin");
var path = require('path');
var fs = require('fs');


var commonLoaders = [
    { test: /\.js$/, loader: 'jsx' },
    { test: /\.jsx$/, loader: 'jsx' },
    { test: /\.json$/, loader: 'json' },
    { test: /\.ico$/, loader: 'url?limit=100000&name=resources/images/[hash].ico&mimeType=image/ico' },
    { test: /\.gif$/, loader: 'url?limit=100000&name=resources/images/[hash].gif&mimeType=image/gif' },
    { test: /\.png$/, loader: 'url?limit=100000&name=resources/images/[hash].png&mimeType=image/png' },
    { test: /\.jpg$/, loader: 'url?limit=100000&name=resources/images/[hash].jpg&mimeType=image/jpeg' },

    { test: /\.eot$/, loader: 'url?limit=1&name=resources/fonts/[name][hash].eot' },
    { test: /\.ttf$/, loader: 'url?limit=1&name=resources/fonts/[name][hash].ttf' },
    { test: /\.woff$/, loader: 'url?limit=1&name=resources/fonts/[name][hash].woff' }
];

var scssIncludes =
    'includePaths[]=' + (path.resolve(__dirname, './src/main/resources/vendor/foundation/scss'));/* + '&' +
    'includePaths[]=' + (path.resolve(__dirname, './src/main/resources/vendor/videojs/dist/video-js'));*/

var root = path.join(__dirname,'src','main','js');

var appPackages = {
    dataserverinterface: true
};

fs.readdirSync(root).forEach(function(f) {
    if(fs.statSync(path.join(root, f)).isDirectory()) {
        appPackages[f] = false;//mark it as NOT external
    }
});


function getWidgets() {
    var widgetPath = path.join(__dirname, 'src', 'main', 'widgets');

    var o = {};

    fs.readdirSync(widgetPath).forEach(function(file) {
        var dir = path.join(widgetPath, file);
        var entry = path.join(dir, 'main.js');
        var isDir = fs.statSync(dir).isDirectory();
        var entryExists = isDir && fs.existsSync(entry);
        if (entryExists) {
            o[file] = entry;
        }
    });

    return o;
}


function includeWidgets(o) {
    var w = getWidgets();
    var v;

    for (var k in w) {
        if (!w.hasOwnProperty(k)) {continue;}

        v = assign({}, o[0], {
            name: 'Widget: '+ k,

            output: {
                path: '<%= pkg.dist %>/widgets/' + k + '/',
                filename: 'main.js',
                chunkFilename: '[id].chunk.js'
            },

            entry: w[k],

            plugins: [
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.UglifyJsPlugin(),
                new CompressionPlugin({
                    asset: "{file}.gz",
                    algorithm: "gzip",
                    regExp: /$/
                })
            ],
        });

        o.push(v);
    }
}


exports = module.exports = [
    {
        name: 'browser',
        output: {
            path: '<%= pkg.dist %>/client/',
            filename: 'js/[hash].js',
            publicPath: '<%= pkg.public_root %>'
        },

        cache: true,
        debug: true,
        devtool: '#source-map',

        entry: '<%= pkg.src %>/js/index.js',

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
            root: root,
            extensions: ['', '.jsx', '.js', '.css', '.scss', '.html']
        },

        plugins: [
            //new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                SERVER: false
            }),
            function(/*compiler*/) {
                this.plugin('done', function(stats) {
                    var p = path.join(__dirname, 'dist', 'server');
                    var file = path.join(p, 'stats.generated.json');
                    try {
                        if (fs.existsSync(p)) {
                            fs.writeFileSync(file, JSON.stringify(stats.toJson()));
                        }
                    } catch (e) {
                        console.warn('Could not write %s', file);
                    }
                });
            }
        ],

        module: {
            loaders: commonLoaders.concat([
                { test: /\.css$/, loader: 'style!css' },
                { test: /\.scss$/, loader: 'style!css!sass?' + scssIncludes
                }
            ])
        }
    },
    {
        // The configuration for the server-side rendering
        name: 'server-side rendering',
        entry: '<%= pkg.src %>/../server/page.js',
        target: 'node',
        bail: true,
        output: {
            path: '<%= pkg.dist %>/server/node_modules/page.generated/',
            filename: 'index.js',
            publicPath: '<%= pkg.public_root %>',
            library: 'page.generated',
            libraryTarget: 'commonjs2'
        },
        resolve: {
            root: root,
            extensions: ['', '.jsx', '.js', '.css', '.scss', '.html']
        },
        plugins: [
            new webpack.DefinePlugin({
                SERVER: true
            }),
        ],
        externals: [
            appPackages//, /^[a-z\-0-9]+$/
        ],
        module: {
            loaders: commonLoaders.concat([
                { test: /\.html$/, loader: 'html?attrs=link:href' },
                { test: /\.css$/,  loader: path.join(__dirname, 'src', 'server', 'style-collector') + '!css' },
                { test: /\.scss$/, loader: path.join(__dirname, 'src', 'server', 'style-collector') +
                    '!css!sass?' + scssIncludes
                }
            ])
        }
    }
];


includeWidgets(exports);
