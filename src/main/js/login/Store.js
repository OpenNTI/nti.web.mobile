import {
	LINK_LOGIN_CONTINUE,
	LOGIN_STATE_CHANGED,
	LOGIN_INIT_DATA,
	LOGIN_PONG
} from './Constants';

import StorePrototype from 'common/StorePrototype';

const data = Symbol('data');
const pong = Symbol('pong');
const SetLoggedIn = Symbol('set:logged in');
const SetInitialData = Symbol('set:data');
const SetPongData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[LOGIN_INIT_DATA]: SetInitialData,
			[LOGIN_PONG]: SetPongData
		});
	}


	[SetInitialData] (payload) {
		this[data] = payload.action.data;
		if (this.getLink(LINK_LOGIN_CONTINUE)) {
			this[SetLoggedIn]();
		}
		this.emitChange({type: LOGIN_INIT_DATA});
	}


	[SetPongData] (payload) {
		this[pong] = payload.action.data;
		this.emitChange({type: LOGIN_PONG});
	}


	[SetLoggedIn] () {
		this[data].loggedIn = true;
		this.emitChange({type: LOGIN_STATE_CHANGED});
	}


	get isLoggedIn () {
		return this[data].loggedIn;
	}


	getData () {
		let a = this[data];
		let b = this[pong] || {};

		return a && Object.assign({}, a, b, {
			links: Object.assign({},
				a.links || {},
				b.links || {})
			});
	}


	getLink (rel) {
		let {links = {}} = this.getData() || {};
		return links[rel];
	}
}

console.debug('Login Instance');

export default new Store();
