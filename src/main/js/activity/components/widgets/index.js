import './index.scss';
import React from 'react';

import Unknown from './Unknown';
import Badge from './Badge';
import BlogComment from './BlogComment';
import Chat from './Chat';
import ContentIcon from './ContentIcon';
import ForumComment from './ForumComment';
import ForumTopic from './ForumTopic';
import Highlight from './Highlight';
import HighlightContainer from './HighlightContainer';
import HighlightGroup from './HighlightGroup';
import Joined from './Joined';
import Note from './Note';
import RecentReplies from './RecentReplies';

const WIDGETS = [
	Badge,
	BlogComment,
	Chat,
	ContentIcon,
	ForumComment,
	ForumTopic,
	Highlight,
	HighlightContainer,
	HighlightGroup,
	Joined,
	Note,
	RecentReplies,
];

export default function select (item, index, props = {}) {
	let Item = Unknown;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	Object.assign(props, {
		ref: 'input',
		key: 'activity-' + (index || item.OID),
		index, item
	});

	return React.createElement(Item, props);
}
