import StorePrototype from 'nti-lib-store';

import {SET_ACTIVE_COURSE, NOT_FOUND} from './Constants';

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
		let {body} = response || {};
		if (body && body instanceof Error) {
			body = {
				error: data,
				notFound: body.message === NOT_FOUND.toString() || body.message === NOT_FOUND
			};
		}

		this[data] = body;
		this.emitChange({type: SET_ACTIVE_COURSE});
	}


	getData () { return this[data]; }
}

export default new Store();
