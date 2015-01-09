'use strict';
var React = require('react/addons');

var Unknown = require('./Unknown');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.

	ForumItem: require('./ForumItem'),
	TopicItem: require('./TopicItem'),
	PostItem: require('./PostItem'),

	select: function(part, index, props) {

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

		return React.createElement(
			Item, 
			Object.assign({
				key: 'list-item-' + index,
				index: index,
				item: part
			}, props)
		);
	}

};
