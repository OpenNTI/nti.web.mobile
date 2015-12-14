import React from 'react';

export default React.createClass({
	displayName: 'CompletionRatio',

	propTypes: {
		course: React.PropTypes.shape({
			enrolledTotalCount: React.PropTypes.number
		}).isRequired,
		assignment: React.PropTypes.shape({
			submittedCount: React.PropTypes.number
		}).isRequired
	},

	render () {

		let {course, assignment} = this.props;

		return (
			<div className="completion-ratio">{assignment.submittedCount}/{course.enrolledTotalCount}</div>
		);
	}
});
