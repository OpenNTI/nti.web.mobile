'use strict';

var ServerRender = true;
var src;
var stats = {assetsByChunkName: {}};
var reason;

module.exports.page = function() {return 'Imagine the UI.';};

try {
	module.exports.page = require('page.generated');
} catch(e) {
	reason = e.stack || e.message;
	ServerRender = false;
	//no big
	if (/Cannot find module 'page\.generated'/.test(e.message)) {
			reason = 'Missing compiled page';
	}
	console.warn('%s\tCould not load compiled page. %s', new Date().toUTCString(), reason);

	global.DISABLE_SERVER_RENDERING = true;
}


try {
	stats = require('../stats.generated.json');
	if (!ServerRender) {
		throw new Error('Stats Extist, but could not load the compiled page!');
	}

} catch (e) {
	if (ServerRender) {
		module.exports.entryPoint = false;

		console.error('%s\tServer UI rendering: cannot load webpack`s compile info: %s',
			new Date().toUTCString(),
			e.stack || e.message || e);
		return;
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
