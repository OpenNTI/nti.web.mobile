'use strict';

var path = require('path');
var module$1 = require('module');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/*eslint-disable no-console, strict, import/no-commonjs*/

if (typeof require === 'undefined') {
	// eslint-disable-next-line no-global-assign
	require = module$1.createRequire(undefined);
}

let dev;
let assets = path__default['default'].resolve(__dirname, '../client');

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
		const redirects = await Promise.resolve().then(function () { return require('./redirects-904a8e8e.js'); });
		const { sessionSetup } = await Promise.resolve().then(function () { return require('./session-setup-2daea1b3.js'); });

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
