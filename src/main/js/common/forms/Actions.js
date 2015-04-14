import Constants from './Constants';
import AppDispatcher from 'dispatcher/AppDispatcher';

export default {
	loadSelectOptionsFromUserLinkRel (rel) {
		dispatch(
			Constants.FETCH_LINK,
			{
				type: 'rel',
				link: rel
			}
		);
	}

};

function dispatch(key, data) {
	let action = {
		type: key,
		payload: data
	};
	AppDispatcher.handleRequestAction(action);
}
