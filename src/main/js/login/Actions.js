import AppDispatcher from 'dispatcher/AppDispatcher';

import {getServer} from 'common/utils';

import {
	LOGIN_INIT_DATA,
	LOGIN_PONG
} from './Constants';


export function begin () {
	return getServer().ping()//anonymouse ping
		.then(data =>
			AppDispatcher.handleRequestAction({type: LOGIN_INIT_DATA, data}));
}


export function updateWithNewUsername (username) {

	return getServer().ping(null, username)//anonymouse ping with a username
		.then(data => {
			debugger;
			AppDispatcher.handleRequestAction({type: LOGIN_PONG, data, username});
		});
}


export function logOut () {

}
