import React from 'react';

import Unknown from './Unknown';
// import File from './File';

import FreeResponse from './FreeResponse';
import ModeledContent from './ModeledContent';

import MultipleChoice from './MultipleChoice';
import MultipleChoiceMultipleAnswer from './MultipleChoiceMultipleAnswer';

import NumericMath from './NumericMath';
import SymbolicMath from './SymbolicMath';

import Matching from './Matching';
import Ordering from './Ordering';

import FillInTheBlankShortAnswer from './FillInTheBlankShortAnswer';
import FillInTheBlankWithWordBank from './FillInTheBlankWithWordBank';


const KINDS = [
	Unknown,
	// File,
	FreeResponse,
	ModeledContent,
	MultipleChoice,
	MultipleChoiceMultipleAnswer,
	NumericMath,
	Matching,
	Ordering,
	SymbolicMath,
	FillInTheBlankShortAnswer,
	FillInTheBlankWithWordBank
];

export function getInputWidget (item, index) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, {
		ref: 'input',
		key: 'question-input-' + index,
		index, item
	});
}
