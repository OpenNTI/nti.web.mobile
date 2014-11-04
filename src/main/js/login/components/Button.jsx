/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Link = require('react-router-component').Link;

var Button = React.createClass({

	render: function() {
		return this.transferPropsTo(
			<Link className="tiny button radius small-12 columns">{this.props.children}</Link>
		);
	}

});

module.exports = Button;
