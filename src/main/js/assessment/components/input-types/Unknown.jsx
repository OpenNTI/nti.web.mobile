'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Unknown',

	render: function() {
		console.debug('Input Type Missing: %s', this.props.item.MimeType);
		return (
			<div className="unknown part">

				<h4>This question type is currently not available on mobile.<br/>
				Please use the iPad app or your desktop browser.</h4>

			</div>
		);
	}
});
