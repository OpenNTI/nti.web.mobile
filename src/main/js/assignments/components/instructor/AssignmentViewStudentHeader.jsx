import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

import ActionsMenu from './ActionsMenu';
import GradeBox from './GradeBox';
import Status from './AssignmentStatus';

export default React.createClass({
	displayName: 'instructor:AssignmentViewStudentHeader',

	propTypes: {
		userId: React.PropTypes.any.isRequired,
		rootId: React.PropTypes.string.isRequired,
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentDidMount () {
		const {rootId, userId, assignments} = this.props;
		const assignment = assignments.getAssignment(decodeFromURI(rootId));

		assignments.getHistoryItem(assignment.getID(), userId)
			.then(history => this.setState({history, assignment})); //eslint-disable-line
	},

	render () {

		const {userId, rootId} = this.props;
		const {history, assignment} = this.state;

		const props = {
			assignmentId: rootId,
			userId
		};

		const grade = history && history.Grade;

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
