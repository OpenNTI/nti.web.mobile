'use strict';

var Unknown = require('./Unknown');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.
	Card: require('./Card'),
	MarkupFrame: require('./MarkupFrame'),
	Question: require('./Question'),

	select: function getItemHandler(part, pageData, ownerProps) {
		var Item = exports.Unknown;
		var key, Type;

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
				key: 'widget-' + part.guid,
				item: part,
				ownerProps: ownerProps,
				pageData: pageData
			});
	}

};
