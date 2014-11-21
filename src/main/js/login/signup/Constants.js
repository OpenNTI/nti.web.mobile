'use strict';

var keyMirror = require('react/lib/keyMirror');

var actions = keyMirror({
	PREFLIGHT: null,
	CREATE_ACCOUNT: null,
	PREFLIGHT_AND_CREATE_ACCOUNT: null,
	CLEAR_ERRORS: null
});

exports.actions = actions;
