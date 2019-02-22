import StorePrototype from '@nti/lib-store';
import Logger from '@nti/util-logger';

import {
	LINK_LOGIN_CONTINUE,
	LINK_LOGIN_PASSWORD,

	LOGIN_STATE_CHANGED,
	LOGIN_INIT_DATA,
	LOGIN_PONG,
	LOGIN_SUCCESS
} from './Constants';


const logger = Logger.get('login:store');

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
		// We want to keep annonymouse ping data prestine.
		// Data from pong's change as we type and rappid
		// fire, so only we keep the last one.

		// So only merge pong data on request.
		return a && {
			...a,
			...b
		};
	}


	getLink (...rel) {
		const d = this.getData();
		return d && d.getLink(...rel);
	}


	getLoginLink () {
		const {links = []} = this.getData() || {};
		//once lib-interfaces@1.77.0 is released we can ditch this compat func and just use links directly.
		const iterable = x => Array.isArray(x) ? x : Object.keys(x);

		let url = this.getLink(LINK_LOGIN_PASSWORD);

		// prefer the LDAP link if available.
		for (let k of iterable(links)) {
			if((/logon\.ldap\./).test(k)) {
				url = this.getLink(k);
				logger.debug('Found rel: "%s", using.', k);
				break;
			}
		}

		return url;
	}


	getAvailableOAuthLinks () {
		const whiteList = [
			// 'logon.facebook',
			'logon.google',
			'logon.linkedin.oauth1',
			'logon.openid',
			'logon.ou.sso',
			'logon.ats.imis',
			'logon.ensync.imis',
			'logon.ifsta.oauth',
			'logon.your.membership'
		];

		return whiteList
			.map(rel => this.getLink(rel) && {[rel]: this.getLink(rel, true)})
			.filter(Boolean)
			.reduce((a, b) => Object.assign(a, b), {});
	}

	get hasOAuthLinks () {
		return Object.keys(this.getAvailableOAuthLinks() || {}).length > 0;
	}
}

export default new Store();
