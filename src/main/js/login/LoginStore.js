var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('./LoginConstants');
var ResponseHandlers = require('./LoginResponseHandlers');
var merge = require('react/lib/merge');
var Dataserver = require('dataserverinterface');
var CHANGE_EVENT = 'change';

var _links = {};
// var handlers = new ResponseHandlers(LoginStore);

var _dataserver;

function _begin() {
	console.log('LoginStore::_begin; (no actual implementation)');
	_ping();
	LoginStore.emitChange();
}

function dataserver() {
	if(!_dataserver) {
		_dataserver = Dataserver($AppConfig).interface;
	}
	return _dataserver;
}

function _ping(credentials) {
	var username = (credentials && credentials.username)
	var p = dataserver().ping(null,username);
	console.log(p);
	p.then(function(res) {
		LoginStore.emitChange();
	})
	p.catch(function(result) {
		console.log('catch?');
		_links = result.links;
		LoginStore.emitChange();
	})
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
	},

	canDoPasswordLogin: function() {
		return (LoginConstants.LOGIN_PASSWORD_LINK in _links);
	}

});

AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {
		case LoginConstants.LOGIN_BEGIN:
			_begin();
		break;

		case LoginConstants.LOGIN_FORM_CHANGED:
			console.log("LoginStore responding to LOGIN_FORM_CHANGED event");
			console.log(action);
			_ping(action.credentials);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = LoginStore;
