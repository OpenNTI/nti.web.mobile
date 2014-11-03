/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');
var Enrollment = require('../../enrollment');
var Loading = require('common/components/Loading');

var EnrollButtons = React.createClass({

	propTypes: {
		'course': React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			loading: true,
			enrolled: false
		};
	},

	componentDidMount: function() {
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
			return <div className="hide"><Loading /></div>
		}

		if(!this.state.enrolled) {
			var buttons = this._enrollmentOptions().map(function(option,index) {
				return <div key={'option' + index} className="column"><a href="#" onClick={this._enroll.bind(null,option)} className="button tiny radius small-12 columns">{option.label}</a></div>
			}.bind(this));
			return (
				<div>
					{buttons}
				</div>
			);
		}
		
		return <div key='drop' className="column"><a href="#" onClick={this._dropCourse} className="button tiny radius small-12 columns">{t('drop')}</a></div>
		
	}

});

module.exports = EnrollButtons;
