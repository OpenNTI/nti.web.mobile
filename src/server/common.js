'use strict';

var env = {};
try {
	env = require('./config/env.json');
} catch(e) {
	console.error('You do not have an environment config file. ' +
					'See: %s/config/env.json.example', __dirname);
}

var assign = Object.assign || require('object-assign');

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
			.check(function(v) {if (v.hasOwnProperty('h')){throw false;}})
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
	var base = 'development';

	return _override(
		assign({}, env[base], env[process.env.NODE_ENV] || {}),
		overrides);
};

exports.clientConfig = function(username) {
	//unsafe to send to client raw... lets reduce it to essentials
	var unsafe = this.config();
	var config = {
		username: username,
		server: unsafe.server,
		basepath: unsafe.basepath,
		flags: unsafe.flags
	};

	return {
		config: unsafe,//used only on server
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
		config: assign({}, config, {
			username: context.username,
			nodeInterface: dontUseMe,
			/* jshint -W106 */
			nodeService: context.__nti_service || noServiceAndThereShouldBe
		})
	};

};
