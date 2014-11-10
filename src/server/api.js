'use strict';

//var Promise = global.Promise || require('es6-promise').Promise;

var assign = Object.assign || require('object-assign');

var request = require('dataserverinterface/utils/request');
var autoBind = require('dataserverinterface/utils/autobind');

function throwError(msg) {
	throw new Error(msg);
}


var api = module.exports = autoBind({

	registerAnonymousEndPoints: function(express, config) {
		var prefix = /^\/api/i;
		assign(this, config);
		express.get(/^\/api\/user-agreement/, api.serveUserAgreement);

		express.use(/^\/api/, function(err, req, res, next){
			if (prefix.test(req.url)) {
				console.error('API Error:\n\n%s', err.stack);
				res.status(500).json({stack: err.stack, message: err.message});
				res.end();
				return;
			}
			next();
		});
	},


	registerAuthenticationRequiredEndPoints: function(){},//function(express, config) {},


	serveUserAgreement: function(req, res) {
		var BODY_REGEX = /<body[^>]*>(.*)<\/body/i;
		var url = this['user-agreement'] || throwError('No user-agreement url set');

		request(url, function(error, r, response) {
			var body = BODY_REGEX.exec(response);

			var data = {
				status: r.statusCode,
				html: response,
				body: body && body[1]
			};

			res.status(data.status);
			res.json(data);
			res.end();
		});
	}
});
