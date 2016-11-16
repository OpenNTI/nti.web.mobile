import React from 'react';

import Unknown from './Unknown';

//`require.context` is a little WebPack magic :) --- dynamicly require all files the match the pattern /.jsx$/
const req = require.context('./', true, /.jsx$/);
const WIDGETS = req.keys().map(m => req(m).default);

export function getWidget (item, page, ownerProps) {
	let Item = Unknown;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	let key = `widget-${item.guid}`;

	return React.createElement(Item, {...ownerProps, key, item, page});
}
