'use strict';


/**
* Application configuration/settings
* @class AppConfig
*/
module.exports = exports = {
	/**
	* Where to go upon successful login.
	* @property login_success_url
	* @static
	* @final
	*/
	login_success_url: '/loginsuccess'
};

/**
 * We cannot access $AppConfig at define time, because it is undefined on the
 * server side. So, it must be hidden in a function call.
 */
Object.defineProperty(exports, 'basePath', {

	// enumerable: true,
	// writable: false,
	// configurable: false,
	set: function() {},
	get: function() {
		return $AppConfig.basepath;
	}
});
