'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Unknown',

	render: function() {
		console.debug('Input Type Missing: %s', this.props.item.MimeType);
		return (
			<div className="unknown solution">

				<h4>This solution type is currently not available on mobile.  Please use the iPad app or your desktop browser.</h4>

			</div>
		);
	}
});
