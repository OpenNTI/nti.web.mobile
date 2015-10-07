import React from 'react';

import Unknown from './Unknown';

import ModeledContent from './ModeledContent';

import MultipleChoice from './MultipleChoice';
import MultipleChoiceMultipleAnswer from './MultipleChoiceMultipleAnswer';

import Matching from './Matching';
import Ordering from './Ordering';

const KINDS = [
	Unknown,
	ModeledContent,
	MultipleChoice,
	MultipleChoiceMultipleAnswer,
	Matching,
	Ordering
];

export function renderWidget (item, index) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, {
		ref: 'input',
		key: 'aggregated-type-' + index,
		index, item
	});
}
