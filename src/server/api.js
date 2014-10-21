'use strict';

var Promise = global.Promise || require('es6-promise').Promise;

var merge = require('merge');
var request = require('dataserverinterface/utils/request');
var autoBind = require('dataserverinterface/utils/autobind');

function throwError(msg) {
	throw new Error(msg);
}


var api = module.exports = autoBind({

	register: function(express, config) {
		merge(this, config);
		express.get(/^\/api\/user-agreement/, api.serveUserAgreement);
	},


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
