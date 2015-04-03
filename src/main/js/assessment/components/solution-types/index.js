import React from 'react';

import Unknown from './Unknown';


import Solution from './String';

import MultipleChoice from './MultipleChoice';

// import NumericMath from './NumericMath';
// import SymbolicMath from './SymbolicMath';

import Matching from './Matching';
import Ordering from './Ordering';

import FillInTheBlankShortAnswer from './FillInTheBlankShortAnswer';
import FillInTheBlankWithWordBank from './FillInTheBlankWithWordBank';


const KINDS = [
	Unknown,
	Solution,

	MultipleChoice,

	//NumericMath,
	//SymbolicMath,

	Matching,
	Ordering,

	FillInTheBlankShortAnswer,
	FillInTheBlankWithWordBank
];


export function getSolutionWidget (item, index) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, {
		ref: 'solution',
		key: 'question-solution-' + index,
		index, item
	});
}
