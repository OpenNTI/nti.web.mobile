/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var EnrollmentOptions = require('library/catalog/mixins/EnrollmentMixin');
var Loading = require('common/components/Loading');
var Notice = require('common/components/Notice');
var CourseContentLink = require('library/components/CourseContentLink');

var Enroll = React.createClass({

	mixins: [EnrollmentOptions],

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

			return (
				<div>
					<Notice>You are enrolled in {title}.</Notice>
					<div className="column">
						<CourseContentLink
							className="tiny button radius small-12 columns"
							courseId={this._getCourseId()}>Go to the course</CourseContentLink>
					</div>
				</div>
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
