/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var requiredProps = require('./RequiredProps');

var UnrecogzniedEnrollmentType = React.createClass({

	propTypes: requiredProps,

	render: function() {
		console.warn('Not rendering UnrecogzniedEnrollmentType: %s %O', this.props.enrollmentOption.key, this.props.enrollmentOption);
		return null;
	}

});

module.exports = UnrecogzniedEnrollmentType;
