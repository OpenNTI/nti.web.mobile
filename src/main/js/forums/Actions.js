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

	saveComment: function(postItem, newValue) {
		dispatch(Constants.SAVE_COMMENT, {
			postItem: postItem,
			newValue: newValue
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
	},

	reportItem: function(item) {
		dispatch(Constants.REPORT_ITEM, {
			item: item
		});	
	}
};

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
