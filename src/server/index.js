'use strict';

global.SERVER = true;

if (typeof Promise === 'undefined') {
	global.Promise = require('es6-promise').Promise;
}

var knownPages = [
	'catalog',
	'contacts',
	'content',
	'course',
	'forums',
	'library',
	'search'
].join('|');

var authedRoutes = new RegExp('^\\/($|' + knownPages + ')((?!resources).)*$');
var appRoutes = new RegExp('^\\/($|login|' + knownPages + ')((?!resources).)*$');

var express = require('express');
var path = require('path');
var fs = require('fs');

var common = require('./common');
var config = common.config();
var address = config.address || '0.0.0.0';
var port = config.port || 9000;

var waitFor = require('dataserverinterface/utils/waitfor');
var dataserver = require('dataserverinterface')(config);
var session = dataserver.session;
var datacache = dataserver.datacache;

var generated = require('./generated');
var entryPoint = generated.entryPoint;
var page = generated.page;

var devmode;
var assetPath = path.join(__dirname, '..', entryPoint ? 'client' : 'main');

//WWW Server
var app = express();
require('./logger').attachToExpress(app);
require('./cors').attachToExpress(app);
require('./compress').attachToExpress(app, assetPath);

var mobileapp = express();
mobileapp.use(config.basepath, app);//re-root the app to /mobile/
mobileapp.all('/', function(_, res) { res.redirect('/mobile/'); });

if (!entryPoint) {
	page = require('./page');
	devmode = require('./devmode')(port);

	entryPoint = devmode.entry;
	app.use(devmode.middleware);//serve in-memory compiled sources/assets
}


//Static files...
app.use(express.static(assetPath));//static files

//Session manager...
app.use(authedRoutes, session.middleware.bind(session));


//HTML Renderer...
app.get(appRoutes, function(req, res) {
	console.log('Rendering Inital View: %s %s', req.url, req.username);

	//Pre-flight (if any widget makes a request, we will cache its result and
	// send its result to the client)
	page(req, entryPoint, common.nodeConfigAsClientConfig(config, req));

	waitFor(req.__pendingServerRequests, 60000)
		.then(function() {
			var clientConfig = common.clientConfig(req.username);
			clientConfig.html += datacache.getForContext(req).serialize();
			//Final render
			console.log('Flushing Render to client: %s %s', req.url, req.username);
			res.end(page(req, entryPoint, clientConfig));
		});
});


//Errors
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send('Oops! Something broke!'); });

//Go!
(mobileapp || app).listen(port, address, function() {
	console.log('Listening on port %d', port); });

if (devmode) {
	devmode.start();
}
