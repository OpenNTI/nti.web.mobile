import React from 'react';

//`require.context` is a little WebPack magic :)
const req = require.context('./', false, /.jsx$/);
const {default: Unknown} = req('./Unknown.jsx');
const KINDS = req.keys().map(m => req(m).default);

export function getNotificationItem (item, index) {
	let Item = Unknown;

	for (let Type of KINDS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, { key: 'notifications-' + item.OID, item, index });
}
