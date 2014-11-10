/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Unknown',

	render: function() {
		return (
			<div>
				{this.props.item.MimeType}
			</div>
		);
	}
});
