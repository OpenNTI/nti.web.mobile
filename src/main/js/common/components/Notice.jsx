/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Notice = React.createClass({
	render: function() {
		return (
			<div {...this.props} className="notice">
				{this.props.children}
			</div>
		);
	}
});

module.exports = Notice;
