'use strict';
var React = require('react/addons');


var Unknown = require('./Unknown');
var Topic = require('./Topic');
var Group = require('./Group');
var Video = require('./Video');
var Videos = require('./Videos');
var Card = require('./RelatedWorkRef');
var Discussion = require('./Discussion');
var QuestionSet = require('./QuestionSet');


function getItemHandler(item, index, list, props, node) {
	var Item = exports.Unknown;
	var key, Type, render = true;

	for (key in exports) {
		if (exports.hasOwnProperty(key)) {
			Type = exports[key];
			if (Type !== Unknown && Type.handles && Type.handles(item)) {
				if (!Type.Factory) {
					Type.Factory = React.createFactory(Type);
				}
				Item = Type.Factory;
				render = (!Type.canRender || Type.canRender(item, node));
				break;
			}
		}
	}

	return render &&
	 	Item(Object.assign({}, props || {}, {
			key: item.NTIID || ('overview-' + item.MimeType + '-' + index),
			item: item,
			index: index,
			ref: Item.displayName + '-' + index
		}));
}


exports = module.exports = {
	Unknown: Unknown, //Unknown for future items.
	Topic: Topic,
	Card: Card,
	Group: Group,
	Video: Video,
	Videos: Videos,
	Discussion: Discussion,
	QuestionSet: QuestionSet,

	Mixin: require('./Mixin')

};

exports.Mixin.select = exports.select = getItemHandler.bind(exports);
