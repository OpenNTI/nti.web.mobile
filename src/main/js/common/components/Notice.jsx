/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Notice = React.createClass({
	render: function() {
		return this.transferPropsTo(
			<div className="notice">
				{this.props.children}
			</div>
		);
	}
});

module.exports = Notice;
