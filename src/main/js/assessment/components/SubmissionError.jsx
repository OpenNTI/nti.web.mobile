import React from 'react';

SubmissionError.propTypes = {
	onClick: React.PropTypes.func,
	children: React.PropTypes.any,
	error: React.PropTypes.any
};
export default function SubmissionError (props) {
	const {children, error, onClick} = props;
	const errorMessage = error && (typeof error === 'string' ? error : error.message);
	return (
		<div className="submission-error">
			<a href="#" onClick={onClick}>x</a>{errorMessage || children}
		</div>
	);
}
