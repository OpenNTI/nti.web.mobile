import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const isOutlineNode = RegExp.prototype.test.bind(/\.courseoutlinecontentnode$/i);

export default class OutlineNodePathResolver {
	static handles (o) {
		let {MimeType} = o || {};
		return isOutlineNode(MimeType);
	}

	static resolve (o) {
		return new OutlineNodePathResolver(o).getPath();
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
			lessons/OU-HTML-OU_LSTD_1153_601_SU_2015_A_History_of_the_United_States.lec%3A01.02_LESSON/ <-- lesson id
		*/

		let object = this.focusObject;
		let id = encodeForURI(object.getID());

		return Promise.resolve(`/lessons/${id}/`);
	}
}

