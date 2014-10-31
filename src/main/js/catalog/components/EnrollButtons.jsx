/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');
var Enrollment = require('../../enrollment');

var EnrollButtons = React.createClass({

	propTypes: {
		'course': React.PropTypes.object.isRequired
	},

	_enrollmentOptions: function() {
		var result = [];
		var options = this.props.course.EnrollmentOptions||{};
		Object.keys(options).forEach(function(key) {
			if(options[key].Enabled) {
				result.push({
					label: t(key)
				});
			}
		});
		return result;
	},

	_enroll: function(enrollmentOption) {
		Enrollment.Actions.enrollOpen(this.props.course);
	},

	render: function() {

		if(!this.props.course) {
			return null;
		}

		var buttons = this._enrollmentOptions().map(function(option,index) {
			return <div key={'option' + index} className="column"><a href="#" onClick={this._enroll.bind(null,option)} className="button tiny radius small-12 columns">{option.label}</a></div>
		}.bind(this));

		return (
			<div>
				{buttons}
			</div>
		);
	}

});

module.exports = EnrollButtons;
