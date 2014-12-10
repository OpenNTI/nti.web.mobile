'use strict';

var Constants = require('./Constants');
var AppDispatcher = require('dispatcher/AppDispatcher');

module.exports = {
	preflight: function(data, storeContextId) {
		dispatch(
			Constants.actions.PREFLIGHT,
			{
				data: data,
				storeContextId: storeContextId
			}
		);
	}
};

function dispatch(key, data) {
	var action = {
		type: key,
		payload: data
	};
	AppDispatcher.handleRequestAction(action);
}
