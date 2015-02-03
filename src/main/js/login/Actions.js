'use strict';
/** @module login/LoginActions */

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');

var EventEmitter = require('events').EventEmitter;

var getServer = require('common/Utils').getServer;
var Store = require('./Store');
var MessageActions = require('messages/Actions');
var Message = require('messages/Message');
/**
 * Actions available to views for login-related functionality.
 */
module.exports = Object.assign({}, EventEmitter.prototype, {

	begin: function() {
		AppDispatcher.handleViewAction({
			type: Constants.actions.LOGIN_BEGIN
		});
	},

	/**
	 * Fired in response to user changes on the login form.
	 */
	userInputChanged: function(data) {
		console.log('LoginActions::userInputChanged');
		AppDispatcher.handleViewAction({
			type: Constants.events.LOGIN_FORM_CHANGED,
			credentials: (data && data.credentials)
		});
	},

	clearErrors: function() {
		AppDispatcher.handleViewAction({
			type: Constants.actions.LOGIN_CLEAR_ERRORS
		});
	},

	deleteTOS: function() {
		return getServer().deleteTOS();
	},

	/** Attempt a login using the provided credentials.
	 * @param {Object} credentials The credentials to submit for authentication. Currently expects 'username' and 'password'.
	 */
	logIn: function(credentials) {
		AppDispatcher.handleViewAction({
			type: Constants.actions.LOGIN_PASSWORD,
			credentials: credentials
		});
	},

	/** Attempt an oauth login via the specified url
	 * @param {String} the url to hit.
	 */
	logInOAuth: function(url) {
		AppDispatcher.handleViewAction({
			type: Constants.actions.LOGIN_OAUTH,
			url: url
		});
	},

	/** Log the out of the system. */
	logOut: function() {
		AppDispatcher.handleViewAction({
			type: Constants.actions.LOGOUT
		});
	},

	/** dispatch a dataserver request to recover a user's password */
	recoverPassword: function(fields) {
		return Store.getPasswordRecoveryReturnUrl().then(function(returnUrl) {
			return getServer().recoverPassword(fields.email, fields.username, returnUrl);
		});
	},

	resetPassword: function(fields) {

		var success = function(result) {
			Store.emitChange({
				type: Constants.events.PASSWORD_RESET_SUCCESSFUL,
				data: result
			});
		};

		var failure = function(reason) {
			MessageActions.clearMessages({category: Constants.messages.category});
			MessageActions.addMessage( new Message(reason.message, {category: Constants.messages.category}) );
			return reason;
		};

		return getServer().resetPassword(
			fields.username,
			fields.password,
			fields.token
		)
		.then(success,failure);
	},

	recoverUsername: function(fields) {
		return getServer().recoverUsername(fields.email);
	},

	setReturnPath: function(path) {
		Store.setReturnPath(path);
	}

});
