import React from 'react';
import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

export default React.createClass({
	displayName: 'AssignmentItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {
		let {assignment} = this.props;
		return (
			<div>
				{assignment.title}
				<AssignmentStatusLabel assignment={assignment} />
			</div>
		);
	}
});
