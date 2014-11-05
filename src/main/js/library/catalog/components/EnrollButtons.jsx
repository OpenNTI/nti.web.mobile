/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

var Loading = require('common/components/Loading');

var CourseContentLink = require('../../components/CourseContentLink');
var Enrollment = require('enrollment');

var EnrollButtons = React.createClass({

	propTypes: {
		'catalogEntry': React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			loading: true,
			enrolled: false
		};
	},

	componentDidMount: function() {
		this._updateEnrollmentStatus();
		Enrollment.Store.addChangeListener(this._updateEnrollmentStatus);
	},

	componentWillUnmount: function() {
		Enrollment.Store.removeChangeListener(this._updateEnrollmentStatus);
	},

	_updateEnrollmentStatus: function() {
		Enrollment.Store.isEnrolled(this.props.catalogEntry.CourseNTIID).then(function(result) {
			this.setState({
				enrolled: result,
				loading: false
			});
		}.bind(this));
	},

	_enrollmentOptions: function() {
		var result = [];
		var options = this.props.catalogEntry.EnrollmentOptions||{};
		Object.keys(options).forEach(function(key) {
			if(options[key].Enabled) {
				result.push({
					label: t(key)
				});
			}
		});
		return result;
	},

	_dropCourse: function(event) {
		event.preventDefault();
		Enrollment.Actions.dropCourse(this.props.catalogEntry.CourseNTIID);
	},

	_enroll: function(enrollmentOption,event) {
		event.preventDefault();
		Enrollment.Actions.enrollOpen(this.props.catalogEntry.getID());
	},

	render: function() {

		if(!this.props.catalogEntry) {
			return null;
		}

		if (this.state.loading) {
			return (<div className="hide"><Loading /></div>);
		}

		if(!this.state.enrolled) {
			var buttons = this._enrollmentOptions().map(function(option,index) {
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
