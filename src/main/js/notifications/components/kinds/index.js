'use strict';

var unknown = require('./Unknown');

exports = module.exports = {
	Unknown: unknown, //Unknown for future items.

	Contact: '',
	Badge: '',
	Grade: '',
	Feedback: '',

	Note: '',

	BlogEntry: '',
	BlogEntryPost: '',
	BlogComment: '',

	ForumTopic: '',
	ForumComment: '',

	select: function getNotificationItemHandler(item, index) {
		var Item = exports.Unknown;

		return Item({key: 'notifications-' + index});
	}

};
