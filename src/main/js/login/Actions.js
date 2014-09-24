'use strict';
/** @module login/LoginActions */

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var ActionConstants = require('./Constants').actions;
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

/**
 * Actions available to views for login-related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	begin: function() {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.LOGIN_BEGIN
		});
	},

	/**
	* Fired in response to user changes on the login form.
	*/
	userInputChanged: function(data) {
		console.log('LoginActions::userInputChanged');
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.LOGIN_FORM_CHANGED,
			credentials: (data && data.credentials)
		});
	},

	clearErrors: function() {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.LOGIN_CLEAR_ERRORS
		});
	},

	/** Attempt a login using the provided credentials.
	* @param {Object} credentials The credentials to submit for authentication. Currently expects 'username' and 'password'.
	*/
	logIn: function(credentials) {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.LOGIN_PASSWORD,
			credentials: credentials
		});
	},

	/** Attempt an oauth login via the specified url
	* @param {String} the url to hit.
	*/
	logInOAuth: function(url) {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.LOGIN_OAUTH,
			url: url
		});
	},

	/** Log the out of the system. */
	logOut: function() {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.LOGOUT
		});
	},

	recoverPassword: function(username, email) {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.RECOVER_PASSWORD,
			username: username
		});
	},

	recoverUsername: function(email) {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.RECOVER_USERNAME,
			email: email
		});
	}

});
