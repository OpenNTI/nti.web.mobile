'use strict';
/** @module notifications/Actions */
var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('dispatcher/AppDispatcher');

var Api = require('./Api');
var Constants = require('./Constants');


/**
 * Actions available to views for notification-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	load: function() {
		Api.load()
			.then(dispatch.bind(this, Constants.LOADED_NOTIFICATIONS));
	},


	loadMore: function(notifications) {
		if (notifications) {
			notifications.nextBatch()
				.then(dispatch.bind(this, Constants.LOADED_NOTIFICATIONS));
		}
	}
});



function dispatch(key, collection) {
	AppDispatcher.handleRequestAction({
		type: key,
		response: collection
	});
}
