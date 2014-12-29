'use strict';

var NTIIDs = require('dataserverinterface/utils/ntiids');
var autoBind = require('dataserverinterface/utils/autobind');
var path = require('path');

module.exports = autoBind({
	register: function(express, config, route) {
		this.basepath = config.basepath;
		express.use(route, this.handleRedirects);
	},

	translateCatalogId: function(input) {
		var catalogId = input
					.replace(/-/g, '+')
					.replace(/_/g, '/');

		catalogId = new Buffer(catalogId, 'base64').toString();
		catalogId = catalogId.replace(/^!@/,'');//strip off the WebApp's 'salt'
		catalogId = NTIIDs.encodeForURI(catalogId);

		return catalogId;
	},

	translateTrailingPath: function(trailingPath) {

		var segments = (trailingPath || '').split('/');
		var translated = '';

		switch(segments[0]) {
			case 'redeem':
				translated = path.join('enrollment','store','gift', segments.slice(0,2).join('/'));
				break;

			case 'forcredit':
				translated = path.join('enrollment','credit','/');
				break;
		}

		return translated;
	},

	handleRedirects: function(_, res, next) {

		var url = _.originalUrl || _.url;
		var index = (url && url.indexOf('?q=')) || 0;
		var catalog = /library\/availablecourses\/([^\/]*)\/?(.*)/;
		var redUrl, parts, trailingPath;

		/* From:
		 * ?q=library/availablecourses/IUB0YWc6bmV4dHRob3VnaHQuY29tLDIwMTEtMTA6TlRJLUNvdXJzZUluZm8tU3ByaW5nMjAxNV9MU1REXzExNTM/redeem/code
		 *
		 * To:
		 * <basepath>/library/catalog/item/NTI-CourseInfo-Spring2015_LSTD_1153/enrollment/store/gift/redeem/code
		 */
		if (index > 0) {
			// default to root view with notification drawer open:
			// '/mobile/#notifications'
			redUrl = url.substr(0, index) + '#notifications';

			// [full match, catalog item id (encoded), trailing path]
			parts = url.match(catalog);

			if (parts) {
				var catalogId = this.translateCatalogId(parts[1]);
				trailingPath = this.translateTrailingPath(parts[2]);
				redUrl = path.join(this.basepath, 'library', 'catalog', 'item', catalogId, trailingPath);
			}
			console.log('\n\nredUrl: ', redUrl, '\n\n');
			res.redirect(redUrl);
			return;
		}

		next();
	}
});
