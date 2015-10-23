import React from 'react';

export default React.createClass({
	displayName: 'NoteReply',

	statics: {
		handles (item) {
			const {MimeType = ''} = item;
			return /note$/i.test(MimeType) && item.isReply();
		}
	},

	render () {
		return (
			<div>Reply</div>
		);
	}
});
