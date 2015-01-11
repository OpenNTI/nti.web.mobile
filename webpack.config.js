/*
 * Webpack development server configuration
 */

'use strict';

var webpack = require('webpack');
var assign = require('object-assign');
var CompressionPlugin = require("compression-webpack-plugin");

var path = require('path');
var fs = require('fs');

var StatsCollector = require('./src/webpack-plugins/stats-collector');

var StyleCollector = path.join(__dirname, 'src', 'server', 'style-collector');
var ES3Recast = '';//path.join(__dirname, 'src', 'webpack-plugins', 'es3recast') + '!';

var scssIncludes =
    'includePaths[]=' + (path.resolve(__dirname, './src/main/resources/vendor/foundation/scss'));

var root = path.join(__dirname,'src','main','js');

var appPackages = {
    dataserverinterface: true
};

var appFontName = /OpenSans.*\-(Cond(Bold|Light)|Regular|Bold)\-.*woff/i;

//TODO: move JS to load through 6to5-loader instead of jsx-loader
var commonLoaders = [
    { test: /\.json$/, loader: 'json' },
    { test: /\.js(x?)$/, loader: ES3Recast + 'jsx?stripTypes&harmony' },

    { test: /\.(ico|gif|png|jpg)$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/[ext]' },

    { test: appFontName, loader: 'url' },

    {
        test: {
            test: function(s) {
                if (/woff$/.test(s)) {
                    return ! appFontName.test(s);
                }

                return /\.(eot|ttf)$/.test(s);
            }
        },
        loader: 'file',
        query: {
            name: 'resources/fonts/[name].[ext]'
        }
    }

];


function isNodeModule(module, context) {
    var file = path.join(context, 'node_modules', module.split('/')[0]);
    var parent = context && context.split('/').slice(0, -1).join('/');
    var nodeBuiltins = {
        path: true,
        fs: true,
        net: true,
        url: true
    };

    if (nodeBuiltins[module]) {
        return true;
    }

    if (!parent || parent === '' || /^(\.|!)/.test(module)) {
        return false;
    }

    return fs.existsSync(file) || isNodeModule(module, parent);
}

fs.readdirSync(root).forEach(function(f) {
    if(fs.statSync(path.join(root, f)).isDirectory()) {
        appPackages[f] = false;//mark it as NOT external
    }
});


function getWidgets() {
    var widgetPath = path.join(__dirname, 'src', 'main', 'widgets');

    var o = {};

    fs.readdirSync(widgetPath).forEach(function(file) {
        if (file === 'example') {return;} //skip the example

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
                path: '<%= pkg.stage %>/widgets/' + k + '/',
                filename: 'main.js',
                chunkFilename: '[id].chunk.js'
            },

            entry: w[k],

            plugins: [
                new webpack.DefinePlugin({
                    SERVER: false,
                    "process.env": {
                        // This has effect on the react lib size
                        "NODE_ENV": JSON.stringify(process.env.NODE_ENV||"development")
                    }
                }),
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.DedupePlugin(),
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
            path: '<%= pkg.stage %>/client/',
            filename: 'js/[hash].js',
            chunkFilename: 'js/[hash]-[id].js',
            publicPath: '<%= pkg.public_root %>'
        },

        cache: true,
        debug: true,
        devtool: 'inline-source-map',

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
            StatsCollector(__dirname),
            new webpack.DefinePlugin({
                SERVER: false,
                "process.env": {
                    // This has effect on the react lib size
                    "NODE_ENV": JSON.stringify(process.env.NODE_ENV||"development")
                }
            })
        ],

        module: {
            loaders: commonLoaders.concat([
                { test: /\.css$/, loader: 'style!css' },
                { test: /\.scss$/, loader: 'style!css!sass?' + scssIncludes }
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
            path: '<%= pkg.stage %>/server/node_modules/page.generated/',
            filename: 'index.js',
            chunkFilename: 'chunk-[id].js',
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
            })
        ],
        externals: [
            appPackages,
            function(context, request, callback) {

                if (/node_modules/i.test(context) || isNodeModule(request, context)){
                    return callback(null, request);
                }

                callback();
            },
        ],
        module: {
            loaders: commonLoaders.concat([
                { test: /\.html$/, loader: 'html?attrs=link:href' },
                { test: /\.css$/,  loader: StyleCollector + '!css' },
                { test: /\.scss$/, loader: StyleCollector + '!css!sass?' + scssIncludes }
            ])
        }
    }
];


includeWidgets(exports);
