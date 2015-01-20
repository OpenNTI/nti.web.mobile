'use strict';
/** @module forums/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var Api = require('./Api');


module.exports = {
	getCommentReplies: function(comment) {
		dispatch(Constants.GET_COMMENT_REPLIES, {
			comment: comment
		});
	},

	addComment: function(topic, parent, comment) {
		return Api.addComment(topic, parent, comment);
	},

	deleteComment: function(comment) {
		return Api.deleteComment(comment);
	}
};

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
