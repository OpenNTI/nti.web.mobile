import React from 'react/addons';

import Unknown from './Unknown';

import Card from './Card';
import MarkupFrame from './MarkupFrame';
import Question from './Question';

const WIDGETS = [
	Unknown,
	Card,
	MarkupFrame,
	Question
];

export function getWidget(part, page, ownerProps) {
	var Item = Unknown;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(part)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item,
		{
			key: 'widget-' + part.guid,
			item: part,
			ownerProps: ownerProps,
			page: page
		});
}
