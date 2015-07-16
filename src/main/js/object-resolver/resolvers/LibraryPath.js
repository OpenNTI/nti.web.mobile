// import {CommonSymbols} from 'nti.lib.interfaces';
// let {Service} = CommonSymbols;

import {encodeForURI as encode} from 'nti.lib.interfaces/utils/ntiids';

import {join} from 'path';

const IGNORE = Symbol();

const isPageInfo = RegExp.prototype.test.bind(/pageinfo$/i);


const MIME_TYPES = {
	'application/vnd.nextthought.courses.courseinstance': (o) => `/course/${encode(o.getID())}/`,
	'application/vnd.nextthought.courses.courseoutlinecontentnode': (o) => `/lessons/${encode(o.getID())}/`,
	'application/vnd.nextthought.community': (o) => `/profile/${encodeURIComponent(o.getID())}/activity/`,
	'application/vnd.nextthought.forums.communityboard': () => '/discussions/',

	'application/vnd.nextthought.forums.communityforum': (o, prev) => {
		if (prev && /community$/i.test(prev.MimeType)) {
			return `/${o.ID}/`;
		}
		return `/${encode(o.getID())}/`;
	},

	'application/vnd.nextthought.forums.communityheadlinetopic': (o) => {
		console.debug(o);
		return `/${encode(o.getID())}/`;
	},


	'application/vnd.nextthought.relatedworkref': (o, prev, next) => {
		let c = `/content/`;

		if (o.isExternal) {
			c = `/external-content/${encode(o.getID())}`;
			if (next) {
				next[IGNORE] = true;
			}
		}
		else if (!next || !isPageInfo(next.MimeType)) {
			console.error('Unexpected Path sequence. Internal RelatedWorkReferences should be followed by a pageInfo');
		}
		else if (next && next.getID() !== o.target) {
			c += `${encode(o.target)}/`;
		}

		return c;
	},


	'application/vnd.nextthought.pageinfo': (o, prev, next, target) => {
		let c = `${encode(o.getID())}/`;


		if (next && isPageInfo(next.MimeType)) {
			c = '';
		}

		if (!next && target && target.body) {
			c += 'discussions/';
		}

		return c;
	},


	'application/vnd.nextthought.ntivideoref': (o, prev, next, target) => {
		let c = `/videos/${encode(o.getID())}/`;
		if(next && /pageinfo$/i.test(next.MimeType)) {
			next[IGNORE] = true;
		}

		if ((!next || next[IGNORE]) && target && target.body) {
			c += 'discussions/';
		}

		return c;
	}
};


function getPathPart(targetObject, o, i, a) {
	if (o[IGNORE]) {
		o = a[i + 1]; //once we ignore, we continue to ignore.
		if (o) {
			o[IGNORE] = true;
		}
		return '';
	}

	let p = MIME_TYPES[o.MimeType];
	while(typeof p === 'string') {
		p = MIME_TYPES[p];
	}

	if (!p) {
		console.error(o);
		return 'Unknown Path Component';
	}

	return p(o, a[i - 1], a[i + 1], targetObject);
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
			result = result[0];
			if (!result) {
				return Promise.reject('Not Found');
			}

			let path = result.map(getPathPart.bind(this, object)),
				ugd = object.headline || object;

			//This is primarily for UGD... all UGD at this momement is either a Note or Highlight. (Forum/Blog stuff is already handled)

			// if the object has a 'body' we will assume the object is a note or note-like and append the path accordingly...
			if (ugd.body) {
				let id = (object.references || [])[0] || object.getID();
				path.push(`/${encode(id)}/`);
			}

			return join(...path);
		});
	}
}
