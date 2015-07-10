// import {CommonSymbols} from 'nti.lib.interfaces';
// let {Service} = CommonSymbols;

// import {encodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

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

		//The resolution of the objectPath should have all the information we need to construct the path.
		//
		//  /course/<courseId>/...etc.

		return Promise.reject('Implement Library Path Resolver');
	}
}
