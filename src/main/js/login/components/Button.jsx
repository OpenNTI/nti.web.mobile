'use strict';

var React = require('react');
var Link = require('react-router-component').Link;

var Button = React.createClass({

	render: function() {
		return (
			<Link {...this.props} className="tiny button radius small-12 columns">{this.props.children}</Link>
		);
	}

});

module.exports = Button;
