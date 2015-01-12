'use strict';
/** @module forums/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');

module.exports = {
	getCommentReplies: function(comment) {
		dispatch(Constants.GET_COMMENT_REPLIES, {
			comment: comment
		});
	}
};

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
