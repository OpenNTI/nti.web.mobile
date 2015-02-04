import {LOADED_LIBRARY} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[LOADED_LIBRARY]: SetData
		});
	}


	[SetData] (payload) {
		var d = payload.action.response;
		d.loaded = true;
		this[data] = d;
		this.emitChange({type: LOADED_LIBRARY});
	}


	getData () { return this[data]; }
}

export default new Store();
