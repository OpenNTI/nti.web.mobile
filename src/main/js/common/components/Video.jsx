/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Video',

	render: function() {
		var e = this.props.src;

		return (
			<div>
				{e}
			</div>
		);
	}
});
