/**
 * Constants related to (and used by) the message modules.
 * @class MessageConstants
 */
var keyMirror = require('react/lib/keyMirror');

var actions = keyMirror({
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
	MESSAGES_REMOVE: null,

});

var events = keyMirror({

	/**
	* Emitted when a message is added or removed
	* @event MESSAGES_CHANGE
	* @type String
	* @final
	*/	
	MESSAGES_CHANGE: null,

});

exports.actions = actions;
exports.events = events;
