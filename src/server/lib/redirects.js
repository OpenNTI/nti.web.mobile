import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import path from 'path';

const SEGMENT_HANDLERS = {

	redeem: (segments) =>
		path.join('enrollment', 'store', 'gift', segments.slice(0, 2).join('/')),

	forcredit: () =>
		path.join('enrollment', 'credit', '/'),

	[null]: (s)=> console.warn('There is no handler registered for ', s)
};


export default {

	register (express, config) {
		this.basepath = config.basepath;
		express.use(/\?q\=/i, this.handleRedirects);
	},


	handleRedirects (_, res, next) {

		let url = _.originalUrl || _.url;
		let index = (url && url.indexOf('?q=')) || 0;
		let catalog = /library\/availablecourses\/([^\/]*)\/?(.*)/;
		let redUrl, parts, trailingPath;

		/* From:
		 * ?q=library/availablecourses/IUB0YWc6bmV4dHRob3VnaHQuY29tLDIwMTEtMTA6TlRJLUNvdXJzZUluZm8tU3ByaW5nMjAxNV9MU1REXzExNTM/redeem/code
		 *
		 * To:
		 * <basepath>/catalog/item/NTI-CourseInfo-Spring2015_LSTD_1153/enrollment/store/gift/redeem/code
		 */
		if (index > 0) {
			// default to root view with notification drawer open:
			// '/mobile/#notifications'
			redUrl = url.substr(0, index) + '#notifications';

			// [full match, catalog item id (encoded), trailing path]
			parts = url.match(catalog);

			if (parts) {
				let catalogId = translateCatalogId(parts[1]);
				trailingPath = translateTrailingPath(parts[2]) || '';

				redUrl = path.join(this.basepath, 'catalog', 'item', catalogId, trailingPath);
			}
			console.log('\n\nredUrl: ', redUrl, '\n\n');
			res.redirect(redUrl);
			return;
		}

		next();
	}
};


function translateTrailingPath (trailingPath) {
	if (!trailingPath) {
		return void 0;
	}

	let segments = (trailingPath || '').split('/');

	let handler = SEGMENT_HANDLERS[segments[0] || null];

	return handler.call(null, segments);
}


function translateCatalogId (input) {
	let catalogId = input
				.replace(/-/g, '+')
				.replace(/_/g, '/');

	catalogId = new Buffer(catalogId, 'base64').toString();
	catalogId = catalogId.replace(/^!@/, '');//strip off the WebApp's 'salt'
	catalogId = encodeForURI(catalogId);

	return catalogId;
}
