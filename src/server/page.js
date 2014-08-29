'use strict';

var styleCollector = require('./style-collector');

var url = require('url');
var fs = require('fs');
var React = require('react/addons');
var Application;

var template;

try {
	Application = require('../main/js/main');
	template = require('../main/page.html');
} catch (e) {
	console.warn('No Server-side Rendering');
}

module.exports = function(req, scriptFilename, additional) {

	var path = url.parse(req.url).pathname;

	var html = '';
	var css = '';

	if (Application) {
		css = styleCollector.collect(function() {
			html = React.renderComponentToString(Application({path:path}));
		});
	}

	if (additional) {
		html += additional;
	}


	css = '<style type="text/css" id="server-side-style">' + css + '</style>';

	if (!template) {
		template = fs.readFileSync(__dirname + '/../main/page.html', "utf8");
	}

	return template
			.replace(/<!--css:server-values-->/i, css)
			.replace(/<!--html:server-values-->/i, html)
			.replace(/js\/main\.js/, scriptFilename);
};
