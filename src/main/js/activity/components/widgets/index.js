import React from 'react';

import Unknown from './Unknown';
import ForumComment from './ForumComment';
import ForumTopic from './ForumTopic';
import Highlight from './Highlight';
import HighlightContainer from './HighlightContainer';
import Note from './Note';
import Chat from './Chat';


const KINDS = [
	Unknown,
	ForumComment,
	ForumTopic,
	HighlightContainer,
	Highlight,
	Note,
	Chat
];

export default function select (item, index, props = {}) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	Object.assign(props, {
		ref: 'input',
		key: 'profile-activity-' + (index || item.OID),
		index, item
	});

	return React.createElement(Item, props);
}
