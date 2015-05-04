import fs from 'fs';
import url from 'url';
import path from 'path';
import request from 'request';
import getSite from './site-mapping';
import logger from './logger';
import gitRevision from './git-revision';
import {SiteName, ServiceStash} from 'nti.lib.interfaces/CommonSymbols';

let env = null; //until this loads, calling config() should blow up.

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
				desc: 'Liston on port'
			})
			.options('protocol', {
				demand: true,
				default: 'proxy',
				desc: 'Protocol to use (proxy or http)'
			})
			.options('dataserver-host', {
				desc: 'Override DataServer host (this trumps the config)'
			})
			.options('dataserver-port', {
				desc: 'Override DataServer port (this trumps the config)'
			})
			.options('config', {
				demand: true,
				default: '../config/env.json',
				desc: 'URI/path to config file (http/https/file/path)'
			})
			/*eslint no-throw-literal:0*/
			.check(v => {if (v.hasOwnProperty('h')){ throw false; }})
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

	let serverHost = opt['dataserver-host'];
	let serverPort = opt['dataserver-port'];

	let c = override(
		Object.assign({}, env[base], env[process.env.NODE_ENV] || {}), {
			protocol: opt.protocol,
			address: opt.l,
			port: opt.p || env.port,
			revision: gitRevision
		});

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
