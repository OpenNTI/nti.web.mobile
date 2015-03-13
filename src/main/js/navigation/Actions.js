import AppDispatcher from 'dispatcher/AppDispatcher';

import {
	SET_CONTEXT,
	SET_PAGE_SOURCE,
} from './Constants';

export function setContext (context) {
	dispatch(SET_CONTEXT, {context});
}


export function setPageSource (pageSource, currentPage, context) {
	dispatch(SET_PAGE_SOURCE, {pageSource, currentPage, context});
}

function dispatch(key, data) {
	AppDispatcher.handleRequestAction({type: key, response: data});
}
