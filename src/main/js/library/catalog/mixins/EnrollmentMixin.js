'use strict';

var React = require('react/addons');
var EnrollmentStore = require('../../../enrollment/Store');
var EnrollmentActions = require('../../../enrollment/Actions');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

module.exports = {

	enrollmentOptions: function(catalogEntry) {
		var result = [];
		if (!catalogEntry) {
			return result;
		}
		var options = catalogEntry.EnrollmentOptions||{};
		Object.keys(options).forEach(function(key) {
			if(options[key].Enabled) {
				result.push({
					key: key,
					option: options[key]
				});
			}
		});
		return result;
	},

	enrollmentWidgets: function(catalogEntry) {
		if(!catalogEntry) {
			return null;
		}
		if(!this.state.enrolled) {
			var buttons = this.enrollmentOptions(catalogEntry).map(function(option,index) {
				return React.DOM.a({
						href: "#",
						onClick: this._enroll.bind(null,catalogEntry,option),
						key: 'option' + index,
						className: "button tiny radius column"	
					},
					t(option.key)
				);
			}.bind(this));
			if (buttons.length > 0) {
				return React.DOM.div({
						className: "small-12 columns"		
					},
					buttons
				);
			}
		}
		return null;
	},

	componentDidMount: function() {
		this._updateEnrollmentStatus();
		EnrollmentStore.addChangeListener(this._updateEnrollmentStatus);
	},

	componentWillUnmount: function() {
		EnrollmentStore.removeChangeListener(this._updateEnrollmentStatus);
	},

	_updateEnrollmentStatus: function(evt) {
		return;
		EnrollmentStore.isEnrolled(catalogEntry.CourseNTIID).then(function(result) {
			this.setState({
				enrolled: result,
				loading: false
			});
		}.bind(this));
	},

	_dropCourse: function(catalogEntry,event) {
		event.preventDefault();
		EnrollmentActions.dropCourse(catalogEntry.CourseNTIID);
	},

	_enroll: function(catalogEntry,enrollmentOption,event) {
		event.preventDefault();
		EnrollmentActions.enrollOpen(catalogEntry.getID());
	}
};
