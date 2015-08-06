import {join} from 'path';

import {CommonSymbols} from 'nti.lib.interfaces';
let {Service} = CommonSymbols;

import {encodeForURI as encode} from 'nti.lib.interfaces/utils/ntiids';

import LibraryPath, {isPageInfo} from './LibraryPath';

export default class RandomContentPagesResolver extends LibraryPath {

	static handles (o) {
		return isPageInfo(o);
	}


	static resolve (o) {
		return new RandomContentPagesResolver(o).getPath();
	}


	constructor (o) {
		super(o);

		this.getContentPath = id => o[Service].getContextPathFor(id);
	}


	overrides (key, item, index, list) {
		let prev = list[index - 1];
		//return a different handler for PageInfos in books
		if (isPageInfo(key) && prev && /contentpackage/i.test(prev.Class)) {
			return this.handleBookPageInfo.bind(this);
		}
	}



	handleBookPageInfo (item) {
		return `${encode(item.getPackageID())}/${encode(item.getID())}/`;
	}



	getPath () {
		let {object} = this;
		let id = object.getID();

		return this.getContentPath(id)
			.then(result => {
				result = result[0];
				if (!result) {
					return Promise.reject('Not Found');
				}

				let last = result[result.length - 1];
				if (last.getID() !== id || !isPageInfo(last)) {
					result = result.slice().concat(object);
				}

				let path = result.map(this.getPathPart.bind(this));


				return join(...path);
			});
	}
}
