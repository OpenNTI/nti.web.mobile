import {PAGE_LOADED} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this[data] = {};
		this.registerHandlers({
			[PAGE_LOADED]: SetData
		});
	}


	[SetData] (payload) {
		let descriptor = payload.action.response;
		this[data][descriptor.getID()] = descriptor;
		this.emitChange({type: PAGE_LOADED, ntiid: payload.ntiid});
	}


	getPageDescriptor (id) {
		return this[data][id];
	}
}

export default new Store();
