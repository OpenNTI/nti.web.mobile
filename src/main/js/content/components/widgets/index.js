import React from 'react';

import Unknown from './Unknown';

import Card from './Card';
import MarkupFrame from './MarkupFrame';
import Question from './Question';
import Video from './Video';

const WIDGETS = [
	Unknown,
	Card,
	MarkupFrame,
	Question,
	Video
];

export function getWidget(item, page, ownerProps) {
	let Item = Unknown;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	let key = `widget-${item.guid}`;

	return React.createElement(Item,
		Object.assign({}, ownerProps, {key, item, page}));
}
