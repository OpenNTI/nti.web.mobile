import {PAGE_LOADED, PAGE_FAILED} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const SetData = Symbol('set:data');
const SetError = Symbol('set:error');

class Store extends StorePrototype {

	constructor () {
		super();
		this[data] = {};
		this.registerHandlers({
			[PAGE_LOADED]: SetData,
			[PAGE_FAILED]: SetError
		});
	}


	[SetError] (payload) {
		let {ntiid, error} = payload.action.response;

		this[data][ntiid] = error;

		this.emitChange({type: PAGE_FAILED, ntiid});
	}


	[SetData] (payload) {
		let descriptor = payload.action.response;
		let ntiid = descriptor.getID();
		this[data][ntiid] = descriptor;
		this.emitChange({type: PAGE_LOADED, ntiid});
	}


	getPageDescriptor (id) {
		return this[data][id];
	}
}

export default new Store();
