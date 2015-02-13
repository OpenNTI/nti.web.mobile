import AppDispatcher from 'dispatcher/AppDispatcher';

import {load as doLoad} from './Api';
import {LOADED_NOTIFICATIONS} from './Constants';


/**
 * Actions available to views for notification-related functionality.
 */


export function load () {
	doLoad()
		.then(dispatch.bind(this, LOADED_NOTIFICATIONS));
}


export function loadMore (notifications) {
	if (notifications) {
		notifications.nextBatch()
			.then(dispatch.bind(this, LOADED_NOTIFICATIONS));
	}
}


function dispatch(type, response) {
	AppDispatcher.handleRequestAction({type, response});
}
