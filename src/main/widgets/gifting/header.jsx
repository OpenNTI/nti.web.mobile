/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Header',

	render: function() {

		var courseTitle = this.props.purchasable.Title;

		return (
			<div className="widget-header">
				<span className="title">{courseTitle}</span>
			</div>
		);
	}
});
