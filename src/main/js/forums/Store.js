'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var TypedEventEmitter = require('common/TypedEventEmitter');

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;
var NTIID = require('dataserverinterface/utils/ntiids');
var indexForums = require('./utils/index-forums');
var _discussions = {};
var _forums = {}; // forum objects by id.
var _forumContents = {};
var _objectContents = {};
var _objects = {};

var Store = Object.assign({}, TypedEventEmitter, {
	displayName: 'forums.Store',

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
		_forums = Object.assign(_forums||{}, indexForums(_discussions));
		this.emitChange({
			type: Constants.DISCUSSIONS_CHANGED,
			courseId: courseId
		});
	},

	getDiscussions(courseId) {
		return _discussions[courseId];
	},

	getForum(forumId) {
		return _forums[NTIID.decodeFromURI(forumId)];
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

	getObjectContents(objectId) {
		var key = this.__keyForContents(objectId);
		return _objectContents[key];
	},

	getObject(objectId) {
		return _objects[objectId];
	},

	setObject(objectId, object) {
		_objects[objectId] = object;
	},

	deleteObject(object) {
		var objectId = object && object.getID ? object.getID() : object;
		delete _objects[objectId];
		Store.emitChange({
			type: Constants.OBJECT_DELETED,
			objectId: objectId,
			object: object
		});
	},

	setObjectContents(objectId, contents) {
		var key = this.__keyForContents(objectId);
		_objectContents[key] = contents;
		this.emitChange({
			type: Constants.OBJECT_CONTENTS_CHANGED,
			objectId: objectId,
		});
	},

	commentAdded: function(data) {
		this.emitChange({
			type: Constants.COMMENT_ADDED,
			data: data
		});
	},

	__keyForContents(objectId) {
		return [objectId, 'contents'].join(':');
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

Store.setMaxListeners(0);

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
