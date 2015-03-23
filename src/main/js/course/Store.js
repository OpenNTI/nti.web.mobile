import {SET_ACTIVE_COURSE, NOT_FOUND} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[SET_ACTIVE_COURSE]: SetData
		});
	}


	get isLoaded () {
		return !!this[data];
	}


	[SetData] (payload) {
		let {response} = payload.action;
		let _data = response && response.body;
		if (_data && _data instanceof Error) {
			_data = {
				error: data,
				notFound: _data.message === NOT_FOUND.toString() || _data.message === NOT_FOUND };
			return;
		}

		this[data] = _data;
		this.emitChange({type: SET_ACTIVE_COURSE});
	}


	getData () { return this[data]; }
}

export default new Store();
