/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Utils = require('common/Utils');
var NTIID = require('dataserverinterface/utils/ntiids');

var CourseContentLink = React.createClass({

	propTypes: {
		courseId: React.PropTypes.string.isRequired
	},

	render: function() {

		var courseUrl = NTIID.encodeForURI(this.props.courseId);
		
		return (
			<a href={Utils.getBasePath() + 'course/' + courseUrl + '/#nav'}>{this.props.children}</a>
		);
	}

});

module.exports = CourseContentLink;

