import React from 'react';

export default React.createClass({
	displayName: 'Unknown',

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {
		let {MimeType} = this.props.item || {};
		return (
			<error><span>Unknown Type:<br/>{MimeType}</span></error>
		);
	}
});
