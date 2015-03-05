import React from 'react';

import {types} from '../../Constants';
import {scoped} from 'common/locale';
let t = scoped('FORUMS.viewHeaders');

// map symbols to the corresponding lookup keys in locale/forums
const localeKeys = {
	[types.DISCUSSIONS]: 'discussions',
	[types.FORUM]: 'forum',
	[types.TOPIC]: 'topic',
	[types.POST]: 'post'
};

export default React.createClass({
	displayName: 'ViewHeader',

	propTypes: {
		type: React.PropTypes.oneOf([
			types.DISCUSSIONS,
			types.FORUM,
			types.TOPIC,
			types.POST
		]).isRequired
	},

	render () {
		let k = localeKeys[this.props.type] || 'unknown';
		let headerText = t(k, {fallback: ' '});
		if ((headerText || '').trim().length === 0 ) {
			console.warn('No view-header entry in locale/forums for type: %s, (key: %s)', this.props.type, k);
			return null;
		}
		return (
			<h2 className="view-header">{headerText}</h2>
		);
	}
});
