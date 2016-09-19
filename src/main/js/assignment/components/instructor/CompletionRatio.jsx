import React from 'react';

CompletionRatio.propTypes = {
	course: React.PropTypes.shape({
		enrolledTotalCount: React.PropTypes.number
	}).isRequired,
	assignment: React.PropTypes.shape({
		submittedCount: React.PropTypes.number
	}).isRequired
};

export default function CompletionRatio ({course, assignment}) {
	const {submittedCount, submittedCountTotalPossible: totalPossible} = assignment;

	const total = typeof totalPossible === 'number' ? totalPossible : course.enrolledTotalCount;

	return (
		<div className="completion-ratio">{submittedCount}/{total}</div>
	);
}
