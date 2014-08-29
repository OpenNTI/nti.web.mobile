'use strict';

if (typeof Promise === 'undefined') {
	global.Promise = require('es6-promise').Promise;
}

var authedRoutes = /^\/($|content|contacts|library|forums|search)/;
var appRoutes = /^\/($|login|content|contacts|library|forums|search)(.(?!\.[^.]+$))*$/;

var express = require('express');
var path = require('path');

var common = require('./common.js');
var logger = require('./logger.js');
var session = require('dataserverinterface')(common.config()).session;

var generated = require('./generated.js');
var entryPoint = generated.entryPoint;
var page = generated.page;


//WWW Server
var app = express();

logger.attachToExpress(app);

var mobileApp = express();
mobileApp.use(express.static(path.join(__dirname, '..')));
mobileApp.use(authedRoutes, session.middleware.bind(session));
mobileApp.get(appRoutes, function(req, res) {
	console.log('Rendering Inital View: %s %s', req.url, req.username);
	res.end(page(req, entryPoint, common.clientConfig()));
});

app.use(common.config().basepath, mobileApp);

//Error Handler
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send('Oops! Something broke!');
});

var server = app.listen(common.config().port || 9000, function() {
	console.log('Listening on port %d', server.address().port);
});
