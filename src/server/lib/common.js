import getSite from './site-mapping';
import {SiteName, ServiceStash} from 'dataserverinterface/CommonSymbols';

var env = {};

try {
	env = require('../config/env.json');
} catch(e) {
	console.error('You do not have an environment config file. ' +
					'See: %s/config/env.json.example', __dirname);
}

//Use native node require() for optimist since it defines a 'default' property on the exports.
var opt = require('optimist').usage('WebApp Instance')
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
			.check(v => {if (v.hasOwnProperty('h')){throw false;}})
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


export function config() {
	var base = 'development';

	return _override(
		Object.assign({}, env[base], env[process.env.NODE_ENV] || {}),
		overrides);
}

export function clientConfig (username, context) {
	//unsafe to send to client raw... lets reduce it to essentials
	var unsafe = this.config();
	var config = {
		username: username,
		server: unsafe.server,
		basepath: unsafe.basepath,
		flags: unsafe.flags,
		/* jshint -W106 */
		siteName: getSite(context[SiteName])
		/* jshint +W106 */
	};

	return {
		config: unsafe,//used only on server
		html:
			'\n<script type="text/javascript">\n' +
			'window.$AppConfig = ' + JSON.stringify(config) +
			'\n</script>\n'
		};
}


function dontUseMe() {
	throw new Error(
		'Use the Service to make your requests. ' +
		'The interface is not meant to be used directly ' +
		'anymore. (So we can centrally manage request contexts.)');
}

function noServiceAndThereShouldBe() {
	throw new Error('No Service.');
}

export function nodeConfigAsClientConfig (config, context) {
	return {
		html: '',
		config: Object.assign({}, config, {
			username: context.username,
			nodeInterface: dontUseMe,
			/* jshint -W106 */
			siteName: getSite(context[SiteName]),
			nodeService: context[ServiceStash] || noServiceAndThereShouldBe
			/* jshint +W106 */
		})
	};

}
