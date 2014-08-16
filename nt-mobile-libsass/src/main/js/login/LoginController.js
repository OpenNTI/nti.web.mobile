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

// function ping() {
// 	console.log('ping');
// 	Utils.call('/dataserver2/logon.ping',null,pong);
// }

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


var LoginController = merge(EventEmitter.prototype, {

	state: {
		links:{},
		isLoggedIn: false
	},

	canDoPasswordLogin: function() {
		return this.getHref(LoginConstants.LOGIN_PASSWORD_LINK) != null;
	},

	isLoggedIn: function() {
		return this.state.isLoggedIn;
	},

	setState:function(data) {
		this.state = merge(this.state,data);
		this.emit(CHANGE_EVENT);
	},

	getHref: function(link_rel) {
		return this.state.links.hasOwnProperty(link_rel) ? this.state.links[link_rel].href : null;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
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
