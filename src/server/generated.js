'use strict';

var src;
var stats = {assetsByChunkName: {}};

module.exports.page = function() {return 'Imagine the UI.';};


try {
	module.exports.page = require('page.generated');
	stats = require('./stats.generated.json');
} catch(e) {
	//no big
	console.warn('Running from SRC directory...',
				'Good for testing server calls, but not UI rendering.');
}

try {
	src = stats.assetsByChunkName.main;
	if (Array.isArray(src)) {
		src = src[0];
	}

	module.exports.entryPoint = src;
} catch (e) {
	console.warn('Could not resolve the entryPoint script name.');
}
