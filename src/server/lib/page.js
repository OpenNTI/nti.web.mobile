/*eslint strict: 0*/
'use strict';
const logger = require('./logger');

const url = require('url');
const Path = require('path');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

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

exports.getPage = function getPage () {
	let Application;
	let template;
	let scriptFilename = 'js/main.js';
	let revision = require('./git-revision');

	try {
		let app = require('app-renderer');
		scriptFilename = require('../compile-data.json').assetsByChunkName.main;

		Application = app.default;
		revision = app.revision;

	} catch (e) {
		Application = null;
		logger.error('No Server-side Rendering (Because: %s)',
			/Cannot find module \'app-renderer\'/.test(e.message || e) ?
				e.message : e.stack || e.message || e);
	}



	try {

		let file = Path.resolve(__dirname, '../../client/page.html'); //production
		if (!isFile(file)) {
			file = Path.resolve(__dirname, '../../main/page.html'); //dev
		}

		template = fs.readFileSync(file, 'utf8');
	} catch (er) {
		logger.error('%s', er.stack || er.message || er);
		template = 'Could not load page template.';
	}


	return (basePath, req, clientConfig) => {
		let u = url.parse(req.url);
		let manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache"' : '<html';
		let path = u.pathname;
		let cfg = Object.assign({revision}, clientConfig.config || {});
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
};
