import React from 'react';

import Unknown from './Unknown';
import Assignment from './Assignment';
import CourseOutlineContentNode from './CourseOutlineContentNode';
import ForumComment from './ForumComment';
import ForumTopic from './ForumTopic';
import Highlight from './Highlight';
import HighlightContainer from './HighlightContainer';
import Note from './Note';
import Chat from './Chat';


const KINDS = [
	Unknown,
	Assignment,
	CourseOutlineContentNode,
	ForumComment,
	ForumTopic,
	HighlightContainer,
	Highlight,
	Note,
	Chat
];

export default function select (item, index) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, {
		ref: 'input',
		key: 'profile-activity-' + (index || item.OID),
		index, item
	});
}
