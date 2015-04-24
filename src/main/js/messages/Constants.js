/**
 * Constants related to (and used by) the message modules.
 * @class message.Constants
 */
let keyMirror = require('react/lib/keyMirror');

export const actions = keyMirror({
	/**
	* Action for adding a message.
	* @property MESSAGES_ADD
	* @type String
	* @final
	*/
	MESSAGES_ADD: null,

	/**
	* Action for clearing messages.
	* @property MESSAGES_CLEAR
	* @type String
	* @final
	*/
	MESSAGES_CLEAR: null,

	/**
	* Action for removing a specific message.
	* @property MESSAGES_REMOVE
	* @type String
	* @final
	*/
	MESSAGES_REMOVE: null

});

export const events = keyMirror({

	/**
	* Emitted when a message is added or removed
	* @event MESSAGES_CHANGE
	* @type String
	* @final
	*/
	MESSAGES_CHANGE: null

});
