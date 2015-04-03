import getSite from './site-mapping';
import {SiteName, ServiceStash} from 'nti.lib.interfaces/CommonSymbols';

let env = {};

try {
	env = require('../config/env.json');
} catch(e) {
	console.error('You do not have an environment config file. ' +
					'See: %s/config/env.json.example', __dirname);
}

//Use native node require() for optimist since it defines a 'default' property on the exports.
let opt = require('optimist').usage('WebApp Instance')
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
			/*eslint no-throw-literal:0*/
			.check(v => {if (v.hasOwnProperty('h')){ throw false; }})
			.argv;

let baseOverrides = {
	protocol: opt.protocol,
	address: opt.l,
	port: opt.p
};


function override(dest, overrides) {
	for (let key in overrides) {
		if(overrides[key]) {
			dest[key] = overrides[key];
		}
	}
	return dest;
}


export function config() {
	let base = 'development';

	return override(
		Object.assign({}, env[base], env[process.env.NODE_ENV] || {}),
		baseOverrides);
}

export function clientConfig (username, context) {
	//unsafe to send to client raw... lets reduce it to essentials
	let unsafe = config();
	let cfg = {
		analytics: unsafe.analytics,
		basepath: unsafe.basepath,
		discussions: unsafe.discussions,
		flags: unsafe.flags,
		server: unsafe.server,
		/* jshint -W106 */
		siteName: getSite(context[SiteName]),
		/* jshint +W106 */
		username: username
	};

	return {
		config: unsafe,//used only on server
		html:
			'\n<script type="text/javascript">\n' +
			'window.$AppConfig = ' + JSON.stringify(cfg) +
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

export function nodeConfigAsClientConfig (cfg, context) {
	return {
		html: '',
		config: Object.assign({}, cfg, {
			username: context.username,
			nodeInterface: dontUseMe,
			/* jshint -W106 */
			siteName: getSite(context[SiteName]),
			nodeService: context[ServiceStash] || noServiceAndThereShouldBe
			/* jshint +W106 */
		})
	};

}
