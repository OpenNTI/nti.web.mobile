/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Utils = require('common/Utils');

var CourseContentLink = React.createClass({

	propTypes: {
		courseId: React.PropTypes.string.isRequired
	},

	render: function() {

		return (
			<a href={Utils.getBasePath() + 'course/' + this.props.courseId + '/#nav'}>{this.props.children}</a>
		);
	}

});

module.exports = CourseContentLink;

