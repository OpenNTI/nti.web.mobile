import { join } from 'path';

// import {Models, Service} from '@nti/lib-interfaces';
import Logger from '@nti/util-logger';
import { encodeForURI as encode } from '@nti/lib-ntiids';
import { profileHref } from 'internal/profile/mixins/ProfileLink';

const logger = Logger.get('object:resolvers:LibraryPath');

const IGNORE = Symbol();

export const isPageInfo = o =>
	typeof o !== 'string'
		? o && isPageInfo(o.MimeType || o.mimeType || o.Class)
		: /pageinfo$/i.test(o);

const getTarget = x =>
	x.target || x[Object.keys(x).filter(k => /target-ntiid/i.test(k))[0]];

const MIME_TYPES = {
	contentpackage(o, prev, next) {
		if (next.isBoard) {
			return `/content/${encode(o.getID())}`;
		}

		return `/content/${encode(o.getID())}/o/`;
	},
	contentpackagebundle: 'contentpackage',
	publishablecontentpackagebundle: 'contentpackage',

	'courses.legacycommunitybasedcourseinstance': 'courses.courseinstance',
	'courses.courseinstance': o => `/course/${encode(o.getID())}/`,
	'courses.courseoutlinecontentnode': o =>
		`/lessons/${encode(o.getContentId())}/`,
	'courses.scormcourseinstance': o => `/course/${encode(o.getID())}`,
	community: o => `/community/${encodeURIComponent(o.getID())}/`,
	dynamicfriendslist: o =>
		`/profile/${encodeURIComponent(o.getID())}/activity/`,
	'forums.dflboard': 'forums.communityboard',
	'forums.contentboard': 'forums.communityboard',
	'forums.dflforum': o => `/${encode(o.getID())}/`,
	'forums.communityboard'(o, prev) {
		if (prev.isCommunity) {
			return '';
		}

		if (prev.isCourse || prev.isBundle) {
			return '/community/';
		}

		return '/discussions/';
	},

	'forums.contentforum': 'forums.communityforum',
	'forums.communityforum'(o, prev) {
		if (prev && /community$/i.test(prev.MimeType)) {
			return `/${o.ID}/`;
		}
		return `/${encode(o.getID())}/`;
	},
	'forums.personalblog': () => '/thoughts/',
	'forums.personalblogentry': o => `/${encode(o.getID())}/`,
	'forums.dflheadlinetopic': 'forums.communityheadlinetopic',
	'forums.communityheadlinetopic'(o, prev, next, obj) {
		if (!next && obj && obj.isComment) {
			return `/${encode(o.getID())}/discussions/`;
		}
		return `/${encode(o.getID())}/`;
	},

	['courseware.coursecalendar'](o, prev, next) {
		let p = '/#calendar';
		if (next) {
			p = join(p, encode(next.getID()));
			next[IGNORE] = true;
		}
		return p;
	},

	nticalendareventref: '--lessonItemRef',
	assignmentref: '--lessonItemRef',
	questionsetref: '--lessonItemRef',
	pollref: '--lessonItemRef',
	surveyref: '--lessonItemRef',
	'--lessonItemRef'(o, prev, next, target) {
		if (prev.isOutlineNode) {
			this.lessonItems.add(target);
			let c = `/items/${encode(o.getID())}`;

			if (!next && target && target.body) {
				c += '/discussions/';
			}

			return c;
		}
		return MIME_TYPES.relatedworkref.apply(this, arguments);
	},
	relatedworkref(o, prev, next, target) {
		let c = '/content/';

		if (o.isExternal) {
			c = `/items/${encode(o.getID())}/`;

			if (next && isPageInfo(next.MimeType)) {
				next[IGNORE] = true;
			}

			if (target && target.body) {
				c += 'discussions/';
			}
		} else if (!next || !isPageInfo(next.MimeType)) {
			logger.error(
				'Unexpected Path sequence. Internal RelatedWorkReferences should be followed by a pageInfo'
			);
		} else if (next && next.getID() !== o.target) {
			let id = getTarget(o);

			c += `${encode(id)}/`;
		}

		return c;
	},

	pageinfo(o, prev, next, target) {
		let c = `${encode(o.getID())}/`;

		if (
			(next && isPageInfo(next.MimeType)) ||
			this.lessonItems.has(target)
		) {
			c = '';
		}

		if (!next && target && target.body) {
			c += 'discussions/';
		}

		return c;
	},

	user: profileHref,

	ntislidedeck: () => '',

	ntivideo: 'ntivideoref',
	ntivideoref(o, prev, next, target) {
		let c = `/videos/${encode(o.getID())}/`;
		if (next && /pageinfo$/i.test(next.MimeType)) {
			next[IGNORE] = true;
		}

		if ((!next || next[IGNORE]) && target && target.body) {
			c += 'discussions/';
		}

		return c;
	},
};

export default class LibraryPathResolver {
	lessonItems = new Set();

	static handles(o) {
		return !isPageInfo(o) && o?.getID?.();
	}

	static resolve(o) {
		return new LibraryPathResolver(o).getPath();
	}

	constructor(o) {
		this.object = o;
	}

	getPathPart = (o, i, a) => {
		const { object } = this;
		if (o[IGNORE]) {
			o = a[i + 1]; //once we ignore, we continue to ignore.
			if (o) {
				o[IGNORE] = true;
			}
			return '';
		}

		const key = (o.MimeType || o.mimeType || o.Class)
			.replace(/application\/vnd\.nextthought\./, '')
			.toLowerCase();

		let p = MIME_TYPES[key];
		while (typeof p === 'string') {
			p = MIME_TYPES[p];
		}

		if (this.overrides) {
			p = this.overrides(key, o, i, a) || p;
		}

		if (!p) {
			logger.error(o);
			return 'Unknown Path Component';
		}

		return p.call(this, o, a[i - 1], a[i + 1], object);
	};

	async getPath() {
		const { object } = this;
		const [result] = (await object.getContextPath?.()) ?? [];

		if (!result) {
			return Promise.reject('Not Found');
		}

		const path = result.map(this.getPathPart);
		const ugd = object.headline || object;

		//This is primarily for UGD... all UGD at this mom7ent is either a Note or Highlight. (Forum/Blog stuff is already handled)

		// if the object has a 'body' we will assume the object is a note or note-like and append the path accordingly...
		if (ugd.body) {
			const id = (object.references || [])[0] || object.getID();
			path.push(`/${encode(id)}/`);
		}

		return join(...path);
	}
}
