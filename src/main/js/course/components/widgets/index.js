'use strict';

var Unknown = require('./Unknown');
var Group = require('./Group');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.

	Group: Group,

	select: function getItemHandler(item, index, list, children) {
		var Item = exports.Unknown;
		var key, Type;

		for (key in exports) {
			if (exports.hasOwnProperty(key)) {
				Type = exports[key];
				if (Type !== Unknown && Type.handles && Type.handles(item)) {
					Item = Type;
					break;
				}
			}
		}

		return Item({key: 'overview-' + item.MimeType + '-' + index, item: item, index: index}, children);
	}

};
