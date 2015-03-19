'use strict';

require("babel/register")({
	ignore: false,//parse node_modules too

	//but...

	// only if filenames match this regex...
	only: /(?!.*node_modules)(dataserverinterface|react-editor-component|server\/lib)/
});

global.SERVER = true;

var http = require('http');
var proxiedHttp = require('proxywrap').proxy(http);

var express = require('express');
var common = require('./lib/common');
var server = require('./lib/app-server');
var logger = require('./lib/logger');

var config = common.config();
var protocol = config.protocol === 'proxy' ? proxiedHttp : http;
var address = config.address || '0.0.0.0';
var port = config.port || 9000;

//WWW Server
var app = express();

var mobileapp = express();
mobileapp.use(config.basepath, app);//re-root the app to /mobile/
mobileapp.all('/', function(_, res) { res.redirect('/mobile/'); });

var port = server.setupApplication(app, config);

//Errors
/* jshint -W098 */	// We need the signature to be 4 args long
					// for express to treat it as a error handler
app.use(function(err, req, res, next){
	if (!err) {
		err = 'Unknown Error';
	}
	else if (err.toJSON) {
		err = err.toJSON();
	}
	else if (err.stack) {
		err = err.stack;
	}

	logger.error('%o', err);

	res.status(err.statusCode || 500).send(err.body || 'Oops! Something broke!'); });

//Go!
protocol.createServer(mobileapp || app).listen(port, address, function() {
	logger.info('Listening on port %d', port); });
