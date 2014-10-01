'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MessageConstants = require('./MessageConstants');
var Actions = MessageConstants.actions;
var Events = MessageConstants.events;
var merge = require('react/lib/merge');

var _messages = {};


var MessageStore = merge(EventEmitter.prototype, {

	emitChange: function() {
		console.log('MessageStore: emitting change');
		this.emit(Events.MESSAGES_CHANGE, this.messages());
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		console.log('MessageStore: adding change listener');
		this.on(Events.MESSAGES_CHANGE, callback);
	},

	/**
	* @param {function} callback
	*/
	removeChangeListener: function(callback) {
		this.removeListener(Events.MESSAGES_CHANGE, callback);
	},

	messages: function() {
		return Object.keys(_messages).map(function(key, idx, keys) {
			return _messages[key];
		});
	}

});

function Message(message, sender, category) {
	this.message = message;
	this.sender = sender;
	this.category = category;
	this.id = Date.now();
}

/**
* Add a message
* @param {Object} message object should include properties for message and raw (the raw response)
*/
function _addMessage(message, sender, category) {
	var m = new Message(message, sender, category);
	_messages[m.id] = m;
	MessageStore.emitChange();
}

function _clearMessages(sender) {
	if (Object.keys(_messages).length === 0) {
		return;
	}
	if(sender) {
		Object.keys(_messages).forEach(function(key) {
			if(_messages[key].sender === sender) {
				delete _messages[key];
			}
		});
	}
	else {
		_messages = {};	
	}
	MessageStore.emitChange();
}

function _removeMessage(id) {
	delete _messages[id];
	MessageStore.emitChange();
}


AppDispatcher.register(function(payload) {
	var action = payload.action;
	console.log('MessageStore received %s action.', action.actionType);
	switch (action.actionType) {
		case Actions.MESSAGES_ADD:
			_addMessage(action.msg, action.sender, action.category);
		break;

		case Actions.MESSAGES_CLEAR:
			_clearMessages();
		break;

		case Actions.MESSAGES_REMOVE:
			_removeMessage(action.messageId);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = MessageStore;
