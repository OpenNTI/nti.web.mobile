'use strict';

var env = {};
try {
	env = require('./config/env.json');
} catch(e) {
	console.error('You do not have an environment config file. See: %s/config/env.json.example', __dirname);
}

var merge = require('merge');
var opt = require('optimist')
			.usage('WebApp Instance')

			.options('h', {
				alias: ['?', 'help'],
				desc: 'Usage'
			})
			.options('l', {
		        alias: 'listen',
		        default: '0.0.0.0',
				desc: 'Force server to liston on address'
		    })
			.options('p', {
				alias: 'port',
				default: env.port || undefined,
				desc: 'Liston on port'
			})
			.check(function(v) {if (v.hasOwnProperty('h')) throw false;})
		    .argv;

var overrides = {
	address: opt.l,
	port: opt.p
};


function _override(dest, override) {
	for (var key in override) {
		if(override[key]) {
			dest[key] = override[key];
		}
	}
	return dest;
}


exports.config = function() {
	var node_env = process.env.NODE_ENV,
		base = 'development';

	return _override(
		merge(true, env[base], env[node_env] || {}),
		overrides);
};

exports.clientConfig = function(username) {
	var config = this.config();
	config.username = username;
	return '\n<script type="text/javascript">\n' +
			'window.$AppConfig = ' + JSON.stringify(config) +
			'\n</script>\n';
};
