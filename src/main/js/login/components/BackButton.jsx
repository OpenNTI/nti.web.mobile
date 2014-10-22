/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');
var Link = require('react-router-component').Link;

var BackButton = React.createClass({

	render: function() {
		return (
			<Link className="tiny button radius fi-arrow-left small-12 columns" href="/"> {this.props.children}</Link>
		);
	}

});

module.exports = BackButton;
