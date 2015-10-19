import StorePrototype from 'common/StorePrototype';

import {
	SET_CONTEXT,
	SET_PAGE_SOURCE,

	CLEAR_NAV_GUARDED,
	SET_NAV_GUARDED
} from './Constants';

const SetData = Symbol('Set Data');

const data = Symbol();

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[SET_CONTEXT]: SetData,
			[SET_PAGE_SOURCE]: SetData,

			[CLEAR_NAV_GUARDED]: CLEAR_NAV_GUARDED,
			[SET_NAV_GUARDED]: SET_NAV_GUARDED
		});
	}


	[CLEAR_NAV_GUARDED] () {
		delete this.getGuardMessage;
	}


	[SET_NAV_GUARDED] (payload) {
		let {response} = payload.action;
		if (typeof response !== 'function') {
			throw new Error('Expected a function.');
		}

		this.getGuardMessage = response;
	}


	[SetData] (payload) {
		let {response, type} = payload.action;
		this[data] = Object.assign({
			path: null,
			pageSource: null,
			currentPage: null,
			context: null
		}, response);

		this.emitChange({type});
	}


	getData () {
		return this[data];
	}
}

export default new Store();
