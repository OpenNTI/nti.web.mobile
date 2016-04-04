global.SERVER = true;

import express from 'express';
import path from 'path';

import dataserver from 'nti-lib-interfaces';

import {registerEndPoints} from './api';
import cacheBuster from './no-cache';
import {clientConfig, nodeConfigAsClientConfig} from './common';
import generated from './generated';
import pageSource from './page';
import redirects from './redirects';
import {setupDeveloperMode} from './devmode';

import logger from './logger';
import {attachToExpress as setupCORS} from './cors';
import {attachToExpress as setupCompression} from './compress';

const manifest = /\.appcache$/i;


export function setupApplication (app, config) {
	let port = config.port = (config.port || 9000);
	//config.silent = true;
	let dsi = dataserver(config);
	let session = dsi.session;
	let datacache = dsi.datacache;

	let {basepath, webpack} = config;

	let entryPoint = generated.entryPoint;
	let assetPath = path.join(__dirname, '../..', entryPoint ? 'client' : 'main');
	logger.info('Static Assets: %s', assetPath);
	logger.info('DataServer end-point: %s', config.server);
	logger.info('mount-point: %s', basepath);
	let page = generated.page;
	let devmode;

	logger.attachToExpress(app);
	setupCORS(app);
	setupCompression(app, assetPath);

	redirects.register(app, config);

	if (entryPoint == null && webpack) {
		//only start the dev server if entryPoint is null or undefined. if its false, skip.
		devmode = setupDeveloperMode(config);
		entryPoint = devmode.entry;
		page = pageSource();
		app.use(devmode.middleware);//serve in-memory compiled sources/assets
	}
	else if (entryPoint === false && webpack) {
		logger.error('Not in dev mode, preventing dev server from starting. Shutting down.');
		return void 0;
	}

	app.use('/errortest*', function () {
		throw new Error('This is an error. Neato.');
	});

	//Static files...
	app.use(express.static(assetPath, {
		maxage: 3600000, //1hour
		setHeaders: (res, requsestPath) => {
			if (manifest.test(requsestPath)) {
				//manifests never cache
				res.setHeader('Cache-Control', 'public, max-age=0');
			}
		}
	}));//static files

	//Do not let requests for static assets (that are not found) fall through to page rendering.
	app.get(/^\/(js|resources)\//i, (_, res)=>
		res.status(404).send('Asset Not Found'));

	app.use(cacheBuster);

	registerEndPoints(app, config, dsi.interface);

	app.use(/^\/login/i, (q,r,n) => session.anonymousMiddleware(basepath,q,r,n));

	//Session manager...
	app.use(/^(?!\/(api|login|resources)).*/i, (q,r,n) => session.middleware(basepath,q,r,n));

	//HTML Renderer...
	app.get('*', (req, res)=> {
		logger.info('Rendering Inital View: %s %s', req.url, req.username);
		let isErrorPage = false;
		/*eslint no-underscore-dangle: 0*/
		global.pageRenderSetPageNotFound = ()=>isErrorPage = true;

		//Pre-flight (if any widget makes a request, we will cache its result and send its result to the client)
		page(basepath, req, entryPoint, nodeConfigAsClientConfig(config, req));

		if (isErrorPage) {
			res.status(404);
		}

		const prefetch = req.waitForPending ?
				req.waitForPending(5 * 60000/* 5 minutes*/) :
				Promise.resolve();


		prefetch.then(
			()=> {
				let configForClient = clientConfig(req.username, req);
				configForClient.html += datacache.getForContext(req).serialize();
				//Final render
				logger.info('Flushing Render to client: %s %s', req.url, req.username);
				res.end(page(basepath, req, entryPoint, configForClient));
			},

			error => {
				logger.error(error.stack || error.message || error);
				res.end(error);
			});
	});


	if (devmode) {
		devmode.start();
	}

	return port;
}
