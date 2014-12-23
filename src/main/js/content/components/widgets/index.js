'use strict';
var React = require('react/addons');

var Unknown = require('./Unknown');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.
	Card: require('./Card'),
	MarkupFrame: require('./MarkupFrame'),
	Question: require('./Question'),

	select: function getItemHandler(part, page, ownerProps) {
		var Item = exports.Unknown;
		var key, Type;

		for (key in exports) {
			if (exports.hasOwnProperty(key)) {
				Type = exports[key];
				if (Type !== Unknown && Type.handles && Type.handles(part)) {
					if (!Type.Factory) {
						Type.Factory = React.createFactory(Type);
					}
					Item = Type.Factory;
					break;
				}
			}
		}

		return Item(
			{
				key: 'widget-' + part.guid,
				item: part,
				ownerProps: ownerProps,
				page: page
			});
	}

};
