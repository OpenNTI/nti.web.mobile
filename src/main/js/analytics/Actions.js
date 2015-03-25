'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var Types = require('dataserverinterface/models/analytics/MimeTypes');

module.exports = {
	emitEventStarted(event) {
		var types = Types.getTypes();
		var mType = (event||{}).MimeType;
		if (!types[mType]) {
			throw new Error('emitEvent action called with unrecognized MimeType. Stop it.'.concat(mType));
		}
		AppDispatcher.handleViewAction({
			type: Constants.EVENT_STARTED,
			event: event
		});
	},

	emitEventEnded(event) {
		AppDispatcher.handleViewAction({
			type: Constants.EVENT_ENDED,
			event: event
		});
	}
};
