import {encodeForURI} from 'nti-lib-ntiids';
import logger from './logger';
import path from 'path';

const SEGMENT_HANDLERS = {

	redeem: (catalogId, segments) =>
		path.join('catalog', 'redeem', catalogId, segments[1]),

	forcredit: (catalogId) =>
		// catalog/enroll/apply/NTI-CourseInfo-Summer2015_LSTD_1153_Block_C/
		path.join('catalog', 'enroll', 'apply', catalogId, '/'),

	[null]: (catalogId)=> path.join('catalog', 'item', catalogId)
};

const HANDLERS = {
	handleObjectRedirects: /^(object|ntiid)/i,
	handleInvitationRedirects: /invitations\/accept/i,
	handleLibraryRedirects: /^library/i,
	handleLibraryPathRedirects: /^\/*app\/library/i
};


export default {

	register (express, config) {
		this.basepath = config.basepath;

		express.use((req, res, next) => {
			let redirectParam = req.query.p || req.query.q;
			if (!redirectParam) {
				return next();
			}

			for (let handlerName of Object.keys(HANDLERS)) {
				let test = HANDLERS[handlerName];
				if (redirectParam.match(test)) {
					return this[handlerName](redirectParam, res, next);
				}
			}

			return res.redirect(this.basepath);
		});
	},


	handleInvitationRedirects (query, res, next) {
		/*
		 *	from:
		 *	?q=library/courses/available/invitations/accept/<token>
		 *
		 *	to:
		 *	<basepath>/catalog/code/<token>
		 */

		// [full match, token]
		let parts = query.match(/accept\/([^\/]*)/);
		if (parts) {
			let url = path.join(this.basepath, 'catalog', 'code', parts[1]);
			logger.info('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	},

	handleLibraryPathRedirects (query, res, next) {
		/* From:
		 * ?p=/app/library/courses/available/NTI-CourseInfo-iLed_iLed_001/...
		 *
		 * To:
		 * <basepath>/catalog/item/NTI-CourseInfo-iLed_iLed_001/...
		 */

		let pattern = /library\/courses\/available\/(.*)/;
		let parts = query.match(pattern);
		if (parts) {
			let url = path.join(this.basepath, 'catalog', 'item', parts[1]);
			logger.info('redirecting to: %s', url);
			res.redirect(url);
		}

		next();
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
			let trailingPath = translatePath(catalogId, parts[2]) || '';

			url = path.join(this.basepath, trailingPath);

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


		logger.debug('\n\n\nTesting %s\n\n\n', query);
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


function translatePath (catalogId, trailingPath) {
	let segments = (trailingPath || '').split('/');

	let handler = SEGMENT_HANDLERS[segments[0] || null];

	return handler.call(null, catalogId, segments);
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
