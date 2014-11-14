'use strict';
/**
 * Constants related to (and used by) the assessment modules.
 * @class assessment.Constants
 */

var assign = require('object-assign');

var keyMirror = require('react/lib/keyMirror');

module.exports = assign(exports, keyMirror({

	INTERACTED: null,

	RESET: null,

	SYNC: null
}));
