'use strict';

var React = require('react');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');
var Loading = require('common/components/Loading');
var PanelButton = require('common/components/PanelButton');
var CourseContentLink = require('library/components/CourseContentLinkMixin');

var Enroll = React.createClass({

	mixins: [EnrollmentOptions, CourseContentLink],

	_getCourseTitle: function() {
		return this._getEntry().Title;
	},

	_getCourseId: function() {
		return this._getEntry().CourseNTIID;
	},

	render: function() {

		if (!this.state.enrollmentStatusLoaded) {
			return <Loading />;
		}

		if(this.state.enrolled) {

			var title = this._getCourseTitle();
			var href = this.courseHref(this._getCourseId());

			return (
				<PanelButton href={href} linkText='Go to the course'>
					You are enrolled in {title}.
				</PanelButton>
			);
		}

		var widgets = this.enrollmentWidgets();

		return (
			<div>
				{widgets}
			</div>
		);
	}

});

module.exports = Enroll;
