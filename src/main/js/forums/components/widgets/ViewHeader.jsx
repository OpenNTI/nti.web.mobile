import React from 'react';

import {DISCUSSIONS, FORUM, TOPIC, POST} from '../../Constants';
import {scoped} from 'common/locale';
let t = scoped('FORUMS.viewHeaders');

// map symbols to the corresponding lookup keys in locale/forums
const localeKeys = {
	[DISCUSSIONS]: 'discussions',
	[FORUM]: 'forum',
	[TOPIC]: 'topic',
	[POST]: 'post'
};


function headerTextForType(localeKey) {
	let k = localeKeys[localeKey] || 'unknown';
	let headerText = t(k, {fallback: ' '});
	return headerText;
}

export default React.createClass({
	displayName: 'ViewHeader',

	propTypes: {
		type: React.PropTypes.oneOf([
			DISCUSSIONS,
			FORUM,
			TOPIC,
			POST
		]).isRequired
	},

	statics: {
		headerTextForType(localeKey) {
			return headerTextForType(localeKey);
		}
	},

	render () {
		let headerText = headerTextForType(this.props.type);
		if ((headerText || '').trim().length === 0 ) {
			console.warn('No view-header entry in locale/forums for type: %s', this.props.type);
			return null;
		}
		return (
			<h2 className="view-header">{headerText}</h2>
		);
	}
});
