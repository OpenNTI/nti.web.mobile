import AppDispatcher from 'dispatcher/AppDispatcher';
import {EVENT_STARTED, EVENT_ENDED} from './Constants';
import Store from './Store';
import {getTypes} from 'nti.lib.interfaces/models/analytics/MimeTypes';


export function emitEventStarted (event) {
	let types = getTypes();
	let mType = (event || {}).MimeType;
	if (!types[mType]) {
		throw new Error('emitEvent action called with unrecognized MimeType. Stop it.'.concat(mType));
	}
	AppDispatcher.handleViewAction({
		type: EVENT_STARTED,
		event: event
	});
}

export function emitEventEnded (event) {
	AppDispatcher.handleViewAction({
		type: EVENT_ENDED,
		event: event
	});
}

export function endSession () {
	return Store.endSession();
}
