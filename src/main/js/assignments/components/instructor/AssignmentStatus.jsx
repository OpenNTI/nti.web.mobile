import React from 'react';

export default React.createClass({
	displayName: 'AssignmentStatus',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<div className="assignment-status">(status)</div>
		);
	}
});
