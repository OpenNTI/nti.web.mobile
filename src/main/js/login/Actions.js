import AppDispatcher from 'dispatcher/AppDispatcher';

import {getServer, getService} from 'nti-web-client';

import Store from './Store'; //ONLY READ from the store!!
import {endSession as endAnalyticsSession} from 'analytics/Actions';

import {
	LOGIN_INIT_DATA,
	LOGIN_PONG,
	LOGIN_SUCCESS
} from './Constants';


export function begin () {
	return getServer().ping()//anonymouse ping
		.then(data =>
			AppDispatcher.handleRequestAction({type: LOGIN_INIT_DATA, data}));
}


export function updateWithNewUsername (username) {
	let meta = Store.getData() || {};
	if (meta.for === username) {
		return Promise.resolve();
	}

	return getServer().ping(null, username)//anonymouse ping with a username
		.catch(reason => {
			let {links} = reason || {};
			return links ? {links} : Promise.reject(reason);
		})
		.then(data => {
			AppDispatcher.handleRequestAction({type: LOGIN_PONG, data, username});
		});
}


export function login (username, password) {

	let url = Store.getLoginLink();

	return getServer().logInPassword( url, username, password)
		.then(
			data => AppDispatcher.handleRequestAction({type: LOGIN_SUCCESS, data, username})
		);
}

export function logout () {
	endAnalyticsSession()
	.then( () => getService().then(s => {
		let url = s.getLogoutURL('/mobile/login/');
		location.replace(url);
	}));
}
