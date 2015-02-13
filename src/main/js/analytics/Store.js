'use strict';

var EventEmitter = require('events').EventEmitter;

var Constants = require('./Constants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var Utils = require('common/Utils');
var autobind = require('dataserverinterface/utils/autobind');
var queue = [];
var fixedQueue = require('fixedqueue').FixedQueue;
var postFrequency = 10000;
var timeoutId;

var _contextHistory = fixedQueue(11);

function startTimer() {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(
		function() {
			// process the queue and start the timer again.
			Store._processQueue().then(startTimer);
		},
		postFrequency
	);
}


var Store = autobind(Object.assign({}, EventEmitter.prototype, {

	init: function() {
		startTimer();
	},

	pushHistory(item) {
		if (_contextHistory[_contextHistory.length - 1] !== item ) { // omit duplicate entries
			_contextHistory.enqueue(item);
		}
	},

	getHistory() {
		return _contextHistory.slice(0);
	},

	enqueueEvent: function(analyticsEvent) {
		queue.push(analyticsEvent.getData());
	},

	_processQueue: function() {
		if (queue.length === 0) {
			return Promise.resolve('No events in the queue.');
		}

		console.log('AnalyticsStore processing queue (%s events)', queue.length);

		// yank everything out of the queue
		var items = queue;
		queue = [];


		return Utils.getService()
			.then(function(service) {
				return service.postAnalytics(items);
			})
			.then(function(response) {
				console.log('%i of %i analytics events accepted.', response, items.length);
				return response;
			})
			.catch(function(r) {
				console.warn(r);
				// put items back in the queue
				queue.push.apply(queue, items);
			});

	},

}));


AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.

		case Constants.NEW_EVENT:
		case Constants.VIDEO_PLAYER_EVENT:
			console.log('Analytics Store received event: %s, %O', action.event.type, action);
			Store.enqueueEvent(action.event);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = Store;
