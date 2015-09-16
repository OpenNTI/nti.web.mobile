global.SERVER = true;

import express from 'express';
import path from 'path';
//import fs from 'fs';
import waitFor from 'nti.lib.interfaces/utils/waitfor';
import dataserver, {CommonSymbols} from 'nti.lib.interfaces';
let {Pending} = CommonSymbols;

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

	let {basepath} = config;

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

	if (entryPoint == null) {//only start the dev server if entryPoint is null or undefined. if its false, skip.
		devmode = setupDeveloperMode(config);
		entryPoint = devmode.entry;
		page = pageSource();
		app.use(devmode.middleware);//serve in-memory compiled sources/assets
	}
	else if (entryPoint === false) {
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

	app.use(/^\/login/i, session.anonymousMiddleware.bind(session));

	//Session manager...
	app.use(/^(?!\/(api|login|resources)).*/i, session.middleware.bind(session));

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

		waitFor(req[Pending], 60000)
			.then(()=> {
				let configForClient = clientConfig(req.username, req);
				configForClient.html += datacache.getForContext(req).serialize();
				//Final render
				logger.info('Flushing Render to client: %s %s', req.url, req.username);
				res.end(page(basepath, req, entryPoint, configForClient));
			})
			.catch(e=> {
				logger.error(e.stack || e.message || e);
				res.end(e);
			});
	});


	if (devmode) {
		devmode.start();
	}

	return port;
}
