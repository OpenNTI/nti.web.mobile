/*eslint-disable no-console, strict, import/no-commonjs*/
'use strict';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
		const { sessionSetup } = await import ('./lib/session-setup.js');

		const devmode = dev ? await dev.setupDeveloperMode(config) : false;

		redirects.register(expressApp, config);

		if (devmode) {
			expressApp.use(devmode.middleware); //serve in-memory compiled sources/assets
		}

		return {
			devmode,

			assets,

			sessionSetup,
		};
	},
};
