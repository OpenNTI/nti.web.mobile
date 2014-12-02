'use strict';
/**
 * Constants related to (and used by) the assessment modules.
 * @class assessment.Constants
 */

var keyMirror = require('react/lib/keyMirror');

module.exports = Object.assign(exports, keyMirror({

	INTERACTED: null,

	RESET: null,
	SYNC: null,

	SUBMIT_BEGIN: null,
	SUBMIT_END: null,

}), {

	BUSY: keyMirror({
		LOADING: null,
		SUBMITTING: null,
		SAVEPOINT: null
	})

});
