/**
 * Constants related to (and used by) the login modules.
 * @class LoginConstants
 */

var merge = require('merge');
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
	* @property HANDSHAKE
	* @type String
	* @final
	*/
	HANDSHAKE: "logon.handshake",

	/**
	* The rel for the password login link from the dataserver.
	* @property LOGIN_PASSWORD_LINK
	* @type String
	* @final
	*/
	LOGIN_PASSWORD_LINK: "logon.nti.password",
		
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

module.exports = merge(links, keyMirror({
	/**
	* The name of the action for initializing the LoginController.
	* @property LOGIN_BEGIN
	* @type String
	* @final
	*/
	LOGIN_BEGIN: null,

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

}));
