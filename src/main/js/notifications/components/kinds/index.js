import React from 'react';

import Unknown from './Unknown';
import Chat from './Chat';
import ChatGroup from './ChatGroup';
import Contact from './Contact';
import Badge from './Badge';
import Grade from './Grade';
import Feedback from './Feedback';
import Note from './Note';
import BlogEntry from './BlogEntry';
import BlogEntryPost from './BlogEntryPost';
import BlogComment from './BlogComment';
import ForumComment from './ForumComment';
import ForumTopic from './ForumTopic';

const KINDS = [
	Unknown,

	Chat,
	ChatGroup,
	Contact,
	Badge,
	Grade,
	Feedback,

	Note,

	BlogEntry,
	BlogEntryPost,
	BlogComment,

	ForumTopic,
	ForumComment
];

export function getNotificationItem (item, index) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, {
		key: 'notifications-' + index + '-' + item.OID,
		item: item, index: index
	});
}
