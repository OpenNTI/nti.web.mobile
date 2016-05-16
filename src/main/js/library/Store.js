import {LOADED_LIBRARY} from './Constants';

import StorePrototype from 'nti-lib-store';

const data = Symbol('data');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[LOADED_LIBRARY]: SetData
		});
	}


	get isLoaded () {
		return !!this[data];
	}


	[SetData] (payload) {
		this[data] = payload.action.response;
		this.emitChange({type: LOADED_LIBRARY});
	}


	getData () { return this[data]; }


	hasCatalog () {
		let lib = this.getData();
		return lib ? lib.hasCatalog() : false;
	}
}

export default new Store();
