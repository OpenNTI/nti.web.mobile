'use strict';
var env = require('./config/env.json');
var merge = require('merge');

exports.config = function() {
	var node_env = process.env.NODE_ENV,
		base = 'development';

	return merge(true, env[base], env[node_env] || {});
};

exports.clientConfig = function() {
	var config = this.config();
	return '\n<script type="text/javascript">\n' +
			'window.$AppConfig = ' + JSON.stringify(config) +
			'\n</script>\n';
};
