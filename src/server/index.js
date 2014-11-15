'use strict';

global.SERVER = true;

var knownPages = [
	'contacts',
	'content',
	'course',
	'forums',
	'library',
	'search'
].join('|');

var appRoutes = new RegExp('^\\/($|login|' + knownPages + ')((?!resources).)*$');

var http = require('http');
var proxiedHttp = require('proxywrap').proxy(http);

var express = require('express');
var path = require('path');
//var fs = require('fs');

var common = require('./common');
var config = common.config();
var protocol = config.protocol === 'proxy' ? proxiedHttp : http;
var address = config.address || '0.0.0.0';
var port = config.port || 9000;

var waitFor = require('dataserverinterface/utils/waitfor');
var dataserver = require('dataserverinterface')(config);
var session = dataserver.session;
var datacache = dataserver.datacache;

var api = require('./api');

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

var manifest = /\.appcache$/i;

var mobileapp = express();
mobileapp.use(config.basepath, app);//re-root the app to /mobile/
mobileapp.all('/', function(_, res) { res.redirect('/mobile/'); });

require('./redirects').register(app, config, appRoutes);

if (!entryPoint) {
	page = require('./page');
	devmode = require('./devmode')(port);

	entryPoint = devmode.entry;
	app.use(devmode.middleware);//serve in-memory compiled sources/assets
}

//Static files...
app.use(express.static(assetPath, {
	maxage: 3600000, //1hour
	setHeaders: function(res, path) {
		if (manifest.test(path)) {//manifests never cache
			res.setHeader('Cache-Control', 'public, max-age=0');
		}
	}
}));//static files

//Session manager...
app.use(require('./no-cache'));

api.registerAnonymousEndPoints(app, config);

app.use(/^(?!\/login).*/,session.middleware.bind(session));

api.registerAuthenticationRequiredEndPoints(app, config);

//HTML Renderer...
app.get('*', function(req, res) {
	console.log('Rendering Inital View: %s %s', req.url, req.username);
	var isErrorPage = false;
	global.__setPageNotFound = function() {
		isErrorPage = true;
	};

	//Pre-flight (if any widget makes a request, we will cache its result and
	// send its result to the client)
	page(req, entryPoint, common.nodeConfigAsClientConfig(config, req));

	if (isErrorPage) {
		res.status(404);
	}

	waitFor(req.__pendingServerRequests, 60000)
		.then(function() {
			var clientConfig = common.clientConfig(req.username, req);
			clientConfig.html += datacache.getForContext(req).serialize();
			//Final render
			console.log('Flushing Render to client: %s %s', req.url, req.username);
			res.end(page(req, entryPoint, clientConfig));
		});
});

//Errors
/* jshint -W098 */	// We need the signature to be 4 args long
					// for express to treat it as a error handler
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send('Oops! Something broke!'); });

//Go!
protocol.createServer(mobileapp || app).listen(port, address, function() {
	console.log('Listening on port %d', port); });

if (devmode) {
	devmode.start();
}
