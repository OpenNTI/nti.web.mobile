import React from 'react';

export default React.createClass({
	displayName: 'list-items:Unknown',

	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		return (
			<div>
				{this.props.item.MimeType}
			</div>
		);
	}
});
