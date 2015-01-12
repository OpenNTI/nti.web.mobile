'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var indexForums = require('./utils/index-forums');

var _discussions = {};
var _forums = {}; // forum objects by id.
var _forumContents = {};
var _data = {};

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'forums.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	setDiscussions(courseId, data) {
		_discussions[courseId] = dataOrError(data);
		_forums[courseId] = indexForums(_discussions);
		this.emitChange({
			type: Constants.DISCUSSIONS_CHANGED,
			courseId: courseId
		});
	},

	getDiscussions(courseId) {
		return _discussions[courseId];
	},

	getForum(forumId) {
		return _forums[forumId];
	},

	setBoardContents(courseId, boardId, data) {
		_forumContents[boardId] = dataOrError(data);
		this.emitChange({
			type: Constants.BOARD_CONTENTS_CHANGED,
			forumId: boardId
		});
	},

	getForumContents(forumId) {
		return _forumContents[forumId];
	},

	getTopicContents(courseId, forumId, topicId) {
		var key = [courseId, forumId, topicId, 'contents'].join(':');
		return _data[key];
	},

	setTopicContents(courseId, forumId, topicId, contents) {
		var key = [courseId, forumId, topicId, 'contents'].join(':');
		_data[key] = contents;
		this.emitChange({
			type: Constants.TOPIC_CONTENTS_CHANGED,
			key: key
		});
	}

});

// convenience method for creating an error object
// for failed fetch attempts
function dataOrError(data) {
	if (data && data instanceof Error) {
		return {
			error: data,
			isError: true
		};
	}
	return data;
}

function getCommentReplies(comment) {
	if(!comment || !comment.getReplies) {
		console.warn('Can\'t get replies from %O', comment);
		return;
	}
	comment.getReplies().then(replies => {
		Store.emitChange({
			type: Constants.GOT_COMMENT_REPLIES,
			comment: comment,
			replies: replies
		});
	});
}

Store.appDispatch = AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
		case Constants.GET_COMMENT_REPLIES:
			getCommentReplies(action.comment);
			break;
		default:
			return true;
	}
	return true;
});

module.exports = Store;
