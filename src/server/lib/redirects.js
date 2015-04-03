import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import logger from './logger';
import path from 'path';

const SEGMENT_HANDLERS = {

	redeem: (segments) =>
		path.join('enrollment', 'store', 'gift', segments.slice(0, 2).join('/')),

	forcredit: () =>
		path.join('enrollment', 'credit', '/'),

	[null]: (s)=> console.warn('There is no handler registered for ', s)
};

const HANDLERS = {
	handleObjectRedirects: /^(object|ntiid)/i,
	handleLibraryRedirects: /^library/i
};


export default {

	register (express, config) {
		this.basepath = config.basepath;

		express.use((req, res, next)=>{
			let redirectQuery = req.query.q;
			if (!redirectQuery) {
				return next();
			}

			for (let handlerName of Object.keys(HANDLERS)) {
				let test = HANDLERS[handlerName];
				if (redirectQuery.match(test)) {
					return this[handlerName](redirectQuery, res, next);
				}
			}

		});
	},


	handleLibraryRedirects (query, res, next) {
		let url = query;
		let catalog = /library\/availablecourses\/([^\/]*)\/?(.*)/;

		/* From:
		 * ?q=library/availablecourses/IUB0YWc6bmV4dHRob3VnaHQuY29tLDIwMTEtMTA6TlRJLUNvdXJzZUluZm8tU3ByaW5nMjAxNV9MU1REXzExNTM/redeem/code
		 *
		 * To:
		 * <basepath>/catalog/item/NTI-CourseInfo-Spring2015_LSTD_1153/enrollment/store/gift/redeem/code
		 */

		// [full match, catalog item id (encoded), trailing path]
		let parts = url.match(catalog);
		if (parts) {
			let catalogId = translateCatalogId(parts[1]);
			let trailingPath = translateTrailingPath(parts[2]) || '';

			url = path.join(this.basepath, 'catalog', 'item', catalogId, trailingPath);

			logger.info('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	},


	handleObjectRedirects (query, res, next) {

		/* From:
		 *	?q=object/ntiid/tag:nextthought.com,2011-10:unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 *
		 * To:
		 * 	<basepath>/object/unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 */


		console.log('\n\n\nTesting %s\n\n\n', query);
		let object = /(?:(?:object|ntiid)\/)+([^\/]*)\/?(.*)/;
		let match = decodeURIComponent(query).match(object);

		if (match) {
			let [, ntiid] = match;

			let url = path.join(this.basepath, 'object', encodeForURI(ntiid));

			logger.info('redirecting to: %s', url);
			res.redirect(url);
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
