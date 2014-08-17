
var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var LoginConstants = require('./LoginConstants');

/**
 * Actions available to views for login-related functionality.
 * @class LoginActions
 **/
var LoginActions = {

	/**
	* Initializes the login system.
	* @method begin
	*/
	begin: function() {
		AppDispatcher.handleViewAction({
			actionType: LoginConstants.LOGIN_BEGIN,
			samplePayloadProperty: 'this is just here to illustrate attaching a payload to an action.'
		});
	},

	/**
	* Attempt a login using the provided credentials.
	* @method log_in
	* @param {Object} credentials The credentials to submit for authentication. Currently expects 'username' and 'password'.
	*/
	log_in: function(credentials) {
		AppDispatcher.handleViewAction({
			actionType: LoginConstants.LOGIN_PASSWORD,
			credentials: credentials
		});
	}
};

module.exports = LoginActions;
