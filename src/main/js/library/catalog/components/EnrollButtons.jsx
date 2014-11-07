/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

var Loading = require('common/components/Loading');

var CourseContentLink = require('../../components/CourseContentLink');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');
var Store = require('enrollment/Store');

var EnrollButtons = React.createClass({

	mixins: [EnrollmentOptions],

	propTypes: {
		'catalogEntry': React.PropTypes.object.isRequired
	},

	render: function() {

		if(!this.props.catalogEntry) {
			return null;
		}

		if (!this.state.enrollmentStatusLoaded) {
			return (<div className="hide"><Loading /></div>);
		}

		if(!this.state.enrolled) {
			var buttons = this.enrollmentOptions(this.props.catalogEntry).map(function(option,index) {
				return (
					<a href="#"
						onClick={this._enroll.bind(null,option)}
						key={'option' + index}
						className="button tiny radius column">{option.label}</a>
				);
			}.bind(this));
			return (
				<div className="small-12 columns">
					{buttons}
				</div>
			);
		}

		return (
			<div key='drop' className="column">
				<CourseContentLink courseId={this.props.catalogEntry.CourseNTIID} className="button tiny radius small-12 columns">
					{t('viewCourse')}
				</CourseContentLink>
				<a href="#" onClick={this._dropCourse} className="button tiny radius small-12 columns">{t('drop')}</a>
			</div>
		);

	}

});

module.exports = EnrollButtons;
