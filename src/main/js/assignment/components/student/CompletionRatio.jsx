import PropTypes from 'prop-types';

CompletionRatio.propTypes = {
	assignments: PropTypes.object.isRequired,
};

export default function CompletionRatio({ assignments }) {
	if (!assignments) {
		return null;
	}
	const a = assignments.getAssignments();
	const denominator = a.length;
	const numerator = a.filter(as => as.hasSubmission).length;

	return (
		<span>
			{numerator} of {denominator}
		</span>
	);
}
