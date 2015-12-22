import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import Navigatable from 'common/mixins/NavigatableMixin';

import StudentHeader from './StudentHeader';
import StudentAssignmentsTable from './table/StudentAssignmentsTable';

export default React.createClass({
	displayName: 'Performance:Student',
	mixins: [ContextSender, Navigatable],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		userId: React.PropTypes.string
	},

	getContext () {
		const {userId} = this.props;
		return [{
			label: 'Students',
			href: this.makeHref('/performance/')
		}, {
			label: 'Student',//This is good enough
			href: this.makeHref('/performance/' + userId)
		}];
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
