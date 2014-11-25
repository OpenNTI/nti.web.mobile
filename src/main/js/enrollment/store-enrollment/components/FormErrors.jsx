/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var FormErrors = React.createClass({

	render: function() {
		return (
			<div className='errors' key="errors">
				<ReactCSSTransitionGroup transitionName="messages">
					{Object.keys(this.props.errors).map(
						function(ref) {
							var err = this.props.errors[ref];
							return (err.message ? <small key={ref} className='error'>{err.message}</small> : null);
					}.bind(this))}
				</ReactCSSTransitionGroup>
			</div>
		);
	}

});

module.exports = FormErrors;
