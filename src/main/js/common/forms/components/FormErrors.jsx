import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default React.createClass({

	displayName: 'FormErrors',

	propTypes: {
		errors: React.PropTypes.object
	},

	render () {
		let {errors} = this.props;
		let messages = new Set();

		return (
			<div className='errors' key="errors">
				<ReactCSSTransitionGroup transitionName="fadeOutIn">
					{Object.keys(errors).map(ref => {
						let error = errors[ref];

						if (error.message && !messages.has(error.message)) {
							messages.add(error.message);
							return React.createElement('small', {key: ref, className: 'error'}, error.message);
						}

						return null;
					})}
				</ReactCSSTransitionGroup>
			</div>
		);
	}

});
