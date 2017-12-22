import React from 'react';
import PropTypes from 'prop-types';

import Unknown from './Unknown';

//`require.context` is a little WebPack magic :) --- dynamicly require all files that match the pattern /.jsx$/
const req = require.context('./', true, /.jsx$/);
const WIDGETS = req.keys().map(m => req(m).default);

export function getWidget (item, page, ownerProps, context) {
	let Item = Unknown;

	class ContextWrapper extends React.Component {
		static propTypes = { children: PropTypes.any }

		getChildContext () {
			return context;
		}

		render () {
			return this.props.children;
		}
	}

	ContextWrapper.childContextTypes = Object.keys(context).reduce((_,p) => (_[p] = PropTypes.any, _), {});

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	const key = `widget-${item.guid}`;

	return React.createElement(ContextWrapper, {key},
		React.createElement(Item, {...ownerProps, item, page})
	);
}
