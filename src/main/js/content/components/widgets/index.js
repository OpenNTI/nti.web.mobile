import React from 'react';

import Unknown from './Unknown';

import Card from './Card';
import ImageRoll from './roll/ImageRoll';
import MarkupFrame from './MarkupFrame';
import Question from './Question';
import Video from './Video';
import VideoRoll from './roll/VideoRoll';

const WIDGETS = [
	Unknown,
	Card,
	ImageRoll,
	MarkupFrame,
	Question,
	Video,
	VideoRoll
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
