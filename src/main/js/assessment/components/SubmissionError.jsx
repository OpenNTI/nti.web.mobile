import React from 'react';

SubmissionError.propTypes = {
	onClick: React.PropTypes.func,
	children: React.PropTypes.any,
	error: React.PropTypes.any
};
export default function SubmissionError (props) {
	return (
		<div className="submission-error">
			<a href="#" onClick={props.onClick}>x</a>{props.error || props.children}
		</div>
	);
}
