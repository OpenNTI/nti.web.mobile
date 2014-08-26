"use strict";

var stats = {assetsByChunkName: {}};

module.exports.page = function() {return 'Imagine the UI.';};


try {
	module.exports.page = require("./page.generated.js");
	stats = require("./stats.generated.json");
} catch(e) {
	//no big
	console.warn('Running from SRC directory... Good for testing server calls, but not UI rendering.');
}

try {
	module.exports.entryPoint = stats.assetsByChunkName.main;
} catch (e) {
	console.warn('Could not resolve the entryPoint script name.');
}
