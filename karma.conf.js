/*eslint no-var: 0 strict: 0*/
'use strict';
var baseConfig = require('nti-unittesting-clientside');
var Progress = require('nti-unittesting-clientside/progress');

module.exports = function (config) {
	baseConfig.webpack.plugins.push(Progress.getPlugin());
	config.set(baseConfig);
};
