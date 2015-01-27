'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var Types = require('dataserverinterface/models/analytics/MimeTypes');

var _types;

module.exports = {
	emitEvent: function(event) {
		var types = this._getTypes();
		var mType = (event||{}).MimeType;
		if (!types[mType]) {
			throw new Error('emitEvent action called with unrecognized MimeType. Stop it.'.concat(mType));
		}
		AppDispatcher.handleViewAction({
			type: Constants.NEW_EVENT,
			event: event
		});
	},

	_getTypes: function() {
		if (!_types) {
			_types = {};
			Object.keys(Types).forEach(key => _types[Types[key]] = Types[key]);
		}
		return _types;
	}
};
