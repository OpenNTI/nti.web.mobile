import React from 'react';

import Unknown from './Unknown';

//`require.context` is a little WebPack magic :) --- dynamicly require all files that match the pattern /.jsx$/
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

	const key = `widget-${item.guid}`;

	return React.createElement(Item, {key, ...ownerProps, item, page});
}
