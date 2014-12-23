/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Utils = require('common/Utils');
var NTIID = require('dataserverinterface/utils/ntiids');

var CourseContentLink = React.createClass({

	statics: {
		courseHref: function(courseId) {
			var courseUrl = NTIID.encodeForURI(courseId);
			return Utils.getBasePath() + 'course/' + courseUrl + '/#nav';
		}
	},

	propTypes: {
		courseId: React.PropTypes.string.isRequired
	},

	render: function() {

		var href = CourseContentLink.courseHref(this.props.courseId);

		return (
			<a {...this.props} href={href}>{this.props.children}</a>
		);
	}

});

module.exports = CourseContentLink;
