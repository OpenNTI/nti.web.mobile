import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {decodeFromURI} from 'nti-lib-ntiids';
import {Mixins} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import Redirect from 'navigation/components/Redirect';
import CatalogAccessor from 'catalog/mixins/CatalogAccessor';
import NotFound from 'notfound/components/View';

import StoreEnrollmentView from '../store-enrollment/components/View';
import CreditEnrollmentView from '../five-minute/components/View';

import Enroll from './Enroll';
import DropCourse from './DropCourse';

const entry = Symbol('cce');

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
	mixins: [Mixins.BasePath, CatalogAccessor, ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		entryId: PropTypes.string.isRequired,
		enrollmentType: PropTypes.string.isRequired
	},


	getEntry () {
		let id = decodeFromURI(this.props.entryId);
		let e = this.getCatalogEntry(id);

		// Enrollment can trigger a catalog reload. If we started on one catalog entry,
		// but the service mapped us to a different one on completing enrollment, the
		// catalog will contain a new and different Entry that represents the same thing,
		// but the ID will not map, and thus, we will have a null `e` variable. So, to
		// make sure routes continue to work while we are wrapping up the enrollment
		// proccess save the last-known-good Entry, if it fails to come back on a
		// subsequent call, use the cached one IF (AND ONLY IF) the ID matches.
		if (!e) {
			e = this[entry];
			if (!e || e.getID() !== id) {
				e = null;
			}
		} else {
			this[entry] = e;
		}


		return e;
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
		const {catalog: curr} = this.state;
		const {catalog: next} = nextState;
		return !curr || (curr && next && curr !== next);
	},


	render () {
		const {props: {enrollmentType, entryId}, state: {catalogLoading}} = this;
		let courseId = this.getCourseId();

		if (catalogLoading) {
			return null;
		}

		if (!catalogLoading && !courseId) {
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
