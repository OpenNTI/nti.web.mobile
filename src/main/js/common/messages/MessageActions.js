var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('./MessageConstants').actions;
var Store = require('./MessageStore');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge')
var invariant = require('react/lib/invariant');

/**
 * Actions available to views for alerts/messages related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	addMessage: function(msg,options) {
		if (!(options && options.category)) {
			var e = new Error('options.category is required when adding a message.');
			console.error(e);
			throw e;
		}
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_ADD,
			msg: msg,
			category:options.category,
			options:options
		});
	},

	clearMessages: function(category) {
		Store.clearMessages(category);
	},

	removeMessage: function(id) {
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_REMOVE,
			messageId: id
		});
	}

});
