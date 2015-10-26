import React from 'react';

export default React.createClass({
	displayName: 'ForumItem',

	statics: {
		handles (item) {
			const {MimeType = ''} = item;
			return /topic$/i.test(MimeType);
		}
	},

	render () {
		return (
			<div>ForumItem</div>
		);
	}
});
