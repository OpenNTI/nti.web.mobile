import React from 'react';

import EnrollmentStore from '../Store';
import CatalogStore from 'catalog/Store';

import {decodeFromURI} from 'nti-lib-ntiids';
import Logger from 'nti-util-logger';

import {LOAD_ENROLLMENT_STATUS, ENROLL_OPEN} from '../Constants';

import {getWidget} from '../components/enrollment-option-widgets';
import NoOptions from '../components/enrollment-option-widgets/NoOptions';

import {Loading, Mixins} from 'nti-web-commons';

import GiftableUtils from './GiftableUtils';

const logger = Logger.get('enrollment:mixnis:EnrollmentMixin');

export default {
	mixins: [Mixins.NavigatableMixin, GiftableUtils],

	getInitialState () {
		return {
			enrollmentStatusLoaded: false,
			entry: null
		};
	},

	componentWillMount () {
		if (!this.getEntry()) {
			this.setState({
				error: {
					message: 'Catalog entry not found.'
				}
			});
		}
	},

	componentDidMount () {
		let entry = this.getEntry();
		EnrollmentStore.addChangeListener(this.storeChange);
		if (entry) {
			EnrollmentStore.loadEnrollmentStatus(entry.CourseNTIID);
		}
	},

	componentWillUnmount () {
		EnrollmentStore.removeChangeListener(this.storeChange);
	},

	storeChange (event) {

		let action = (event || {}).action;

		const handlers = {
			[LOAD_ENROLLMENT_STATUS]: () => {
				const entry = this.getEntry();
				if (action.courseId === entry.CourseNTIID) {
					this.setState({
						enrolled: action.result,
						enrollmentStatusLoaded: true
					});
				}
			},

			[ENROLL_OPEN]: () => {
				const entry = this.getEntry();
				if(action.catalogId === entry.getID()) {
					this.setState({
						enrolled: event.result.success,
						enrollmentStatusLoaded: true,
						loading: false
					});
				}
			}
		};

		if(action) {
			let handler = handlers[action.type];
			if (handler) {
				handler();
			}
			else {
				logger.debug('Unrecognized EnrollmentStore change event: %o', event);
			}
		}
	},

	canDrop (catalogEntry) {
		// we currently only support dropping open enrollment within the app.

		let o = catalogEntry.getEnrollmentOptions().getEnrollmentOptionForOpen() || {};

		return o.enrolled;
	},

	enrollmentWidgets () {
		let catalogEntry = this.getEntry();
		if (!this.state.enrollmentStatusLoaded) {
			return <Loading.Mask />;
		}

		function showOption (option) {
			return option && (option.enrolled || option.available);
		}

		let widgets = this.enrollmentOptions(catalogEntry, true).filter(showOption).map((option, index) => {
			let widget = getWidget(option);
			return widget ? React.createElement(widget, {
				catalogEntry: catalogEntry,
				entryId: this.props.entryId,
				enrollmentOption: option,
				isGiftable: this.isGiftable(option),
				className: 'enrollment-panel',
				key: 'eno_' + (option.MimeType || index)
			}) : null;
		});

		widgets = widgets.filter(item => item !== null);
		if (widgets.length > 0) {
			return React.createElement('div', {className: 'enrollment-panels'}, widgets);
		}


		return [React.createElement(NoOptions)];
	},

	getEntry () {
		if (this.state.entry) {
			return this.state.entry;
		}

		if (this.props.catalogEntry) {
			return this.props.catalogEntry;
		}

		let entryId = decodeFromURI(this.props.entryId);
		let entry = CatalogStore.getEntry(entryId);
		return entry;
	},

	getCourseId () {
		let entry = this.getEntry() || {};
		return entry.CourseNTIID;
	},

	getDataIfNeeded () {
		this.setState({ entry: this.getEntry() });
	}
};
