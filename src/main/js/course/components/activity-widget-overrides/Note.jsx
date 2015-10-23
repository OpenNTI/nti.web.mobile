import React from 'react';

export default React.createClass({
	displayName: 'course:activity:Note',

	statics: {
		handles (item) {
			const {MimeType = ''} = item;
			return /note$/i.test(MimeType) && !item.isReply();
		}
	},

	render () {
		return (
			<div>Course Activity Note</div>
		);
	}
});
