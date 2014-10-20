'use strict';

var Promise = global.Promise || require('es6-promise').Promise;

var merge = require('merge');
var request = require('dataserverinterface/utils/request');
var autoBind = require('dataserverinterface/utils/autobind');

var api = module.exports = autoBind({

	register: function(express, config) {
		merge(this, config);
		console.log(config);
		express.get(/^\/api\/user-agreement/, api.serveUserAgreement);
	},


	serveUserAgreement: function(req, res) {
		var BODY_REGEX = /<body[^>]*>(.*)<\/body/i;
		var url = this['user-agreement'] || 'http://nextthought.com';

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
