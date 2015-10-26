import React from 'react';

import Unknown from './Unknown';

import ForumItem from './ForumItem';
import TopicItem from './TopicItem';
import PostItem from './PostItem';
import DeletedGroupItem from './DeletedGroupItem';

const Types = [
	Unknown, //Unknown for future items.
	ForumItem,
	TopicItem,
	PostItem,
	DeletedGroupItem
];

export default function select (part, index, props) {

	let Item = Unknown;

	for (let Type of Types) {
		if (Type !== Unknown && Type.handles && Type.handles(part)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(
		Item,
		Object.assign({
			key: 'list-item-' + index,
			index: index,
			item: part
		}, props)
	);
}
