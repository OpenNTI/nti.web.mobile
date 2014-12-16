'use strict';

var Constants = require('./Constants');
var AppDispatcher = require('dispatcher/AppDispatcher');

module.exports = {
	loadSelectOptionsFromUserLinkRel: function(rel) {
		dispatch(
			Constants.FETCH_LINK,
			{
				type: 'rel',
				link: rel
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
