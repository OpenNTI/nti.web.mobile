import React from 'react';

export default React.createClass({
	displayName: 'ArrayWidget',

	statics: {
		handles (item) {
			return Array.isArray(item);
		}
	},

	render () {
		return (
			<div>ArrayWidget</div>
		);
	}
});
