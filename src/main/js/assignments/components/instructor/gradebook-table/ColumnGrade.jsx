import React from 'react';

import GradeBox from '../GradeBox';

export default React.createClass({
	displayName: 'GradebookColumnGrade',

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
		const {props: {item: {grade, user}}} = this;

		const userId = user && user.getID();

		return (
			<div className="grade">
				{grade && ( <GradeBox assignmentId={grade.AssignmentId} grade={grade} userId={userId}/> )}
			</div>
		);
	}
});
