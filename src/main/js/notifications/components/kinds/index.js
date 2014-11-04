'use strict';

var Unknown = require('./Unknown');
var Chat = require('./Chat');
var Contact = require('./Contact');
var Badge = require('./Badge');
var Grade = require('./Grade');
var Feedback = require('./Feedback');
var Note = require('./Note');
var BlogEntry = require('./BlogEntry');
var BlogEntryPost = require('./BlogEntryPost');
var BlogComment = require('./BlogComment');
var ForumComment = require('./ForumComment');
var ForumTopic = require('./ForumTopic');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.

	Chat: Chat,
	Contact: Contact,
	Badge: Badge,
	Grade: Grade,
	Feedback: Feedback,

	Note: Note,

	BlogEntry: BlogEntry,
	BlogEntryPost: BlogEntryPost,
	BlogComment: BlogComment,

	ForumTopic: ForumTopic,
	ForumComment: ForumComment,

	select: function getNotificationItemHandler(item, index) {
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
		return Item({key: 'notifications-' + index + '-' + item.OID, item: item, index: index});
	}

};
