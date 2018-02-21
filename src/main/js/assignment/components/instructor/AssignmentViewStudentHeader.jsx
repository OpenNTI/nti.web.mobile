import React from 'react';
import PropTypes from 'prop-types';
import {PropType as NTIID} from 'nti-lib-ntiids';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

import Assignments from '../bindings/Assignments';

import ActionsMenu from './ActionsMenu';
import GradeBox from './GradeBox';
import Status from './AssignmentStatus';


export default
@Assignments.connect
class InstructorAssignmentViewStudentHeader extends React.Component {

	static propTypes = {
		assignmentId: NTIID,
		assignments: PropTypes.object.isRequired,
		userId: PropTypes.any.isRequired,
	}


	state = {}


	componentWillMount () {
		this.setup();
	}


	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	}


	componentWillUnmount () {
		if (this.unsubcribe) {
			this.unsubcribe();
		}
	}


	async setup (props = this.props) {
		const {assignments, assignmentId, userId} = props;

		this.subscribe(assignments);

		const assignment = assignments.getAssignment(assignmentId);
		const history = await assignments.getHistoryItem(assignment.getID(), userId);

		this.setState({history, assignment});
	}


	subscribe (collection) {
		const changed = (assignmentIdWithNewGrade) => {
			if (assignmentIdWithNewGrade === this.props.assignmentId) {
				this.setup();
			}
		};

		collection.on('new-grade', changed);
		collection.on('reset-grade', changed);

		if (this.unsubcribe) {
			this.unsubcribe();
		}

		this.unsubcribe = () => {
			delete this.unsubcribe;
			collection.removeListener('new-grade', changed);
			collection.removeListener('reset-grade', changed);
		};
	}


	render () {

		const {userId, assignmentId} = this.props;
		const {history, assignment} = this.state;
		const {grade} = history || {};

		const props = { assignmentId, userId, item: history };


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
}
