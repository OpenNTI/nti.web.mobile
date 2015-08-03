import AppDispatcher from 'dispatcher/AppDispatcher';

import {
	SET_CONTEXT,
	SET_PAGE_SOURCE,

	CLEAR_NAV_GUARDED,
	SET_NAV_GUARDED
} from './Constants';

export function setContext (context) {
	context.resolveContext().then(path=>
		dispatch(SET_CONTEXT, {context, path}));
}


export function setPageSource (pageSource, currentPage, context) {
	context.resolveContext().then(path=>
		dispatch(SET_PAGE_SOURCE, {pageSource, currentPage, context, path}));
}


export function activateNavigationGuard (getMessageCallback) {
	dispatch(SET_NAV_GUARDED, getMessageCallback);
}


export function deactivateNavigationGuard () {
	dispatch(CLEAR_NAV_GUARDED);
}


function dispatch (key, data) {
	AppDispatcher.handleRequestAction({type: key, response: data});
}
