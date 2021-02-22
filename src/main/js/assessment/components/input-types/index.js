import React from 'react';

import Unknown from './Unknown';
//
import File from './file';
//
import FreeResponse from './FreeResponse';
import ModeledContent from './ModeledContent';
//
import MultipleChoice from './MultipleChoice';
import MultipleChoiceMultipleAnswer from './MultipleChoiceMultipleAnswer';
//
import NumericMath from './NumericMath';
import SymbolicMath from './SymbolicMath';
//
import Matching from './Matching';
import Ordering from './Ordering';
//
import FillInTheBlankShortAnswer from './FillInTheBlankShortAnswer';
import FillInTheBlankWithWordBank from './FillInTheBlankWithWordBank';

const KINDS = [
	Unknown,
	File,
	FreeResponse,
	ModeledContent,
	MultipleChoice,
	MultipleChoiceMultipleAnswer,
	NumericMath,
	Matching,
	Ordering,
	SymbolicMath,
	FillInTheBlankShortAnswer,
	FillInTheBlankWithWordBank,
];

function inputComponent(item) {
	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			return Type;
		}
	}

	return Unknown;
}

export function containerClass(item) {
	return inputComponent(item).containerClass;
}

export function getInputWidget(item, index) {
	const Component = inputComponent(item);

	return React.createElement(Component, {
		ref: 'input',
		key: 'question-input-' + index,
		index,
		item,
	});
}
