import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {decodeFromURI} from 'nti-lib-ntiids';
import {Mixins} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import Redirect from 'navigation/components/Redirect';
import NotFound from 'notfound/components/View';

import {getCatalogEntry} from '../Api';
import StoreEnrollmentView from '../store-enrollment/components/View';
import CreditEnrollmentView from '../five-minute/components/View';

import Enroll from './Enroll';
import DropCourse from './DropCourse';

const HANDLERS = {
	open: Enroll,
	purchase: StoreEnrollmentView,
	apply: CreditEnrollmentView,
	drop: DropCourse
};

const ENROLLMENT_SUFFIXES = {
	purchase: 'Purchase',
	apply: 'FiveMinute'
};

export default createReactClass({
	displayName: 'enrollment:View',
	mixins: [Mixins.BasePath, ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		entryId: PropTypes.string.isRequired,
		enrollmentType: PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.resolveCatalogEntry();
	},


	componentWillReceiveProps (nextProps) {
		if (this.getEntryId() !== this.getEntryId(nextProps)) {
			this.resolveCatalogEntry(nextProps);
		}
	},


	async resolveCatalogEntry (props = this.props) {
		const id = this.getEntryId(props);

		if (!this.state[id]) {
			this.setState({ loading: true });
			const entry = await getCatalogEntry(id);
			this.setState({ loading: false, [id]: entry });
		}
	},


	getEntryId ({entryId} = this.props) {
		return decodeFromURI(entryId);
	},


	getEntry (props = this.props) {
		return this.state[this.getEntryId(props)];
	},

	getCourseId () {
		return (this.getEntry() || {}).CourseNTIID;
	},


	getCourseTitle () {
		let e = this.getEntry();
		return e ? e.Title : 'Enrollment';
	},


	getEnrollmentOptionFor (suffix) {
		const getter = 'getEnrollmentOptions';
		const method = `getEnrollmentOptionFor${suffix}`;
		const e = (x => x && x[getter] && x[getter]())(
			//Why did we make this return a truthy object while loading that DOES NOT implement the interface??
			this.getEntry()
		);

		return (e && e[method]) ? e[method]() : null;
	},


	shouldComponentUpdate (nextProps, nextState) {
		const currEntry = this.getEntry();
		const nextEntry = this.getEntry(nextProps, false);
		const hasEntry = Boolean(currEntry || nextEntry);

		return !hasEntry || nextProps.entryId !== this.props.entryId;
	},


	render () {
		const {props: {enrollmentType, entryId}, state: {loading}} = this;
		let courseId = this.getCourseId();

		if (loading) {
			return null;
		}

		if (!loading && !courseId) {
			return (
				<NotFound/>
			);
		}

		let Comp = HANDLERS[enrollmentType] || NotFound;
		let type = ENROLLMENT_SUFFIXES[enrollmentType];
		let enrollment = type
			? this.getEnrollmentOptionFor(type)
			: null;

		if (enrollmentType !== 'drop' && (!enrollment || enrollment.enrolled)) {
			const href = `/item/${entryId}/enrollment/`;
			return <Redirect location={href} />;
		}

		return (
			<Comp {...this.props}
				courseId={courseId}
				enrollment={enrollment}
			/>);
	}
});
