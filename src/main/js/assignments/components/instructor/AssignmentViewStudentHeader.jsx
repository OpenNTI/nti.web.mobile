import React from 'react';

import {decodeFromURI} from 'nti-lib-interfaces/lib/utils/ntiids';

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
		rootId: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {};
	},

	componentDidMount () {
		const {rootId, userId} = this.props;
		const collection = this.getAssignments();
		const assignment = collection.getAssignment(decodeFromURI(rootId));

		collection.getHistoryItem(assignment.getID(), userId)
			.then(history => this.setState({history, assignment})); //eslint-disable-line
	},

	render () {

		const {userId, rootId} = this.props;
		const {history, assignment} = this.state;
		const {grade} = history || {};

		const props = {
			assignmentId: rootId,
			userId
		};


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
