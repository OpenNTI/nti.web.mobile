'use strict';

var ServerRender = true;
var src;
var stats = {assetsByChunkName: {}};

module.exports.page = function() {return 'Imagine the UI.';};

try {
	module.exports.page = require('page.generated');
} catch(e) {
	ServerRender = false;
	//no big
	console.warn('%s\tRunning from SRC directory...', new Date().toUTCString());
}

if (ServerRender) {
	try {
		stats = require('./stats.generated.json');
	} catch (e) {
		console.error('%s\tServer UI rendering: cannot load webpack`s compile info: %s',
			new Date().toUTCString(),
			e.stack || e.message || e);
	}
}

try {
	src = stats.assetsByChunkName.main;
	if (Array.isArray(src)) {
		src = src[0];
	}

	module.exports.entryPoint = src;
} catch (e) {
	console.warn('%s\tCould not resolve the entryPoint script name: %s',
		new Date().toUTCString(),
		e.stack || e.message || e);
}
