/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Error',

	propTypes: {
		message: React.PropTypes.string
	},

	render: function() {
		var message = this.props.message;
		return (
			<figure className="error">
				<div className="m glyph fi-alert"></div>
				<figcaption>
					Error
					<div>{message}</div>
				</figcaption>
			</figure>
		);
	}
});
