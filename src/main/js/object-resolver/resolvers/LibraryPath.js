// import {CommonSymbols} from 'nti.lib.interfaces';
// let {Service} = CommonSymbols;

import {encodeForURI as encode} from 'nti.lib.interfaces/utils/ntiids';

import {join} from 'path';

const IGNORE = Symbol();

const MIME_TYPES = {
	'application/vnd.nextthought.courses.courseinstance': (o) => `/course/${encode(o.getID())}/`,
	'application/vnd.nextthought.courses.courseoutlinecontentnode': (o) => `/lessons/${encode(o.getID())}/`,
	'application/vnd.nextthought.community': (o, prev, next) => {
		if (next && /communityboard$/i.test(next.MimeType)) {
			next[IGNORE] = true;
		}
		return `/profile/${encodeURIComponent(o.getID())}/activity/`;
	},
	'application/vnd.nextthought.forums.communityboard': () => '/discussions/',
	'application/vnd.nextthought.forums.communityforum': (o, prev, next) => {
		if (prev && /community$/i.test(prev.MimeType)) {
			return `/${o.ID}/`;
		}
		return `/${encode(o.getID())}/`;
	},
	'application/vnd.nextthought.forums.communityheadlinetopic': (o) =>`/${encode(o.getID())}/`,
	'application/vnd.nextthought.relatedworkref': (o, prev, next) => {
		let c;

		if (next && /pageinfo$/i.test(next.MimeType)) {
			if (!prev || prev.ContentNTIID !== next.NTIID) {
				c = `/content/${encode(o.target)}/`;
			} else {
				next[IGNORE] = true;
			}

		}

		if (!c) {
			c = `/external-content/${encode(o.getID())}`;
		}

		return c;
	},

	'application/vnd.nextthought.pageinfo': (o, prev, next) => {
		if (o[IGNORE]) { return ''; }

		let c = `/content/${encode(o.getID())}`;
		if (prev && /relatedworkref$/i.test(prev.MimeType)) {
			c = encode(o.getID());
		}
		else if (next && /pageinfo$/i.test(next.MimeType)) {
			c = '';
		}
		return c;
	},
	'application/vnd.nextthought.ntivideoref': (o, prev, next) => {
		let c = `/videos/${encode(o.getID())}`;
		if(next && /pageinfo$/i.test(next.MimeType)) {
			next[IGNORE] = true;
		}
		return c;
	}
};


function getPathPart(o, i, a) {
	let p = MIME_TYPES[o.MimeType];
	while(typeof p === 'string') {
		p = MIME_TYPES[p];
	}

	if (!p) {
		console.error(o);
		return 'Unknown Path Component';
	}

	return p(o, a[i - 1], a[i + 1]);
}


export default class LibraryPathResolver {

	static handles (o) {
		return o.hasLink('LibraryPath');
	}


	static resolve (o) {
		return new LibraryPathResolver(o).getPath();
	}


	constructor (o) {
		this.object = o;
	}

	getPath () {
		let {object} = this;
		let objectPath = object.getContextPath();
		return objectPath.then(result => {
			let path = result[0].map(getPathPart);

			//This is primarily for UGD... all UGD at this momement is either a Note or Highlight. (Forum/Blog stuff is already handled)

			//if the object has a 'body' we will assume the object is a note or note-like and append the path accordingly...
			// if (object.body) {
			// 	let id = (object.references || [])[0] || object.getID();
			// 	path.push(`/discussions/${encode(id)}`);
			// }

			return join(...path);
		});
	}
}
