'use strict';

var Unknown = require('./Unknown');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.

	MultipleChoice: require('./MultipleChoice'),
	MultipleChoiceMultipleAnswer: require('./MultipleChoiceMultipleAnswer'),

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
