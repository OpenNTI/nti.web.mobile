'use strict';

var styleCollector = require('./style-collector');
var common = require('./common.js');

var url = require('url');

function basePathFix(original,attr,val) {
	if (val.charAt(0) === '/' && val.charAt(1) !== '/') {
		val = common.config().basepath + val.substr(1);
	}

	return attr + '="' + val + '"';
}

module.exports = function(req, scriptFilename, additional) {

	var path = url.parse(req.url).pathname

	var html;
	var css = styleCollector.collect(function() {
		var React = require('react/addons');
		var Application = require('../main/js/main.jsx');
		html = React.renderComponentToString(Application({
			path:path, 
			basePath: common.config().basepath
		}));
	});

	if (additional) {
		html += additional;
	}

	css = '<style type="text/css" id="server-side-style">' + css + '</style>';
	var basepathreplace = /(src|href)="(.*?)"/igm;

	console.log(scriptFilename);

	return require('../main/page.html')
			.replace(basepathreplace,basePathFix)
			.replace(/<!--css:server-values-->/i, css)
			.replace(/<!--html:server-values-->/i, html)
			.replace(/js\/main\.js/, scriptFilename);
};
