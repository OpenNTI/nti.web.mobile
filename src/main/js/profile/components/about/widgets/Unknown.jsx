import React from 'react';

export default React.createClass({
	displayName: 'UnknownWidget',

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {
		return (
			<div>UnknownWidget: {this.props.item.MimeType}</div>
		);
	}
});
