'use strict';
var morgan = require('morgan');

var loguser = morgan['remote-user'];

morgan['remote-user'] = function(req) {
	var u = loguser(req);
	if ((!u || u === '-') && req.username) {
		u = req.username;
	}
	return u;
};


morgan.attachToExpress = function(expressApp) {

	expressApp.use(require('response-time')());
	expressApp.use(require('cookie-parser')());
	expressApp.use(morgan('combined'));
};

module.exports = morgan;
