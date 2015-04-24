/**
 * Constants related to (and used by) the login modules.
 * @class LoginConstants
 */

export const links = {
	/**
	* @property ACCOUNT_CREATE
	* @type String
	* @final
	*/
	ACCOUNT_CREATE: 'account.create',

	/**
	* @property ACCOUNT_PREFLIGHT_CREATE
	* @type String
	* @final
	*/
	ACCOUNT_PREFLIGHT_CREATE: 'account.preflight.create',

	/**
	* @property FORGOT_PASSCODE
	* @type String
	* @final
	*/
	FORGOT_PASSCODE: 'logon.forgot.passcode',

	/**
	* @property FORGOT_USERNAME
	* @type String
	* @final
	*/
	FORGOT_USERNAME: 'logon.forgot.username',

	/**
	* The rel/key for the handshake link
	* @property HANDSHAKE_LINK
	* @type String
	* @final
	*/
	HANDSHAKE_LINK: 'logon.handshake',

	/**
	* The rel/key for the logon continue link
	* @property LOGIN_CONTINUE_LINK
	* @type String
	* @final
	*/
	LOGIN_CONTINUE_LINK: 'logon.continue',

	/**
	* The rel/key for the log-out link.
	* @property LOGOUT_LINK
	* @type String
	* @final
	*/
	LOGOUT_LINK: 'logon.logout',

	/**
	* The rel/key for the log in with facebook link.
	* @property OAUTH_LINK_FACEBOOK
	* @type String
	* @final
	*/
	OAUTH_LINK_FACEBOOK: 'logon.facebook',

	/**
	* The rel/key for the log in with google link.
	* @property OAUTH_LINK_GOOGLE
	* @type String
	* @final
	*/
	OAUTH_LINK_GOOGLE: 'logon.google',

	/**
	* The rel for the password login link from the dataserver.
	* @property LOGIN_PASSWORD_LINK
	* @type String
	* @final
	*/
	LOGIN_PASSWORD_LINK: 'logon.nti.password',

	/**
	* The rel for the ldap login link from the dataserver.
	* @property LOGIN_LDAP_LINK
	* @type String
	* @final
	*/
	LOGIN_LDAP_LINK: 'logon.ldap.ou',

	/**
	* @property MIMETYPE_PONG
	* @type String
	* @final
	*/
	MIMETYPE_PONG: 'application/vnd.nextthought.pong',

	/**
	* @property RESET_PASSCODE
	* @type String
	* @final
	*/
	RESET_PASSCODE: 'logon.reset.passcode'
};

export const actions = {

	/**
	* The name of the action for initializing the LoginController.
	* @property LOGIN_BEGIN
	* @type String
	* @final
	*/
	LOGIN_BEGIN: 'LOGIN_BEGIN',

	/**
	* Action name for attempting a password login.
	* @property LOGIN_PASSWORD
	* @type String
	* @final
	*/
	LOGIN_PASSWORD: 'LOGIN_PASSWORD',

	/**
	* Action name for clearing login errors.
	* @property LOGIN_CLEAR_ERRORS
	* @type String
	* @final
	*/
	LOGIN_CLEAR_ERRORS: 'LOGIN_CLEAR_ERRORS',

	/**
	* Action name for attempting an oauth login.
	* @property LOGIN_OAUTH
	* @type String
	* @final
	*/
	LOGIN_OAUTH: 'LOGIN_OAUTH',

	/**
	* Action name for logout.
	* @property LOGOUT
	* @type String
	* @final
	*/
	LOGOUT: 'LOGOUT',

	/**
	* Action name for password recovery.
	* @property RECOVER_PASSWORD
	* @type String
	* @final
	*/
	RECOVER_PASSWORD: 'RECOVER_PASSWORD',

	/**
	* Action name for username recovery.
	* @property RECOVER_USERNAME
	* @type String
	* @final
	*/
	RECOVER_USERNAME: 'RECOVER_USERNAME',

	/**
	* Action for requesting a ping/pong/handshake with the
	* dataserver to get links for a given username.
	* @property UPDATE_LINKS
	* @type String
	* @final
	*/
	UPDATE_LINKS: 'UPDATE_LINKS'

};

export const events = {

	/**
	* Emitted by LoginForm input changes.
	* @event LOGIN_FORM_CHANGED
	* @type String
	* @final
	*/
	LOGIN_FORM_CHANGED: 'LOGIN_FORM_CHANGED',

	/**
	* @property LOGIN_SUCCESS
	* @type String
	* @final
	*/
	LOGIN_SUCCESS: 'LOGIN_SUCCESS',

	/**
	* @property LOGIN_FAILURE
	* @type String
	* @final
	*/
	LOGIN_FAILURE: 'LOGIN_FAILURE',

	/**
	* The event emitted by the LoginController when its links change.
	* @property LOGIN_LINKS_CHANGED
	* @type String
	* @final
	*/
	LOGIN_LINKS_CHANGED: 'LOGIN_LINKS_CHANGED',

	/**
	* The event emitted upon successful password reset.
	* @property PASSWORD_RESET_SUCCESSFUL
	* @type String
	* @final
	*/
	PASSWORD_RESET_SUCCESSFUL: 'PASSWORD_RESET_SUCCESSFUL'

};

export const messages = {
	LOGIN_ERROR: 'LOGIN.LOGIN_ERROR',
	SIGNUP_CONFIRMATION: 'SIGNUP_CONFIRMATION',
	category: 'login'
};
