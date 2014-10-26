'use strict';
/**
 * Constants related to (and used by) the content module.
 * @class Constants
 */
var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');


module.exports = merge(exports, keyMirror({
	VIEWER_EVENT: null,
    PAGE_LOADED: null
}));
