'use strict';

var React = require('react/addons');
var EnrollmentStore = require('enrollment/Store');
var EnrollmentActions = require('enrollment/Actions');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var Constants = require('enrollment/Constants');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var _enrolled;

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
			switch(action.actionType) {
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
						this.navigate('../');
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

	enrollmentWidgets: function() {
		var catalogEntry = this._getEntry();
		if (!this.state.enrollmentStatusLoaded) {
			return "Loading";
		}
		if (this.state.enrollmentStatusLoaded && !this.state.enrolled) {
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

	_updateEnrollmentStatus: function(event) {
		var entry = this._getEntry();
		var action = (event||{}).action;
		if (action && action.actionType === Constants.ENROLL_OPEN && action.catalogId === entry.getID()) {
			this.navigate('../');
		}
		EnrollmentStore.isEnrolled(entry.CourseNTIID).then(function(result) {
			_enrolled = result;
			this.setState({
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
