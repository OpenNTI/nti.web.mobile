'use strict';

var nsKeyMirror = require('nti.lib.interfaces/utils/namespaced-key-mirror');
var namespace = 'fiveminute';

module.exports = {
	actions: nsKeyMirror(namespace, {
		PREFLIGHT_AND_SUBMIT: null,
		DO_EXTERNAL_PAYMENT: null,
		REQUEST_CONCURRENT_ENROLLMENT: null
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
		RECEIVED_PAY_AND_ENROLL_LINK: null,
		CONCURRENT_ENROLLMENT_ERROR: null,
		CONCURRENT_ENROLLMENT_SUCCESS: null
	}),
	fields: nsKeyMirror(namespace, {
		IS_CONCURRENT_FORM: null
	}),
	links: {
		PAY_AND_ENROLL: 'fmaep.pay.and.enroll',
		CONCURRENT_ENROLLMENT_NOTIFY: 'concurrent.enrollment.notify'
	}
};
