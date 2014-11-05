'use strict';

var merge = require('react/lib/merge');

var Unknown = require('./Unknown');
var Group = require('./Group');
var Video = require('./Video');
var Videos = require('./Videos');
var Card = require('./RelatedWorkRef');
var Discussion = require('./Discussion');
var QuestionSet = require('./QuestionSet');


function getItemHandler(item, index, list, props) {
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
		merge({
			key: item.NTIID || ('overview-' + item.MimeType + '-' + index),
			item: item,
			index: index,
			ref: Item.displayName + '-' + index
		}, props || {}));
}


exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.
	Card: Card,
	Group: Group,
	Video: Video,
	Videos: Videos,
	Discussion: Discussion,
	QuestionSet: QuestionSet,

	Mixin: require('./Mixin')

};

exports.Mixin.select = exports.select = getItemHandler.bind(exports);
