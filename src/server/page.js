'use strict';

var styleCollector = require('./style-collector');
var common = require('./common');

var url = require('url');
var Path = require('path');
var fs = require('fs');
var React = require('react/addons');
var Application;
var basepathreplace = /(manifest|src|href)="(.*?)"/igm;
var template;


function basePathFix(original,attr,val) {
	if (val.charAt(0) === '/' && val.charAt(1) !== '/') {
		val = (common.config().basepath || '/') + val.substr(1);
	}

	return attr + '="' + val + '"';
}

try {
	Application = require('../main/js/main');
} catch (e) {
	console.warn('No Server-side Rendering (Because: %s)',
		/Cannot find module '\.\.\/main\/js\/main'/.test(e.message || e) ?
			'Dev Mode':
			e.message || e);
}

try {
	//For WebPack... (production)
	template = require('../main/page');
} catch (e) {
	//For Node... (dev)
	template = fs.readFileSync(__dirname + '/../main/page.html', "utf8");
}

module.exports = function(req, scriptFilename, clientConfig) {

	var u = url.parse(req.url);
	var manifest = u.query === 'cache' ? '<html manifest="/manifest.appcache" ' : '<html';
	var path = u.pathname;
	var cfg;
	var html = '';
	var css = '';

	if (Application) {
		try {
			cfg = global.$AppConfig = clientConfig.config || {};
			css = styleCollector.collect(function() {
				html = React.renderComponentToString(Application({
					path: Path.join(cfg.basepath || '', path),
					basePath: common.config().basepath
				}));
			});
		} finally {
			delete global.$AppConfig;
		}
	}

	html += clientConfig.html;
	css = '<style type="text/css" id="server-side-style">' + css + '</style>';

	return template
			.replace(/<html/, manifest)
			.replace(basepathreplace, basePathFix)
			.replace(/<!--css:server-values-->/i, css)
			.replace(/<!--html:server-values-->/i, html)
			.replace(/js\/main\.js/, scriptFilename);
};
