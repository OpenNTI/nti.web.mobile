import PropTypes from 'prop-types';
import React from 'react';
import {scoped} from 'nti-lib-locale';

const t = scoped('assessment.errors', {
	submission404: 'A required resource could not be found. This assignment may have been deleted.'
});

SubmissionError.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.any,
	error: PropTypes.any
};

function getErrorMessage (response) {
	if (response.statusCode === 404) {
		return t('submission404');
	}
	return (response || {}).message || 'An error occurred.';
}

export default function SubmissionError (props) {
	const {children, error, onClick} = props;
	const errorMessage = error && (typeof error === 'string' ? error : getErrorMessage(error));
	return (
		<div className="submission-error">
			<a href="#" onClick={onClick}>x</a>{errorMessage || children}
		</div>
	);
}
