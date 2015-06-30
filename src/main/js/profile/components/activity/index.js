import React from 'react';

import Unknown from './Unknown';
import ForumComment from './ForumComment';
import ForumTopic from './ForumTopic';
import Highlight from './Highlight';


const KINDS = [
	Unknown,
	ForumComment,
	ForumTopic,
	Highlight
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
		key: 'profile-activity-' + item.OID,
		index, item
	});
}
