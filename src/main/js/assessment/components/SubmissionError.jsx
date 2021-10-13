import './SubmissionError.scss';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

const t = scoped('assessment.errors', {
	submission404:
		'A required resource could not be found. This assignment may have been deleted.',
	pastDue:
		'This assignment is past due.  You can continue to view this assignment, but it cannot be submitted.',
});

SubmissionError.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.any,
	error: PropTypes.any,
};

function getErrorMessage(response) {
	if (response.statusCode === 404) {
		return t('submission404');
	}
	if (response.code === 'SubmissionPastDueDateError') {
		return t('pastDue');
	}
	return (response || {}).message || 'An error occurred.';
}

export default function SubmissionError(props) {
	const { children, error, onClick } = props;
	const errorMessage =
		error && (typeof error === 'string' ? error : getErrorMessage(error));
	return (
		<div className="submission-error">
			<a href="#" onClick={onClick}>
				x
			</a>
			{errorMessage || children}
		</div>
	);
}
