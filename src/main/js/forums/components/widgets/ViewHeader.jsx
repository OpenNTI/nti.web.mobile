import React from 'react';

import {types} from '../../Constants';

export default React.createClass({
	displayName: 'ViewHeader',

	propTypes: {
		type: React.PropTypes.oneOf([
			types.FORUM,
			types.TOPIC,
			types.POST
		]).isRequired
	},

	render () {
		return (
			<h2 className="view-header">{this.props.children}</h2>
		);
	}
});
