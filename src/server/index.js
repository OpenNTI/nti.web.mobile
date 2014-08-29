'use strict';

if (typeof Promise === 'undefined') {
	global.Promise = require('es6-promise').Promise;
}

var authedRoutes = /^\/($|content|contacts|library|forums|search)/;
var appRoutes = /^\/($|login|content|contacts|library|forums|search)(.(?!\.[^.]+$))*$/;

var express = require('express');
var path = require('path');

var common = require('./common');
var config = common.config();
var port = config.port || 9000;

var session = require('dataserverinterface')(config).session;

var generated = require('./generated');
var entryPoint = generated.entryPoint;
var page = generated.page;

var devmode;

//WWW Server
var app = express();
require('./logger').attachToExpress(app);

var mobileapp = express();
mobileapp.use(config.basepath, app);//re-root the app to /mobile/

if (!entryPoint) {
	devmode = require('./devmode')(port);

	page = require('./page');

	entryPoint = devmode.entry;
	app.use(devmode.middleware);//serve in-memory compiled sources/assets
}

//Static files...
app.use(express.static(path.join(__dirname, '..')));//static files

//Session manager...
app.use(authedRoutes, session.middleware.bind(session));

//CORS...
app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

//HTML Renderer...
app.get(appRoutes, function(req, res) {
	console.log('Rendering Inital View: %s %s', req.url, req.username);
	res.end(page(req, entryPoint, common.clientConfig()));
});


//Errors
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send('Oops! Something broke!'); });

//Go!
(mobileapp || app).listen(port, function() {
	console.log('Listening on port %d', port); });

if (devmode) {
	devmode.start();
}
