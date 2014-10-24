'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Constants = require('./VideoConstants');

module.exports = {
	emitVideoEvent: function(event,context) {
		AppDispatcher.handleViewAction({
			actionType: Constants.VIDEO_PLAYER_EVENT,
			event: event,
			context: context
		});
	}
};
