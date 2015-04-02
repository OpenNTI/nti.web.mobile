'use strict';

import AppDispatcher from 'dispatcher/AppDispatcher';
import {EVENT_STARTED, EVENT_ENDED} from './Constants';

import getTypes from 'nti.lib.interfaces/models/analytics/MimeTypes';

module.exports = {
	emitEventStarted(event) {
		let types = getTypes();
		let mType = (event||{}).MimeType;
		if (!types[mType]) {
			throw new Error('emitEvent action called with unrecognized MimeType. Stop it.'.concat(mType));
		}
		AppDispatcher.handleViewAction({
			type: EVENT_STARTED,
			event: event
		});
	},

	emitEventEnded(event) {
		AppDispatcher.handleViewAction({
			type: EVENT_ENDED,
			event: event
		});
	}
};
