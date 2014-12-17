'use strict';

var nsKeyMirror = require('dataserverinterface/utils/namespaced-key-mirror');

module.exports = nsKeyMirror('commonforms', {
	FORM_CONFIG: null,
	SUBFIELDS: null,
	MESSAGE: null,
	ERROR_ADDED: null,
	FETCH_LINK: null,
	URL_RETRIEVED: null,
	FIELD_VALUE_CHANGE: null,
	FIELD_VALUES_REMOVED: null,
	AVAILABLE_FIELDS_CHANGED: null
});
