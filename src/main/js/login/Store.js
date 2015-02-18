'use strict';


var Url = require('url');


var invariant = require('react/lib/invariant');
var EventEmitter = require('events').EventEmitter;

var IllegalArgumentException = require('common/exceptions/').IllegalArgumentException;
var AppDispatcher = require('dispatcher/AppDispatcher');
var MessagesActions = require('messages/Actions');
var Message = require('messages/Message');

var t = require('common/locale').translate;
var {getServer, getServerURI, __setUsername} = require('common/utils');

var Constants = require('./Constants');
var ActionConstants = Constants.actions;
var Links = Constants.links;
var LoginMessages = Constants.messages;

var StoreProperties = require('./StoreProperties');

var _t = require('common/locale').scoped('LOGIN');

var CHANGE_EVENT = 'change';
var _links = {};
var _isLoggedIn = false;
var _returnPath;

var LoginStore = Object.assign({}, EventEmitter.prototype, {
	Properties: StoreProperties,

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
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
	},

	getPasswordRecoveryReturnUrl: function() {
		//'https://ou-alpha.nextthought.com/login/passwordrecover.html?return=https://ou-alpha.nextthought.com/app/&username=ray.hatfield&id=2f36ca6e7a5f4c5b9f54cea84b3c8ca1';
		return Promise.resolve(Url.resolve(document.URL, '/login/passwordrecover.html'));
	},

	loginFormFields: function() {
		return [
			{
				ref: 'username',
				type: 'text',
				placeholder: _t('UsernamePlaceholder')
			},
			{
				ref: 'password',
				type: 'password',
				placeholder: _t('PasswordPlaceholder')
			}
		];
	},

	setReturnPath: function(path) {
		_returnPath = path;
	},

	getReturnPath: function() {
		return _returnPath;
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
	var message = new Message(msg, {category: LoginMessages.category, error: error});
	MessagesActions.addMessage(message);

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
	getServer().ping(null, username)
		.then(resp, resp)
		.catch (function(r) {
			console.error(r);
		});
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
//	LOGIN_LDAP_LINK: "logon.ldap.okstate",
//	LOGIN_LDAP_LINK: "logon.ldap.ou",

	var url = _links[Links.LOGIN_PASSWORD_LINK];
	// prefer the LDAP link if available.
	for (let k of Object.keys(_links)) {
		if((/logon\.ldap\./).test(k)) {
			url = _links[k];
			console.debug('Found rel: "%s", using.', k);
		}
	}


	var p = getServer().logInPassword(
			url,
			credentials);

	p.then(function(r) {
		__setUsername(credentials.username);
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

function _logOut() {
	var current = encodeURIComponent(location.href);
	//TODO: this link doesn't need to be built, (we just need to append the
	//success to the rel="logout" link in the ping...which we should store on
	// a successfull handshake.)
	var p = getServerURI() + Links.LOGOUT_LINK + '?success=' + current;
	location.replace(p);
}

function _clearErrors() {
	MessagesActions.clearMessages(null,Constants.messages.category);
}


AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case ActionConstants.LOGIN_BEGIN:
			_ping();
		break;

		case Constants.events.LOGIN_FORM_CHANGED:
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
