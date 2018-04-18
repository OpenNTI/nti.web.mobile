import AppDispatcher from '@nti/lib-dispatcher';
import { getServer, getService } from '@nti/web-client';

import Store from './Store'; //ONLY READ from the store!!
import { LOGIN_INIT_DATA, LOGIN_PONG, LOGIN_SUCCESS } from './Constants';

export async function begin () {
	//ping
	const data = await getServer().ping();
	AppDispatcher.handleRequestAction({ type: LOGIN_INIT_DATA, data });
}

export async function updateWithNewUsername (username) {
	const meta = Store.getData() || {};
	if (meta.for === username) {
		return;
	}

	//ping with a username
	const data = await getServer().ping(username)
		.catch(e => e.getLink ? e : Promise.reject(e));

	AppDispatcher.handleRequestAction({ type: LOGIN_PONG, data, username });
}

export async function login (username, password) {
	const url = Store.getLoginLink();

	const data = await getServer().logInPassword(url, username, password);

	AppDispatcher.handleRequestAction({ type: LOGIN_SUCCESS, data, username });
}

export async function logout () {
	const service = await getService();
	const url = service.getLogoutURL('/mobile/login/');
	global.location.replace(url);
}
