import {FETCH_LINK} from './Constants';
import AppDispatcher from 'dispatcher/AppDispatcher';

export function loadSelectOptionsFromUserLinkRel (rel) {
	dispatch(FETCH_LINK, { type: 'rel', link: rel });
}

function dispatch (type, payload) {
	AppDispatcher.handleRequestAction({ type, payload });
}
