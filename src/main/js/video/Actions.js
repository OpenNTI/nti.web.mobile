'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var Analytics = require('analytics/Constants');

module.exports = {
	emitVideoEvent: function(eventData) {
		AppDispatcher.handleViewAction({
			type: Analytics.VIDEO_PLAYER_EVENT,
			event: eventData
		});
	}
};
