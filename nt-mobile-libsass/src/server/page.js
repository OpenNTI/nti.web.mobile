"use strict";

var styleCollector = require("./style-collector");

var url = require('url');

module.exports = function(req, scriptFilename, additional) {

	var path = url.parse(req.url).pathname

	var html;
	var css = styleCollector.collect(function() {
		var React = require("react/addons");
		var Application = require("../main/js/main.jsx");
		html = React.renderComponentToString(Application({path:path}));
	});

	if (additional) {
		html += additional;
	}

	css = '<style type="text/css" id="server-side-style">' + css + '</style>';

	console.log(html);
	return require("../main/page.html")
			.replace(/<!--css:server-values-->/i, css)
			.replace(/<!--html:server-values-->/i, html)
			.replace(/js\/main\.js/, scriptFilename);
};
