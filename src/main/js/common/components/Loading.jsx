/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var isEmpty = require('dataserverinterface/utils/isempty');

module.exports = React.createClass({
	displayName: 'Loading',
	render: function() {

		if (!isEmpty(this.props.children) && !this.props.loading) {
			return React.DOM.div(null, this.props.children);
		}

		return (
			<figure className="loading">
				<div className="m spinner"></div>
				<figcaption>Loading</figcaption>
			</figure>
		);
	}
});
