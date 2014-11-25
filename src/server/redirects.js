'use strict';

var NTIIDs = require('dataserverinterface/utils/ntiids');
var autoBind = require('dataserverinterface/utils/autobind');
var path = require('path');

module.exports = autoBind({
	register: function(express, config, route) {
		this.basepath = config.basepath;
		express.use(route, this.handleRedirects);
	},

	handleRedirects: function(_, res, next) {
		var url = _.originalUrl || _.url;
		var index = (url && url.indexOf('?q=')) || 0;
		var catalog = /library\/availablecourses\/([^\/]*)\/?(.*)/;
		var redUrl, encoded, redeem;

		/* From:
		 * ?q=library/availablecourses/IUB0YWc6bmV4dHRob3VnaHQuY29tLDIwMTEtMTA6TlRJLUNvdXJzZUluZm8tU3ByaW5nMjAxNV9MU1REXzExNTM/redeem/code
		 *
		 * To:
		 * <basepath>/library/catalog/item/NTI-CourseInfo-Spring2015_LSTD_1153/enrollment/store/gift/redeem/code
		 */
		if (index > 0) {
			redUrl = url.substr(0, index) + '#notifications';

			catalog = url.match(catalog);

			if (catalog) {
				encoded = catalog[1]
							.replace(/-/g, '+')
							.replace(/_/g, '/');

				redeem = (catalog[2] || '').split('/');
				if (!/^redeem$/i.test(redeem[0])) {
					redeem = '';
				} else {
					redeem = path.join('enrollment','store','gift', redeem.slice(0,2).join('/'));
				}

				catalog = new Buffer(encoded, 'base64').toString();
				catalog = catalog.replace(/^!@/,'');//strip off the WebApps 'salt'
				catalog = NTIIDs.encodeForURI(catalog);

				redUrl = path.join(this.basepath, 'library', 'catalog', 'item', catalog) + '/' + redeem;
			}


			res.redirect(redUrl);
			return;
		}

		next();
	}
});
