import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default React.createClass({

	displayName: 'FormErrors',

	propTypes: {
		errors: React.PropTypes.object
	},

	render () {
		let {errors} = this.props;
		let messages = new Set();

		return (
			<ReactCSSTransitionGroup
				className="errors"
				transitionName="fadeOutIn"
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}>
				{Object.keys(errors).map(ref => {
					let error = errors[ref];

					if (error.message && !messages.has(error.message)) {
						messages.add(error.message);
						return React.createElement('small', {key: ref, className: 'error'}, error.message);
					}

					return null;
				})}
			</ReactCSSTransitionGroup>
		);
	}

});
