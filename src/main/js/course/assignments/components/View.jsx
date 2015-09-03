import React from 'react';
import Student from './student/View';
import Instructor from './instructor/View';

export default React.createClass({
	displayName: 'Assignments:View',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	render () {
		let {course} = this.props;
		let Comp = course.isAdministrative ? Instructor : Student;
		return <Comp {...this.props} />;
	}
});
