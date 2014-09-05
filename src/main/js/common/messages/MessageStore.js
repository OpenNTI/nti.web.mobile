var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var invariant = require('react/lib/invariant');
var EventEmitter = require('events').EventEmitter;
var AlertConstants = require('./AlertConstants');
var Actions = AlertConstants.actions;
var Events = AlertConstants.events;
var merge = require('react/lib/merge');

var _messages = [];


/**
* Add a message
* @param {Object} message object should include properties for message and raw (the raw response)
*/
function _addMessage(message) {
	_messages.push(message);
	MessageStore.emitChange();
}

function _clearMessages() {
	if(_messages.length === 0) {
		return;
	}
	_messages.length = 0;
	MessageStore.emitChange();
}

var MessageStore = merge(EventEmitter.prototype, {

	emitChange: function() {
		console.log('MessageStore: emitting change');
		this.emit(Events.MESSAGES_CHANGE,_messages.slice());
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
	}

});

AppDispatcher.register(function(payload) {
	var action = payload.action;
	console.log('MessageStore received %s action.', action.actionType);
	switch(action.actionType) {
		case Actions.MESSAGES_ADD:
			_addMessage(action.msg);
		break;

		case Actions.MESSAGES_CLEAR:
			_clearMessages();
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = MessageStore;
