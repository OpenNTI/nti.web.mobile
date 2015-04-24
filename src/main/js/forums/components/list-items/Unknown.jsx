import React from 'react';

export default React.createClass({
	displayName: 'Unknown',

	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		console.debug(this.props.item);
		return (
			<div>
				{this.props.item.MimeType}
			</div>
		);
	}
});
