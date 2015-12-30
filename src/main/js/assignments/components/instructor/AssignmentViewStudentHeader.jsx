import React from 'react';

import {PropType as NTIID} from 'nti-lib-interfaces/lib/utils/ntiids';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

import ActionsMenu from './ActionsMenu';
import GradeBox from './GradeBox';
import Status from './AssignmentStatus';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'instructor:AssignmentViewStudentHeader',
	mixins: [AssignmentsAccessor],

	propTypes: {
		userId: React.PropTypes.any.isRequired,
		assignmentId: NTIID
	},

	getInitialState () {
		return {};
	},

	componentDidMount () {
		const {assignmentId, userId} = this.props;
		const collection = this.getAssignments();
		const assignment = collection.getAssignment(assignmentId);

		collection.getHistoryItem(assignment.getID(), userId)
			.then(history => this.setState({history, assignment})); //eslint-disable-line
	},

	render () {

		const {userId, assignmentId} = this.props;
		const {history, assignment} = this.state;
		const {grade} = history || {};

		const props = { assignmentId, userId };


		return (
			<div className="assignment-header">
				<AvatarProfileLink entity={userId} />
				{assignment && (
					<div className="controls">
						<Status history={history} assignment={assignment} />
						<div className="grade">
							<div className="label">Assignment Grade</div>
							<GradeBox {...props} grade={grade} />
						</div>
						<ActionsMenu {...props} />
					</div>
				)}
			</div>
		);
	}
});
