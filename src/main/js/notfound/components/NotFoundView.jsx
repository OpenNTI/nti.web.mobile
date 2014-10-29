/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'NotFound',
	render: function() {
		if (global.__setPageNotFound) {
			__setPageNotFound();
		}
		return (
			<div>This is not the page you seek...</div>
		);
	}
});
