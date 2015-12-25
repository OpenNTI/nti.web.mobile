import path from 'path';

import {CommonSymbols} from 'nti.lib.interfaces';
let {Service} = CommonSymbols;

import {encodeForURI} from 'nti.lib.interfaces/lib/utils/ntiids';

import {load as getLibrary} from 'library/Actions';

const isForum = RegExp.prototype.test.bind(/\.forums\./i);
const isBlog = RegExp.prototype.test.bind(/blog/i);
const isBoard = RegExp.prototype.test.bind(/board/i);
const isCommunity = RegExp.prototype.test.bind(/community$/);


export default class ForumObjectPathResolver {

	//Prefixed with x to prevent it from being called. See ./index.js
	static xhandles (o) {
		let {MimeType} = o || {};
		return isForum(MimeType) && !isBlog(MimeType);
	}


	static resolve (o) {
		return new ForumObjectPathResolver(o).getPath();
	}


	constructor (o) {
		this.focusObject = o;
		this[Service] = o[Service];

		this.getObject = id => this[Service].getParsedObject(id);

		this.get = url => this[Service].get(url);
	}

	getPath () {
		// course forums
		/*
			/course/system-OID-0x09a0a6:5573657273%3ASxckbJ5KZAZ/   <-- course instance id
			discussions/
			unknown-OID-0x0b2915%3A5573657273%3Aar9paCPkF0R/	<-- forum id
			unknown-OID-0x0b2916%3A5573657273%3Aar9paCPkF0P/	<-- topic id
			local-OID-0x14dc6b%3A5573657273%3Ams7PHFqe0n0/		<-- comment id
		*/

		// community forums
		/*
			/profile/
			tag%3Anextthought.com%2C2011-10%3Asystem-NamedEntity%3ACommunity-bleach/	<-- community id
			activity/
			Course_Design/																<-- forum id
			topic/
			Bleach-Topic%3AGeneralCommunity-Course_Design.from_chrome_iOS_pano			<-- topic id
		*/

		let toPathPart = this.getPathPart.bind(this);

		return this.resolveContainers(this.focusObject)
			//clone the array, reverse it.
			.then(x=>x.slice().reverse())
			//add the focusObject to the end
			.then(x=> { x.push(this.focusObject); return x; })
			//convert it to path
			.then(x=> path.join(...x.map(toPathPart)))
			//ensure it begins and ends with '/'
			.then(x=> {
				x = /^\//.test(x) ? x : '/' + x;
				x = /\/$/.test(x) ? x : x + '/';
				return x;
			});
			//to debug:
			// .then(x=>Promise.reject(x));
	}


	getPathPart (obj, i) {
		let id = encodeForURI(obj.getID());

		if (isBoard(obj.MimeType) && i !== 0) {
			return 'discussions';
		}

		if (obj.isCourse) {
			id = encodeForURI(obj.getCourseID());
			return path.join('course', id);
		}

		return id;
	}


	resolveContainers (o) {
		if (!o.ContainerId) {
			let {href} = o;

			if (isCommunity(o.MimeType)) {
				return Promise.resolve([o]);
			}

			if (isBoard(o.MimeType)) {

				//Find a course that has a discussion board with our href.
				return getLibrary()
					.then(library=> library.findCourse(course=> {
						let {
							ParentDiscussions = {},
							Discussions = {}
						} = course.CourseInstance;

						let refs = [
							ParentDiscussions.href,
							Discussions.href
						];

						return refs.indexOf(href) >= 0;
					}) || Promise.reject('No Course found'));
					// .catch(()=> {
					//
					// })
			}

			return Promise.resolve([]);
		}

		return this.getObject(o.ContainerId)
			.then(x => this.resolveContainers(x).then(y => [x].concat(y)));
	}


}
