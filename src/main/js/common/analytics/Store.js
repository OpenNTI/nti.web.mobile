'use strict';

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Actions = require('./Constants').actions;
var VideoConstants = require('common/components/VideoConstants');
var AppDispatcher = require('common/dispatcher/AppDispatcher');
var VideoEvent = require('./AnalyticsEvents').VideoEvent;

var _queue = [];

var Store = merge(EventEmitter.prototype, {

	enqueueEvent: function(analyticsEvent) {
		console.debug('enqueueEvent: %O', analyticsEvent);
		_queue.push(analyticsEvent);
	},

	_processQueue: function() {
		if (_queue.length === 0 ) {
			return;
		}

		// yank everything out of the queue
		_items = _queue.slice();
		_queue = [];


	},

	_processEvent: function(analyticsEvent) {

	}

});


AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.actionType) {

		case VideoConstants.VIDEO_PLAYER_EVENT:
			if(action.event.type !== 'timeupdate') {
				console.log('Analytics Store received VIDEO_PLAYER_EVENT: %s, %O', action.event.type, action);
				Store.enqueueEvent(
					new VideoEvent(action.event,
						action.context,
						(action.props||{})
					)
				);
			}
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});
