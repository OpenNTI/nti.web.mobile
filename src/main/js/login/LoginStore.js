var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var invariant = require('react/lib/invariant');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('./LoginConstants');
var Actions = LoginConstants.actions;
var Links = LoginConstants.links;
var LoginMessages = LoginConstants.messages;
var LoginActions = require('./LoginActions');
var LoginStoreProperties = require('./LoginStoreProperties');
var merge = require('react/lib/merge');
var Dataserver = require('dataserverinterface');
var CHANGE_EVENT = 'change';
var ERROR_EVENT = 'error';
var Messages = require('../common/messages/');
var t = require('../common/locale');

var dataserver = require('../common/Utils').getServer;

var _links = {};
var _errors = [];
var _isLoggedIn = false;

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
			raw:r
		});
	});
}

function _logOut(action) {
	var current = encodeURIComponent(location.href);
	var p = $AppConfig.server + Links.LOGOUT_LINK + '?success=' + current;
	location.replace(p);
}

function LoginStoreChangeEvent(prop,val,oldval) {
	if(!prop in LoginStoreProperties) {
		throw new IllegalArgumentException( '"' + prop + '" is not a property defined in LoginStoreProperties.');
	}
	this.property = prop;
	this.value = val;
	this.oldValue = oldval;
}

/**
* Add an error
* @param {Object} error object should include properties for statusCode (http status code) and raw (the raw response)
*/
function _addError(err) {
	invariant(
		(err && 'statusCode' in err && 'raw' in err),
		"err should contain values for statusCode and raw; { statusCode:xxx, raw:{...} }"
	);
	var msg = t(LoginMessages.LOGIN_ERROR,err.statusCode.toString());
	Messages.Actions.addMessage(msg,'LoginStore');

}

function _clearErrors() {
	if(_errors.length === 0) {
		return;
	}
	Messages.Actions.clearMessages();
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
		return (Links.LOGIN_PASSWORD_LINK in _links);
	}

});

AppDispatcher.register(function(payload) {
	var action = payload.action;
	console.log('LoginStore received %s action.', action.actionType);
	switch(action.actionType) {
		case Actions.LOGIN_BEGIN:
			_begin();
		break;

		case Actions.LOGIN_FORM_CHANGED:
			_ping(action.credentials);
		break;

		case Actions.LOGIN_PASSWORD:
			_logIn(action.credentials);
		break;

		case Actions.LOGIN_OAUTH:
			_logInOAuth(action.url);
		break;

		case Actions.LOGOUT:
			_logOut(action);
		break;

		case Actions.LOGIN_CLEAR_ERRORS:
			_clearErrors(action);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = LoginStore;
