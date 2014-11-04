'use strict';
/**
 * Constants related to (and used by) the catalog modules.
 * @class CatalogConstants
 */
var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');


module.exports = merge(exports, keyMirror({

	/**
	 *
	 * @event LOAD_CATALOG
	 * @type String
	 * @final
	 */
	LOAD_CATALOG: null,


	/**
	 *
	 * @event LOADED_CATALOG
	 * @type String
	 * @final
	 */
	LOADED_CATALOG: null

}));
