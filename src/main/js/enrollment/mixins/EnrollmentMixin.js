import {decodeFromURI} from '@nti/lib-ntiids';
import Logger from '@nti/util-logger';
import {Mixins} from '@nti/web-commons';

import {getCatalogEntry} from '../Api';
import EnrollmentStore from '../Store';
import {LOAD_ENROLLMENT_STATUS, ENROLL_OPEN} from '../Constants';

import GiftableUtils from './GiftableUtils';

const logger = Logger.get('enrollment:mixnis:EnrollmentMixin');



export default {
	mixins: [Mixins.NavigatableMixin, GiftableUtils],

	getInitialState () {
		return {
			loading: true,
			enrollmentStatusLoaded: false,
			entry: null
		};
	},

	async componentWillMount () {
		this.resolving = null;
		const entry = await this.resolveEntry();
		EnrollmentStore.loadEnrollmentStatus(entry.CourseNTIID);
	},

	componentDidMount () {
		EnrollmentStore.addChangeListener(this.storeChange);
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


	getEntry () {
		if (this.state.entry) {
			return this.state.entry;
		}

		if (this.props.catalogEntry) {
			return this.props.catalogEntry;
		}

		this.resolveEntry();
		return null;
	},


	async resolveEntry () {
		if (this.state.entry) {
			return this.state.entry;
		}

		if (this.props.catalogEntry) {
			return this.props.catalogEntry;
		}

		const id = decodeFromURI(this.props.entryId);
		if (this.resolving === id) {
			return null;
		}

		this.resolving = id;
		let entry = null;
		try {
			entry = await getCatalogEntry(id);
			this.setState({loading: false, entry});
		} catch (e) {
			this.setState({
				error: {
					message: 'Catalog entry not found.'
				}
			});
		}

		if (this.resolving === id) {
			delete this.resolving;
		}

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
