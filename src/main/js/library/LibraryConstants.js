'use strict';
/**
 * Constants related to (and used by) the library modules.
 * @class LibraryConstants
 */
var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');


module.exports = merge(exports, keyMirror({

	/**
	 *
	 * @event LOAD_LIBRARY
	 * @type String
	 * @final
	 */
	LOAD_LIBRARY: null,


	/**
	 *
	 * @event LOADED_LIBRARY
	 * @type String
	 * @final
	 */
	LOADED_LIBRARY: null

}));
