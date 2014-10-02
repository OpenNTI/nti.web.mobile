/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Error',

	propTypes: {
		error: React.PropTypes.any
	},

	render: function() {
		var error = this.props.error;
		var message = error.stack || error.message || error.responseText || error;
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
