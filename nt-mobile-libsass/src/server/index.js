"use strict";

if (typeof Promise === 'undefined') {
	global.Promise = require('es6-promise').Promise;
}

var appRoutes = '/';

var express = require("express");
var morgan = require('morgan');
var path = require("path");

var common = require("./common.js");
var generated = require('./generated.js');

//var session = require("./dataserver/session");

var entryPoint = generated.stats;
var page = generated.page;

var app = express();

//patch morgan to read remote-user from an alternate place.
// var loguser = morgan['remote-user'];
// morgan['remote-user'] = function(req) {
// 	var u = loguser(req);
// 	if ((!u || u === '-') && req.username) {
// 		u = req.username;
// 	}
// 	return u;
// };

//app.use(require('response-time')());
//app.use(require('cookie-parser')());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, "..")));
//app.use(appRoutes, session.middleware.bind(session));

app.get(appRoutes, function(req, res) {
	console.log('Rendering Inital View: %s %s', req.url, req.username);
	res.end(page(req, entryPoint, common.clientConfig()));
});

var server = app.listen(9000, function() {
	console.log('Listening on port %d', server.address().port);
});
