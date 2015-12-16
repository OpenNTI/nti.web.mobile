import React from 'react';

import StudentHeader from './StudentHeader';
import StudentAssignmentsTable from './table/StudentAssignmentsTable';

export default React.createClass({
	displayName: 'Performance:Student',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		userId: React.PropTypes.string
	},

	render () {

		const {assignments, userId} = this.props;
		const summary = assignments.getStudentSummary(userId);

		return (
			<div>
				<StudentHeader userId={userId} />
				<StudentAssignmentsTable items={summary || []} />
			</div>
		);
	}
});
