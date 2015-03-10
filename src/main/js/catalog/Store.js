import {LOADED_CATALOG} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[LOADED_CATALOG]: SetData
		});
	}


	get isLoaded () {
		return !!this[data];
	}


	[SetData] (payload) {
		var d = this[data] = payload.action.response;
		d.applied = new Date();
		this.emitChange({type: LOADED_CATALOG});
	}


	getData () { return this[data]; }


	getEntry (id) {
		var d = this[data];
		var entry = {loading: true};
		if (d && d.findEntry) {
			entry = d.findEntry(id);
		}

		return entry;
	}


	setActivePageSource (ps) {
		this.pageSource = ps;
	}


	getPageSource () {
		return this.pageSource;
	}
}

export default new Store();
