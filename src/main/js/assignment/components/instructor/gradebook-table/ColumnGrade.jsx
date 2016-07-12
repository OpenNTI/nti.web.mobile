import React from 'react';

import Accessor from '../../../mixins/AssignmentCollectionAccessor';

import GradeBox from '../GradeBox';

export default React.createClass({
	displayName: 'GradebookColumnGrade',
	mixins: [Accessor],

	statics: {
		label () {
			return 'Grade';
		},
		className: 'col-grade',
		sort: 'Grade'
	},

	propTypes: {
		item: React.PropTypes.shape({
			grade: React.PropTypes.object
		}).isRequired
	},

	render () {
		//"Final_Grade" only
		const {props: {item: {grade, user, hasFinalGrade}}} = this;

		const userId = user && user.getID();
		const finalGradeId = this.getAssignments().getFinalGradeAssignmentId();

		return (
			<div className="grade">
				{hasFinalGrade && finalGradeId && (
					<GradeBox assignmentId={finalGradeId} grade={grade} userId={userId} showLetter />
				)}
			</div>
		);
	}
});
