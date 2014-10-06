'use strict';

var merge = require('react/lib/merge');

var Card = require('./Card');
var MarkupFrame = require('./MarkupFrame');
var Unknown = require('./Unknown');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.
	Card: Card,
	MarkupFrame: MarkupFrame,

	select: function getItemHandler(part) {
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
				item: part
			});
	}

};
