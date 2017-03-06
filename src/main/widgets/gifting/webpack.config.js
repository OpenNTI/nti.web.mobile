/*eslint strict: 0*/
const path = require('path');

const output = path.resolve(__dirname, 'dist');

const AppCachePlugin = require('appcache-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');

const baseConfig = require('../../../../webpack.config')[0];

function blacklistedPluginsForWidgets (o) {
	return !(
		o instanceof AppCachePlugin
		|| o instanceof StatsPlugin
		|| o instanceof SplitByPathPlugin
	);
}

Object.assign(module.exports, baseConfig, {
	name: 'Widget: Gifting',

	output: {
		path: output,
		filename: 'js/main.js',
		chunkFilename: '[id].chunk.js',
		publicPath: './'
	},

	entry: path.resolve(__dirname, 'src', 'js', 'main.js'),
	externals: void 0,

	plugins: baseConfig.plugins
		.filter(blacklistedPluginsForWidgets)
});
