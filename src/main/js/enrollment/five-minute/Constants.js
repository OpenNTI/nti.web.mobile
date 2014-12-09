'use strict';

var nsKeyMirror = require('dataserverinterface/utils/namespaced-key-mirror');
var namespace = 'fiveminute';

module.exports = {
	actions: nsKeyMirror(namespace, {
		PREFLIGHT: null
	}),
	errors: nsKeyMirror(namespace, {
		PREFLIGHT_ERROR: null
	}),
	admissionStatus: nsKeyMirror(null,{
		PENDING: null,
		REJECTED: null,
		ACCEPTED: null
	})
};

