import PropTypes from 'prop-types';
import React from 'react';

const AorB = (a, b) => typeof a === 'number' ? a : b;

CompletionRatio.propTypes = {
	course: PropTypes.shape({
		enrolledTotalCount: PropTypes.number
	}).isRequired,
	assignment: PropTypes.shape({
		UserCompletionCount: PropTypes.number,
		submittedCount: PropTypes.number,
		submittedCountTotalPossible: PropTypes.number,
	}).isRequired
};

export default function CompletionRatio ({course, assignment}) {
	const {submittedCount, UserCompletionCount, submittedCountTotalPossible: totalPossible} = assignment;
	const totalSubmissions = AorB(UserCompletionCount, submittedCount);
	const total = typeof totalPossible === 'number' ? totalPossible : course.enrolledTotalCount;

	return (
		<div className="completion-ratio">{totalSubmissions || 0}/{total}</div>
	);
}
