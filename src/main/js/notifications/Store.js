import {LOADED_NOTIFICATIONS} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[LOADED_NOTIFICATIONS]: SetData
		});
	}


	get isLoaded () {
		return !!this[data];
	}


	[SetData] (payload) {
		this[data] = payload.action.response;
		this.emitChange({type: LOADED_NOTIFICATIONS});
	}


	getData () { return this[data]; }
}

export default new Store();
