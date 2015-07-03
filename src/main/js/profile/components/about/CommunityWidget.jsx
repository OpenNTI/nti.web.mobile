import React from 'react';

export default React.createClass({
	displayName: 'CommunityWidget',

	statics: {
		handles (item) {
			return item.MimeType && (/community$/i).test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<div>{this.props.item.displayName}</div>
		);
	}
});
