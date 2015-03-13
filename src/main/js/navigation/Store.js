import StorePrototype from 'common/StorePrototype';

import {
	SET_CONTEXT,
	SET_PAGE_SOURCE
} from './Constants';

const SetData = Symbol('Set Data');

const data = Symbol();

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[SET_CONTEXT]: SetData,
			[SET_PAGE_SOURCE]: SetData
		});
	}


	[SetData] (payload) {
		let {response, type} = payload.action;
		this[data] = response;

		this.emitChange({type});
	}


	getData () {
		return this[data];
	}
}

export default new Store();
