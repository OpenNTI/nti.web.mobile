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

var WantsCompressed = /gzip/i;

var waitFor = require('dataserverinterface/utils/waitfor');
var dataserver = require('dataserverinterface')(config);
var session = dataserver.session;
var datacache = dataserver.datacache;

var generated = require('./generated');
var entryPoint = generated.entryPoint;
var page = generated.page;

var devmode;
var assetPath = path.join(__dirname, '..', 'client');

//WWW Server
var app = express();
require('./logger').attachToExpress(app);

var mobileapp = express();
mobileapp.use(config.basepath, app);//re-root the app to /mobile/
mobileapp.all('/', function(_, res) { res.redirect('/mobile/'); });

if (!entryPoint) {
	devmode = require('./devmode')(port);

	page = require('./page');

	entryPoint = devmode.entry;
	app.use(devmode.middleware);//serve in-memory compiled sources/assets
	assetPath = path.join(assetPath, 'main');
}


//CORS...
app.all('*', function(req, res, next) {
	var gz = req.url + '.gz';
	var compress = WantsCompressed.test(req.header('accept-encoding') || '');
	if (compress && fs.existsSync(path.join(assetPath, gz))) {
		req.url = gz;
		res.set('Content-Encoding', 'gzip');
	}

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});


//Static files...
app.use(express.static(assetPath));//static files

//Session manager...
app.use(authedRoutes, session.middleware.bind(session));


//HTML Renderer...
app.get(appRoutes, function(req, res) {
	console.log('Rendering Inital View: %s %s', req.url, req.username);

	//Pre-flight (if any widget makes a request, we will cache its result and
	// send its result to the client)
	page(req);

	waitFor(req.__pendingServerRequests, 60000)
		.then(function() {
			//Final render
			console.log('Flushing Render to client: %s %s', req.url, req.username);
			res.end(page(req, entryPoint,
				common.clientConfig(req.username) + datacache.getForContext(req).serialize()
			));
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
