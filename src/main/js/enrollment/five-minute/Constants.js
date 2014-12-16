'use strict';

var nsKeyMirror = require('dataserverinterface/utils/namespaced-key-mirror');
var namespace = 'fiveminute';

module.exports = {
	actions: nsKeyMirror(namespace, {
		PREFLIGHT_AND_SUBMIT: null,
		DO_EXTERNAL_PAYMENT: null
	}),
	errors: nsKeyMirror(namespace, {
		PREFLIGHT_ERROR: null,
		REQUEST_ADMISSION_ERROR: null,
		PAY_AND_ENROLL_ERROR: null
	}),
	admissionStatus: nsKeyMirror(null,{
		PENDING: null,
		REJECTED: null,
		ADMITTED: null,
		NONE: null
	}),
	events: nsKeyMirror(namespace, {
		ADMISSION_SUCCESS: null,
		RECEIVED_PAY_AND_ENROLL_LINK: null
	})
};

