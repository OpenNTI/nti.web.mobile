import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

FormErrors.propTypes = {
	errors: React.PropTypes.object
};

export default function FormErrors ({errors}) {

	const messages = new Set();

	return (
		<ReactCSSTransitionGroup
			className="errors"
			transitionName="fadeOutIn"
			transitionEnterTimeout={500}
			transitionLeaveTimeout={500}>
			{Object.keys(errors).map(ref => {
				const error = errors[ref];

				if (error.message && !messages.has(error.message)) {
					messages.add(error.message);
					return React.createElement('small', {key: ref, className: 'error'}, error.message);
				}

				return null;
			})}
		</ReactCSSTransitionGroup>
	);
}
