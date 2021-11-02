import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';

import Assignments from '../../bindings/Assignments';
import GradeBox from '../GradeBox';

class ColumnGrade extends React.Component {
	static propTypes = {
		assignments: PropTypes.object.isRequired,
		item: PropTypes.shape({
			grade: PropTypes.object,
			hasFinalGrade: PropTypes.bool,
			user: PropTypes.shape({
				getID: PropTypes.func,
			}),
		}).isRequired,
	};

	static className = 'col-grade';
	static label = () => 'Grade';
	static sort = 'Grade';

	render() {
		//"Final_Grade" only
		const {
			props: {
				assignments,
				item: { grade, user, hasFinalGrade },
			},
		} = this;

		const finalGradeId = assignments?.getFinalGradeAssignmentId();

		return !hasFinalGrade || !finalGradeId ? null : (
			<GradeBox
				assignmentId={finalGradeId}
				grade={grade}
				userId={user?.getID()}
				showLetter
			/>
		);
	}
}

export default decorate(ColumnGrade, [Assignments.connect]);
