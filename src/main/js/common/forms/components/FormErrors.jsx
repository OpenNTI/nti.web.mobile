

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default React.createClass({

	displayName: 'FormErrors',

	propTypes: {
		errors: React.PropTypes.object
	},

	render () {

		let messages = new Set();

		return (
			<div className='errors' key="errors">
				<ReactCSSTransitionGroup transitionName="messages">
					{Object.keys(this.props.errors).map(
						function(ref) {
							let err = this.props.errors[ref];
							if (err.message && !messages.has(err.message)) {
								messages.add(err.message);
								return <small key={ref} className='error'>{err.message}</small>;
							}
							return null;
						}.bind(this))}
				</ReactCSSTransitionGroup>
			</div>
		);
	}

});
