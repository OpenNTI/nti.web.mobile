var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('./LoginConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _links = {};

function begin() {
	console.log('LoginStore::begin; (no actual implementation)');
	LoginStore.emitChange();
}

var LoginStore = merge(EventEmitter.prototype, {

	emitChange: function() {
		console.log('LoginStore: emitting change');
		this.emit(CHANGE_EVENT);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		console.log('LoginStore: adding change listener');
		this.on(CHANGE_EVENT, callback);
	},

	/**
	* @param {function} callback
	*/
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

});

AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {
		case LoginConstants.LOGIN_BEGIN:
			begin();
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = LoginStore;
