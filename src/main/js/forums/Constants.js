'use strict';

var namespacedKeyMirror = require('dataserverinterface/utils/namespaced-key-mirror');

var types = {
	FORUM: 'forums.communityforum',
	TOPIC: 'forums.communityheadlinetopic'
};

module.exports = Object.assign(exports,
	{
		types: types // e.g. Constants.types.FORUM === 'forums.communityforum'
	},
	namespacedKeyMirror('forums', {
    	DISCUSSIONS_CHANGED: null,
    	FORUM_CONTENTS_CHANGED: null
	})
);
