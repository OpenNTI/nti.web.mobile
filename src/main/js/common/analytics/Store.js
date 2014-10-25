'use strict';

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Actions = require('./Constants').actions;
var VideoConstants = require('common/components/VideoConstants');
var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Utils = require('common/Utils');
var autobind = require('dataserverinterface/utils/autobind');
var _queue = [];
var _post_frequency = 10000;
var _timeoutId;

function startTimer() {
	clearTimeout(_timeoutId);
	_timeoutId = setTimeout(
		function() {
			// process the queue and start the timer again.
			Store._processQueue().then(startTimer);
		},
		_post_frequency
	);
}

var Store = autobind(merge(EventEmitter.prototype, {


	init: function() {
		startTimer();
	},

	enqueueEvent: function(analyticsEvent) {
		console.debug('enqueueEvent: %O', analyticsEvent);
		_queue.push(analyticsEvent);
	},

	_processQueue: function() {
		if (_queue.length === 0) {
			return Promise.resolve('No events in the queue.');
		}

		console.log('AnalyticsStore processing queue (%s events)', _queue.length);

		// yank everything out of the queue
		var _items = _queue.slice();
		_queue = [];

		return Utils.getServer().postAnalytics(_items).then(function(response) {
			console.log('%i of %i analytics events accepted.', response, _items.length);
			return response;
		}).catch(function(r) {
			console.warn(r);
			// put _items back in the queue
			_queue.push.apply(_queue,_items);
		});

	},

}));


AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.actionType) {

		case VideoConstants.VIDEO_PLAYER_EVENT:
			if(action.event.type !== 'timeupdate') {
				console.log('Analytics Store received VIDEO_PLAYER_EVENT: %s, %O', action.event.type, action);
				Store.enqueueEvent(action.event);
			}
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = Store;
