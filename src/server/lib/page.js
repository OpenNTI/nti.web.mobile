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

const unwrap = x => Array.isArray(x) ? x[0] : x;

exports.getPage = function getPage () {
	const ScriptFilenameMap = { main: 'js/main.js', vendor: 'js/vendor.js' };
	let revision = require('./git-revision');
	let Application;
	let template;
	let isDevMode = false;

	try {

		let file = Path.resolve(__dirname, '../../client/page.html'); //production
		if (!isFile(file)) {
			isDevMode = true;
			file = Path.resolve(__dirname, '../../main/page.html'); //dev
		}

		template = fs.readFileSync(file, 'utf8');
	} catch (er) {
		logger.error('%s', er.stack || er.message || er);
		template = 'Could not load page template.';
	}

	try {
		const app = require('app-renderer');
		Application = app.default;
		revision = app.revision;
	} catch (e) {
		const noModule = /Cannot find module \'app-renderer\'/.test(e.message || e);
		Application = null;

		if (!isDevMode) {
			logger.error('No Server-side Rendering (Because: %s)',
				noModule ? e.message : e.stack || e.message || e);
		}
	}


	try {
		const data = require('../compile-data.json');
		const chunks = data.assetsByChunkName;

		for (let chunk of Object.keys(chunks)) {
			ScriptFilenameMap[chunk] = unwrap(chunks[chunk]);
		}
	}
	catch (e) {
		if (!isDevMode) {
			logger.error('Could not resolve chunk names.');
		}
	}


	return (basePath, req, clientConfig) => {
		basePath = basePath || '/';
		const u = url.parse(req.url);
		const manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache"' : '<html';
		const path = u.pathname;
		const cfg = Object.assign({revision}, clientConfig.config || {});

		let basePathFix = (original, attr, val) => attr + '="' +
				(isRootPath.test(val) ? (basePath || '/') + val.substr(1) : val) + '"';

		let html = '';

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
				.replace(/resources\/styles\.css/, 'resources/styles.css?rel=' + encodeURIComponent(ScriptFilenameMap.main));

		for (let script of Object.keys(ScriptFilenameMap)) {
			out = out.replace(new RegExp(`js\\/${script}\\.js`), ScriptFilenameMap[script]);
		}

		return out;
	};
};
