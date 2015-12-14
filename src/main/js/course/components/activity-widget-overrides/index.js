import React from 'react';

//`require.context` is a little WebPack magic :) --- dynamicly require all files the match the pattern /.jsx$/
const req = require.context('./', true, /.jsx$/);
const WIDGETS = req.keys().map(m => req(m).default);


export default function select (item, index, props = {}) {
	let clazz;
	for (let Type of WIDGETS) {
		if (Type.handles && Type.handles(item)) {
			clazz = Type;
			break;
		}
	}

	if (clazz) {
		props = Object.assign({}, props, {
			ref: 'input',
			key: 'course-activity-' + (index || item.OID),
			index, item
		});
	}

	return clazz && React.createElement(clazz, props);
}
