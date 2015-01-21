'use strict';
/** @module forums/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');


module.exports = {
	getCommentReplies: function(comment) {
		dispatch(Constants.GET_COMMENT_REPLIES, {
			comment: comment
		});
	},

	addComment: function(topic, parent, comment) {
		dispatch(Constants.ADD_COMMENT, {
			topic: topic,
			parent: parent,
			comment: comment
		});
	},

	createTopic: function(forum, topic) {
		dispatch(Constants.CREATE_TOPIC, {
			forum: forum,
			topic: topic
		});
	},

	deleteTopic: function(topic) {
		dispatch(Constants.DELETE_TOPIC, {
			topic: topic
		});	
	},

	deleteComment: function(comment) {
		dispatch(Constants.DELETE_COMMENT, {
			comment: comment
		});
	}
};

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
