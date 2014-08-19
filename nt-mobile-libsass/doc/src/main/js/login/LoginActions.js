/** @module login/LoginActions */

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var LoginConstants = require('./LoginConstants');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge')

/**
 * Actions available to views for login-related functionality.
 **/
var LoginActions = merge(EventEmitter.prototype, {

	/** Initializes the login system. */
	begin: function() {
		AppDispatcher.handleViewAction({
			actionType: LoginConstants.LOGIN_BEGIN
		});
	},

	/**
	* Attempt a login using the provided credentials.
	* @method log_in
	* @param {Object} credentials The credentials to submit for authentication. Currently expects 'username' and 'password'.
	*/
	logIn: function(credentials) {
		AppDispatcher.handleViewAction({
			actionType: LoginConstants.LOGIN_PASSWORD,
			credentials: credentials
		});
	},

	/**
	* Log the current user out of the system.
	* @method logOut
	*/
	logOut: function() {
		AppDispatcher.handleViewAction({
			actionType: LoginConstants.LOGOUT
		});	
	}
});

module.exports = LoginActions;
