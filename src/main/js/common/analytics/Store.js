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
		console.log('AnalyticsStore processing queue (%s events)', _queue.length);
		if (_queue.length === 0 ) {
			return Promise.resolve();
		}

		// yank everything out of the queue
		var _items = _queue.slice();
		_queue = [];

		return this._submitEvents(_items).catch( function(r) {
			console.warn(r);
			// put _items back in the queue
			_queue.push.apply(_queue,_items);
		});

	},

	_submitEvents: function(events) {

		return Utils.getService().then(function(serviceDoc) {
			var workspace = serviceDoc.getWorkspace("Analytics");
			var links = Utils.indexArrayByKey(workspace.Links,'rel');
			Utils.getServer()._get(links['analytics_session']).then(function(result) {
				console.warn('AnalyticsStore submit events not fully implemented');
				return result;	
			},
			function(result) {
				console.warn('AnalyticsStore submit events not fully implemented');
				return result;	
			});
		});
		// return Promise.reject('analytics event posting not implemented');
	}

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
