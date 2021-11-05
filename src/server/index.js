/*eslint-disable no-console, strict, import/no-commonjs*/
'use strict';
const path = require('path');

let dev;
let assets = path.resolve(__dirname, '../client');

try {
	if (!/dist\/server/i.test(__dirname)) {
		dev = require('@nti/app-scripts/server/lib/devmode');
		assets = require('@nti/app-scripts/config/paths').assetsRoot;
	}
} catch (e) {
	console.error(e.stack || e.message || e);
}

exports = module.exports = {
	async register(expressApp, config) {
		const redirects = await import('./lib/redirects.mjs');
		const { sessionSetup } = await import('./lib/session-setup.mjs');

		const devmode = dev
			? await dev.setupDeveloperMode(config, expressApp)
			: false;

		redirects.register(expressApp, config);

		return {
			devmode,

			assets,

			sessionSetup,
		};
	},
};
