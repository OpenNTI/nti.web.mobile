/*
 * LoginController
 */
'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('./LoginConstants');
var merge = require('react/lib/merge');
var Utils = require('../common/Utils');

var CHANGE_EVENT = 'change';

function begin() {
	$.ajax({
		dataType: 'json',
		url:'/dataserver2/logon.ping', // TODO: get this url from config?
		headers: {Accept:'application/json'},
		type: 'GET'
	})
	.done(ResponseHandlers.pong)
	.fail(function(){
		console.log('LoginController::begin failed.');
	});
}

function log_in(credentials) {
	console.log("LoginController::login", credentials);
}

var ResponseHandlers = {
	pong: function(response) {
		var auth = {
			username: 'ray.hatfield@gmail.com',
			password: 'ray.hatfield',
			remember: true
		};
		var handshakeLink = Utils.getLink(response, LoginConstants.HANDSHAKE);
		if(response && response.hasOwnProperty('Links')) {
			// index the links by their 'rel' attr
			var links_by_rel = Utils.indexArrayByKey(response['Links'],'rel');
			LoginController.setState({links: links_by_rel});
		}
		Utils.call(handshakeLink.href,auth,ResponseHandlers.handshake);
	},

	handshake: function(response) {
		console.log('handshake handler.');
		if(response && response.hasOwnProperty('Links')) {
			// index the links by their 'rel' attr
			var links_by_rel = Utils.indexArrayByKey(response['Links'],'rel');
			LoginController.setState({links: links_by_rel});
		}

		// from NextThoughtLoginApp login.js:
		//
		// resetForPingHandshake();
		// if(typeof o === 'number' || !o){
		// 	error();
		// 	return;
		// }

		// if(showErrorOnReady && $.isFunction(showErrorOnReady)){
		// 	showErrorOnReady.call();
		// 	showErrorOnReady = null;
		// }

		// if(o.offline){
		// 	offline();
		// 	return;
		// }

		// addOAuthButtons(o.Links || [], true);
		// updateSubmitButton();

	}
}

/**
 * Coordinates login actions between the view and the dataserver
 * and emits related events.
 * @class LoginController
 */
var LoginController = merge(EventEmitter.prototype, {

	state: {
		links:{},
		isLoggedIn: false
	},

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
			log_in(action.credentials);
			LoginController.emitChange();
		break;

		default:
			return true;
	}

	return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = LoginController;
