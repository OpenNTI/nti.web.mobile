'use strict';
/** @module forums/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');

var Constants = require('./Constants');

module.exports = {
	getDiscussions(source) {
		dispatch(Constants.LOAD_DISCUSSIONS, source);
	}
};


function dispatch(key, data) {
	AppDispatcher.handleRequestAction({
		type: key,
		data: data
	});
}
