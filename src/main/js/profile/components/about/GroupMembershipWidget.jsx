import React from 'react';

export default React.createClass({
	displayName: 'GroupMembershipWidget',

	statics: {
		handles (item) {
			return item.MimeType && (/membership$/i).test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<div>GroupMembershipWidget</div>
		);
	}
});
