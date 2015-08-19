import fs from 'fs';
import url from 'url';
import path from 'path';
import request from 'request';
import getSite from './site-mapping';
import logger from './logger';
import gitRevision from './git-revision';
import {CommonSymbols} from 'nti.lib.interfaces';
let {SiteName, ServiceStash} = CommonSymbols;

let env = null; //until this loads, calling config() should blow up.

//Use native node require() for optimist since it defines a 'default' property on the exports.
let opt = require('yargs')
		.usage('WebApp Instance')
			.options({
				'l': {
					alias: 'listen',
					default: '0.0.0.0',
					desc: 'Force server to liston on address'
				},
				'p': {
					alias: 'port',
					desc: 'Liston on port'
				},
				'protocol': {
					demand: true,
					default: 'proxy',
					desc: 'Protocol to use (proxy or http)'
				},
				'dataserver-host': {
					desc: 'Override DataServer host (this trumps the config)'
				},
				'dataserver-port': {
					desc: 'Override DataServer port (this trumps the config)'
				},
				'config': {
					demand: true,
					default: '../config/env.json',
					desc: 'URI/path to config file (http/https/file/path)'
				}
			})
			.help('help', 'Usage').alias('help', '?')
			.argv;


export function loadConfig () {
	if (!opt.config) {
		return Promise.reject('No config file specified');
	}

	return new Promise((pass, fail)=> {

		let uri = url.parse(opt.config);
		if (uri.protocol == null || uri.protocol === 'file:') {
			uri = opt.config.replace(/^file:\/\//i, '');
			uri = path.resolve(__dirname, uri);
			if (!fs.existsSync(uri)) {
				logger.error('You do not have an environment config file at: ', uri,
					`See: ${path.resolve(__dirname, '../config/env.json.example')}`);
			}
			env = JSON.parse(fs.readFileSync(uri));
			return pass(config());
		}

		request(opt.config, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				try {
					env = JSON.parse(body);
					pass(config());
				} catch (e) {
					logger.error(e);
					fail(e);
				}
			} else {
				fail(error || response);
			}
		});
	});
}



function override (dest, overrides) {
	for (let key in overrides) {
		if(overrides[key]) {
			dest[key] = overrides[key];
		}
	}
	return dest;
}


export function showFlags (config) {
	if (!config.flags) {
		logger.info('No flags configured.');
		return;
	}

	for (let flag of Object.keys(config.flags)) {
		let	value = config.flags[flag];

		if (typeof value === 'object') {
			for (let siteFlag of Object.keys(value)) {
				logger.info('Resolved Flag: (%s) %s =', flag, siteFlag, value[siteFlag]);
			}
			continue;
		}

		logger.info('Resolved Flag: (Global) %s =', flag, value);
	}
}


export function config () {
	let base = 'development';

	let serverHost = opt['dataserver-host'];
	let serverPort = opt['dataserver-port'];

	let c = override(
		Object.assign({}, env[base], env[process.env.NODE_ENV] || {}), {
			protocol: opt.protocol,
			address: opt.l,
			port: opt.p || env.port,
			revision: gitRevision
		});


	if (env[process.env.NODE_ENV] != null) {
		logger.info(`In ${process.env.NODE_ENV} mode`);
	} else {
		logger.error('In default "development" mode. Consider seting NODE_ENV="production"');
	}

	if (serverHost || serverPort) {
		let server = url.parse(c.server);
		server.host = null;
		if (serverHost) {
			server.hostname = serverHost;
		}
		if (serverPort) {
			server.port = serverPort;
		}
		c.server = server.format();
	}

	return c;
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
		siteName: getSite(context[SiteName]),
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


function dontUseMe () {
	throw new Error(
		'Use the Service to make your requests. ' +
		'The interface is not meant to be used directly ' +
		'anymore. (So we can centrally manage request contexts.)');
}

function noServiceAndThereShouldBe () {
	throw new Error('No Service.');
}

export function nodeConfigAsClientConfig (cfg, context) {
	return {
		html: '',
		config: Object.assign({}, cfg, {
			username: context.username,
			nodeInterface: dontUseMe,
			siteName: getSite(context[SiteName]),
			nodeService: context[ServiceStash] || noServiceAndThereShouldBe
		})
	};

}
