import React from 'react';

export default React.createClass({
	displayName: 'AssignmentItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {
		let {assignment} = this.props;
		return (
			<div>{assignment.title}</div>
		);
	}
});
