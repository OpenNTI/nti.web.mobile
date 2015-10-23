import React from 'react';

import Note from './Note';

const KINDS = [
	Note
];

export default function select (item, index, props = {}) {
	let clazz;
	for (let Type of KINDS) {
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
