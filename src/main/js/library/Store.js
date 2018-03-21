import StorePrototype from 'nti-lib-store';

import {LOADED_LIBRARY} from './Constants';


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
		if (this._unsubscribe) {
			this._unsubscribe();
		}

		const {response: lib} = payload.action;

		const onChange = () => {
			this.emitChange({type: LOADED_LIBRARY});
		};

		lib.addListener('change', onChange);
		this._unsubscribe = () => lib.removeListener('change', onChange);

		this[data] = lib;
		this.emitChange({type: LOADED_LIBRARY});
	}


	getData () { return this[data]; }


	hasCatalog () {
		let lib = this.getData();
		return lib ? lib.hasCatalog() : false;
	}
}

export default new Store();
