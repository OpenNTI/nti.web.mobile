var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('./LoginConstants');
var LoginStoreProperties = require('./LoginStoreProperties');
var ResponseHandlers = require('./LoginResponseHandlers');
var merge = require('react/lib/merge');
var Dataserver = require('dataserverinterface');
var CHANGE_EVENT = 'change';

var _links = {};
var _isLoggedIn = false;

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
	p.then(function(res) {
		_setLinks(res.links || {});
	})
	p.catch(function(result) {
		_setLinks(result.links || {});
	})
}

function _setLinks(links) {
	var oldVal = _links;
	_links = links || {};
	LoginStore.emitChange(
		new LoginStoreChangeEvent(LoginStoreProperties.links,_links,oldVal)
	);
}

function _setLoggedIn(isLoggedIn) {
	console.log('LoginStore::_setLoggedIn: %s', isLoggedIn);
	// emit a change event if the new value is different.
	if(_isLoggedIn !== (_isLoggedIn = isLoggedIn)) {
		LoginStore.emitChange(
			new LoginStoreChangeEvent(LoginStoreProperties.isLoggedIn,
				_isLoggedIn,
				!_isLoggedIn
			)
		);
	};
	return _isLoggedIn;
}

function _logIn(credentials) {
	var p = dataserver().logInPassword(
			_links[LoginConstants.LOGIN_PASSWORD_LINK],
			credentials);
	
	p.then(function(r) {
		console.log('login attempt resolved. %O', r);
		_setLoggedIn(true);
	});
	p.catch(function(r) {
		console.log('login attempt rejected.');
	});
}

function _logOut(action) {
	var p = dataserver()._request(LoginConstants.LOGOUT_LINK);
	p.then(function(r) {
		console.log('Logout fulfilled. %O',r);
		_setLoggedIn(false);
	});
}

LoginStoreChangeEvent = function(prop,val,oldval) {
	if(!prop in LoginStoreProperties) {
		throw new IllegalArgumentException( '"' + prop + '" is not a property defined in LoginStoreProperties.');
	}
	this.property = prop;
	this.value = val;
	this.oldValue = oldval;
}

var LoginStore = merge(EventEmitter.prototype, {

	emitChange: function(evt) {
		console.log('LoginStore: emitting change');
		this.emit(CHANGE_EVENT,evt);
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
	console.log('LoginStore received %s action.', action.actionType);
	switch(action.actionType) {
		case LoginConstants.LOGIN_BEGIN:
			_begin();
		break;

		case LoginConstants.LOGIN_FORM_CHANGED:
			_ping(action.credentials);
		break;

		case LoginConstants.LOGIN_PASSWORD:
			_logIn(action.credentials);
		break;

		case LoginConstants.LOGOUT:
			_logOut(action);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = LoginStore;
