import React from 'react';
import PropTypes from 'prop-types';

import Assignments from '../../bindings/Assignments';
import GradeBox from '../GradeBox';

export default
@Assignments.connect
class GradebookColumnGrade extends React.Component {

	static propTypes = {
		assignments: PropTypes.object.isRequired,
		item: PropTypes.shape({
			grade: PropTypes.object,
			hasFinalGrade: PropTypes.bool,
			user: PropTypes.shape({
				getID: PropTypes.func
			})
		}).isRequired
	}

	static className = 'col-grade'
	static label = () => 'Grade'
	static sort = 'Grade'


	render () {
		//"Final_Grade" only
		const {props: {assignments, item: {grade, user, hasFinalGrade}}} = this;

		const userId = user && user.getID();
		const finalGradeId = assignments.getFinalGradeAssignmentId();

		return (
			<div className="grade">
				{hasFinalGrade && finalGradeId && (
					<GradeBox assignmentId={finalGradeId} grade={grade} userId={userId} showLetter />
				)}
			</div>
		);
	}
}
