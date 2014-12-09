'use strict';

var nsKeyMirror = require('dataserverinterface/utils/namespaced-key-mirror');
var namespace = 'fiveminute';

module.exports = {
	actions: nsKeyMirror( namespace, {
		PREFLIGHT: null
	}),
	admissionStatus: nsKeyMirror(null,{
		PENDING: null,
		REJECTED: null,
		ACCEPTED: null
	})
};

