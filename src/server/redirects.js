'use strict';

var NTIIDs = require('dataserverinterface/utils/ntiids');
var autoBind = require('dataserverinterface/utils/autobind');
var path = require('path');


var SEGMENT_HANDLERS = {

	redeem: function (segments) {
		return path.join('enrollment','store','gift', segments.slice(0,2).join('/'));
	},


	forcredit: function () {
		return path.join('enrollment','credit','/');
	}

};


function noSegmentHandler(s) {
	console.warn('There is no handler registered for ', s);
}


module.exports = autoBind({
	register: function(express, config, route) {
		this.basepath = config.basepath;
		express.use(route, this.handleRedirects);
	},

	__translateCatalogId: function(input) {
		var catalogId = input
					.replace(/-/g, '+')
					.replace(/_/g, '/');

		catalogId = new Buffer(catalogId, 'base64').toString();
		catalogId = catalogId.replace(/^!@/,'');//strip off the WebApp's 'salt'
		catalogId = NTIIDs.encodeForURI(catalogId);

		return catalogId;
	},

	__translateTrailingPath: function(trailingPath) {
		if (!trailingPath) {
			return;
		}

		var segments = (trailingPath || '').split('/');

		var handler = SEGMENT_HANDLERS[segments[0]] || noSegmentHandler;

		return handler.call(null, segments);
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
				var catalogId = this.__translateCatalogId(parts[1]);
				trailingPath = this.__translateTrailingPath(parts[2]) || '';

				redUrl = path.join(this.basepath, 'library', 'catalog', 'item', catalogId, trailingPath);
			}
			console.log('\n\nredUrl: ', redUrl, '\n\n');
			res.redirect(redUrl);
			return;
		}

		next();
	}
});
