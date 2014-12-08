/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var FiveMinuteEnrollmentForm = require('./FiveMinuteEnrollmentForm');

var View = React.createClass({

	render: function() {
		return (
			<FiveMinuteEnrollmentForm />
		);
	}

});

module.exports = View;
