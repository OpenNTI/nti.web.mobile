'use strict';

var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var IllegalArgumentException = require('common/exceptions').IllegalArgumentException;

var Actions = require('./Constants').actions;
var Store = require('./Store');
var Message = require('./Message');


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
			type: Actions.MESSAGES_ADD,
			message: message
		});
	},

	clearMessages: function(options) {
		Store.clearMessages(options && options.category);
	},

	removeMessage: function(id) {
		AppDispatcher.handleViewAction({
			type: Actions.MESSAGES_REMOVE,
			messageId: id
		});
	}

});
