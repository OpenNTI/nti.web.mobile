import React from 'react';

import Badge from './Badge';
import BlogComment from './BlogComment';
import BlogEntry from './BlogEntry';
import BlogEntryPost from './BlogEntryPost';
import Chat from './Chat';
import ChatGroup from './ChatGroup';
import Contact from './Contact';
import Feedback from './Feedback';
import ForumComment from './ForumComment';
import ForumTopic from './ForumTopic';
import Grade from './Grade';
import Note from './Note';
import Unknown from './Unknown';


const KINDS = [
	Badge,
	BlogComment,
	BlogEntry,
	BlogEntryPost,
	Chat,
	ChatGroup,
	Contact,
	Feedback,
	ForumComment,
	ForumTopic,
	Grade,
	Note,
];

export function getNotificationItem (item, index) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, { key: 'notifications-' + item.OID, item, index });
}
