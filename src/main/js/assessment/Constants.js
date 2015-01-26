'use strict';
/**
 * Constants related to (and used by) the assessment modules.
 * @class assessment.Constants
 */

var keyMirror = require('react/lib/keyMirror');

module.exports = Object.assign(exports, keyMirror({

	INTERACTED: null,

	CLEAR: null,
	RESET: null,
	SYNC: null,

	SUBMIT_BEGIN: null,
	SUBMIT_END: null,

	HELP_VIEW_HINT: null,
	HELP_VIEW_SOLUTION: null

}), {

	BUSY: keyMirror({
		LOADING: null,
		SUBMITTING: null,
		SAVEPOINT: null
	})

});
