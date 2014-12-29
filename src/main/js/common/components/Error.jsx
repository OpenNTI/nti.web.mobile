'use strict';

var React = require('react/addons');

var isHTML = /<html|<([a-z]+)[^>]*>(.+)<\/\1>/i;

module.exports = React.createClass({
	displayName: 'Error',

	propTypes: {
		error: React.PropTypes.any
	},


	componentDidMount: function() {
		var e = this.props.error;
		console.error(e.stack || e.message || e.responseText || e);
	},


	render: function() {
		var error = this.props.error;
		var message = error.stack || error.message || error.responseText || error;

		if (isHTML.test(message)) {
			message = (
				<pre dangerouslySetInnerHTML={{__html: message}}/>
			);
		}

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
