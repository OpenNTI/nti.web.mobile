'use strict';
/*eslint no-var: 0*/
require("babel/register")({
	ignore: false,//parse node_modules too

	//but...

	// only if filenames match this regex...
	only: /(?!.*node_modules)(nti.lib.interfaces|react-editor-component|server\/lib)/
});

global.SERVER = true;

var http = require('http');
var proxiedHttp = require('proxywrap').proxy(http);

var express = require('express');
var common = require('./lib/common');
var server = require('./lib/app-server');
var logger = require('./lib/logger');
var errorHandler = require('./lib/error-handler');

common.loadConfig().then(function(config) {

	var protocol = config.protocol === 'proxy' ? proxiedHttp : http;
	var address = config.address || '0.0.0.0';
	var port = config.port || 9000;

	//WWW Server
	var app = express();

	var mobileapp = express();
	mobileapp.use(config.basepath, app);//re-root the app to /mobile/
	mobileapp.all('/', function(_, res) { res.redirect('/mobile/'); });

	port = server.setupApplication(app, config);

	//Errors
	app.use(errorHandler);

	//Go!
	protocol.createServer(mobileapp || app).listen(port, address, function() {
		logger.info('Listening on port %d', port); });

}, function (error) {
	logger.error('Failed to load config: ', error);
});
