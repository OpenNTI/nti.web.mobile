'use strict';

import styleCollector from './style-collector';
import {config} from './common';

import url from 'url';
import Path from 'path';
import fs from 'fs';
import React from 'react';

var Application;
var basepathreplace = /(manifest|src|href)="(.*?)"/igm;
var configValues = /<\[cfg\:([^\]]*)\]>/igm;
var template;


function injectConfig(cfg, orginal, prop) {
	return cfg[prop] || 'MissingConfigValue';
}


function basePathFix(original,attr,val) {
	if (val.charAt(0) === '/' && val.charAt(1) !== '/') {
		val = (config().basepath || '/') + val.substr(1);
	}

	return attr + '="' + val + '"';
}

if (!global.DISABLE_SERVER_RENDERING) {
	try {
		Application = require('../../main/js/AppView');
	} catch (e) {
		console.warn('%s\tNo Server-side Rendering (Because: %s)', new Date().toUTCString(),
			/Cannot find module '\.\.\/main\/js\/AppView'/.test(e.message || e) ?
				e.message: e.stack || e.message || e);
	}
}

try {
	//For WebPack... (production)
	template = require('../../main/page');
} catch (e) {
	//For Node... (dev)
	try {
		template = fs.readFileSync(__dirname + '/../../main/page.html', 'utf8');
	} catch (er) {
		console.error('%s\t%s', new Date().toUTCString(), er.stack || er.message || er);
		template = 'Could not load page template.';
	}
}

template = template.replace(
	/<!--css:site-styles-->/,
	//This path has to be the same depth as the mapped
	'<link href="/resources/css/sites/current/site.css" ' +
	'rel="stylesheet" type="text/css" id="site-override-styles"/>');

export default function(req, scriptFilename, clientConfig) {
	var u = url.parse(req.url);
	var manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache"' : '<html';
	var path = u.pathname;
	var cfg = clientConfig.config || {};
	var html = '';
	var css = '';

	if (Application) {
		try {
			global.$AppConfig = cfg;
			css = styleCollector.collect(() => {
				var app = React.createElement(Application, {
					path: Path.join(cfg.basepath || '', path),
					basePath: config().basepath
				});

				html = React.renderToString(app);
			});
		}
		finally {
			delete global.$AppConfig;
		}
	}

	html += clientConfig.html;
	css = `<style type="text/css" id="server-side-style">${css}</style>`;

	var out = template
			.replace(/<html/, manifest)
			.replace(configValues, injectConfig.bind(this, cfg))
			.replace(basepathreplace, basePathFix)
			.replace(/<!--css:server-values-->/i, css)
			.replace(/<!--html:server-values-->/i, html)
			.replace(/js\/main\.js/, scriptFilename);

	return out;
}
