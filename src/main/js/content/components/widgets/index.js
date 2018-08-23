import React from 'react';

import Unknown from './Unknown';
import Card from './Card';
import EmbededWidget from './EmbededWidget';
import ImageRoll from './roll/ImageRoll';
import MarkupFrame from './MarkupFrame';
import Question from './Question';
import RealPageNumber from './RealPageNumber';
import TopicEmbed from './TopicEmbed';
import Video from './Video';
import VideoRoll from './roll/VideoRoll';

const WIDGETS = [
	Card,
	EmbededWidget,
	ImageRoll,
	MarkupFrame,
	Question,
	RealPageNumber,
	TopicEmbed,
	Unknown,
	Video,
	VideoRoll,
];

export function getWidget (item, page, ownerProps) {
	let Item = Unknown;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	const key = `widget-${item.guid}`;

	return React.createElement(Item, {key, ...ownerProps, item, page});
}
