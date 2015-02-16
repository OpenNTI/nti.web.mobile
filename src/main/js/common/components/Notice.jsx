'use strict';

var React = require('react');

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
