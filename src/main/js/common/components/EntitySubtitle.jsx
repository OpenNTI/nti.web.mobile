import React from 'react';

export default React.createClass({
	displayName: 'EntitySubtitle',

	propTypes: {
		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		]).isRequired
	},

	render () {
		return (
			<div />
		);
	}
});
