import {FETCH_LINK} from './Constants';
import AppDispatcher from 'dispatcher/AppDispatcher';

export default {
	loadSelectOptionsFromUserLinkRel (rel) {
		dispatch(
			FETCH_LINK,
			{
				type: 'rel',
				link: rel
			}
		);
	}

};

function dispatch (key, data) {
	let action = {
		type: key,
		payload: data
	};
	AppDispatcher.handleRequestAction(action);
}
