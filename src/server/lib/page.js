import logger from './logger';

import url from 'url';
import Path from 'path';
import fs from 'fs';
import React from 'react';

const isRootPath = /^\/(?!\/).*/;
const basepathreplace = /(manifest|src|href)="(.*?)"/igm;
const configValues = /<\[cfg\:([^\]]*)\]>/igm;

function injectConfig(cfg, orginal, prop) {
	return cfg[prop] || 'MissingConfigValue';
}


export default function getPage(render) {
	let Application;
	let template;

	if (render) {
		try {
			Application = require('../../main/js/AppView');
		} catch (e) {
			logger.error('No Server-side Rendering (Because: %s)',
				/Cannot find module '\.\.\/main\/js\/AppView'/.test(e.message || e) ?
					e.message : e.stack || e.message || e);
		}
	}


	try {
		//For WebPack... (production)
		template = require('../../main/page');//can't specify the extention otherwise Node will load it, we only want WebPack to find it.
	} catch (e) {
		//For Node... (dev)
		try {
			template = fs.readFileSync(Path.resolve(__dirname, '../../main/page.html'), 'utf8');
		} catch (er) {
			logger.error('%s', er.stack || er.message || er);
			template = 'Could not load page template.';
		}
	}

	template = template.replace(
		/<!--css:site-styles-->/,
		//This path has to be the same depth as the mapped
		'<link href="/resources/css/sites/current/site.css" ' +
		'rel="stylesheet" type="text/css" id="site-override-styles"/>');



	return function(basePath, req, scriptFilename, clientConfig) {
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

				html = React.renderToString(app);
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
