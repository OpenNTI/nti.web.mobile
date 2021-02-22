import AppDispatcher from '@nti/lib-dispatcher';

import {
	GET_COMMENT_REPLIES,
	ADD_COMMENT,
	SAVE_COMMENT,
	CREATE_TOPIC,
	DELETE_TOPIC,
	DELETE_COMMENT,
	DELETE_FORUM,
	REPORT_ITEM,
	CREATE_FORUM,
} from './Constants';

export function getCommentReplies(comment) {
	dispatch(GET_COMMENT_REPLIES, { comment });
}

export function addComment(topic, parent, comment) {
	dispatch(ADD_COMMENT, { topic, parent, comment });
}

export function saveComment(postItem, newValue) {
	dispatch(SAVE_COMMENT, { postItem, newValue });
}

export function createTopic(forum, topic) {
	dispatch(CREATE_TOPIC, { forum, topic });
}

export function deleteTopic(topic) {
	dispatch(DELETE_TOPIC, { topic });
}

export function deleteComment(comment) {
	dispatch(DELETE_COMMENT, { comment });
}

export function deleteForum(forum) {
	dispatch(DELETE_FORUM, { forum });
}

export function reportItem(item) {
	dispatch(REPORT_ITEM, { item });
}

export function createForum(board, forum) {
	dispatch(CREATE_FORUM, { board, forum });
}

function dispatch(type, data) {
	AppDispatcher.handleRequestAction(Object.assign(data, { type }));
}
