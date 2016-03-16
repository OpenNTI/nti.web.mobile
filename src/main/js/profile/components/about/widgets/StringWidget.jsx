import React from 'react';

import {rawContent} from 'common/utils/jsx';

export default React.createClass({
	displayName: 'StringWidget',

	propTypes: {
		item: React.PropTypes.string.isRequired
	},

	statics: {
		handles (item) {
			return typeof item === 'string';
		}
	},

	render () {
		return <div className="string-item" {...rawContent(this.props.item)}/>;
	}
});
