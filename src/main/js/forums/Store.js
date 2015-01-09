'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var indexForums = require('./utils/index-forums');

var _discussions;
var _forums = {}; // forum objects by id.
var _forumContents = {};
var _data = {};

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'forums.Store',

	emitChange: function(evt) {
		console.debug("forums/Store emitting change event.", evt);
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

	setDiscussions(data) {
		_discussions = dataOrError(data);
		_forums = indexForums(_discussions);
		this.emitChange({
			type: Constants.DISCUSSIONS_CHANGED
		});
	},

	getDiscussions() {
		return _discussions;
	},

	getForum(forumId) {
		return _forums[forumId];
	},

	// getTopic(forumId, topicId) {
	// 	var forum = this.getForum(forumId);
	// 	console.debug('getTopic has not been implemented. returning the forum temporarily.');
	// 	return forum;
	// 	// return forum.getTopic(topicId);
	// },

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

Store.appDispatch = AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
		default:
			return true;
	}
	return true;
});

module.exports = Store;
