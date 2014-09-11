'use strict';

var Unknown = require('./Unknown');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.

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

	select: function getNotificationItemHandler(item, index, list) {
		var Item = exports.Unknown;
		var key, Type;

		for (key in exports) {
			if (exports.hasOwnProperty(key)) {
				Type = exports[key];
				if (Type !== Unknown && Type.handles && Type.handles(item)) {
					Item = Type;
					break;
				}
			}
		}

		return Item({key: 'notifications-' + item.OID, item: item, index: index});
	}

};
