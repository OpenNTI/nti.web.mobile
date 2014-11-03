'use strict';

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Constants = require('./Constants');
var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Utils = require('common/Utils');
var autobind = require('dataserverinterface/utils/autobind');
var queue = [];
var postFrequency = 10000;
var timeoutId;
var Promise = global.Promise || require('es6-promise').Promise;

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

var Store = autobind(merge(EventEmitter.prototype, {


	init: function() {
		startTimer();
	},

	enqueueEvent: function(analyticsEvent) {
		queue.push(analyticsEvent);
	},

	_processQueue: function() {
		if (queue.length === 0) {
			return Promise.resolve('No events in the queue.');
		}

		console.log('AnalyticsStore processing queue (%s events)', queue.length);

		// yank everything out of the queue
		var items = queue.slice();
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

	switch (action.actionType) {

		case Constants.VIDEO_PLAYER_EVENT:
		case Constants.VIEWER_EVENT:
			console.log('Analytics Store received event: %s, %O', action.event.type, action);
			Store.enqueueEvent(action.event);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = Store;
