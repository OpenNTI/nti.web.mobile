/**
 * Constants related to (and used by) the login modules.
 * @class LoginConstants
 */
var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');

var links = {
	/**
	* @property ACCOUNT_CREATE
	* @type String
	* @final
	*/
	ACCOUNT_CREATE: "account.create",

	/**
	* @property ACCOUNT_PREFLIGHT_CREATE
	* @type String
	* @final
	*/
	ACCOUNT_PREFLIGHT_CREATE: "account.preflight.create",
	
	/**
	* @property FORGOT_PASSCODE
	* @type String
	* @final
	*/
	FORGOT_PASSCODE: "logon.forgot.passcode",
	
	/**
	* @property FORGOT_USERNAME
	* @type String
	* @final
	*/
	FORGOT_USERNAME: "logon.forgot.username",
	
	/**
	* The rel/key for the handshake link
	* @property HANDSHAKE_LINK
	* @type String
	* @final
	*/
	HANDSHAKE_LINK: "logon.handshake",

	/**
	* The rel/key for the logon continue link
	* @property LOGIN_CONTINUE_LINK
	* @type String
	* @final
	*/
	LOGIN_CONTINUE_LINK: "logon.continue",

	/**
	* The rel/key for the log-out link.
	* @property LOGOUT_LINK
	* @type String
	* @final
	*/
	LOGOUT_LINK: "logon.logout",

	/**
	* The rel/key for the log in with facebook link.
	* @property OAUTH_LINK_FACEBOOK
	* @type String
	* @final
	*/
	OAUTH_LINK_FACEBOOK: "logon.facebook",

	/**
	* The rel/key for the log in with google link.
	* @property OAUTH_LINK_GOOGLE
	* @type String
	* @final
	*/
	OAUTH_LINK_GOOGLE: "logon.google",

	/**
	* The rel for the password login link from the dataserver.
	* @property LOGIN_PASSWORD_LINK
	* @type String
	* @final
	*/
	LOGIN_PASSWORD_LINK: "logon.nti.password",

	/**
	* The rel for the OU4+4/ldap login link from the dataserver.
	* @property LOGIN_OU4x4_LINK
	* @type String
	* @final
	*/
	LOGIN_OU4x4_LINK: "logon.ldap.ou",

	/**
	* @property MIMETYPE_PONG
	* @type String
	* @final
	*/
	MIMETYPE_PONG: "application/vnd.nextthought.pong",

	/**
	* @property RESET_PASSCODE
	* @type String
	* @final
	*/
	RESET_PASSCODE: "logon.reset.passcode"
}

var actions = keyMirror({

	/**
	* The name of the action for initializing the LoginController.
	* @property LOGIN_BEGIN
	* @type String
	* @final
	*/
	LOGIN_BEGIN: null,

	/**
	* Action name for attempting a password login.
	* @property LOGIN_PASSWORD
	* @type String
	* @final
	*/
	LOGIN_PASSWORD: null,

	/**
	* Action name for clearing login errors.
	* @property LOGIN_CLEAR_ERRORS
	* @type String
	* @final
	*/
	LOGIN_CLEAR_ERRORS: null,

	/**
	* Action name for attempting an oauth login.
	* @property LOGIN_OAUTH
	* @type String
	* @final
	*/
	LOGIN_OAUTH: null,

	/**
	* Action name for logout.
	* @property LOGOUT
	* @type String
	* @final
	*/
	LOGOUT: null,

	/**
	* Action name for password recovery.
	* @property RECOVER_PASSWORD
	* @type String
	* @final
	*/
	RECOVER_PASSWORD: null,

	/**
	* Action name for username recovery.
	* @property RECOVER_USERNAME
	* @type String
	* @final
	*/
	RECOVER_USERNAME: null,

	/**
	* Action for requesting a ping/pong/handshake with the
	* dataserver to get links for a given username.
	* @property UPDATE_LINKS
	* @type String
	* @final
	*/
	UPDATE_LINKS: null

});

var events = keyMirror({

	/**
	* Emitted by LoginForm input changes.
	* @event LOGIN_FORM_CHANGED
	* @type String
	* @final
	*/	
	LOGIN_FORM_CHANGED: null,

	/**
	* @property LOGIN_SUCCESS
	* @type String
	* @final
	*/
	LOGIN_SUCCESS: null,

	/**
	* @property LOGIN_FAILURE
	* @type String
	* @final
	*/
	LOGIN_FAILURE: null,

	/**
	* The event emitted by the LoginController when its links change.
	* @property LOGIN_LINKS_CHANGED
	* @type String
	* @final
	*/
	LOGIN_LINKS_CHANGED: null

});

var messages = {
	LOGIN_ERROR: 'LOGIN.LOGIN_ERROR',
	category: 'login'
};

exports.actions = actions;
exports.events = events;
exports.links = links;
exports.messages = messages;
