import {
	LINK_LOGIN_CONTINUE,
	LINK_LOGIN_PASSWORD,

	LOGIN_STATE_CHANGED,
	LOGIN_INIT_DATA,
	LOGIN_PONG,
	LOGIN_SUCCESS
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
			[LOGIN_PONG]: SetPongData,
			[LOGIN_SUCCESS]: SetLoggedIn
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
		let {action} = payload;
		this[pong] = action.data;
		this[pong].for = action.username;
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


	getLoginLink () {
		let {links = {}} = this.getData() || {};
		let url = links[LINK_LOGIN_PASSWORD];

		// prefer the LDAP link if available.
		for (let k of Object.keys(links)) {
			if((/logon\.ldap\./).test(k)) {
				url = links[k];
				console.debug('Found rel: "%s", using.', k);
				break;
			}
		}

		return url;
	}


	getAvailableOAuthLinks () {
		let {links = {}} = this.getData() || {};

		let whiteList = [
			// 'logon.facebook',
			'logon.google',
			'logon.linkedin.oauth1',
			'logon.openid'
		];

		return whiteList
			.map(rel => links[rel] && {[rel]: links[rel]})
			.filter(x => x)
			.reduce((a, b) => Object.assign(a, b), {});
	}
}

export default new Store();
