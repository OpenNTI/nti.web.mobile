import React from 'react';

export default React.createClass({
	displayName: 'course:activity:Note',

	statics: {
		handles (item) {
			return /note$/i.test(item.MimeType);
		}
	},

	render () {
		return (
			<div>Course Activity Note</div>
		);
	}
});
