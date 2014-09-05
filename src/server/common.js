'use strict';

var env = {};
var merge = require('merge');

try {
	env = require('./config/env.json');
} catch(e) {
	console.error('You do not have an environment config file. See: %s/config/env.json.example', __dirname);
}


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
