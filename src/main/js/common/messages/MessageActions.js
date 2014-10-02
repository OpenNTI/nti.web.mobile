'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('./MessageConstants').actions;
var Store = require('./MessageStore');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Message = require('./Message');
var IllegalArgumentException = require('common/exceptions').IllegalArgumentException;

/**
 * Actions available to views for alerts/messages related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	addMessage: function(message) {
		if (!(message instanceof Message)) {
			var e = new IllegalArgumentException('message must be an instance of Message');
			console.error(e);
			throw e;
		}
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_ADD,
			message: message
		});
	},

	clearMessages: function(options) {
		Store.clearMessages(options && options.category);
	},

	removeMessage: function(id) {
		AppDispatcher.handleViewAction({
			actionType: Actions.MESSAGES_REMOVE,
			messageId: id
		});
	}

});
