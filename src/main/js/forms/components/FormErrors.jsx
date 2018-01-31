import PropTypes from 'prop-types';
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

FormErrors.propTypes = {
	errors: PropTypes.object
};

export default function FormErrors ({errors}) {

	const messages = new Set();

	return (
		<TransitionGroup className="errors">
			{Object.keys(errors).map(ref => {
				const error = errors[ref];

				if (error.message && !messages.has(error.message)) {
					messages.add(error.message);
					return (
						<CSSTransition classNames="fade-out-in" timeout={500} key={ref}>
							<small className="error">error.message</small>
						</CSSTransition>
					);
				}

				return null;
			})}
		</TransitionGroup>
	);
}
