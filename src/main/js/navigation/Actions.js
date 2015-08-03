import AppDispatcher from 'dispatcher/AppDispatcher';

import {
	SET_CONTEXT,
	SET_PAGE_SOURCE,
} from './Constants';

export function setContext (context) {
	context.resolveContext().then(path=>
		dispatch(SET_CONTEXT, {context, path}));
}


export function setPageSource (pageSource, currentPage, context) {
	context.resolveContext().then(path=>
		dispatch(SET_PAGE_SOURCE, {pageSource, currentPage, context, path}));
}

function dispatch (key, data) {
	AppDispatcher.handleRequestAction({type: key, response: data});
}
