// import {CommonSymbols} from 'nti.lib.interfaces';
// let {Service} = CommonSymbols;

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {getHandler} from './';
import ensureArray from 'nti.lib.interfaces/utils/ensure-array';
import {join} from 'path';

export default class LibraryPathResolver {

	static handles (o) {
		return o.hasLink('LibraryPath');
	}


	static resolve (o) {
		return new LibraryPathResolver(o).getPath();
	}


	constructor (o) {
		this.focusObject = o;
	}

	getPath () {

		let objectPath = this.focusObject.getContextPath();

		return objectPath.then(result => {
			let parts = ensureArray(result)[0];
			let promises = parts.reduce( (previous, current) => {
				previous.push(pathFromPart(current));
				return previous;
			}, []);
			return Promise.all(promises).then(segments => join(...(segments.filter(x=>x))));
		});

		//The resolution of the objectPath should have all the information we need to construct the path.
		//
		//  /course/<courseId>/...etc.

		// return Promise.reject('Implement Library Path Resolver');
	}
}

function pathFromPart(part) {
	let handler = getHandler(part);
	if (handler) {
		return handler.resolve(part);
	}
	else {
		console.debug(part);
		if (part.getID) {
			console.log(encodeForURI(part.getID()));
		}
		return null;
	}
}
