'use strict';

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Actions = require('./Constants').actions;
var VIDEO_PLAYER_EVENT = require('common/components/VideoConstants').VIDEO_PLAYER_EVENT;
var AppDispatcher = require('common/dispatcher/AppDispatcher');

var Store = merge(EventEmitter.prototype, {

	enqueueEvent: function(analyticsEvent) {

	}

});

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.actionType) {

		case VIDEO_PLAYER_EVENT:
		if(action.event.type !== 'timeupdate') {
			console.log('Analytics Store received VIDEO_PLAYER_EVENT: %s, %O', action.event.type, action);
		}
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});
