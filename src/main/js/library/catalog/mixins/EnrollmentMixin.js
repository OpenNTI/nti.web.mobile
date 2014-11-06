'use strict';

var React = require('react/addons');
var EnrollmentStore = require('enrollment/Store');
var EnrollmentActions = require('enrollment/Actions');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');

module.exports = {

	getInitialState: function() {
		return {
			loading: true,
			entry: null
		};
	},

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
		if(this.state.enrolled === false) {
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

	_getEntry: function() {
		if (this.state.entry) {
			return this.state.entry;
		}
		var entryId = NTIID.decodeFromURI(this.props.entryId);
		var entry = CatalogStore.getEntry(entryId);
		return entry;
	},

	getCourseId: function() {
		var entry =  this._getEntry();
		return entry.CourseNTIID;
	},

	getDataIfNeeded: function() {
		this.setState({
			entry: this._getEntry()
		});
	},

	_updateEnrollmentStatus: function() {
		var entry = this._getEntry();
		EnrollmentStore.isEnrolled(entry.CourseNTIID).then(function(result) {
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
