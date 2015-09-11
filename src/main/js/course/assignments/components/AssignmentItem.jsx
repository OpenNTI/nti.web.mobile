import React from 'react';

import StudentAssignmentItem from './student/AssignmentListItem';
import InstructorAssignmentItem from './instructor/AssignmentListItem';


export default React.createClass({
	displayName: 'AssignmentItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	},

	render () {
		let {assignment, course} = this.props;
		let Component = course.isAdministrative ? InstructorAssignmentItem : StudentAssignmentItem;
		return <Component assignment={assignment} course={course} />;
	}
});
