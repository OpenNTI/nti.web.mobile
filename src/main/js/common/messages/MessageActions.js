var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('./MessageConstants').actions;
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge')

/**
 * Actions available to views for alerts/messages related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	addMessage: function(msg) {
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_ADD,
			msg: msg
		});
	},

	clearMessages: function() {
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_CLEAR
		});
	}

});
