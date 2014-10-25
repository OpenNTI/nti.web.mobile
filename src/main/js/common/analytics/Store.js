'use strict';

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Actions = require('./Constants').actions;
var VideoConstants = require('common/components/VideoConstants');
var AppDispatcher = require('common/dispatcher/AppDispatcher');


var _queue = [];
var _post_frequency = 10000;
var _timeoutId;

var Store = merge(EventEmitter.prototype, {


	startTimer: function() {
		clearTimeout(_timeoutId);
		_timeoutId = setTimeout(
			function() {
				// process the queue and start the timer again.
				this._processQueue().then(this.startTimer.bind(this),this.startTimer.bind(this));
			}.bind(this),
			_post_frequency
		);
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
		return Promise.reject('analytics event posting not implemented');
	}

});


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
