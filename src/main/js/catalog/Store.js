import {LOAD_CATALOG, LOADED_CATALOG} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const SetLoading = Symbol('set:loading');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[LOAD_CATALOG]: SetLoading,
			[LOADED_CATALOG]: SetData
		});
	}


	get isLoaded () {
		return !!this[data];
	}


	[SetLoading] () {
		this.loading = true;
		this.emitChange({type: LOAD_CATALOG});
	}


	[SetData] (payload) {
		let d = this[data] = payload.action.response;
		d.applied = new Date();
		this.loading = false;
		this.emitChange({type: LOADED_CATALOG});
	}


	getData () { return this[data]; }


	getEntry (id) {
		let d = this[data];
		let entry = {loading: true};
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
