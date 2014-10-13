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
			.options('protocol', {
				demand: true,
				default: 'proxy',
				desc: 'Protocol to use (proxy or http)'
			})
			.check(function(v) {if (v.hasOwnProperty('h')) throw false;})
		    .argv;

var overrides = {
	protocol: opt.protocol,
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
	return {
		config: config,
		html:
			'\n<script type="text/javascript">\n' +
			'window.$AppConfig = ' + JSON.stringify(config) +
			'\n</script>\n'
		};
};


function dontUseMe() {
	throw new Error(
		'Use the Service to make your requests. ' +
		'The interface is not meant to be used directly ' +
		'anymore. (So we can centrally manage request contexts.)');
}

function noServiceAndThereShouldBe() {
	throw new Error('No Service.');
}

exports.nodeConfigAsClientConfig = function(config, context) {

	return {
		html: '',
		config: merge(true, config, {
			username: context.username,
			nodeInterface: dontUseMe,
			nodeService: context.__nti_service || noServiceAndThereShouldBe
		})
	};

};
