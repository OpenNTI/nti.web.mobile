'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var invariant = require('react/lib/invariant');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./Constants');
var ActionConstants = Constants.actions;
var Links = Constants.links;
var LoginMessages = Constants.messages;
var Actions = require('./Actions');
var StoreProperties = require('./StoreProperties');
var merge = require('react/lib/merge');
var CHANGE_EVENT = 'change';
var ERROR_EVENT = 'error';
var Messages = require('common/messages/');
var t = require('common/locale').translate;
var IllegalArgumentException = require('common/exceptions/').IllegalArgumentException;

var dataserver = require('common/Utils').getServer;

var _links = {};
var _errors = [];
var _isLoggedIn = false;


var LoginStore = merge(EventEmitter.prototype, {

	emitChange: function(evt) {
		console.log('LoginStore: emitting change');
		this.emit(CHANGE_EVENT, evt);
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
		return (Links.LOGIN_PASSWORD_LINK in _links);
	}

});


/**
* Add an error
* @param {Object} error object should include properties for statusCode (http status code) and raw (the raw response)
*/
function _addError(error) {
	invariant(
		(error && 'statusCode' in error && 'raw' in error),
		'error should contain values for statusCode and raw; { statusCode:xxx, raw:{...} }'
	);
	var msg = t(LoginMessages.LOGIN_ERROR, error.statusCode.toString());
	Messages.Actions.addMessage(msg, 'LoginStore');

}

function LoginStoreChangeEvent(prop, val, oldval) {
	if (!(prop in StoreProperties)) {
		throw new IllegalArgumentException('"' + prop + '" is not a property defined in StoreProperties.');
	}
	this.property = prop;
	this.value = val;
	this.oldValue = oldval;
}

function _setLinks(links) {
	var oldVal = _links;
	_links = links || {};
	LoginStore.emitChange(
		new LoginStoreChangeEvent(StoreProperties.links, _links, oldVal)
	);
}

function _ping(credentials) {
	function resp(res) { _setLinks(res.links || {}); }

	var username = (credentials && credentials.username);
	dataserver().ping(null, username)
		.then(resp, resp);
}

function _setLoggedIn(isLoggedIn) {
	console.log('LoginStore::_setLoggedIn: %s', isLoggedIn);
	// emit a change event if the new value is different.
	if (_isLoggedIn !== (_isLoggedIn = isLoggedIn)) {
		LoginStore.emitChange(
			new LoginStoreChangeEvent(StoreProperties.isLoggedIn,
				_isLoggedIn,
				!_isLoggedIn
			)
		);
	}
	return _isLoggedIn;
}

function _logIn(credentials) {

	// prefer the OU4x4 link if available.
	var url = _links[Links.LOGIN_OU4x4_LINK] || _links[Links.LOGIN_PASSWORD_LINK];

	var p = dataserver().logInPassword(
			url,
			credentials);

	p.then(function(r) {
		console.log('login attempt resolved. %O', r);
		_setLoggedIn(true);
	});
	p.catch(function(r) {
		console.log('login attempt rejected. %O', r);
		_addError({
			statusCode: r.status || r.statusCode,
			raw: r
		});
	});
}

function _logOut(action) {
	var current = encodeURIComponent(location.href);
	var p = $AppConfig.server + Links.LOGOUT_LINK + '?success=' + current;
	location.replace(p);
}

function _clearErrors() {
	if (_errors.length === 0) {
		return;
	}
	Messages.Actions.clearMessages();
}


AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.actionType) {
		case ActionConstants.LOGIN_BEGIN:
			_ping();
		break;

		case ActionConstants.LOGIN_FORM_CHANGED:
			_ping(action.credentials);
		break;

		case ActionConstants.LOGIN_PASSWORD:
			_logIn(action.credentials);
		break;

		case ActionConstants.LOGOUT:
			_logOut(action);
		break;

		case ActionConstants.LOGIN_CLEAR_ERRORS:
			_clearErrors(action);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = LoginStore;
