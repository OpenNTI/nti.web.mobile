import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';

import StudentHeader from './StudentHeader';
import StudentAssignmentsTable from './table/StudentAssignmentsTable';

import AssignmentsAccessor from '../../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'Performance:Student',
	mixins: [AssignmentsAccessor, ContextSender, Mixins.NavigatableMixin],

	propTypes: {
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

		const userId = decodeURIComponent(this.props.userId);
		const summary = this.getAssignments().getStudentSummary(userId);

		return (
			<div>
				<StudentHeader userId={userId} />
				<StudentAssignmentsTable  userId={userId} items={summary || []} />
			</div>
		);
	}
});
