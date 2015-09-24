/*eslint no-var: 0 strict: 0*/
'use strict';
require('babel/register')({
	ignore: false,//parse node_modules too

	//but...

	// only if filenames match this regex...
	only: /(?!.*node_modules)(nti.lib|react-editor-component|server\/lib|server\/schema)/
});

global.SERVER = true;

var http = require('http');
var proxiedHttp = require('findhit-proxywrap').proxy(http);

var express = require('express');
var common = require('./lib/common');
var server = require('./lib/app-server');
var logger = require('./lib/logger');
var setupErrorHandler = require('./lib/error-handler');

function contextualize (root, app) {
	var contextWapper = express();
	contextWapper.use(root, app);
	contextWapper.all('/', function (_, res) { res.redirect(root); });
	return contextWapper;
}

common.loadConfig()
	.then(function (config) {
		common.showFlags(config);
		logger.info('Build Source (revision): ', config.revision);

		var protocol = config.protocol === 'proxy' ? proxiedHttp : http;
		var address = config.address || '0.0.0.0';
		var port = config.port || 9000;

		//WWW Server
		var app = express();

		port = server.setupApplication(app, config);

		//Errors
		setupErrorHandler(app, config);

		//re-root the app to /mobile/
		if (config.basepath && config.basepath !== '') {
			app = contextualize(config.basepath, app);
		}

		app.set('trust proxy', 1); // trust first proxy

		//Go!
		protocol.createServer(app).listen(port, address, function () {
			logger.info('Listening on port %d', port);
		});

	}, function (error) { logger.error('Failed to load config: ', error); })

	.catch(function (error) {
		logger.error('Failed to start: ', error);
		process.kill();//just in case dev server is already up.
	});
