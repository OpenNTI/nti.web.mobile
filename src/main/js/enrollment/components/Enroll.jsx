/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');

var Enroll = React.createClass({

	render: function() {
		return (
			<div>enroll {this.props.course}</div>
		);
	}

});

module.exports = Enroll;
