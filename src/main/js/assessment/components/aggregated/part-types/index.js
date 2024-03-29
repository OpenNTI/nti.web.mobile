import React from 'react';

import Unknown from './Unknown';
import FreeResponse from './FreeResponse';
import ModeledContent from './ModeledContent';
import MultipleChoice from './MultipleChoice';
// import MultipleChoiceMultipleAnswer from './MultipleChoiceMultipleAnswer';
// import Matching from './Matching';
import Ordering from './Ordering';

const KINDS = [
	Unknown,
	FreeResponse,
	ModeledContent,
	MultipleChoice,
	// MultipleChoiceMultipleAnswer,
	// Matching,
	Ordering,
];

export function renderWidget(item, index, questionPart) {
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
		index,
		item,
		questionPart,
	});
}
