'use strict';

var namespacedKeyMirror = require('dataserverinterface/utils/namespaced-key-mirror');

var types = {
	FORUM: 'forums.communityforum',
	TOPIC: 'forums.communityheadlinetopic',
	POST: 'forums.generalforumcomment'
};

module.exports = Object.assign(exports,
	{
		types: types // e.g. Constants.types.FORUM === 'forums.communityforum'
	},
	namespacedKeyMirror('forums', {
		DISCUSSIONS_CHANGED: null,
		BOARD_CONTENTS_CHANGED: null,
		FORUM_CONTENTS_CHANGED: null,
		TOPIC_CONTENTS_CHANGED: null,
		OBJECT_LOADED: null,
		OBJECT_DELETED: null,
		OBJECT_CONTENTS_CHANGED: null,
		GET_COMMENT_REPLIES: null,
		GOT_COMMENT_REPLIES: null,
		ADD_COMMENT: null,
		COMMENT_ADDED: null,
		CREATE_TOPIC: null,
		TOPIC_CREATED: null,
		DELETE_TOPIC: null,
		DELETE_COMMENT: null
	})
);
