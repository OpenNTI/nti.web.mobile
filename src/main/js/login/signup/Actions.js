import AppDispatcher from 'nti-lib-dispatcher';

import * as Constants from './Constants';

const bufferTime = 500;

//TODO: Move the "work" into these actions! The "store" should have
// NO "executable/actionable" code...just data organizational code.

//Unreferenced?
export function preflight (data) {
	clearTimeout(preflight.buffer);
	preflight.buffer = setTimeout(() => {
		AppDispatcher.handleViewAction({
			type: Constants.PREFLIGHT,
			fields: (data && data.fields)
		});
	}, bufferTime);
}

export function preflightAndCreateAccount (data) {
	AppDispatcher.handleViewAction({
		type: Constants.PREFLIGHT_AND_CREATE_ACCOUNT,
		fields: (data && data.fields)
	});
}

//Unreferenced?
export function createAccount (data) {
	AppDispatcher.handleViewAction({
		type: Constants.CREATE_ACCOUNT,
		fields: (data && data.fields)
	});
}

export function clearErrors () {
	AppDispatcher.handleViewAction({
		type: Constants.CLEAR_ERRORS
	});
}
