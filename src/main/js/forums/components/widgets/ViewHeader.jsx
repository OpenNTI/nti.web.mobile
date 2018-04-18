import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import {DISCUSSIONS, FORUM, TOPIC, POST} from '../../Constants';

const DEFAULT_TEXT = {
	discussions: 'Discussions',
	forum: 'Forum',
	topic: 'Topic',
	post: 'Comment'
};

const t = scoped('forums.headers', DEFAULT_TEXT);

// map symbols to the corresponding lookup keys in locale/forums
const localeKeys = {
	[DISCUSSIONS]: 'discussions',
	[FORUM]: 'forum',
	[TOPIC]: 'topic',
	[POST]: 'post'
};


function headerTextForType (localeKey) {
	let k = localeKeys[localeKey] || 'unknown';
	let headerText = t(k, {fallback: ' '});
	return headerText;
}

export default class extends React.Component {
	static displayName = 'ViewHeader';

	static propTypes = {
		type: PropTypes.oneOf([
			DISCUSSIONS,
			FORUM,
			TOPIC,
			POST
		]).isRequired
	};

	static headerTextForType (localeKey) {
		return headerTextForType(localeKey);
	}

	render () {
		let headerText = headerTextForType(this.props.type);
		if ((headerText || '').trim().length === 0 ) {
			// console.warn('No view-header entry in locale/forums for type: %s', this.props.type);
			return null;
		}
		return (
			<h2 className="view-header">{headerText}</h2>
		);
	}
}
