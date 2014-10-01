'use strict';

var styleCollector = require('./style-collector');
var common = require('./common');

var url = require('url');
var fs = require('fs');
var React = require('react/addons');
var Application;
var basepathreplace = /(src|href)="(.*?)"/igm;
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

module.exports = function(req, scriptFilename, additional) {

	var path = url.parse(req.url).pathname;

	var html = '';
	var css = '';

	if (Application) {
		css = styleCollector.collect(function() {
			html = React.renderComponentToString(Application({
				path:path,
				basePath: common.config().basepath
			}));
		});
	}

	if (additional) {
		html += additional;
	}


	//css = '<style type="text/css" id="server-side-style">' + css + '</style>';

	//In practice, the bundle contains the CSS and injects it no matter what. So
	//injecting it here, doubles the clients' download for no reason.
	css = '';


	return template
			.replace(basepathreplace, basePathFix)
			.replace(/<!--css:server-values-->/i, css)
			.replace(/<!--html:server-values-->/i, html)
			.replace(/js\/main\.js/, scriptFilename);
};
