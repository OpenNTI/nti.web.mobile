'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup");

var FormErrors = React.createClass({

	render: function() {

		var messages = new Set();

		return (
			<div className='errors' key="errors">
				<ReactCSSTransitionGroup transitionName="messages">
					{Object.keys(this.props.errors).map(
						function(ref) {
							var err = this.props.errors[ref];
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

module.exports = FormErrors;
