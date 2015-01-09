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
		OBJECT_CONTENTS_LOADED: null
	})
);
