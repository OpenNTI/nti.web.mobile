/**
 * Constants used in LoginStoreChangeEvents to identify properties.
 * @class LoginStoreProperties
 */
var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
	isLoggedIn: null,
	links: null,
	errors: null
});
