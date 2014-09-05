'use strict';

var merge = require('merge');
var opt = require('optimist')
			.usage('WebApp Instance')
			    .alias('l', 'listen')
				.default('l', '0.0.0.0')
			    .describe('l', 'Liston on address')
				.alias('p', 'port')
				.describe('p', 'Liston on port')
			    .argv;
var env = {};

var overrides = {
	address: opt.l,
	port: opt.p
};


function override(dest, override) {
	for (var key in override) {
		if(override[key]) {
			dest[key] = override[key];
		}
	}
	return dest;
}


try {
	env = require('./config/env.json');
} catch(e) {
	console.error('You do not have an environment config file. See: %s/config/env.json.example', __dirname);
}


exports.config = function() {
	var node_env = process.env.NODE_ENV,
		base = 'development';

	return override(
		merge(true, env[base], env[node_env] || {}),
		overrides);
};

exports.clientConfig = function() {
	var config = this.config();
	return '\n<script type="text/javascript">\n' +
			'window.$AppConfig = ' + JSON.stringify(config) +
			'\n</script>\n';
};
