/*
 * LoginController
 */
'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var AppConfig = require('../common/AppConfig');
var EventEmitter = require('events').EventEmitter;
var LoginActions = require('./LoginActions');
var LoginConstants = require('./LoginConstants');
var HttpStatusCodes = require('../common/constants/HttpStatusCodes');
var merge = require('react/lib/merge');
var Utils = require('../common/Utils');

var CHANGE_EVENT = 'change';


function begin() {
	_ping();
}

/**
* Sends a ping to the dataserver to retrieve a 'Pong' containing links for available next steps.
* @method begin
*/
function _ping() {
	$.ajax({
		dataType: 'json',
		url:'/dataserver2/logon.ping', // TODO: get this url from config?
		headers: {Accept:'application/json'},
		type: 'GET'
	})
	.done(ResponseHandlers.pong)
	.fail(function(){
		console.log('LoginController::ping failed.');
	});	
}

/**
* Send a ping to dataserver to fetch available links.
* @method updateLinks
* @param {Object} credentials Object with username and password properties for which we're requesting links.
*/
function updateLinks(credentials) {
	LoginController.setState(credentials);
	_ping();
}

/**
* Attempt a login using the provided credentials.
* @method log_in
* @param {Object} credentials The credentials (currently expects username, password)
*/
function logIn(credentials) {
	var url = LoginController.getHref(LoginConstants.LOGIN_PASSWORD_LINK);
	Utils.call(url,credentials,ResponseHandlers.login,'GET');
}

function logOut() {
	var url = LoginController.getHref(LoginConstants.LOGOUT_LINK);
	if(url) {
		$.ajax({
			url: url,
			headers: {Accept:'application/json'},
			type: 'GET'	
		})
		.done(ResponseHandlers.logOut)
		.fail(ResponseHandlers.fail);	
	}
	else {
		LoginController.setLoggedIn(false);
	}
}

function initialState() {
	return {
		links:{},
		isLoggedIn: false,
		username: '',
		password: ''
	};
}

/**
* Collection of methods for handling responses from the dataserver related to logins.
* @class ResponseHandlers
*/
var ResponseHandlers = {
	/**
	* Handles a 'pong' response from a call to dataserver 'ping'.
	* If the pong includes a handshake link and we have a username
	* this method will send the handshake request.
	* @method pong
	* @param {mixed} response The response from the call.
	*/
	pong: function(response) {
		debugger;
		if(response && response.hasOwnProperty('Links')) {
			// index the links by their 'rel' attr
			var links_by_rel = Utils.indexArrayByKey(response['Links'],'rel');
			LoginController.setState({links: links_by_rel});
		}
		if(LoginController.getHref(LoginConstants.LOGIN_CONTINUE_LINK)) {
			LoginController.setLoggedIn(true);
			return;
		}
		var username = LoginController.state.username || '';
		var password = LoginController.state.password || '';
		var handshakeLink = LoginController.getHref(LoginConstants.HANDSHAKE_LINK);
		if(handshakeLink && username.length > 0) {
			var auth = {
				username: username,
				password: password,
				remember: true
			};
			Utils.call(handshakeLink,auth,ResponseHandlers.handshake);	
		}
	},

	/**
	* General-purpose failure handler.
	* @method fail
	*/
	fail:function(response) {
		console.log('Ajax call failed.');
	},

	/**
	* Handles response from a call to a dataserver password login attempt.
	* @method login
	* @param {mixed} response The response from the call.
	*/
	login: function(response) {

		function isSuccess(res) {
			switch(typeof response) {
				case 'number':
					if (response == HttpStatusCodes.NO_CONTENT || response == HttpStatusCodes.NO_CONTENT_IE8) {
						console.log('Login successful');
						return true;
					}
					return false;
				break;

				case 'object':
					return !!response.success;
				break;
			}
			return false;
		}

		LoginController.setLoggedIn(isSuccess(response));
	},

	/**
	* Response handler for logout call.
	* @method logOut
	*/
	logOut: function(response) {
		LoginController.setLoggedIn(false);
	},

	/**
	* Handles response from a dataserver handshake call.
	* @method login
	* @param {mixed} response The response from the call.
	*/
	handshake: function(response) {
		if(response && response.hasOwnProperty('Links')) {
			// index the links by their 'rel' attr
			var links_by_rel = Utils.indexArrayByKey(response['Links'],'rel');
			LoginController.setState({links: links_by_rel});
		}
	}
}


/**
 * Coordinates login actions between the view and the dataserver
 * and emits related events.
 * @class LoginController
 */
var LoginController = merge(EventEmitter.prototype, {

	state: initialState(),

	/**
	* Indicates whether we have the necessary information required to attempt 
	* a password login.
	* The current implementation simply reflects whether we have a link
	* with rel=logon.nti.password
	*
	* @method canDoPasswordLogin
	* @return {boolean} Whether we have the necessary information required
	* to attempt a password login.
	*/
	canDoPasswordLogin: function() {
		return this.getHref(LoginConstants.LOGIN_PASSWORD_LINK) != null;
	},

	/**
	* Indicates whether we're currently logged in.
	* @method isLoggedIn
	* @return {boolean} Whether we're currently logged in.
	*/
	isLoggedIn: function() {
		return this.state.isLoggedIn;
	},

	setLoggedIn: function(loggedIn) {
		console.log('setLoggedIn: %s', loggedIn ? 'true' : 'false');
		this.setState(loggedIn ? {isLoggedIn: loggedIn} : initialState());
	},

	/**
	* Updates the state with properties from data. They will be merged with the
	* current state so it is acceptable and expected for the argument to contain only the
	* parts it cares about. While this mimicks the signature of the React method, this is
	* not a React component and should not be confused with one.
	* @method setState
	* @param {Object} data Object representing the changed state.
	*/
	setState:function(data) {
		this.state = merge(this.state,data);
		this.emit(CHANGE_EVENT);
	},

	/**
	* Looks up a link by its rel attribute and returns its href.
	* @method getHref
	* @param {String} link_rel The rel attribute of the sought link.
	* @return {String} The href for the link with the specified rel attribute, or null.
	*/
	getHref: function(link_rel) {
		return this.state.links.hasOwnProperty(link_rel) ? this.state.links[link_rel].href : null;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * Register to be notified of state changes for this LoginController.
	 * @method addChangeListener
	 * @param {function} callback Function to be invoked in response to a change event.
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * Un-register a previously registered event callback listener
	 * @method removeChangeListener
	 * @param {function} callback The callback to un-register.
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

// Listen for LoginForm input changes
LoginActions.on(LoginConstants.LOGIN_FORM_CHANGED, function(payload) {
	updateLinks(payload.credentials);
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
		case LoginConstants.LOGIN_BEGIN:
			console.log("LoginController: LOGIN_BEGIN.");
			begin();
			LoginController.emitChange();
		break;

		case LoginConstants.LOGIN_PASSWORD:
			console.log("LoginController: LOGIN_PASSWORD.");
			logIn(action.credentials);
			LoginController.emitChange();
		break;

		case LoginConstants.LOGOUT:
			console.log("LoginController: LOGOUT.");
			logOut();
		break;

		case LoginConstants.UPDATE_LINKS:
			console.log("LoginController: UPDATE_LINKS.");
			updateLinks(action.credentials);
		break;

		default:
			return true;
	}

	return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = LoginController;
