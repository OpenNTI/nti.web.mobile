
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


export function getCommentReplies (comment) {
	dispatch(GET_COMMENT_REPLIES, {
		comment: comment
	});
}

export function addComment (topic, parent, comment) {
	dispatch(ADD_COMMENT, {
		topic: topic,
		parent: parent,
		comment: comment
	});
}

export function saveComment (postItem, newValue) {
	dispatch(SAVE_COMMENT, {
		postItem: postItem,
		newValue: newValue
	});
}

export function createTopic (forum, topic) {
	dispatch(CREATE_TOPIC, {
		forum: forum,
		topic: topic
	});
}

export function deleteTopic (topic) {
	dispatch(DELETE_TOPIC, {
		topic: topic
	});
}

export function deleteComment (comment) {
	dispatch(DELETE_COMMENT, {
		comment: comment
	});
}

export function reportItem (item) {
	dispatch(REPORT_ITEM, {
		item: item
	});
}

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
