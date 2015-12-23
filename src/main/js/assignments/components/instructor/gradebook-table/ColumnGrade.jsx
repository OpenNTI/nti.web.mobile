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

		const {props: {item: {assignmentId, grade, user}}} = this;

		const userId = user && user.getID();

		return (
			<div className="grade">
				<GradeBox assignmentId={assignmentId} grade={grade} userId={userId}/>
			</div>
		);
	}
});
