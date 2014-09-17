'use strict';

var Unknown = require('./Unknown');
var Group = require('./Group');
var Video = require('./Video');
var Videos = require('./Videos');

exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.

	Group: Group,
	Video: Video,
	Videos: Videos,

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

		return Item(
			{
				key: 'overview-' + item.MimeType + '-' + index,
				item: item,
				index: index
			},
			//See note below...
			children && children.reduce(collator, []));
	}

};


/**
 * This is the auto-collator function for Videos that are in the overview in a
 * row. This should probably be removed and a more explicit video-grouping be
 * adopted.
 *
 * When more than one video is in a row, this will pull them into one playlist.
 *
 * @param  {Array} items
 * @param  {Component} item
 * @param  {Number} index
 * @param  {Array} list
 *
 * @return {Array}       Returns the `items` array.
 */
function collator(items, item, index, list) {
	var last = items[items.length - 1];
	if (item instanceof Video) {
		if (!(last instanceof Videos)) {
			last = Videos({key: item.props.key}, []);
			items.push(last);
		}
		//magic... don't do this.
		last._store.props.children.push(item);
	} else {
		items.push(item);
	}

	return items;
}
