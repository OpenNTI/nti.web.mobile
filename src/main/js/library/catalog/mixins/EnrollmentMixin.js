'use strict';

var React = require('react/addons');
var EnrollmentStore = require('enrollment/Store');
var EnrollmentActions = require('enrollment/Actions');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var Constants = require('enrollment/Constants');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var EnrollmentWidgets = require('enrollment/components/enrollment-option-widgets');

module.exports = {

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			enrollmentStatusLoaded: false,
			loading: true,
			entry: null
		};
	},

	componentDidMount: function() {
		EnrollmentStore.addChangeListener(this.storeChange);
		var entry = this._getEntry();
		EnrollmentStore.loadEnrollmentStatus(entry.CourseNTIID);
	},

	componentWillUnmount: function() {
		EnrollmentStore.removeChangeListener(this.storeChange);
	},

	storeChange: function(event) {
		var action = (event||{}).action;
		var entry = this._getEntry();
		if(action) {
			switch(action.type) {
				case Constants.LOAD_ENROLLMENT_STATUS:
					if (action.courseId === entry.CourseNTIID) {
						this.setState({
							enrolled: action.result,
							enrollmentStatusLoaded: true
						});
					}
				break;
				case Constants.ENROLL_OPEN:
					if(action.catalogId === entry.getID()) {
						this.setState({
							enrolled: event.result.success,
							enrollmentStatusLoaded: true
						});
					}
				break;
				default:
					console.debug('Saw unrecognized EnrollmentStore change event: %O', event);
			}
		}
	},

	enrollmentOptions: function(catalogEntry) {
		var result = [];
		if (!catalogEntry) {
			return result;
		}
		var options = catalogEntry.EnrollmentOptions.Items||{};
		Object.keys(options).forEach(function(key) {
			if(this._showOption(options[key])) {
				result.push({
					key: key,
					option: options[key]
				});
			}
		}.bind(this));
		return result;
	},

	_showOption: function(enrollmentOption) {
		return enrollmentOption && enrollmentOption.IsAvailable; 
	},

	enrollmentWidgets: function() {
		var catalogEntry = this._getEntry();
		if (!this.state.enrollmentStatusLoaded) {
			return "Loading";
		}
		if (this.state.enrollmentStatusLoaded && !this.state.enrolled) {
			var buttons = this.enrollmentOptions(catalogEntry).map(function(option,index) {
				var widget = EnrollmentWidgets.getWidget(option);
				return widget({
					catalogEntry: catalogEntry,
					enrollmentOption: option,
					className: 'enrollment-panel',
					key: 'eno_' + index
				});
			}.bind(this));
			if (buttons.length > 0) {
				return React.DOM.div({
						className: "small-12 columns enrollment-panels"		
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
		if (this.props.catalogEntry) {
			return this.props.catalogEntry;
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

	_dropCourse: function(catalogEntry,event) {
		event.preventDefault();
		EnrollmentActions.dropCourse(catalogEntry.CourseNTIID);
	}
};
