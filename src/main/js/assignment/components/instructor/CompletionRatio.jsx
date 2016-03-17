import React from 'react';

export default function CompletionRatio ({course, assignment}) {
	return (
		<div className="completion-ratio">{assignment.submittedCount}/{course.enrolledTotalCount}</div>
	);
}

CompletionRatio.propTypes = {
	course: React.PropTypes.shape({
		enrolledTotalCount: React.PropTypes.number
	}).isRequired,
	assignment: React.PropTypes.shape({
		submittedCount: React.PropTypes.number
	}).isRequired
};
