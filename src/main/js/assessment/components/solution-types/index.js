'use strict';
var React = require('react/addons');

var Unknown = require('./Unknown');

exports = module.exports = {
	Solution: require('./String'),
	Unknown: Unknown, //Unknown for future items.

	MultipleChoice: require('./MultipleChoice'),

	// NumericMath: require('./NumericMath'),
	// SymbolicMath: require('./SymbolicMath'),

	Matching: require('./Matching'),
	Ordering: require('./Ordering'),

	FillInTheBlankShortAnswer: require('./FillInTheBlankShortAnswer'),
	FillInTheBlankWithWordBank: require('./FillInTheBlankWithWordBank'),


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

		return React.createElement(Item,
			{
				ref: 'solution',
				key: 'question-solution-' + index,
				index: index,
				item: part
			});
	}

};
