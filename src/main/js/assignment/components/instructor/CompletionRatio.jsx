import PropTypes from 'prop-types';
import React from 'react';

CompletionRatio.propTypes = {
	course: PropTypes.shape({
		enrolledTotalCount: PropTypes.number
	}).isRequired,
	assignment: PropTypes.shape({
		submittedCount: PropTypes.number
	}).isRequired
};

export default function CompletionRatio ({course, assignment}) {
	const {submittedCount, submittedCountTotalPossible: totalPossible} = assignment;

	const total = typeof totalPossible === 'number' ? totalPossible : course.enrolledTotalCount;

	return (
		<div className="completion-ratio">{submittedCount || 0}/{total}</div>
	);
}
