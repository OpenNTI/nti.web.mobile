'use strict';
/**
 * Constants related to (and used by) the notification modules.
 * @class Constants
 */

var keyMirror = require('react/lib/keyMirror');


module.exports = Object.assign(exports, keyMirror({

	/**
	 *
	 * @event LOAD_NOTIFICATIONS
	 * @type String
	 * @final
	 */
	LOAD_NOTIFICATIONS: null,


	/**
	 *
	 * @event LOADED_NOTIFICATIONS
	 * @type String
	 * @final
	 */
	LOADED_NOTIFICATIONS: null

}));
