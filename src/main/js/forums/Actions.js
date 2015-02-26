'use strict';
/** @module forums/Actions */

import AppDispatcher from 'dispatcher/AppDispatcher';

import {
	GET_COMMENT_REPLIES,
	ADD_COMMENT,
	SAVE_COMMENT,
	CREATE_TOPIC,
	DELETE_TOPIC,
	DELETE_COMMENT,
	REPORT_ITEM
} from './Constants';

module.exports = {
	getCommentReplies: function(comment) {
		dispatch(GET_COMMENT_REPLIES, {
			comment: comment
		});
	},

	addComment: function(topic, parent, comment) {
		dispatch(ADD_COMMENT, {
			topic: topic,
			parent: parent,
			comment: comment
		});
	},

	saveComment: function(postItem, newValue) {
		dispatch(SAVE_COMMENT, {
			postItem: postItem,
			newValue: newValue
		});
	},

	createTopic: function(forum, topic) {
		dispatch(CREATE_TOPIC, {
			forum: forum,
			topic: topic
		});
	},

	deleteTopic: function(topic) {
		dispatch(DELETE_TOPIC, {
			topic: topic
		});	
	},

	deleteComment: function(comment) {
		dispatch(DELETE_COMMENT, {
			comment: comment
		});
	},

	reportItem: function(item) {
		dispatch(REPORT_ITEM, {
			item: item
		});	
	}
};

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
