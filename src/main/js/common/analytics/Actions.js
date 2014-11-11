'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Constants = require('common/analytics/Constants');

module.exports = {
	emitEvent: function(eventType, eventData) {
		if (!Constants[eventType]) {
			throw new Error('emitEvent action called with an unknown eventType. Stop it. %s', eventType);
		}
		AppDispatcher.handleViewAction({
			type: eventType,
			event: eventData
		});
	}
};
