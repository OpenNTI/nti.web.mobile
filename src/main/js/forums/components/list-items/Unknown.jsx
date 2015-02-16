'use strict';

var React = require('react');

module.exports = React.createClass({
	displayName: 'Unknown',

	render: function() {
		console.debug(this.props.item);
		return (
			<div>
				{this.props.item.MimeType}
			</div>
		);
	}
});
