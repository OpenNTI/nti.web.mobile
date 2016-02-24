/*eslint strict:0*/
'use strict';
const fs = require('fs');
const path = require('path');

const devmode = require('./lib/devmode');
const page = require('./lib/page');

function exists (f) {
	try {
		return fs.accessSync(f);
	} catch (e) {
		return false;
	}
}

const distAssets = path.resolve(__dirname, '../client');
const srcAssets = path.resolve(__dirname, '../main');

const assets = exists(distAssets) ? distAssets : srcAssets;

exports = module.exports = {

	register (expressApp, config) {

		const pageRenderer = page.getPage();

		return {
			devmode: (srcAssets === assets) ? devmode.setupDeveloperMode(config) : null,

			assets,

			render (base, req, clientConfig) {
				return pageRenderer(base, req, clientConfig);
			}
		};

	}

};
