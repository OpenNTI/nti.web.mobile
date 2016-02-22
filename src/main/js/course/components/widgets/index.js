import React from 'react';

import Unknown from './Unknown';

//`require.context` is a little WebPack magic :) --- dynamicly require all files the match the pattern /.jsx$/
const req = require.context('./', true, /.jsx$/);
const WIDGETS = req.keys().map(m => req(m).default);

export function select (item, index, list, props, node, assessmentCollection) {
	let Item = Unknown;
	let render = true;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			render = (!Type.canRender || Type.canRender(item, node, assessmentCollection));
			break;
		}
	}

	return render &&
		React.createElement(Item, Object.assign({}, props || {}, {
			key: item.NTIID || ('overview-' + item.MimeType + '-' + index),
			item: item,
			index: index,
			ref: x => this['container-item-' + Item.displayName + '-' + index] = x,
			assessmentCollection
		}));
}

import Mixin from './Mixin';
export {Mixin};
