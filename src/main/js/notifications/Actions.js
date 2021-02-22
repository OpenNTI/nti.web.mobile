import AppDispatcher from '@nti/lib-dispatcher';

import { load as doLoad } from './Api';
import { LOADED_NOTIFICATIONS } from './Constants';

export function load(force) {
	doLoad(force).then(store => dispatch(LOADED_NOTIFICATIONS, store));
}

export function reload() {
	load(true);
}

export function loadMore(notifications) {
	if (notifications) {
		notifications
			.nextBatch()
			.then(store => dispatch(LOADED_NOTIFICATIONS, store));
	}
}

function dispatch(type, response) {
	AppDispatcher.handleRequestAction({ type, response });
}
