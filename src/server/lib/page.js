/*eslint strict: 0*/
'use strict';
const logger = require('./logger');

const url = require('url');
const Path = require('path');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const {URL: {join: urlJoin}} = require('nti-commons');

const isRootPath = RegExp.prototype.test.bind(/^\/(?!\/).*/);
const isSiteAssets = RegExp.prototype.test.bind(/^\/site\-assets/);
const shouldPrefixBasePath = val => isRootPath(val) && !isSiteAssets(val);

const basepathreplace = /(manifest|src|href)="(.*?)"/igm;
const configValues = /<\[cfg\:([^\]]*)\]>/igm;

const statCache = {};

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


function getModules () {
	const file = '../compile-data.json';
	const {mtime} = fs.statSync(file);

	if (statCache.mtime === mtime) {
		return statCache.chunks;
	}

	const unwrap = x => Array.isArray(x) ? x[0] : x;
	const data = JSON.parse(fs.readFileSync(file));
	const chunks = data.assetsByChunkName;

	for (let chunk of Object.keys(chunks)) {
		chunks[chunk] = unwrap(chunks[chunk]);
	}

	Object.assign(statCache, {mtime, chunks});
	return chunks;
}

exports.getPage = function getPage () {
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
		if (isDevMode) {
			template = template
				.replace('react-with-addons.min.js', 'react-with-addons.js')
				.replace('react-dom.min.js', 'react-dom.js');
		}
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


	return (basePath, req, clientConfig) => {
		basePath = basePath || '/';
		const ScriptFilenameMap = { main: 'js/main.js', vendor: 'js/vendor.js' };
		const u = url.parse(req.url);
		const manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache"' : '<html';
		const path = u.pathname;
		const cfg = Object.assign({revision}, clientConfig.config || {});

		try {
			Object.assign(ScriptFilenameMap, getModules());
		}
		catch (e) {
			if (!isDevMode) {
				logger.error('Could not resolve chunk names.');
			}
		}

		const basePathFix = (original, attr, val) =>
				attr + `="${
					shouldPrefixBasePath(val)
						? urlJoin(basePath, val)
						: val
				}"`;

		let html = '';

		if (Application) {
			try {
				global.$AppConfig = cfg;

				const app = React.createElement(Application, {
					path: urlJoin(basePath, path),
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
