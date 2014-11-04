'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Analytics = require('common/analytics/Constants');

module.exports = {
	emitVideoEvent: function(eventData) {
		AppDispatcher.handleViewAction({
			actionType: Analytics.VIDEO_PLAYER_EVENT,
			event: eventData
		});
	}
};
