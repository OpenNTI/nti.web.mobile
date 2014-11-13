/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var CourseContentLink = require('library/components/CourseContentLink');

var PaymentSuccess = React.createClass({

	propTypes: {
		courseId: React.PropTypes.string.isRequired,
		courseTitle: React.PropTypes.string.isRequired
	},

	_courseLink: function() {
		return <CourseContentLink
					className="button tiny radius column" 
					courseId={this.props.courseId}>Go to course</CourseContentLink>;
	},

	render: function() {
		return (
			<div className="small-12 columns">
				<PanelButton button={this._courseLink()}>
					You are now enrolled in: {this.props.courseTitle}.
				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentSuccess;
