import AppDispatcher from '@nti/lib-dispatcher';

import { FETCH_LINK } from './Constants';

export function loadSelectOptionsFromUserLinkRel(rel) {
	dispatch(FETCH_LINK, { type: 'rel', link: rel });
}

function dispatch(type, payload) {
	AppDispatcher.handleRequestAction({ type, payload });
}
