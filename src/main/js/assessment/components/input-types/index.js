'use strict';

var Unknown = require('./Unknown');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.

	// File: require('./File'),

	FreeResponse: require('./FreeResponse'),
	// ModeledContent: require('./ModeledContent'),

	MultipleChoice: require('./MultipleChoice'),
	MultipleChoiceMultipleAnswer: require('./MultipleChoiceMultipleAnswer'),

	NumericMath: require('./NumericMath'),
	SymbolicMath: require('./SymbolicMath'),

	// Matching: require('./Matching'),
	// Ordering: require('./Ordering'),

	// FillInTheBlankShortAnswer: require('./FillInTheBlankShortAnswer'),
	// FillInTheBlankWithWordBank: require('./FillInTheBlankWithWordBank'),


	select: function(part, index) {
		var Item = Unknown, Type, key;

		for (key in exports) {
			if (exports.hasOwnProperty(key)) {
				Type = exports[key];
				if (Type !== Unknown && Type.handles && Type.handles(part)) {
					Item = Type;
					break;
				}
			}
		}

		return Item(
			{
				key: 'question-input-' + index,
				index: index,
				item: part
			});
	}

};
