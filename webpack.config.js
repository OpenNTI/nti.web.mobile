/*
 * Webpack development server configuration
 */

'use strict';

var webpack = require('webpack');
var assign = require('object-assign');
var CompressionPlugin = require("compression-webpack-plugin");

var path = require('path');
var fs = require('fs');

var styleCollector = path.join(__dirname, 'src', 'server', 'style-collector');
var es3Rescast = path.join(__dirname, 'src', 'webpack-plugins', 'es3recast') + '!';

var scssIncludes =
    'includePaths[]=' + (path.resolve(__dirname, './src/main/resources/vendor/foundation/scss'));

var root = path.join(__dirname,'src','main','js');

var appPackages = {
    dataserverinterface: true
};

var appFontName = /OpenSans.*\-(Cond(Bold|Light)|Regular|Bold)\-.*woff/i;

var commonLoaders = [
//TODO: move JS to load through 6to5-loader instead of jsx-loader
    { test: /\.js$/, loader: es3Rescast + 'jsx?stripTypes&harmony' },
    { test: /\.jsx$/, loader: es3Rescast + 'jsx?stripTypes&harmony' },
    { test: /\.json$/, loader: 'json' },

    { test: /\.ico$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/ico' },
    { test: /\.gif$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/gif' },
    { test: /\.png$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/png' },
    { test: /\.jpg$/, loader: 'url?limit=100000&name=resources/images/[name].[ext]&mimeType=image/jpeg' },

    { test: appFontName, loader: 'url' },

    { test: /\.eot$/, loader: 'file?name=resources/fonts/[name].[ext]' },
    { test: /\.ttf$/, loader: 'file?name=resources/fonts/[name].[ext]' },
    {
        test: {
            test: function(s) {
                if (/woff$/.test(s)) {
                    return ! appFontName.test(s);
                }
            }
        },
        loader: 'file',
        query: {
            name: 'resources/fonts/[name].[ext]'
        }
    }

];


fs.readdirSync(root).forEach(function(f) {
    if(fs.statSync(path.join(root, f)).isDirectory()) {
        appPackages[f] = false;//mark it as NOT external
    }
});


function StyleCollector(/*compiler*/) {
    this.plugin('done', function(stats) {
        var p = path.join(__dirname, 'stage', 'server');
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
                    SERVER: false
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
            StyleCollector,//must be first in plugins
            //new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                SERVER: false,
                "process.env": {
                    // This has effect on the react lib size
                    "NODE_ENV": JSON.stringify("development")
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
                SERVER: true,
                "process.env": {
                    // This has effect on the react lib size
                    "NODE_ENV": JSON.stringify("production")
                }
            })
        ],
        externals: [
            appPackages//, /^[a-z\-0-9]+$/
        ],
        module: {
            loaders: commonLoaders.concat([

                { test: /\.html$/, loader: 'html?attrs=link:href' },

                { test: /\.css$/,  loader: styleCollector + '!css' },
                { test: /\.scss$/, loader: styleCollector +
                    '!css!sass?' + scssIncludes
                }
            ])
        }
    }
];


includeWidgets(exports);
