/*eslint strict:0, import/no-commonjs:0, import/order:0*/
'use strict';
const path = require('path');
const {
	HREF,
	isNTIID,
	encodeForURI,
	decodeFromURI,
} = require('@nti/lib-ntiids');
const logger = require('./logger');

const SEGMENT_HANDLERS = {
	redeem: (catalogId, segments) =>
		path.join('catalog', 'redeem', catalogId, segments[1]),

	forcredit: catalogId =>
		// catalog/enroll/apply/NTI-CourseInfo-Summer2015_LSTD_1153_Block_C/
		path.join('catalog', 'enroll', 'apply', catalogId, '/'),

	[null]: catalogId => path.join('catalog', 'item', catalogId),
};

const HANDLERS = {
	handleObjectRedirects: /\/(id|ntiid|object)\//i,
	handleInvitationRedirects: /(invitations\/accept)|(catalog\/redeem)/i,
	handleLibraryRedirects: /^library/i,
	handleProfileRedirects: /\/(user|group)/i,
	//the path may not always start with /app/ but it will always be have one path segment in front.
	handleLibraryPathRedirects: /^\/[^/]+\/library/i,
	handleCatalogPathRedirects: /^\/[^/]+\/catalog\/nti-course-catalog-entry/i,
	handleBundlePathRedirect: /^\/[^/]+\/bundle/i,
	handleCommunityPathRedirect: /^\/[^/]+\/community/i,
};

exports = module.exports = {
	register(express, config) {
		this.basepath = config.basepath;

		express.use((req, res, next) => {
			// the query (q) is deprecated, but
			// if its present, it trumps the path (p)
			let redirectParam = req.query.q || req.query.p;
			let redirectFragment = req.query.f;
			if (!redirectParam) {
				return next();
			}

			logger.info('TESTING FOR REDIRECT: ', redirectParam);

			for (let handlerName of Object.keys(HANDLERS)) {
				let test = HANDLERS[handlerName];
				if (redirectParam.match(test)) {
					return this[handlerName](
						redirectParam,
						res,
						next,
						redirectFragment
					);
				}
			}

			return res.redirect(this.basepath);
		});
	},

	handleProfileRedirects(query, res, next) {
		/*
		 *	from:
		 *	/app/user/me/...
		 *
		 *	to:
		 *	/mobile/profile/<user>/...
		 */

		const pattern = /\/(?:user|group)\/(.*)/;
		const [, rest] = query.match(pattern) || [];

		if (!rest) {
			return next();
		}

		const url = path.join(this.basepath, 'profile', rest);
		logger.info('redirecting to: %s', url);
		res.redirect(url);
	},

	handleInvitationRedirects(query, res, next) {
		/*
		 *	from:
		 *	library/courses/available/invitations/accept/<token>
		 *	or:
		 *	/app/catalog/redeem/<token>
		 *
		 *	to:
		 *	<basepath>/catalog/code/<token>
		 */

		// [full match, token]
		let parts = query.match(/(?:accept|redeem)\/([^/]*)/);
		if (parts) {
			let url = path.join(this.basepath, 'catalog', 'redeem', parts[1]);
			logger.info('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	},

	handleCatalogPathRedirects(query, res, next) {
		/* From:
		 *  /app/catalog/nti-course-catalog-entry/<id>
		 *
		 * To:
		 *  <basepath>/catalog/item/<id>
		 */
		const pattern = /catalog\/nti-course-catalog-entry\/([^/]*)/;
		let [, id] = query.match(pattern) || [];

		if (!id) {
			return next();
		}

		if (/^uri/i.test(id)) {
			id = decodeURIComponent(id).replace(/^uri:/i, '');
			id = encodeForURI(HREF.encodeIdFrom(id));
		}

		if (isNTIID(id)) {
			id = encodeForURI(id);
		}

		const url = path.join(this.basepath, 'catalog', 'item', id);
		res.redirect(url);
	},

	handleLibraryPathRedirects(query, res, next) {
		/* From:
		 * /app/library/courses/available/NTI-CourseInfo-iLed_iLed_001/...
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
			return;
		}

		next();
	},

	handleLibraryRedirects(query, res, next) {
		let url = query;
		let catalog = /library\/availablecourses\/([^/]*)\/?(.*)/;

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

	handleBundlePathRedirect(query, res, next, fragment) {
		const partMap = {
			app: '',
			bundle: 'content',
			content: 'page',
			notebook: 'n',
		};

		const fixed = query
			.split('/')
			.map(part => (partMap[part] == null ? part : partMap[part]))
			.filter(Boolean);

		let url = path.join(this.basepath, ...fixed);

		if (fragment) {
			url = `${url}#${fragment}`;
		}

		res.redirect(url);
	},

	handleCommunityPathRedirect(query, res, next) {
		const partMap = {
			app: '',
		};

		const fixed = query
			.split('/')
			.map(part => (partMap[part] == null ? part : partMap[part]))
			.filter(Boolean);

		res.redirect(path.join(this.basepath, ...fixed));
	},

	handleObjectRedirects(query, res, next) {
		/* From:
		 *	/app/id/unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 *	object/ntiid/tag:nextthought.com,2011-10:unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 *
		 * To:
		 * 	<basepath>/object/unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 */

		logger.debug('\n\n\nTesting %s\n\n\n', query);
		let object = /(?:(?:id|object\/ntiid|object)\/)([^/\n\r]*)\/?(.*)/;
		let match = decodeURIComponent(query).match(object);

		if (match) {
			let [, ntiid] = match;

			let url = path.join(
				this.basepath,
				'object',
				encodeForURI(decodeFromURI(ntiid))
			);

			logger.info('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	},
};

function translatePath(catalogId, trailingPath) {
	let segments = (trailingPath || '').split('/');

	let handler = SEGMENT_HANDLERS[segments[0] || null];

	return handler.call(null, catalogId, segments);
}

function translateCatalogId(input) {
	let catalogId = input.replace(/-/g, '+').replace(/_/g, '/');

	catalogId = new Buffer(catalogId, 'base64').toString();
	catalogId = catalogId.replace(/^!@/, ''); //strip off the WebApp's 'salt'
	catalogId = encodeForURI(catalogId);

	return catalogId;
}
