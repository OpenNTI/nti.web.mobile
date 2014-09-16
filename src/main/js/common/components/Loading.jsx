/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Loading',
	render: function() {
		return (
			<figure className="loading">
				<div className="m spinner"></div>
				<figcaption>Loading</figcaption>
			</figure>
		);
	}
});
