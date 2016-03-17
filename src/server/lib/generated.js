import logger from './logger';

let ServerRender = true;
let src;
let stats = {assetsByChunkName: {}};
let reason;

module.exports.page = function () { return 'Imagine the UI.'; };

try {
	const {default: getPage, revision} = require('page.generated');
	module.exports.page =  getPage(true);

	logger.info('Build (revision): %s', revision);
} catch(e) {
	reason = e.stack || e.message;
	ServerRender = false;
	//no big
	if (/Cannot find module 'page\.generated'/.test(e.message)) {
		reason = 'Missing compiled page';
	}
	logger.error('Could not load compiled page. %s', reason);

	global.DISABLE_SERVER_RENDERING = true;
}


try {
	stats = require('./stats.json');
	if (!ServerRender) {
		throw new Error('Stats Extist, but could not load the compiled page!');
	}

} catch (e) {
	if (ServerRender) {
		module.exports.entryPoint = false;

		logger.error('Server UI rendering: cannot load webpack`s compile info: %s',
			e.stack || e.message || e);
	}
}


try {
	if (module.exports.entryPoint !== false) {
		src = stats.assetsByChunkName.main;
		if (Array.isArray(src)) {
			src = src[0];
		}

		module.exports.entryPoint = src;
	}
} catch (e) {
	logger.error('Could not resolve the entryPoint script name: %s',
		e.stack || e.message || e);
}
