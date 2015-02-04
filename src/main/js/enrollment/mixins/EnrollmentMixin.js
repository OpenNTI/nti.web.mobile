import React from 'react/addons';

import EnrollmentStore from '../Store';
import CatalogStore from 'library/catalog/Store';

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';

import {LOAD_ENROLLMENT_STATUS, ENROLL_OPEN} from '../Constants';

import EnrollmentWidgets from '../components/enrollment-option-widgets';
import NoOptions from '../components/enrollment-option-widgets/NoOptions';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

export default {
	mixins: [NavigatableMixin],


	getInitialState () {
		return {
			enrollmentStatusLoaded: false,
			loading: true,
			entry: null
		};
	},


	componentDidMount () {
		var entry = this.getEntry();
		EnrollmentStore.addChangeListener(this.storeChange);
		EnrollmentStore.loadEnrollmentStatus(entry.CourseNTIID);
	},


	componentWillUnmount () {
		EnrollmentStore.removeChangeListener(this.storeChange);
	},

	storeChange (event) {
		var action = (event||{}).action;
		var entry = this.getEntry();
		if(action) {
			switch(action.type) {
			//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
				case LOAD_ENROLLMENT_STATUS:
					if (action.courseId === entry.CourseNTIID) {
						this.setState({
							enrolled: action.result,
							enrollmentStatusLoaded: true
						});
					}
				break;
				case ENROLL_OPEN:
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


	isEnrolled (courseId) {
		return EnrollmentStore.isEnrolled(courseId);
	},


	canDrop (catalogEntry) {
		// we currently only support dropping open enrollment within the app.
		var options = catalogEntry.EnrollmentOptions.Items||{};
		return options.OpenEnrollment && options.OpenEnrollment.IsEnrolled;
	},


	isGiftable (enrollmentOption) {
		var opt = (enrollmentOption && enrollmentOption.option)||{};
		return opt.Purchasable && opt.Purchasable.Giftable;
	},


	hasGiftableEnrollmentOption (catalogEntry) {
		return this.enrollmentOptions(catalogEntry, true).some(this.isGiftable);
	},


	enrollmentOptions (catalogEntry, includeUnavailable) {
		if (!catalogEntry) {
			return result;
		}
		var result = [];
		var options = catalogEntry.EnrollmentOptions.Items||{};

		function showOption (op) {
			return op && op.IsAvailable;
		}

		Object.keys(options).forEach(key => {
			if(includeUnavailable||showOption(options[key])) {
				result.push({
					key: key,
					option: options[key]
				});
			}
		});
		return result;
	},


	enrollmentWidgets () {
		var catalogEntry = this.getEntry();
		if (!this.state.enrollmentStatusLoaded) {
			return "Loading";
		}
		if (this.state.enrollmentStatusLoaded && !this.state.enrolled) {

			let widgets = this.enrollmentOptions(catalogEntry).map((option,index) => {
				var widget = EnrollmentWidgets.getWidget(option);
				return widget ? React.createElement(widget, {
					catalogEntry: catalogEntry,
					enrollmentOption: option,
					isGiftable: this.isGiftable(option),
					className: 'enrollment-panel',
					key: 'eno_' + index
				}) : null;
			});

			widgets = widgets.filter(item => item !== null);
			if (widgets.length > 0) {
				return React.createElement('div', {className: 'enrollment-panels'}, widgets);
			}
		}

		return [NoOptions(null, [])];
	},


	getEntry () {
		if (this.state.entry) {
			return this.state.entry;
		}

		if (this.props.catalogEntry) {
			return this.props.catalogEntry;
		}

		var entryId = decodeFromURI(this.props.entryId);
		var entry = CatalogStore.getEntry(entryId);
		return entry;
	},


	getCourseId () {
		var entry = this.getEntry() || {};
		return entry.CourseNTIID;
	},


	getDataIfNeeded () {
		this.setState({ entry: this.getEntry() });
	}
};
