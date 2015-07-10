// import {CommonSymbols} from 'nti.lib.interfaces';
// let {Service} = CommonSymbols;

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const isCourse = RegExp.prototype.test.bind(/\.courseinstance/i);

export default class CourseObjectPathResolver {

	static handles (o) {
		let {MimeType} = o || {};
		return isCourse(MimeType);
	}


	static resolve (o) {
		return new CourseObjectPathResolver(o).getPath();
	}


	constructor (o) {
		this.focusObject = o;
		// this[Service] = o[Service];

		// this.getObject = id => this[Service].getParsedObject(id);
		//
		// this.get = url => this[Service].get(url);
	}

	getPath () {
		/*
			/course/system-OID-0x09a0a6%3A5573657273%3ASxckbJ5KZAZ/   <-- course instance id
		*/

		let object = this.focusObject;
		let id = encodeForURI(object.getID());

		// if (object is enrollement wrapper) {
		// 	object = object get instance
		// }

		return Promise.resolve(`/course/${id}/`);
	}
}
