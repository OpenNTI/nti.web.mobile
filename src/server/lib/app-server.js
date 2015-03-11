global.SERVER = true;

import express from 'express';
import path from 'path';
//import fs from 'fs';
import waitFor from 'dataserverinterface/utils/waitfor';
import dataserver from 'dataserverinterface';

import api from './api';
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


export function setupApplication(app, config) {
	var port = config.port = (config.port || 9000);
	//config.silent = true;
	var dsi = dataserver(config);
	var session = dsi.session;
	var datacache = dsi.datacache;

	var entryPoint = generated.entryPoint;
	var assetPath = path.join(__dirname, '../..', entryPoint ? 'client' : 'main');
	logger.info('Static Assets: %s',assetPath);
	logger.info('DataServer end-point: %s', config.server);
	var page = generated.page;
	var devmode;

	logger.attachToExpress(app);
	setupCORS(app);
	setupCompression(app, assetPath);

	redirects.register(app, config);

	if (entryPoint==null) {//only start the dev server if entryPoint is null or undefined. if its false, skip.
		devmode = setupDeveloperMode(config);
		entryPoint = devmode.entry;
		page = pageSource();
		app.use(devmode.middleware);//serve in-memory compiled sources/assets
	}
	else if (entryPoint === false) {
		logger.error('Not in dev mode, preventing dev server from starting. Shutting down.');
		return;
	}

	//Static files...
	app.use(express.static(assetPath, {
		maxage: 3600000, //1hour
		setHeaders: (res, path) =>{
			if (manifest.test(path)) {
				//manifests never cache
				res.setHeader('Cache-Control', 'public, max-age=0');
			}
		}
	}));//static files

	//Session manager...
	app.use(cacheBuster);

	api.registerAnonymousEndPoints(app, config);

	app.use(/^\/login.*/,session.anonymousMiddleware.bind(session));
	app.use(/^(?!\/(login|resources)).*/,session.middleware.bind(session));

	api.registerAuthenticationRequiredEndPoints(app, config);

	//HTML Renderer...
	app.get('*', (req, res)=> {
		logger.info('Rendering Inital View: %s %s', req.url, req.username);
		var isErrorPage = false;
		global.__setPageNotFound = ()=>isErrorPage = true;

		//Pre-flight (if any widget makes a request, we will cache its result and send its result to the client)
		page(req, entryPoint, nodeConfigAsClientConfig(config, req));

		if (isErrorPage) {
			res.status(404);
		}

		waitFor(req.__pendingServerRequests, 60000)
			.then(()=> {
				var configForClient = clientConfig(req.username, req);
				configForClient.html += datacache.getForContext(req).serialize();
				//Final render
				logger.info('Flushing Render to client: %s %s', req.url, req.username);
				res.end(page(req, entryPoint, configForClient));
			})
			.catch((e)=>{
				logger.error(e.stack || e.message || e);
				res.end(e);
			});
	});


	if (devmode) {
		devmode.start();
	}

	return port;
}
