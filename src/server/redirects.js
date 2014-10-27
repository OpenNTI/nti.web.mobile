'use strict';

var NTIIDs = require('dataserverinterface/utils/ntiids');
var autoBind = require('dataserverinterface/utils/autobind');
var path = require('path');

var me = module.exports = autoBind({
	register: function(express, config, route) {
		this.basepath = config.basepath;
		express.use(route, this.handleRedirects);
	},

	handleRedirects: function(_, res, next) {
		var url = _.originalUrl || _.url;
		var index = (url && url.indexOf('?q=')) || 0;
		var catalog = /library\/availablecourses\/(.*)/;
		var redUrl;

		//library/availablecourses/IUB0YWc6bmV4dHRob3VnaHQuY29tLDIwMTEtMTA6TlRJLUNvdXJzZUluZm8tU3ByaW5nMjAxNV9MU1REXzExNTM

		if (index > 0) {
			redUrl = url.substr(0, index) + '#notifications';

			catalog = url.match(catalog);

			if (catalog) {
				catalog = new Buffer(catalog[1], 'base64').toString();
				catalog = catalog.replace(/^!@/,'');//strip off the WebApps 'salt'
				catalog = NTIIDs.encodeForURI(catalog);

				// /mobile/courseware/catalog/item/NTIID/
				redUrl = path.join(this.basepath, 'courseware', 'catalog', 'item', catalog) + '/';
			}


			res.redirect(redUrl);
			return;
		}

		next();
	}
});
