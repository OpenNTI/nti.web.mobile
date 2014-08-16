/*
 * LoginConstants
 */

var merge = require('merge');
var keyMirror = require('react/lib/keyMirror');

var links = {
	ACCOUNT_CREATE: "account.create",
	ACCOUNT_PREFLIGHT_CREATE: "account.preflight.create",
	FORGOT_PASSCODE: "logon.forgot.passcode",
	FORGOT_USERNAME: "logon.forgot.username",
	HANDSHAKE: "logon.handshake",
	RESET_PASSCODE: "logon.reset.passcode",
	MIMETYPE_PONG: "application/vnd.nextthought.pong",
	LOGIN_PASSWORD_LINK: "logon.nti.password"
}


module.exports = merge(links, keyMirror({
	LOGIN_BEGIN: null,
	LOGIN_SUCCESS: null,
	LOGIN_FAILURE: null,
	LOGIN_LINKS_CHANGED: null
}));
