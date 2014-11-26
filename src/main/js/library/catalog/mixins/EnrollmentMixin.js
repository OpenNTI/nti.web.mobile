'use strict';

var React = require('react/addons');
var EnrollmentStore = require('enrollment/Store');
var EnrollmentActions = require('enrollment/Actions');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var Constants = require('enrollment/Constants');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var EnrollmentWidgets = require('enrollment/components/enrollment-option-widgets');
var NoOptions = require('enrollment/components/enrollment-option-widgets/NoOptions');

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

	canDrop: function(catalogEntry) {
		// we currently only support dropping open enrollment within the app.
		var options = catalogEntry.EnrollmentOptions.Items||{};
		return options.OpenEnrollment && options.OpenEnrollment.IsEnrolled;
	},

	isGiftable: function(enrollmentOption) {
		var opt = (enrollmentOption && enrollmentOption.option)||{};
		return opt.Purchasable && opt.Purchasable.Giftable;
	},

	hasGiftableEnrollmentOption: function(catalogEntry) {
		return this.enrollmentOptions(catalogEntry, true).some(this.isGiftable);
	},

	enrollmentOptions: function(catalogEntry, includeUnavailable) {
		var result = [];
		if (!catalogEntry) {
			return result;
		}
		var options = catalogEntry.EnrollmentOptions.Items||{};
		Object.keys(options).forEach(function(key) {
			if(includeUnavailable||this._showOption(options[key])) {
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
			var widgets = this.enrollmentOptions(catalogEntry).map(function(option,index) {
				var widget = EnrollmentWidgets.getWidget(option);
				return widget ? widget({
					catalogEntry: catalogEntry,
					enrollmentOption: option,
					isGiftable: this.isGiftable(option),
					className: 'enrollment-panel',
					key: 'eno_' + index
				}) : null;
			}.bind(this));
			widgets = widgets.filter(function(item) {return item !== null;});
			if (widgets.length > 0) {
				return React.DOM.div({
						className: "enrollment-panels"		
					},
					widgets
				);
			}
		}
		return [NoOptions(null, [])];
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
