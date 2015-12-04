import logger from './logger';

import url from 'url';
import Path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const isRootPath = /^\/(?!\/).*/;
const basepathreplace = /(manifest|src|href)="(.*?)"/igm;
const configValues = /<\[cfg\:([^\]]*)\]>/igm;

function injectConfig (cfg, orginal, prop) {
	return cfg[prop] || 'MissingConfigValue';
}

function isFile (file) {
	try {
		return fs.statSync(file).isFile();
	} catch (e) {
		return false;
	}
}

export default function getPage (render) {
	let Application;
	let template;

	if (render) {
		try {
			Application = require('../../main/js/AppView').default;
		} catch (e) {
			logger.error('No Server-side Rendering (Because: %s)',
				/Cannot find module '\.\.\/main\/js\/AppView'/.test(e.message || e) ?
					e.message : e.stack || e.message || e);
		}
	}



	//For Node... (dev)
	try {
		let cwd = process.argv[1];
		if (isFile(cwd)) {
			cwd = Path.dirname(cwd);
		}

		let file = Path.resolve(cwd, '../client/page.html'); //production
		if (!isFile(file)) {
			file = Path.resolve(cwd, '../main/page.html'); //dev
			if (!isFile(file)) {
				file = Path.resolve(cwd, 'src/main/page.html'); //dev (node .)
			}
		}

		template = fs.readFileSync(file, 'utf8');
	} catch (er) {
		logger.error('%s', er.stack || er.message || er);
		template = 'Could not load page template.';
	}


	return function (basePath, req, scriptFilename, clientConfig) {
		let u = url.parse(req.url);
		let manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache"' : '<html';
		let path = u.pathname;
		let cfg = clientConfig.config || {};
		let html = '';

		let basePathFix = (original, attr, val) => attr + '="' +
				(isRootPath.test(val) ? (basePath || '/') + val.substr(1) : val) + '"';

		if (Application) {
			try {
				global.$AppConfig = cfg;

				let app = React.createElement(Application, {
					path: Path.join(basePath || '', path),
					basePath
				});

				html = ReactDOMServer.renderToString(app);
			}
			finally {
				delete global.$AppConfig;
			}
		}

		html += clientConfig.html;

		let out = template
				.replace(/<html/, manifest)
				.replace(configValues, injectConfig.bind(this, cfg))
				.replace(basepathreplace, basePathFix)
				.replace(/<!--html:server-values-->/i, html)
				.replace(/resources\/styles\.css/, 'resources/styles.css?rel=' + encodeURIComponent(scriptFilename))
				.replace(/js\/main\.js/, scriptFilename);

		return out;
	};
}
