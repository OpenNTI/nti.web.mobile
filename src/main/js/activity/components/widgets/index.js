import React from 'react';

import Unknown from './Unknown';

//`require.context` is a little WebPack magic :) --- dynamicly require all files the match the pattern /.jsx$/
const req = require.context('./', true, /.jsx$/);
const WIDGETS = req.keys().map(m => req(m).default);

export default function select (item, index, props = {}) {
	let Item = Unknown;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	Object.assign(props, {
		ref: 'input',
		key: 'activity-' + (index || item.OID),
		index, item
	});

	return React.createElement(Item, props);
}
