import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

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

export default React.createClass({
	displayName: 'enrollment:View',
	mixins: [BasePathAware, CatalogAccessor, ContextSender, NavigatableMixin],

	propTypes: {
		entryId: React.PropTypes.string.isRequired,
		enrollmentType: React.PropTypes.string.isRequired
	},


	getEntry () {
		let id = decodeFromURI(this.props.entryId);
		let e = this.getCatalogEntry(id);

		// Enrollment can trigger a catalog reload. If we started on one catalog entry,
		// but the service mapped us to a different one on completing enrollment, the
		// catalog will contain a new and different Entry that represents the same thing,
		// but the ID will not map, and thus, we will have a nill `e` variable. So, to
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
		let e = this.getEntry();
		e = e && e.getEnrollmentOptions();

		return e ? e[`getEnrollmentOptionFor${suffix}`]() : null;
	},


	// getContext () {
	//
	// 	return Promise.resolve([{ label: this.getCourseTitle(), href }]);
	// },

	render () {

		let {enrollmentType} = this.props;
		let courseId = this.getCourseId();

		if (!this.state.catalogLoading && !courseId) {
			return (
				<NotFound/>
			);
		}

		let Comp = HANDLERS[enrollmentType] || NotFound;
		let type = ENROLLMENT_SUFFIXES[enrollmentType];
		let enrollment = type
			? this.getEnrollmentOptionFor(type)
			: null;

		return (
			<Comp {...this.props}
				courseId={courseId}
				enrollment={enrollment}
			/>);
	}
});
