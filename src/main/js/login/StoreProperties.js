/**
 * Constants used in LoginStoreChangeEvents to identify properties.
 * @class LoginStoreProperties
 */
var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
	isLoggedIn: null,
	links: null,
	errors: null
});
