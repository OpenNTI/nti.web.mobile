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

	messages: function(options) {
		var result = Object.keys(_messages).map(function(key, idx, keys) {
			return _messages[key];
		});
		if(options && options.category) {
			result = result.filter(function(v) {
				return v.category === options.category;
			})
		}
		return result;
	},

	clearMessages: function(sender,category) {
		if (Object.keys(_messages).length === 0) {
			return;
		}
		if(sender||category) {
			Object.keys(_messages).forEach(function(key) {
				var m = _messages[key];
				if(m.sender === sender || m.category === category) {
					delete _messages[key];
				}
			});
		}
		else {
			_messages = {};	
		}
		this.emitChange();
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
			_clearMessages(action.sender);
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
