'use strict';

var Constants = require('./Constants');
var AppDispatcher = require('dispatcher/AppDispatcher');

module.exports = {

	sendMessage: function(fieldValues) {
		dispatch(
			Constants.SEND_MESSAGE,
			fieldValues
		);
	}

};


function dispatch(key, data) {
	AppDispatcher.handleRequestAction({
		type: key,
		data: data
	});
}
