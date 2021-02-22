import { buffer } from '@nti/lib-commons';
import AppDispatcher from '@nti/lib-dispatcher';

import {
	SET_CONTEXT,
	SET_PAGE_SOURCE,
	CLEAR_NAV_GUARDED,
	SET_NAV_GUARDED,
} from './Constants';

export const setContext = buffer(17, function setContext(context) {
	context
		.resolveContext()
		.then(path => dispatch(SET_CONTEXT, { context, path }));
});

export const setPageSource = buffer(
	17,
	function setPageSource(pageSource, currentPage, context) {
		context
			.resolveContext()
			.then(path =>
				dispatch(SET_PAGE_SOURCE, {
					pageSource,
					currentPage,
					context,
					path,
				})
			);
	}
);

export function activateNavigationGuard(getMessageCallback) {
	dispatch(SET_NAV_GUARDED, getMessageCallback);
}

export function deactivateNavigationGuard() {
	dispatch(CLEAR_NAV_GUARDED);
}

function dispatch(key, data) {
	AppDispatcher.handleRequestAction({ type: key, response: data });
}
