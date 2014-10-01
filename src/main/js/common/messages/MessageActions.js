var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('./MessageConstants').actions;
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge')

/**
 * Actions available to views for alerts/messages related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	addMessage: function(msg,sender,category) {
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_ADD,
			msg: msg,
			sender:sender,
			category:category
		});
	},

	clearMessages: function(sender) {
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_CLEAR,
			sender: sender
		});
	},

	removeMessage: function(id) {
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_REMOVE,
			messageId: id
		});
	}

});
